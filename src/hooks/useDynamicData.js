// src/hooks/useDynamicData.js
import { useState, useEffect, useCallback } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import toast from "react-hot-toast";

export const useDynamicData = (currentUser, equipment = []) => {
  const [categories, setCategories] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [positionsList, setPositionsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function để tạo key từ name
  const createKey = useCallback((name, prefix) => {
    const sanitized = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");
    return `${prefix}_${sanitized}`;
  }, []);

  // Initialize default data và load từ Firebase
  const initializeData = useCallback(async () => {
    if (!currentUser) return;

    try {
      // Initialize categories with user-specific path
      const categoriesRef = collection(db, "users", currentUser.uid, "categories");
      const categoriesQuery = query(categoriesRef, orderBy("name"));
      
      // Initialize departments with user-specific path
      const departmentsRef = collection(db, "users", currentUser.uid, "departments");
      const departmentsQuery = query(departmentsRef, orderBy("name"));
      
      // Initialize positions with user-specific path
      const positionsRef = collection(db, "users", currentUser.uid, "positions");
      const positionsQuery = query(positionsRef, orderBy("name"));

      // Listen to categories
      const unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
        const firebaseCategories = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Only use Firebase categories (no default categories)
        setCategories(firebaseCategories);
      });

      // Listen to departments
      const unsubscribeDepartments = onSnapshot(departmentsQuery, (snapshot) => {
        const firebaseDepartments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Only use Firebase departments (no default departments)
        setDepartmentsList(firebaseDepartments);
      });

      // Listen to positions
      const unsubscribePositions = onSnapshot(positionsQuery, (snapshot) => {
        const firebasePositions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Only use Firebase positions (no default positions)
        setPositionsList(firebasePositions);
      });

      setLoading(false);

      // Return cleanup functions
      return () => {
        unsubscribeCategories();
        unsubscribeDepartments();
        unsubscribePositions();
      };
    } catch (error) {
      console.error("Error initializing data:", error);
      setLoading(false);
      toast.error("Lỗi khi tải dữ liệu");
    }
  }, [currentUser]);

  useEffect(() => {
    let cleanup;
    initializeData().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [initializeData]);

  // Helper function để kiểm tra category có đang được sử dụng không
  const isCategoryInUse = useCallback((categoryId) => {
    if (!equipment || equipment.length === 0) return false;
    return equipment.some(item => item.category === categoryId);
  }, [equipment]);

  // Categories functions
  const addCategory = useCallback(async (categoryData) => {
    if (!currentUser) return;
    
    try {
      // Check for duplicates
      const existing = (categories || []).some(cat => 
        cat.name.toLowerCase() === categoryData.name.toLowerCase()
      );
      
      if (existing) {
        toast.error("Danh mục đã tồn tại");
        return false;
      }

      const key = createKey(categoryData.name, "category");
      const newCategory = {
        name: categoryData.name,
        key: key,
        isCustom: true,
        createdAt: new Date(),
        createdBy: currentUser.uid
      };

      await addDoc(collection(db, "users", currentUser.uid, "categories"), newCategory);
      toast.success("Thêm danh mục thành công");
      return true;
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Lỗi khi thêm danh mục");
      return false;
    }
  }, [currentUser, categories, createKey]);

  const updateCategory = useCallback(async (categoryId, categoryData) => {
    if (!currentUser) return;
    
    // Check for duplicate name (excluding current item)
    const existing = (categories || []).some(cat => 
      cat.id !== categoryId && cat.name.toLowerCase() === categoryData.name.toLowerCase()
    );
    
    if (existing) {
      toast.error("Tên danh mục đã tồn tại");
      return false;
    }
    
    // Check if category is in use
    if (isCategoryInUse(categoryId)) {
      toast.error("Không thể cập nhật danh mục đang được sử dụng trong danh sách thiết bị");
      return false;
    }
    
    try {
      const categoryRef = doc(db, "users", currentUser.uid, "categories", categoryId);
      await updateDoc(categoryRef, {
        name: categoryData.name,
        updatedAt: new Date(),
        updatedBy: currentUser.uid
      });
      
      toast.success("Cập nhật danh mục thành công");
      return true;
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Lỗi khi cập nhật danh mục");
      return false;
    }
  }, [currentUser, categories, isCategoryInUse]);

  const deleteCategory = useCallback(async (categoryId) => {
    if (!currentUser) return;
    
    // Local check: if equipment state shows usage, block
    if (isCategoryInUse(categoryId)) {
      toast.error("Không thể xóa danh mục đang được sử dụng trong danh sách thiết bị");
      return false;
    }

    // Server-side check: query Firestore to be absolutely sure
    try {
      const equipRef = collection(db, "users", currentUser.uid, "equipment");
      const q = query(equipRef, where("category", "==", categoryId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        toast.error("Danh mục đang được sử dụng trong thiết bị. Không thể xóa.");
        return false;
      }
    } catch (checkErr) {
      console.error("Error checking category usage:", checkErr);
      // If we cannot verify safely, do not delete
      toast.error("Không thể kiểm tra trạng thái sử dụng của danh mục. Thao tác bị hủy.");
      return false;
    }
    
    try {
      await deleteDoc(doc(db, "users", currentUser.uid, "categories", categoryId));
      toast.success("Xóa danh mục thành công");
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Lỗi khi xóa danh mục");
      return false;
    }
  }, [currentUser, isCategoryInUse]);

  // Departments functions
  const addDepartment = useCallback(async (departmentData) => {
    if (!currentUser) return;
    
    try {
      // Check for duplicates
      const existing = (departmentsList || []).some(dept => 
        dept.name.toLowerCase() === departmentData.name.toLowerCase()
      );
      
      if (existing) {
        toast.error("Phòng ban đã tồn tại");
        return false;
      }

      const key = createKey(departmentData.name, "dept");
      const newDepartment = {
        name: departmentData.name,
        key: key,
        isCustom: true,
        createdAt: new Date(),
        createdBy: currentUser.uid
      };

      await addDoc(collection(db, "users", currentUser.uid, "departments"), newDepartment);
      toast.success("Thêm phòng ban thành công");
      return true;
    } catch (error) {
      console.error("Error adding department:", error);
      toast.error("Lỗi khi thêm phòng ban");
      return false;
    }
  }, [currentUser, departmentsList, createKey]);

  const updateDepartment = useCallback(async (departmentId, departmentData) => {
    if (!currentUser) return;
    
    // Check for duplicate name (excluding current item)
    const existing = (departmentsList || []).some(dept => 
      dept.id !== departmentId && dept.name.toLowerCase() === departmentData.name.toLowerCase()
    );
    
    if (existing) {
      toast.error("Tên phòng ban đã tồn tại");
      return false;
    }
    
    try {
      const departmentRef = doc(db, "users", currentUser.uid, "departments", departmentId);
      await updateDoc(departmentRef, {
        name: departmentData.name,
        updatedAt: new Date(),
        updatedBy: currentUser.uid
      });
      
      toast.success("Cập nhật phòng ban thành công");
      return true;
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("Lỗi khi cập nhật phòng ban");
      return false;
    }
  }, [currentUser, departmentsList]);

  const deleteDepartment = useCallback(async (departmentId) => {
    if (!currentUser) return;
    
    try {
      await deleteDoc(doc(db, "users", currentUser.uid, "departments", departmentId));
      toast.success("Xóa phòng ban thành công");
      return true;
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Lỗi khi xóa phòng ban");
      return false;
    }
  }, [currentUser]);

  // Positions functions
  const addPosition = useCallback(async (positionData) => {
    if (!currentUser) return;
    
    try {
      // Check for duplicates
      const existing = (positionsList || []).some(pos => 
        pos.name.toLowerCase() === positionData.name.toLowerCase()
      );
      
      if (existing) {
        toast.error("Chức danh đã tồn tại");
        return false;
      }

      const key = createKey(positionData.name, "position");
      const newPosition = {
        name: positionData.name,
        key: key,
        isCustom: true,
        createdAt: new Date(),
        createdBy: currentUser.uid
      };

      await addDoc(collection(db, "users", currentUser.uid, "positions"), newPosition);
      toast.success("Thêm chức danh thành công");
      return true;
    } catch (error) {
      console.error("Error adding position:", error);
      toast.error("Lỗi khi thêm chức danh");
      return false;
    }
  }, [currentUser, positionsList, createKey]);

  const updatePosition = useCallback(async (positionId, positionData) => {
    if (!currentUser) return;
    
    // Check for duplicate name (excluding current item)
    const existing = (positionsList || []).some(pos => 
      pos.id !== positionId && pos.name.toLowerCase() === positionData.name.toLowerCase()
    );
    
    if (existing) {
      toast.error("Tên chức danh đã tồn tại");
      return false;
    }
    
    try {
      const positionRef = doc(db, "users", currentUser.uid, "positions", positionId);
      await updateDoc(positionRef, {
        name: positionData.name,
        updatedAt: new Date(),
        updatedBy: currentUser.uid
      });
      
      toast.success("Cập nhật chức danh thành công");
      return true;
    } catch (error) {
      console.error("Error updating position:", error);
      toast.error("Lỗi khi cập nhật chức danh");
      return false;
    }
  }, [currentUser, positionsList]);

  const deletePosition = useCallback(async (positionId) => {
    if (!currentUser) return;
    
    try {
      await deleteDoc(doc(db, "users", currentUser.uid, "positions", positionId));
      toast.success("Xóa chức danh thành công");
      return true;
    } catch (error) {
      console.error("Error deleting position:", error);
      toast.error("Lỗi khi xóa chức danh");
      return false;
    }
  }, [currentUser]);

  // Auto-add functions cho tự động tạo mới
  const autoAddCategoryIfNotExists = useCallback(async (categoryIdentifier) => {
    // Accept either a category ID or a category NAME
    if (!currentUser || !categoryIdentifier) return null;

    // 1) Try by ID first
    const byId = (categories || []).find((cat) => cat.id === categoryIdentifier);
    if (byId) {
      return byId.id;
    }

    // 2) Try by NAME (case-insensitive)
    const nameStr = String(categoryIdentifier);
    const byName = (categories || []).find(
      (cat) => cat.name.toLowerCase() === nameStr.toLowerCase()
    );
    if (byName) {
      return byName.id;
    }

    // 3) Auto-create as a NEW category using the provided name
    const success = await addCategory({ name: nameStr });
    if (success) {
      // Wait for onSnapshot to update state may be async; attempt a best-effort lookup
      const created = (categories || []).find(
        (cat) => cat.name.toLowerCase() === nameStr.toLowerCase()
      );
      return created?.id || null;
    }
    return null;
  }, [currentUser, categories, addCategory]);

  const autoAddDepartmentIfNotExists = useCallback(async (departmentName) => {
    if (!currentUser || !departmentName) return null;
    
    const existing = (departmentsList || []).find(dept => 
      dept.name.toLowerCase() === departmentName.toLowerCase()
    );
    
    if (existing) {
      return existing.id || existing.key;
    }

    const success = await addDepartment({ name: departmentName });
    if (success) {
      const newDepartment = (departmentsList || []).find(dept => 
        dept.name.toLowerCase() === departmentName.toLowerCase()
      );
      return newDepartment?.id;
    }
    
    return null;
  }, [currentUser, departmentsList, addDepartment]);

  const autoAddPositionIfNotExists = useCallback(async (positionName) => {
    if (!currentUser || !positionName) return null;
    
    const existing = (positionsList || []).find(pos => 
      pos.name.toLowerCase() === positionName.toLowerCase()
    );
    
    if (existing) {
      return existing.id || existing.key;
    }

    const success = await addPosition({ name: positionName });
    if (success) {
      const newPosition = (positionsList || []).find(pos => 
        pos.name.toLowerCase() === positionName.toLowerCase()
      );
      return newPosition?.id;
    }
    
    return null;
  }, [currentUser, positionsList, addPosition]);

  return {
    // Data
    categories,
    departmentsList,
    positionsList,
    loading,
    
    // Categories
    addCategory,
    updateCategory,
    deleteCategory,
    
    // Departments
    addDepartment,
    updateDepartment,
    deleteDepartment,
    
    // Positions
    addPosition,
    updatePosition,
    deletePosition,
    
    // Auto-add functions
    autoAddCategoryIfNotExists,
    autoAddDepartmentIfNotExists,
    autoAddPositionIfNotExists,
  };
};