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
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { categoryStructure, departments, positions } from "../constants";
import toast from "react-hot-toast";

export const useDynamicData = (currentUser, t) => {
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
      // Initialize categories
      const categoriesRef = collection(db, "categories");
      const categoriesQuery = query(categoriesRef, orderBy("name"));
      
      // Initialize departments
      const departmentsRef = collection(db, "departments");
      const departmentsQuery = query(departmentsRef, orderBy("name"));
      
      // Initialize positions
      const positionsRef = collection(db, "positions");
      const positionsQuery = query(positionsRef, orderBy("name"));

      // Listen to categories
      const unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
        const firebaseCategories = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Merge with default categories
        const defaultCategories = categoryStructure.map(cat => ({
          ...cat,
          name: t(cat.tKey),
          isDefault: true
        }));
        
        setCategories([...defaultCategories, ...firebaseCategories]);
      });

      // Listen to departments
      const unsubscribeDepartments = onSnapshot(departmentsQuery, (snapshot) => {
        const firebaseDepartments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Merge with default departments
        const defaultDepartments = departments.map(dept => ({
          ...dept,
          name: t(dept.tKey),
          isDefault: true
        }));
        
        setDepartmentsList([...defaultDepartments, ...firebaseDepartments]);
      });

      // Listen to positions
      const unsubscribePositions = onSnapshot(positionsQuery, (snapshot) => {
        const firebasePositions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Merge with default positions
        const defaultPositions = positions.map(pos => ({
          ...pos,
          name: t(pos.tKey),
          isDefault: true
        }));
        
        setPositionsList([...defaultPositions, ...firebasePositions]);
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
  }, [currentUser, t]);

  useEffect(() => {
    let cleanup;
    initializeData().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [initializeData]);

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

      await addDoc(collection(db, "categories"), newCategory);
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
    
    try {
      const categoryRef = doc(db, "categories", categoryId);
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
  }, [currentUser]);

  const deleteCategory = useCallback(async (categoryId) => {
    if (!currentUser) return;
    
    try {
      await deleteDoc(doc(db, "categories", categoryId));
      toast.success("Xóa danh mục thành công");
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Lỗi khi xóa danh mục");
      return false;
    }
  }, [currentUser]);

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

      await addDoc(collection(db, "departments"), newDepartment);
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
    
    try {
      const departmentRef = doc(db, "departments", departmentId);
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
  }, [currentUser]);

  const deleteDepartment = useCallback(async (departmentId) => {
    if (!currentUser) return;
    
    try {
      await deleteDoc(doc(db, "departments", departmentId));
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

      await addDoc(collection(db, "positions"), newPosition);
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
    
    try {
      const positionRef = doc(db, "positions", positionId);
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
  }, [currentUser]);

  const deletePosition = useCallback(async (positionId) => {
    if (!currentUser) return;
    
    try {
      await deleteDoc(doc(db, "positions", positionId));
      toast.success("Xóa chức danh thành công");
      return true;
    } catch (error) {
      console.error("Error deleting position:", error);
      toast.error("Lỗi khi xóa chức danh");
      return false;
    }
  }, [currentUser]);

  // Auto-add functions cho tự động tạo mới
  const autoAddCategoryIfNotExists = useCallback(async (categoryName) => {
    if (!currentUser || !categoryName) return null;
    
    // Check if category exists
    const existing = (categories || []).find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    
    if (existing) {
      return existing.id || existing.key; // return id for custom, key for default
    }

    // Auto-create new category
    const success = await addCategory({ name: categoryName });
    if (success) {
      // Find the newly created category
      const newCategory = (categories || []).find(cat => 
        cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      return newCategory?.id;
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