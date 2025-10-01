// src/modals/EquipmentTypeModal.js
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useDynamicData } from "../hooks/useDynamicData";
import { useAuth } from "../hooks/useAuth";

const EquipmentTypeModal = ({
  show,
  onClose,
  onSubmit,
  categories,
  t,
  initialData,
}) => {
  const { currentUser } = useAuth();
  const { autoAddCategoryIfNotExists } = useDynamicData(currentUser);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const isEditing = !!initialData;

  useEffect(() => {
    if (!show) return;
    if (isEditing) {
      setName(initialData?.name || "");
      setCategory(initialData?.category || "");
      setShowCustomCategory(false);
      setCustomCategory("");
    } else {
      // Thêm mới: chọn category hợp lệ đầu tiên (bỏ id 'all') nếu có
      const firstCategoryId = (categories || []).find((c) => c.id !== "all")?.id || "";
      setName("");
      setCategory(firstCategoryId);
      setShowCustomCategory(false);
      setCustomCategory("");
    }
  }, [show, initialData, isEditing, categories]);

  if (!show) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let finalCategory = category;
    
    // Handle custom category
    if (showCustomCategory && customCategory.trim()) {
      const newCategoryId = await autoAddCategoryIfNotExists(customCategory.trim());
      if (newCategoryId) {
        finalCategory = newCategoryId;
      }
    }
    
    if (!name || !finalCategory) {
      toast.error(t("please_fill_all_fields"));
      return;
    }
    
    // Nếu là chế độ sửa, gửi cả ID
    const dataToSend = isEditing
      ? { ...initialData, name, category: finalCategory }
      : { name, category: finalCategory };
    onSubmit(dataToSend);
    onClose();
  };

  const categoryOptions = categories.filter((c) => c.id !== "all");
  const modalTitle = isEditing
    ? t("edit_device_modal_title")
    : t("add_new_master_item_modal_title");
  const buttonText = isEditing ? t("save_changes") : t("save");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          {modalTitle}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("master_item_name")}
            </label>
            <input
              type="text"
              placeholder={t("master_item_name_placeholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("category")}
            </label>
            <div className="space-y-2 mt-1">
              <select
                value={showCustomCategory ? "custom" : category}
                onChange={(e) => {
                  if (e.target.value === "custom") {
                    setShowCustomCategory(true);
                  } else {
                    setShowCustomCategory(false);
                    setCategory(e.target.value);
                  }
                }}
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                required={!showCustomCategory}
              >
                <option value="">-- Chọn danh mục --</option>
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
                <option value="custom" className="font-bold text-blue-600">
                  + Thêm danh mục mới...
                </option>
              </select>
              
              {showCustomCategory && (
                <div className="relative">
                  <Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Nhập danh mục mới..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-blue-300 focus:border-blue-500 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    required
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentTypeModal;
