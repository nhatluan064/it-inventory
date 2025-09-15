// src/hooks/useInventory.js
import { useState, useEffect, useCallback } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  writeBatch,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";

export const useInventory = (currentUser, t) => {
  const [equipment, setEquipment] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const logTransaction = useCallback(
    async (data) => {
      if (!currentUser) return;
      const newTransaction = {
        user: currentUser?.displayName || currentUser?.email || "System",
        timestamp: new Date().toISOString(),
        ...data,
      };
      try {
        const transColRef = collection(
          db,
          "users",
          currentUser.uid,
          "transactions"
        );
        const docRef = await addDoc(transColRef, newTransaction);
        setTransactions((prev) => [
          { ...newTransaction, id: docRef.id },
          ...prev,
        ]);
      } catch (error) {
        console.error("Error logging transaction: ", error);
        toast.error("Lỗi khi ghi nhận lịch sử.");
      }
    },
    [currentUser]
  );

  const fetchData = useCallback(async () => {
    if (currentUser) {
      setDataLoading(true);
      try {
        const equipColRef = collection(
          db,
          "users",
          currentUser.uid,
          "equipment"
        );
        const equipSnapshot = await getDocs(equipColRef);
        const equipList = equipSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setEquipment(equipList);

        const transColRef = collection(
          db,
          "users",
          currentUser.uid,
          "transactions"
        );
        const transSnapshot = await getDocs(transColRef);
        const transList = transSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTransactions(
          transList.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          )
        );

        if (
          currentUser.metadata.creationTime !==
          currentUser.metadata.lastSignInTime
        ) {
          toast.success(t("loading_database_success"));
        }
      } catch (error) {
        toast.error(t("loading_database_false"));
      } finally {
        setDataLoading(false);
      }
    } else {
      setEquipment([]);
      setTransactions([]);
      setDataLoading(false);
    }
  }, [currentUser, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Master List Functions ---
  const addEquipmentType = useCallback(
    async (typeData) => {
      if (!currentUser) return;
      // Sửa logic kiểm tra trùng lặp: check cả name và category
      const existing = equipment.some(
        (item) =>
          item.name.toLowerCase() === typeData.name.toLowerCase() &&
          item.category === typeData.category &&
          item.status === "master"
      );
      if (existing) {
        toast.error(
          t("toast_model_exists_guide_to_add", { itemName: typeData.name })
        );
        return false;
      }
      const newItem = {
        ...typeData,
        status: "master",
        location: "master-list",
        quantity: 0,
        price: 0,
      };
      const docRef = await addDoc(
        collection(db, "users", currentUser.uid, "equipment"),
        newItem
      );
      setEquipment((prev) => [...prev, { ...newItem, id: docRef.id }]);
      logTransaction({
        type: "master-list",
        reason: "add",
        itemName: newItem.name,
        details: { category: newItem.category },
      });
      toast.success(t("toast_new_model_added_successfully"));
      return true;
    },
    [currentUser, equipment, t, logTransaction]
  );

  const updateMasterName = useCallback(
    async (itemToUpdate) => {
      if (!itemToUpdate || !itemToUpdate.originalName) {
        console.error(
          "updateMasterName called with invalid data",
          itemToUpdate
        );
        return;
      }
      const batch = writeBatch(db);
      const updatedItemsState = equipment.map((item) => {
        if (item.name.startsWith(itemToUpdate.originalName)) {
          const newName = item.name.replace(
            itemToUpdate.originalName,
            itemToUpdate.name
          );
          const docRef = doc(
            db,
            "users",
            currentUser.uid,
            "equipment",
            item.id
          );
          batch.update(docRef, { name: newName });
          return { ...item, name: newName };
        }
        return item;
      });

      try {
        await batch.commit();
        setEquipment(updatedItemsState);
        toast.success(t("toast_model_name_updated_successfully"));
      } catch (error) {
        console.error("Error updating master name: ", error);
        toast.error("Lỗi khi cập nhật tên mẫu.");
      }
    },
    [currentUser, equipment, t]
  );

  const deleteMasterItem = useCallback(
    async (itemToDelete) => {
      // Logic kiểm tra xem mẫu này có đang được sử dụng trong kho không
      const isModelInUse = equipment.some((e) => {
        const baseItemName = e.name.split(" (User:")[0].trim();
        return (
          baseItemName === itemToDelete.name &&
          e.category === itemToDelete.category &&
          e.status !== "master" &&
          e.status !== "pending-purchase"
        );
      });

      if (isModelInUse) {
        // *** LOGIC MỚI: KIỂM TRA NẾU ĐÂY LÀ MỘT BẢN GHI BỊ TRÙNG LẶP ***
        // Đếm xem có bao nhiêu Mẫu trùng khớp cả tên và danh mục
        const duplicateMasters = equipment.filter(
          (e) =>
            e.status === "master" &&
            e.name === itemToDelete.name &&
            e.category === itemToDelete.category
        );

        // Nếu có nhiều hơn 1 Mẫu như vậy, tức là đang có Mẫu bị trùng lặp
        // Trong trường hợp này, chúng ta cho phép xóa để dọn dẹp dữ liệu
        if (duplicateMasters.length <= 1) {
          toast.error(
            t("toast_cannot_delete_model_in_use", {
              itemName: itemToDelete.name,
            })
          );
          return; // Dừng lại nếu Mẫu là duy nhất và đang được sử dụng
        }
        // Nếu có bản trùng lặp, code sẽ tiếp tục chạy xuống dưới để thực hiện xóa
      }

      const batch = writeBatch(db);

      // Chỉ xóa MỘT bản ghi được click, không xóa các bản ghi khác
      const docRef = doc(
        db,
        "users",
        currentUser.uid,
        "equipment",
        itemToDelete.id
      );
      batch.delete(docRef);

      await batch.commit();

      // Cập nhật lại giao diện bằng cách lọc ra item đã bị xóa
      setEquipment((prevEquipment) =>
        prevEquipment.filter((item) => item.id !== itemToDelete.id)
      );

      toast.success(
        t("toast_model_deleted_successfully", { itemName: itemToDelete.name })
      );
    },
    [currentUser, equipment, t]
  );

  const updateMasterItem = useCallback(
    async (itemData) => {
      // *** LOGIC KIỂM TRA TRÙNG LẶP KHI SỬA ***
      const isDuplicate = equipment.some(
        (e) =>
          e.id !== itemData.id && // Phải đảm bảo nó không so sánh với chính nó
          e.name.toLowerCase() === itemData.name.toLowerCase() &&
          e.category === itemData.category &&
          e.status === "master"
      );

      if (isDuplicate) {
        toast.error(
          `Một mẫu khác có tên '${itemData.name}' và danh mục '${t(
            itemData.category
          )}' đã tồn tại.`
        );
        return false; // Dừng việc cập nhật
      }
      // *** KẾT THÚC LOGIC KIỂM TRA ***

      const docRef = doc(
        db,
        "users",
        currentUser.uid,
        "equipment",
        itemData.id
      );

      const dataToUpdate = {
        name: itemData.name,
        category: itemData.category,
      };

      await updateDoc(docRef, dataToUpdate);

      setEquipment(
        equipment.map((e) =>
          e.id === itemData.id ? { ...e, ...dataToUpdate } : e
        )
      );

      logTransaction({
        type: "inventory",
        reason: "update",
        itemName: itemData.name,
        details: { action: "Updated master item" },
      });

      toast.success(t("toast_info_updated_successfully"));
      return true;
    },
    [currentUser, equipment, logTransaction, t]
  );

  // --- Purchasing Flow Functions ---
  const requestFromMaster = useCallback(
    async (itemToAdd) => {
      if (!currentUser) return;
      const existingItem = equipment.find(
        (item) =>
          item.name === itemToAdd.name && item.status === "pending-purchase"
      );
      if (existingItem) {
        toast.error(
          t("toast_model_exists_guide_to_add", { itemName: itemToAdd.name })
        );
        return;
      }
      const newItem = {
        name: itemToAdd.name,
        category: itemToAdd.category,
        status: "pending-purchase",
        location: "location_not_imported",
        purchaseQuantity: 1,
        price: 0,
        addedFromMaster: true,
      };
      const docRef = await addDoc(
        collection(db, "users", currentUser.uid, "equipment"),
        newItem
      );
      setEquipment((prev) => [...prev, { ...newItem, id: docRef.id }]);
      logTransaction({
        type: "procurement",
        reason: "request",
        itemName: newItem.name,
        quantity: 1,
      });
      toast.success(
        t("toast_item_added_to_request_list", { itemName: newItem.name })
      );
    },
    [currentUser, equipment, logTransaction, t]
  );

  const startPurchasing = useCallback(
    async (itemsToPurchase) => {
      const batch = writeBatch(db);
      let localEquipment = [...equipment];
      itemsToPurchase.forEach((itemData) => {
        const docRef = doc(
          db,
          "users",
          currentUser.uid,
          "equipment",
          itemData.id
        );
        const payload = {
          status: "purchasing",
          purchaseQuantity: parseInt(itemData.quantity, 10),
          price: parseFloat(itemData.price),
        };
        batch.update(docRef, payload);
        logTransaction({
          type: "procurement",
          reason: "purchasing",
          itemName: equipment.find((e) => e.id === itemData.id).name,
          quantity: itemData.quantity,
        });
        const index = localEquipment.findIndex((e) => e.id === itemData.id);
        if (index > -1)
          localEquipment[index] = { ...localEquipment[index], ...payload };
      });
      await batch.commit();
      setEquipment(localEquipment);
      toast.success(t("toast_moved_to_purchasing_list"));
    },
    [currentUser, equipment, logTransaction, t]
  );

  const confirmPurchased = useCallback(
    async (ids) => {
      const batch = writeBatch(db);
      let localEquipment = [...equipment];
      ids.forEach((id) => {
        const docRef = doc(db, "users", currentUser.uid, "equipment", id);
        batch.update(docRef, { status: "purchased" });
        logTransaction({
          type: "procurement",
          reason: "purchased",
          itemName: equipment.find((e) => e.id === id).name,
        });
        const index = localEquipment.findIndex((e) => e.id === id);
        if (index > -1) localEquipment[index].status = "purchased";
      });
      await batch.commit();
      setEquipment(localEquipment);
      toast.success(t("toast_purchase_confirmed_successfully"));
    },
    [currentUser, equipment, logTransaction, t]
  );

  const cancelOrRevertPurchase = useCallback(
  async (type, item) => {
    // Logic hoàn tác (revert-purchasing) đã được xóa
    // Giờ hàm này chỉ còn chức năng xóa yêu cầu mua
    await deleteDoc(doc(db, "users", currentUser.uid, "equipment", item.id));
    setEquipment(equipment.filter((e) => e.id !== item.id));
    logTransaction({
      type: "procurement",
      reason: "deleted",
      itemName: item.name,
    });
    toast.success(t("toast_purchase_request_deleted"));
  },
  [currentUser, equipment, logTransaction, t]
);

  const cancelWithNote = useCallback(
    async (item, note) => {
      await deleteDoc(doc(db, "users", currentUser.uid, "equipment", item.id));
      setEquipment(equipment.filter((e) => e.id !== item.id));
      logTransaction({
        type: "procurement",
        reason: "cancelled",
        itemName: item.name,
        details: { note },
      });
      toast.success(
        t("toast_purchase_cancelled_with_note", { itemName: item.name })
      );
    },
    [currentUser, equipment, logTransaction, t]
  );

  // --- Inventory Management Functions ---
  const importPurchasedItems = useCallback(
    async (item, serials) => {
      const existingSNs = equipment
        .map((e) => e.serialNumber?.toLowerCase())
        .filter(Boolean);
      const duplicateSN = serials.find((sn) =>
        existingSNs.includes(sn.toLowerCase())
      );

      if (duplicateSN) {
        toast.error(t("toast_sn_exists", { sn: duplicateSN }));
        return;
      }

      const batch = writeBatch(db);
      const newItems = [];
      const importDate = new Date().toISOString();
      for (let i = 0; i < item.purchaseQuantity; i++) {
        const newItemData = {
          name: item.name,
          category: item.category,
          status: "available",
          location: "location_in_stock",
          condition: "condition_new",
          price: item.price,
          serialNumber: serials[i],
          importDate: importDate,
          quantity: 1,
        };
        const newDocRef = doc(
          collection(db, "users", currentUser.uid, "equipment")
        );
        batch.set(newDocRef, newItemData);
        newItems.push({ ...newItemData, id: newDocRef.id });
      }
      const oldDocRef = doc(db, "users", currentUser.uid, "equipment", item.id);
      batch.delete(oldDocRef);
      await batch.commit();
      setEquipment((prev) => [
        ...prev.filter((e) => e.id !== item.id),
        ...newItems,
      ]);
      logTransaction({
        type: "import",
        reason: "purchase",
        itemName: item.name,
        quantity: item.purchaseQuantity,
        details: { serials },
      });
      toast.success(
        t("toast_items_imported_to_inventory", {
          quantity: item.purchaseQuantity,
          itemName: item.name,
        })
      );
    },
    [currentUser, equipment, logTransaction, t]
  );

  const addLegacyItem = useCallback(
    async (data) => {
      const serials = data.serialNumber
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (serials.length !== data.quantity) {
        toast.error(
          t("toast_sn_quantity_mismatch", {
            snCount: serials.length,
            purchaseCount: data.quantity,
          })
        );
        return false;
      }

      const existingSNs = equipment
        .map((e) => e.serialNumber?.toLowerCase())
        .filter(Boolean);
      const duplicateSN = serials.find((sn) =>
        existingSNs.includes(sn.toLowerCase())
      );

      if (duplicateSN) {
        toast.error(t("toast_sn_exists", { sn: duplicateSN }));
        return false;
      }

      const batch = writeBatch(db);
      const newItems = [];
      const importDate = new Date().toISOString();

      // *** BẮT ĐẦU LOGIC MỚI: TỰ ĐỘNG TẠO MASTER ITEM NẾU CHƯA TỒN TẠI ***
      const masterExists = equipment.some(
        (item) =>
          item.name.toLowerCase() === data.name.toLowerCase() &&
          item.category === data.category && // Thêm dòng này
          item.status === "master"
      );

      if (!masterExists) {
        // Nếu mẫu chưa tồn tại, tạo một mẫu mới
        const newMasterItem = {
          name: data.name,
          category: data.category,
          status: "master",
          location: "master-list",
          quantity: 0,
          price: 0,
        };
        const newMasterDocRef = doc(
          collection(db, "users", currentUser.uid, "equipment")
        );
        batch.set(newMasterDocRef, newMasterItem);
        // Ghi log cho hành động tạo mẫu tự động
        logTransaction({
          type: "master-list",
          reason: "add-legacy", // Lý do mới để phân biệt
          itemName: data.name,
          details: { category: data.category, autoCreated: true },
        });
      }
      // *** KẾT THÚC LOGIC MỚI ***

      for (const sn of serials) {
        const newItemData = {
          ...data,
          serialNumber: sn,
          quantity: 1,
          importDate,
          status: "available",
          location: "location_in_stock",
          condition: "condition_legacy_import",
        };
        const newDocRef = doc(
          collection(db, "users", currentUser.uid, "equipment")
        );
        batch.set(newDocRef, newItemData);
        newItems.push({ ...newItemData, id: newDocRef.id });
      }

      await batch.commit();
      // Sau khi commit, ta cần fetch lại dữ liệu để state 'equipment' được cập nhật
      // với cả mẫu mới và thiết bị mới, thay vì chỉ cập nhật thủ công.
      await fetchData();

      logTransaction({
        type: "import",
        reason: "legacy",
        itemName: data.name,
        quantity: data.quantity,
      });

      toast.success(t("toast_legacy_item_imported"));
      return true;
    },
    [currentUser, equipment, logTransaction, t, fetchData] // Thêm fetchData vào dependency array
  );

  const updateItem = useCallback(
    async (data) => {
      const docRef = doc(db, "users", currentUser.uid, "equipment", data.id);
      await updateDoc(docRef, data);
      setEquipment(equipment.map((e) => (e.id === data.id ? data : e)));
      logTransaction({
        type: "inventory",
        reason: "update",
        itemName: data.name,
      });
      toast.success(t("toast_info_updated_successfully"));
      return true;
    },
    [currentUser, equipment, logTransaction, t]
  );

  const deleteItem = useCallback(
    async (item) => {
      await deleteDoc(doc(db, "users", currentUser.uid, "equipment", item.id));
      setEquipment(equipment.filter((e) => e.id !== item.id));
      logTransaction({
        type: "inventory",
        reason: "delete",
        itemName: item.name,
      });
      toast.success(t("toast_item_deleted_successfully"));
    },
    [currentUser, equipment, logTransaction, t]
  );

  // --- Lifecycle Functions (Allocation, Recall, Maintenance) ---
  const allocateItem = useCallback(
    async (allocationData) => {
      const { equipmentId, ...details } = allocationData;
      const targetItem = equipment.find((item) => item.id === equipmentId);
      if (!targetItem) {
        toast.error("Không tìm thấy thiết bị để bàn giao.");
        return;
      }
      const dataToUpdate = {
        status: "in-use",
        location: details.department,
        allocationDetails: { ...details },
        serialNumber: details.serialNumber,
        // *** XÓA DÒNG NÀY ĐI: name: `${targetItem.name.split(" (User:")[0]} (User: ${details.recipientName})`, ***
      };
      await updateDoc(
        doc(db, "users", currentUser.uid, "equipment", targetItem.id),
        dataToUpdate
      );
      setEquipment((prev) =>
        prev.map((item) =>
          item.id === targetItem.id ? { ...item, ...dataToUpdate } : item
        )
      );
      logTransaction({
        type: "export",
        reason: "allocate",
        itemName: targetItem.name, // Giờ đây chỉ cần lấy tên gốc
        quantity: 1,
        details: { ...details },
        timestamp: details.handoverDate,
      });
      toast.success(
        t("toast_item_allocated_successfully", {
          itemName: targetItem.name,
          recipientName: details.recipientName,
        })
      );
    },
    [currentUser, equipment, logTransaction, t]
  );

  const recallItem = useCallback(
    async (recalledItem) => {
      const { recallReason, maintenanceNote } = recalledItem;
      let dataToUpdate;
      const originalName = recalledItem.name.split(" (User:")[0]; // Vẫn giữ logic này để dọn dẹp dữ liệu cũ

      if (recallReason === "condition_damaged_needs_maintenance") {
        dataToUpdate = {
          status: "maintenance",
          location: "location_maintenance_room",
          condition: maintenanceNote || "N/A",
          name: originalName, // Đảm bảo tên được trả về trạng thái gốc
          maintenanceDate: new Date().toISOString(),
          isRecalled: false,
          allocationDetails: null, // Xóa thông tin cấp phát
        };
        toast.success(
          t("toast_moved_to_maintenance", {
            quantity: 1,
            itemName: dataToUpdate.name,
          })
        );
      } else {
        dataToUpdate = {
          status: "available",
          location: "location_in_stock",
          condition: recallReason,
          name: originalName, // Đảm bảo tên được trả về trạng thái gốc
          allocationDetails: null, // Xóa thông tin cấp phát
          isRecalled: true,
        };
        toast.success(
          t("toast_recalled_to_stock", {
            quantity: 1,
            itemName: dataToUpdate.name,
          })
        );
      }
      await updateDoc(
        doc(db, "users", currentUser.uid, "equipment", recalledItem.id),
        dataToUpdate
      );
      setEquipment((prev) =>
        prev.map((item) =>
          item.id === recalledItem.id ? { ...item, ...dataToUpdate } : item
        )
      );
      logTransaction({
        type: "import",
        reason: "recall",
        itemName: dataToUpdate.name,
        quantity: 1,
        details: { returnCondition: recallReason, maintenanceNote },
      });
    },
    [currentUser, logTransaction, t]
  );

  const markAsDamaged = useCallback(
    async (item, note) => {
      if (!item) return;
      const dataToUpdate = {
        status: "maintenance",
        location: "location_maintenance_room",
        condition: note || t("recalled_from_user"),
        name: item.name.split(" (User:")[0],
        maintenanceDate: new Date().toISOString(),
        isRecalled: false,
        allocationDetails: null,
      };
      await updateDoc(
        doc(db, "users", currentUser.uid, "equipment", item.id),
        dataToUpdate
      );
      setEquipment((prev) =>
        prev.map((eq) => (eq.id === item.id ? { ...eq, ...dataToUpdate } : eq))
      );
      logTransaction({
        type: "inventory",
        reason: "update-note",
        itemName: dataToUpdate.name,
        quantity: 1,
        details: { note: dataToUpdate.condition },
      });
      toast.success(
        t("toast_moved_to_maintenance", {
          quantity: 1,
          itemName: dataToUpdate.name,
        })
      );
    },
    [currentUser, logTransaction, t]
  );

  const updateMaintenanceNote = useCallback(
    async (item, newNote) => {
      await updateDoc(doc(db, "users", currentUser.uid, "equipment", item.id), {
        condition: newNote,
      });
      setEquipment(
        equipment.map((e) =>
          e.id === item.id ? { ...e, condition: newNote } : e
        )
      );
      logTransaction({
        type: "inventory",
        reason: "update-note",
        itemName: item.name,
        details: { note: newNote },
      });
      toast.success(t("toast_maintenance_note_updated"));
    },
    [currentUser, equipment, logTransaction, t]
  );

  const completeRepair = useCallback(
    async (item, noteValue, isNoteKey) => {
      const condition = {
        key: "condition_repaired",
        params: { note: { value: noteValue, isKey: isNoteKey } },
      };
      await updateDoc(doc(db, "users", currentUser.uid, "equipment", item.id), {
        status: "available",
        location: "location_in_stock",
        condition,
      });
      setEquipment(
        equipment.map((e) =>
          e.id === item.id
            ? {
                ...e,
                status: "available",
                location: "location_in_stock",
                condition,
              }
            : e
        )
      );
      logTransaction({
        type: "inventory",
        reason: "repair-complete",
        itemName: item.name,
        details: { note: noteValue },
      });
      toast.success(t("toast_repair_complete", { itemName: item.name }));
    },
    [currentUser, equipment, logTransaction, t]
  );

  const markUnrepairable = useCallback(
    async (item) => {
      await updateDoc(doc(db, "users", currentUser.uid, "equipment", item.id), {
        status: "liquidation",
        location: "location_liquidation_stock",
      });
      setEquipment(
        equipment.map((e) =>
          e.id === item.id
            ? {
                ...e,
                status: "liquidation",
                location: "location_liquidation_stock",
              }
            : e
        )
      );
      logTransaction({
        type: "inventory",
        reason: "unrepairable",
        itemName: item.name,
      });
      toast.success(t("toast_moved_to_liquidation", { itemName: item.name }));
    },
    [currentUser, equipment, logTransaction, t]
  );

  const liquidateItem = useCallback(
    async (item) => {
      await deleteDoc(doc(db, "users", currentUser.uid, "equipment", item.id));
      setEquipment(equipment.filter((e) => e.id !== item.id));
      logTransaction({
        type: "inventory",
        reason: "liquidated",
        itemName: item.name,
      });
      toast.success(
        t("toast_item_liquidated_successfully", { itemName: item.name })
      );
    },
    [currentUser, equipment, logTransaction, t]
  );

  // --- Data Management Functions ---
  const backupData = useCallback(() => {
    try {
      const dataToBackup = {
        equipment: equipment,
        transactions: transactions,
      };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(dataToBackup, null, 2)
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      const date = new Date().toISOString().slice(0, 10);
      link.download = `it_inventory_backup_${date}.json`;
      link.click();
      toast.success(t("toast_backup_successful"));
    } catch (error) {
      console.error("Backup failed: ", error);
      toast.error(t("toast_backup_failed"));
    }
  }, [equipment, transactions, t]);

  const importData = useCallback(
    (file) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (!data.equipment || !data.transactions) {
            toast.error(t("toast_invalid_backup_file"));
            return;
          }
          if (!window.confirm(t("confirm_override_data"))) return;

          const batch = writeBatch(db);
          const equipColRef = collection(
            db,
            "users",
            currentUser.uid,
            "equipment"
          );
          const transColRef = collection(
            db,
            "users",
            currentUser.uid,
            "transactions"
          );

          const oldEquip = await getDocs(equipColRef);
          oldEquip.forEach((doc) => batch.delete(doc.ref));
          const oldTrans = await getDocs(transColRef);
          oldTrans.forEach((doc) => batch.delete(doc.ref));

          data.equipment.forEach((item) => {
            const { id, ...itemData } = item;
            const newDocRef = doc(equipColRef);
            batch.set(newDocRef, itemData);
          });
          data.transactions.forEach((item) => {
            const { id, ...itemData } = item;
            const newDocRef = doc(transColRef);
            batch.set(newDocRef, itemData);
          });

          await batch.commit();
          await fetchData();
          toast.success(t("toast_data_restored_successfully"));
        } catch (error) {
          console.error("Error reading or importing backup file: ", error);
          toast.error(t("toast_error_reading_backup_file"));
        }
      };
      reader.readAsText(file);
    },
    [currentUser, fetchData, t]
  );

  const resetData = useCallback(async () => {
    if (!currentUser) return;
    try {
      const batch = writeBatch(db);
      const equipColRef = collection(db, "users", currentUser.uid, "equipment");
      const transColRef = collection(
        db,
        "users",
        currentUser.uid,
        "transactions"
      );

      const equipSnapshot = await getDocs(equipColRef);
      equipSnapshot.forEach((doc) => batch.delete(doc.ref));
      const transSnapshot = await getDocs(transColRef);
      transSnapshot.forEach((doc) => batch.delete(doc.ref));

      await batch.commit();
      setEquipment([]);
      setTransactions([]);
      toast.success(t("toast_data_reset_successful"));
    } catch (error) {
      console.error("Error resetting data: ", error);
      toast.error("Lỗi khi reset dữ liệu.");
    }
  }, [currentUser, t]);

  return {
    equipment,
    transactions,
    dataLoading,
    addEquipmentType,
    updateMasterName,
    deleteMasterItem,
    updateMasterItem,
    requestFromMaster,
    startPurchasing,
    confirmPurchased,
    cancelOrRevertPurchase,
    cancelWithNote,
    importPurchasedItems,
    addLegacyItem,
    updateItem,
    deleteItem,
    allocateItem,
    recallItem,
    markAsDamaged,
    updateMaintenanceNote,
    completeRepair,
    markUnrepairable,
    liquidateItem,
    backupData,
    importData,
    resetData,
  };
};
