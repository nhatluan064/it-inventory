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
  query,
  where,
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
  
  const requestFromMaster = useCallback(
    async (itemToAdd) => {
      if (!currentUser) return;

      const existingItem = equipment.find(
        (item) =>
          item.name === itemToAdd.name && item.status === "pending-purchase"
      );
      if (existingItem) {
        toast.error(t("toast_item_already_exists", { itemName: itemToAdd.name }));
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

      try {
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
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    [currentUser, equipment, logTransaction, t]
  );

  const addEquipmentType = useCallback(
    async (typeData) => {
      if (!currentUser) return;
      
      const existing = equipment.some(item => item.name.toLowerCase() === typeData.name.toLowerCase());
      if (existing) {
        toast.error(t('toast_item_already_exists', { itemName: typeData.name }));
        return;
      }

      const newItem = {
        ...typeData,
        status: 'master', // A new status to differentiate master items
        location: 'master-list',
        quantity: 0, // Master items don't have quantity
        price: 0,
      };

      try {
        const docRef = await addDoc(collection(db, "users", currentUser.uid, "equipment"), newItem);
        setEquipment(prev => [...prev, { ...newItem, id: docRef.id }]);
        toast.success(t('toast_new_model_added_successfully'));
        // Optionally log this action as a transaction
        logTransaction({
          type: 'master-list',
          reason: 'add',
          itemName: newItem.name,
          details: { category: newItem.category }
        });
      } catch (e) {
        console.error("Error adding equipment type: ", e);
      }
    },
    [currentUser, equipment, t, logTransaction]
  );


  useEffect(() => {
    const fetchData = async () => {
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
          setTransactions(transList);

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
    };

    fetchData();
  }, [currentUser, t]);

  const allocateItem = useCallback(
    async (allocationData) => {
      const { equipmentId, ...details } = allocationData;
      const targetItem = equipment.find((item) => item.id === equipmentId);

      if (!targetItem) {
        toast.error("Không tìm thấy thiết bị để bàn giao.");
        return;
      }

      const existingSn = equipment.find(
        (e) =>
          e.serialNumber &&
          e.serialNumber.toLowerCase() === details.serialNumber.toLowerCase() &&
          e.id !== equipmentId
      );

      if (existingSn) {
        toast.error(
          t("toast_sn_already_exists_in_inventory", {
            sn: details.serialNumber,
          })
        );
        return;
      }

      const dataToUpdate = {
        status: "in-use",
        location: details.department,
        allocationDetails: {
          recipientName: details.recipientName,
          employeeId: details.employeeId,
          position: details.position,
          positionDescription: details.positionDescription || "", // LƯU MÔ TẢ CHỨC VỤ
          department: details.department,
          condition: details.condition,
          handoverDate: details.handoverDate,
        },
        serialNumber: details.serialNumber,
        name: `${targetItem.name.split(" (User:")[0]} (User: ${
          details.recipientName
        })`,
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

      await logTransaction({
        type: "export",
        reason: "allocate",
        itemName: targetItem.name.split(" (User:")[0],
        quantity: 1,
        details: {
          recipientName: details.recipientName,
          employeeId: details.employeeId,
          position: details.position,
          positionDescription: details.positionDescription || "", // GHI LOG MÔ TẢ CHỨC VỤ
          department: details.department,
          serialNumber: dataToUpdate.serialNumber,
        },
        timestamp: dataToUpdate.allocationDetails.handoverDate,
      });

      toast.success(
        t("toast_item_allocated_successfully", {
          itemName: targetItem.name.split(" (User:")[0],
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

      if (recallReason === "condition_damaged_needs_maintenance") {
        toast.success(
          t("toast_moved_to_maintenance", {
            quantity: 1,
            itemName: recalledItem.name.split(" (User:")[0],
          })
        );
        dataToUpdate = {
          status: "maintenance",
          location: "location_maintenance_room",
          condition: maintenanceNote || "N/A",
          name: recalledItem.name.split(" (User:")[0],
          maintenanceDate: new Date().toISOString(),
          isRecalled: false,
          allocationDetails: null,
        };
      } else {
        toast.success(
          t("toast_recalled_to_stock", {
            quantity: 1,
            itemName: recalledItem.name.split(" (User:")[0],
          })
        );
        dataToUpdate = {
          status: "available",
          location: "location_in_stock",
          condition: recallReason, // Ghi lại lý do/tình trạng thu hồi
          name: recalledItem.name.split(" (User:")[0],
          allocationDetails: null,
          isRecalled: true,
        };
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
      
      await logTransaction({
        type: "import",
        reason: "recall",
        itemName: recalledItem.name.split(" (User:")[0],
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
        prev.map((eq) =>
          eq.id === item.id ? { ...eq, ...dataToUpdate } : eq
        )
      );

      await logTransaction({
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

  // ... (Tất cả các hàm khác từ addEquipmentType đến resetData)

  return {
    equipment,
    transactions,
    dataLoading,
    logTransaction,
    allocateItem,
    recallItem,
    markAsDamaged,
    requestFromMaster,
    addEquipmentType,
    // ... (Các hàm khác)
  };
};

