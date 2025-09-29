// src/components/DynamicDataManager.js
import React, { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Settings, AlertCircle } from "lucide-react";
import { useDynamicData } from "../hooks/useDynamicData";

const DynamicDataManager = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState("categories");
  const [editingItem, setEditingItem] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [editItemName, setEditItemName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    categories,
    departmentsList,
    positionsList,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addPosition,
    updatePosition,
    deletePosition,
  } = useDynamicData(currentUser);

  // Add safety check for currentUser after hooks
  if (!currentUser) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-fadeIn">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <AlertCircle className="w-6 h-6" />
          <p>Vui lòng đăng nhập để sử dụng tính năng này</p>
        </div>
      </div>
    );
  }

  // Generic handlers
  const handleAdd = async () => {
    if (!newItemName.trim()) return;
    
    let success = false;
    switch (activeTab) {
      case "categories":
        success = await addCategory({ name: newItemName.trim() });
        break;
      case "departments":
        success = await addDepartment({ name: newItemName.trim() });
        break;
      case "positions":
        success = await addPosition({ name: newItemName.trim() });
        break;
      default:
        return;
    }
    
    if (success) {
      setNewItemName("");
      setShowAddForm(false);
    }
  };

  const handleEdit = async (item) => {
    if (!editItemName.trim()) return;
    
    let success = false;
    switch (activeTab) {
      case "categories":
        success = await updateCategory(item.id, { name: editItemName.trim() });
        break;
      case "departments":
        success = await updateDepartment(item.id, { name: editItemName.trim() });
        break;
      case "positions":
        success = await updatePosition(item.id, { name: editItemName.trim() });
        break;
      default:
        return;
    }
    
    if (success) {
      setEditingItem(null);
      setEditItemName("");
    }
  };

  const handleDelete = async (item) => {
    if (item.isDefault) {
      // eslint-disable-next-line no-alert
      alert("Không thể xóa các mục mặc định của hệ thống");
      return;
    }

    // eslint-disable-next-line no-alert
    if (!window.confirm(`Bạn có chắc chắn muốn xóa "${item.name}"?`)) {
      return;
    }
    
    switch (activeTab) {
      case "categories":
        await deleteCategory(item.id);
        break;
      case "departments":
        await deleteDepartment(item.id);
        break;
      case "positions":
        await deletePosition(item.id);
        break;
      default:
        return;
    }
  };

  const startEditing = (item) => {
    if (item.isDefault) {
      // eslint-disable-next-line no-alert
      alert("Không thể sửa các mục mặc định của hệ thống");
      return;
    }
    setEditingItem(item.id);
    setEditItemName(item.name);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditItemName("");
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case "categories":
        return categories || [];
      case "departments":
        return departmentsList || [];
      case "positions":
        return positionsList || [];
      default:
        return [];
    }
  };

  const getTabTitle = (tab) => {
    switch (tab) {
      case "categories":
        return "Danh Mục Thiết Bị";
      case "departments":
        return "Phòng Ban";
      case "positions":
        return "Chức Danh";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-fadeIn">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-slideInLeft" style={{ animationDelay: `${i * 0.1}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg animate-slideInUp">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 animate-slideInDown">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Quản Lý Dữ Liệu Hệ Thống
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Thêm, sửa, xóa các danh mục, phòng ban và chức danh
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 animate-slideInLeft">
        {["categories", "departments", "positions"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setEditingItem(null);
              setShowAddForm(false);
              setNewItemName("");
              setEditItemName("");
            }}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            {getTabTitle(tab)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 animate-fadeIn">
        {/* Add Button */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {getTabTitle(activeTab)} ({getCurrentData().length})
          </h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors animate-hoverScale"
          >
            <Plus className="w-4 h-4" />
            Thêm mới
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6 animate-slideInDown">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder={`Nhập tên ${getTabTitle(activeTab).toLowerCase()}...`}
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500"
                onKeyPress={(e) => e.key === "Enter" && handleAdd()}
                autoFocus
              />
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 animate-hoverScale transition-all duration-200"
              >
                <Save className="w-4 h-4" />
                Lưu
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewItemName("");
                }}
                className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 animate-hoverScale transition-all duration-200"
              >
                <X className="w-4 h-4" />
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-2">
          {getCurrentData().length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Chưa có dữ liệu
            </div>
          ) : (
            getCurrentData().map((item, index) => (
              <div
                key={item.id || item.key}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg animate-slideInLeft transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  {editingItem === item.id ? (
                    <input
                      type="text"
                      value={editItemName}
                      onChange={(e) => setEditItemName(e.target.value)}
                      className="px-3 py-1 border rounded dark:bg-gray-600 dark:border-gray-500"
                      onKeyPress={(e) => e.key === "Enter" && handleEdit(item)}
                      autoFocus
                    />
                  ) : (
                    <>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {item.name}
                      </span>
                      {item.isDefault && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                          Mặc định
                        </span>
                      )}
                      {item.isCustom && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                          Tùy chỉnh
                        </span>
                      )}
                    </>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {editingItem === item.id ? (
                    <>
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50 rounded animate-hoverScale transition-all duration-200"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded animate-hoverScale transition-all duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(item)}
                        disabled={item.isDefault}
                        className={`p-2 rounded transition-all duration-200 ${
                          item.isDefault 
                            ? "text-gray-400 cursor-not-allowed" 
                            : "text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 animate-hoverScale"
                        }`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        disabled={item.isDefault}
                        className={`p-2 rounded transition-all duration-200 ${
                          item.isDefault 
                            ? "text-gray-400 cursor-not-allowed" 
                            : "text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 animate-hoverScale"
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicDataManager;