// src/hooks/useInventory.js
import { useState, useEffect, useCallback, useMemo } from "react";
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
import { useDynamicData } from "./useDynamicData";

// THAY ĐỔI #1: Thêm `setActiveTab` vào danh sách tham số
export const useInventory = (currentUser, t, setActiveTab) => {
  const [equipment, setEquipment] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Get dynamic data functions
  const { autoAddCategoryIfNotExists, departmentsList, positionsList } =
    useDynamicData(currentUser);

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
        toast.error(t("toast_error_logging_transaction"));
      }
    },
    [currentUser, t]
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
        const equipData = equipSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEquipment(equipData);

        const transColRef = collection(
          db,
          "users",
          currentUser.uid,
          "transactions"
        );
        const transSnapshot = await getDocs(transColRef);
        const transData = transSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(
          transData.sort(
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
        if (currentUser.displayName) {
          toast.error(t("loading_database_false"));
        }
        console.error("Failed to fetch data:", error);
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

  const deleteLogs = useCallback(async () => {
    if (!currentUser) return;
    try {
      const batch = writeBatch(db);
      const transColRef = collection(
        db,
        "users",
        currentUser.uid,
        "transactions"
      );
      const transSnapshot = await getDocs(transColRef);
      transSnapshot.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      setTransactions([]);
      toast.success(t("toast_logs_deleted_successfully"));
    } catch (error) {
      console.error("Error deleting logs: ", error);
      toast.error(t("toast_error_deleting_logs"));
    }
  }, [currentUser, t]);

  // --- Master List Functions ---
  const addEquipmentType = useCallback(
    async (typeData) => {
      if (!currentUser) return;
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
      await logTransaction({
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

  const deleteMasterItem = useCallback(
    async (itemToDelete) => {
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
        const duplicateMasters = equipment.filter(
          (e) =>
            e.status === "master" &&
            e.name === itemToDelete.name &&
            e.category === itemToDelete.category
        );
        if (duplicateMasters.length <= 1) {
          toast.error(
            t("toast_cannot_delete_model_in_use", {
              itemName: itemToDelete.name,
            })
          );
          return;
        }
      }

      const batch = writeBatch(db);
      const docRef = doc(
        db,
        "users",
        currentUser.uid,
        "equipment",
        itemToDelete.id
      );
      batch.delete(docRef);
      await batch.commit();

      setEquipment((prevEquipment) =>
        prevEquipment.filter((item) => item.id !== itemToDelete.id)
      );
      await logTransaction({
        type: "inventory",
        reason: "delete",
        itemName: itemToDelete.name,
        details: { from: "Master List" },
      });
      toast.success(
        t("toast_model_deleted_successfully", { itemName: itemToDelete.name })
      );
    },
    [currentUser, equipment, t, logTransaction]
  );

  const updateMasterItem = useCallback(
    async (itemData) => {
      // Find the original master item to compare old values
      const original = equipment.find((e) => e.id === itemData.id);
      if (!original) {
        toast.error(t("toast_item_not_found_for_update"));
        return false;
      }
      const duplicateItem = equipment.find(
        (e) =>
          e.id !== itemData.id &&
          e.name.toLowerCase() === itemData.name.toLowerCase() &&
          e.category === itemData.category &&
          e.status === "master"
      );

      if (duplicateItem) {
        // eslint-disable-next-line no-alert
        const userChoice = window.confirm(
          t("confirm_override_duplicate_master", {
            itemName: itemData.name,
            category: itemData.category,
          })
        );

        if (!userChoice) {
          return false; // User chose to keep both/cancel
        }

        // User chose to override - delete the duplicate
        try {
          await deleteDoc(
            doc(db, "users", currentUser.uid, "equipment", duplicateItem.id)
          );
          setEquipment((prev) => prev.filter((e) => e.id !== duplicateItem.id));
          await logTransaction({
            type: "master-list",
            reason: "delete-override",
            itemName: duplicateItem.name,
            details: { replacedBy: itemData.id, category: itemData.category },
          });
        } catch (deleteErr) {
          console.error("Error deleting duplicate master:", deleteErr);
          toast.error(t("error_occurred"));
          return false;
        }
      }

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

      // If category changed, propagate to child inventory items of the same model
      if (original.category !== itemData.category) {
        try {
          const batch = writeBatch(db);
          const affectedChildren = equipment.filter((e) => {
            const baseItemName = e.name.split(" (User:")[0].trim();
            return (
              e.status !== "master" &&
              baseItemName === original.name &&
              e.category === original.category
            );
          });

          for (const child of affectedChildren) {
            const childRef = doc(
              db,
              "users",
              currentUser.uid,
              "equipment",
              child.id
            );
            batch.update(childRef, { category: itemData.category });
          }
          if (affectedChildren.length > 0) {
            await batch.commit();
          }

          // Update local state (master + children) using functional set
          setEquipment((prev) =>
            prev.map((e) => {
              if (e.id === itemData.id) return { ...e, ...dataToUpdate };
              if (affectedChildren.findIndex((c) => c.id === e.id) !== -1) {
                return { ...e, category: itemData.category };
              }
              return e;
            })
          );
        } catch (propErr) {
          console.error("Error propagating category to child items:", propErr);
          // Fallback: still update master locally
          setEquipment((prev) =>
            prev.map((e) =>
              e.id === itemData.id ? { ...e, ...dataToUpdate } : e
            )
          );
        }
      } else {
        // Only update master locally if no category change
        setEquipment((prev) =>
          prev.map((e) =>
            e.id === itemData.id ? { ...e, ...dataToUpdate } : e
          )
        );
      }

      await logTransaction({
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
      await logTransaction({
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
      if (!currentUser) return;
      const batch = writeBatch(db);
      const updatedEquipment = [...equipment];

      for (const itemData of itemsToPurchase) {
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

        const index = updatedEquipment.findIndex((e) => e.id === itemData.id);
        if (index !== -1) {
          updatedEquipment[index] = { ...updatedEquipment[index], ...payload };
        }

        await logTransaction({
          type: "procurement",
          reason: "purchasing",
          itemName: updatedEquipment[index].name,
          quantity: itemData.quantity,
        });
      }

      await batch.commit();
      setEquipment(updatedEquipment);
      toast.success(t("toast_moved_to_purchasing_list"));
    },
    [currentUser, equipment, logTransaction, t]
  );

  const confirmPurchased = useCallback(
    async (ids) => {
      const batch = writeBatch(db);
      let localEquipment = [...equipment];
      for (const id of ids) {
        const docRef = doc(db, "users", currentUser.uid, "equipment", id);
        batch.update(docRef, { status: "purchased" });
        await logTransaction({
          type: "procurement",
          reason: "purchased",
          itemName: equipment.find((e) => e.id === id).name,
        });
        const index = localEquipment.findIndex((e) => e.id === id);
        if (index > -1) localEquipment[index].status = "purchased";
      }
      await batch.commit();
      setEquipment(localEquipment);
      toast.success(t("toast_purchase_confirmed_successfully"));
    },
    [currentUser, equipment, logTransaction, t]
  );

  const cancelOrRevertPurchase = useCallback(
    async (item) => {
      await deleteDoc(doc(db, "users", currentUser.uid, "equipment", item.id));
      setEquipment(equipment.filter((e) => e.id !== item.id));
      await logTransaction({
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
      await logTransaction({
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
          purchaseQuantity: item.purchaseQuantity,
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
      await logTransaction({
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

      const uniqueSerials = new Set(serials.map((s) => s.toLowerCase()));
      if (uniqueSerials.size !== serials.length) {
        toast.error(t("toast_duplicate_sn_error"));
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

      // Ensure category exists and resolve to a valid category ID
      const ensuredCategory =
        (await autoAddCategoryIfNotExists(data.category)) || data.category;

      const masterExists = equipment.some(
        (item) =>
          item.name.toLowerCase() === data.name.toLowerCase() &&
          item.category === ensuredCategory &&
          item.status === "master"
      );

      if (!masterExists) {
        const newMasterItem = {
          name: data.name,
          category: ensuredCategory,
          status: "master",
          location: "master-list",
          quantity: 0,
          price: 0,
        };
        const newMasterDocRef = doc(
          collection(db, "users", currentUser.uid, "equipment")
        );
        batch.set(newMasterDocRef, newMasterItem);
        await logTransaction({
          type: "master-list",
          reason: "add-legacy",
          itemName: data.name,
          details: { category: ensuredCategory, autoCreated: true },
        });
      }

      for (const sn of serials) {
        const newItemData = {
          ...data,
          category: ensuredCategory,
          serialNumber: sn,
          quantity: 1,
          purchaseQuantity: data.quantity,
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
      await fetchData();

      await logTransaction({
        type: "import",
        reason: "legacy",
        itemName: data.name,
        quantity: data.quantity,
      });

      toast.success(t("toast_legacy_item_imported"));
      return true;
    },
    [
      currentUser,
      equipment,
      logTransaction,
      t,
      fetchData,
      autoAddCategoryIfNotExists,
    ]
  );

  // Helper function to handle category change logic within updateItem
  const handleCategoryChange = useCallback(
    async (originalItem, newItemData) => {
      // 1. Auto-create category if it doesn't exist
      await autoAddCategoryIfNotExists(newItemData.category);

      // 2. Check if master item exists in new category, if not, create it
      const masterExists = equipment.some(
        (e) =>
          e.status === "master" &&
          e.name.toLowerCase() === newItemData.name.toLowerCase() &&
          e.category === newItemData.category
      );

      if (!masterExists) {
        const newMasterItem = {
          name: newItemData.name,
          category: newItemData.category,
          status: "master",
          location: "master-list",
          quantity: 0,
          price: 0,
        };
        const newMasterDocRef = await addDoc(
          collection(db, "users", currentUser.uid, "equipment"),
          newMasterItem
        );
        setEquipment((prev) => [
          ...prev,
          { ...newMasterItem, id: newMasterDocRef.id },
        ]);
        await logTransaction({
          type: "master-list",
          reason: "add-auto",
          itemName: newItemData.name,
          details: { category: newItemData.category, autoCreated: true },
        });
        toast.success(
          t("toast_master_item_auto_created", {
            itemName: newItemData.name,
            category: newItemData.category,
          })
        );
      }

      // 3. Check if old category becomes empty after this move and notify user
      const remainingItemsInOldCategory = equipment.filter(
        (e) => e.category === originalItem.category && e.id !== originalItem.id
      );

      if (remainingItemsInOldCategory.length === 0) {
        toast(
          t("toast_category_empty_suggestion", {
            category: originalItem.category,
          }),
          { duration: 5000 }
        );
      } else {
        const nonMasterItems = remainingItemsInOldCategory.filter(
          (e) => e.status !== "master"
        );
        if (nonMasterItems.length === 0) {
          toast(
            t("toast_category_only_masters_suggestion", {
              category: originalItem.category,
            }),
            { duration: 5000 }
          );
        }
      }
    },
    [
      currentUser,
      equipment,
      logTransaction,
      autoAddCategoryIfNotExists,
      setEquipment,
      t,
    ]
  );

  const updateItem = useCallback(
    async (data) => {
      const originalItem = equipment.find((e) => e.id === data.id);
      if (!originalItem) {
        toast.error(t("toast_item_not_found_for_update"));
        return false;
      }

      // Handle logic if the category was changed
      if (originalItem.category !== data.category) {
        await handleCategoryChange(originalItem, data);
      }

      const docRef = doc(db, "users", currentUser.uid, "equipment", data.id);
      await updateDoc(docRef, data);

      // Update state immediately instead of fetching all data
      setEquipment((prevEquipment) => {
        return prevEquipment.map((item) =>
          item.id === data.id ? { ...item, ...data } : item
        );
      });

      await logTransaction({
        type: "inventory",
        reason: "update",
        itemName: data.name,
        details: {
          oldCategory: originalItem.category,
          newCategory: data.category,
        },
      });

      toast.success(t("toast_info_updated_successfully"));
      return true;
    },
    [
      currentUser,
      equipment,
      logTransaction,
      t,
      handleCategoryChange,
      setEquipment,
    ]
  );

  const deleteItem = useCallback(
    async (itemToDelete) => {
      if (!currentUser) return;
      try {
        await deleteDoc(
          doc(db, "users", currentUser.uid, "equipment", itemToDelete.id)
        );
        setEquipment((prev) =>
          prev.filter((item) => item.id !== itemToDelete.id)
        );
        await logTransaction({
          type: "inventory",
          reason: "delete",
          itemName: itemToDelete.name,
          details: {
            serialNumber: itemToDelete.serialNumber,
            from: "Inventory",
          },
        });
        toast.success(
          t("toast_item_deleted_successfully", { itemName: itemToDelete.name })
        );
      } catch (error) {
        console.error("Error deleting item: ", error);
        toast.error(t("toast_error_deleting_item"));
      }
    },
    [currentUser, logTransaction, t]
  );

  const allocateItem = useCallback(
    async (item, allocationDetails) => {
      const dataToUpdate = {
        status: "in-use",
        location: "location_in_use",
        allocationDetails,
      };
      await updateDoc(
        doc(db, "users", currentUser.uid, "equipment", item.id),
        dataToUpdate
      );
      setEquipment(
        equipment.map((e) => (e.id === item.id ? { ...e, ...dataToUpdate } : e))
      );

      // Find department and position names for logging
      const departmentName =
        departmentsList?.find(
          (dept) => dept.id === allocationDetails.department
        )?.name || allocationDetails.department;
      const positionName =
        positionsList?.find((pos) => pos.id === allocationDetails.position)
          ?.name || allocationDetails.position;

      await logTransaction({
        type: "allocation",
        reason: "allocate",
        itemName: item.name,
        details: {
          to: allocationDetails.recipientName,
          department: departmentName,
          position: positionName,
        },
      });
      toast.success(
        t("toast_item_allocated_successfully", { itemName: item.name })
      );
    },
    [currentUser, equipment, logTransaction, t, departmentsList, positionsList]
  );

  const updateAllocationDetails = useCallback(
    async (item, updatedDetails) => {
      const dataToUpdate = {
        allocationDetails: {
          ...item.allocationDetails,
          ...updatedDetails,
          handoverDate: item.allocationDetails.handoverDate, // Keep original handover date
          condition: item.allocationDetails.condition, // Keep original condition
        },
      };

      await updateDoc(
        doc(db, "users", currentUser.uid, "equipment", item.id),
        dataToUpdate
      );

      setEquipment(
        equipment.map((e) => (e.id === item.id ? { ...e, ...dataToUpdate } : e))
      );

      // Find department and position names for logging
      const departmentName =
        departmentsList?.find((dept) => dept.id === updatedDetails.department)
          ?.name || updatedDetails.department;
      const positionName =
        positionsList?.find((pos) => pos.id === updatedDetails.position)
          ?.name || updatedDetails.position;

      await logTransaction({
        type: "allocation",
        reason: "update",
        itemName: item.name,
        details: {
          to: updatedDetails.recipientName,
          department: departmentName,
          position: positionName,
        },
      });

      toast.success(
        t("toast_allocation_updated_successfully", { itemName: item.name })
      );
    },
    [currentUser, equipment, logTransaction, t, departmentsList, positionsList]
  );

  const recallItem = useCallback(
    async (item, noteValue, isNoteKey) => {
      const condition = {
        key: "condition_recalled",
        params: { note: { value: noteValue, isKey: isNoteKey } },
      };
      const dataToUpdate = {
        status: "available",
        location: "location_in_stock",
        recalledFrom: item.allocationDetails?.recipientName || "N/A",
        allocationDetails: null,
        condition,
      };
      await updateDoc(
        doc(db, "users", currentUser.uid, "equipment", item.id),
        dataToUpdate
      );
      setEquipment(
        equipment.map((e) => (e.id === item.id ? { ...e, ...dataToUpdate } : e))
      );
      await logTransaction({
        type: "allocation",
        reason: "recall",
        itemName: item.name,
        details: {
          from: item.allocationDetails?.recipientName,
          note: noteValue,
        },
      });
      toast.success(t("toast_item_recalled_successfully"));
    },
    [currentUser, equipment, logTransaction, t]
  );

  const completeRepair = useCallback(
    async (item, noteValue, isNoteKey) => {
      const condition = {
        key: "condition_repaired",
        params: { note: { value: noteValue, isKey: isNoteKey } },
      };
      const dataToUpdate = {
        status: "available",
        location: "location_in_stock",
        condition,
        recalledFrom: null,
      };
      await updateDoc(
        doc(db, "users", currentUser.uid, "equipment", item.id),
        dataToUpdate
      );
      setEquipment(
        equipment.map((e) => (e.id === item.id ? { ...e, ...dataToUpdate } : e))
      );
      await logTransaction({
        type: "inventory",
        reason: "repair-complete",
        itemName: item.name,
        details: { note: noteValue },
      });
      toast.success(t("toast_repair_complete", { itemName: item.name }));
    },
    [currentUser, equipment, logTransaction, t]
  );

  // Bulk move all items (masters and children) from one category to another
  const bulkMoveCategory = useCallback(
    async ({ fromCategoryId, toCategoryId }) => {
      if (!currentUser) return false;
      if (!fromCategoryId || !toCategoryId) return false;
      if (fromCategoryId === toCategoryId) {
        toast(t("no_changes"));
        return false;
      }

      // Collect all affected items (both master and non-master) currently in fromCategoryId
      const affected = equipment.filter((e) => e.category === fromCategoryId);
      if (affected.length === 0) {
        toast(t("no_data_available"));
        return false;
      }

      try {
        // Firestore batch limit ~500 operations; use chunks safely below that
        const chunkSize = 450;
        for (let i = 0; i < affected.length; i += chunkSize) {
          const slice = affected.slice(i, i + chunkSize);
          const batch = writeBatch(db);
          for (const item of slice) {
            const ref = doc(db, "users", currentUser.uid, "equipment", item.id);
            batch.update(ref, { category: toCategoryId });
          }
          await batch.commit();
        }

        // Update local state to reflect changes immediately
        setEquipment((prev) =>
          prev.map((e) =>
            e.category === fromCategoryId ? { ...e, category: toCategoryId } : e
          )
        );

        await logTransaction({
          type: "inventory",
          reason: "bulk-category-move",
          itemName: "*",
          details: { fromCategoryId, toCategoryId, count: affected.length },
        });

        toast.success(t("toast_info_updated_successfully"));
        return true;
      } catch (err) {
        console.error("Bulk move category error:", err);
        toast.error(t("error_occurred"));
        return false;
      }
    },
    [currentUser, equipment, t, setEquipment, logTransaction]
  );

  const markAsDamaged = useCallback(
    async (item, noteValue, isNoteKey) => {
      const condition = {
        key: "condition_damaged",
        params: { note: { value: noteValue, isKey: isNoteKey } },
      };
      const dataToUpdate = {
        status: "maintenance",
        location: "location_maintenance",
        condition,
        recalledFrom: item.allocationDetails?.recipientName || "N/A",
        allocationDetails: null,
        maintenanceDate: new Date().toISOString(),
      };
      await updateDoc(
        doc(db, "users", currentUser.uid, "equipment", item.id),
        dataToUpdate
      );
      setEquipment(
        equipment.map((e) => (e.id === item.id ? { ...e, ...dataToUpdate } : e))
      );
      await logTransaction({
        type: "inventory",
        reason: "damaged",
        itemName: item.name,
        details: { note: noteValue },
      });
      toast.success(t("toast_moved_to_maintenance", { itemName: item.name }));
    },
    [currentUser, equipment, logTransaction, t]
  );

  const updateMaintenanceNote = useCallback(
    async (item, noteValue, isNoteKey) => {
      const condition = {
        ...item.condition,
        params: { note: { value: noteValue, isKey: isNoteKey } },
      };
      await updateDoc(doc(db, "users", currentUser.uid, "equipment", item.id), {
        condition,
      });
      setEquipment(
        equipment.map((e) => (e.id === item.id ? { ...e, condition } : e))
      );
      await logTransaction({
        type: "inventory",
        reason: "update-note",
        itemName: item.name,
      });
      toast.success(t("toast_note_updated_successfully"));
    },
    [currentUser, equipment, logTransaction, t]
  );

  const markUnrepairable = useCallback(
    async (item) => {
      const dataToUpdate = {
        status: "liquidation",
        location: "location_liquidation_stock",
      };
      await updateDoc(
        doc(db, "users", currentUser.uid, "equipment", item.id),
        dataToUpdate
      );
      setEquipment(
        equipment.map((e) => (e.id === item.id ? { ...e, ...dataToUpdate } : e))
      );
      await logTransaction({
        type: "inventory",
        reason: "unrepairable",
        itemName: item.name,
        details: {
          recalledFrom:
            item.recalledFrom || item.allocationDetails?.recipientName,
        },
      });
      toast.success(t("toast_moved_to_liquidation", { itemName: item.name }));
    },
    [currentUser, equipment, logTransaction, t]
  );

  const liquidateItem = useCallback(
    async (item) => {
      await deleteDoc(doc(db, "users", currentUser.uid, "equipment", item.id));
      setEquipment(equipment.filter((e) => e.id !== item.id));
      await logTransaction({
        type: "inventory",
        reason: "liquidated",
        itemName: item.name,
        details: { recalledFrom: item.recalledFrom },
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
          // eslint-disable-next-line no-alert
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
            const itemData = { ...item };
            delete itemData.id;
            const newDocRef = doc(equipColRef);
            batch.set(newDocRef, itemData);
          });
          data.transactions.forEach((item) => {
            const itemData = { ...item };
            delete itemData.id;
            const newDocRef = doc(transColRef);
            batch.set(newDocRef, itemData);
          });

          await batch.commit();
          await fetchData();
          toast.success(t("toast_data_restored_successfully"));
          // THAY ĐỔI #2: Gọi setActiveTab sau khi import thành công
          if (setActiveTab) setActiveTab("home");
        } catch (error) {
          console.error("Error reading or importing backup file: ", error);
          toast.error(t("toast_error_reading_backup_file"));
        }
      };
      reader.readAsText(file);
    },
    // THAY ĐỔI #3: Thêm setActiveTab vào dependency array
    [currentUser, fetchData, t, setActiveTab]
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
      toast.error(t("toast_error_resetting_data"));
    }
  }, [currentUser, t]);

  const batchUpdateItems = useCallback(
    async (group, formData) => {
      const batch = writeBatch(db);

      group.originalItems.forEach((item, index) => {
        const updatedData = {};

        if (item.category !== formData.category) {
          updatedData.category = formData.category;
        }

        const newSn = formData.serialNumbers[index];
        if (item.serialNumber !== newSn) {
          updatedData.serialNumber = newSn;
        }

        if (Object.keys(updatedData).length > 0) {
          const docRef = doc(
            db,
            "users",
            currentUser.uid,
            "equipment",
            item.id
          );
          batch.update(docRef, updatedData);
        }
      });

      try {
        await batch.commit();
        await fetchData();
        toast.success(t("toast_info_updated_successfully"));
        return true;
      } catch (error) {
        console.error("Batch update failed: ", error);
        toast.error(t("toast_batch_update_failed"));
        return false;
      }
    },
    [currentUser, fetchData, t]
  );

  // Memoized computed values for performance
  const inventoryItems = useMemo(
    () => equipment.filter((item) => item.status !== "master"),
    [equipment]
  );

  return {
    equipment,
    transactions,
    dataLoading,
    inventoryItems, // Add memoized inventoryItems
    addEquipmentType,
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
    updateAllocationDetails,
    recallItem,
    markAsDamaged,
    updateMaintenanceNote,
    completeRepair,
    bulkMoveCategory,
    markUnrepairable,
    liquidateItem,
    backupData,
    importData,
    resetData,
    batchUpdateItems,
    deleteLogs,
  };
};
