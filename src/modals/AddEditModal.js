// src/modals/AddEditModal.js
import React, { useState, useEffect } from "react";

// Định nghĩa một state mặc định để tránh lỗi null
const defaultFormState = {
  name: "",
  category: "pc",
  status: "available",
  location: "location_in_stock",
  condition: "condition_legacy_import",
  quantity: 1,
  price: 0,
  serialNumber: "",
};

const AddEditModal = ({
  show,
  onClose,
  onSubmit,
  initialData,
  categories,
  t,
}) => {
  const [formData, setFormData] = useState(defaultFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = initialData != null;

  useEffect(() => {
    if (show) {
      setFormData(isEditing ? initialData : defaultFormState);
    }
  }, [initialData, show, isEditing]);

  if (!show) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isNumericField = name === "quantity" || name === "price";
    const processedValue = isNumericField ? parseFloat(value) || 0 : value;
    setFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = await onSubmit(formData);

    setIsSubmitting(false);

    if (success) {
      onClose();
    }
  };

  const categoryOptions = categories.filter((c) => c.id !== "all");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          {isEditing
            ? t("edit_device_modal_title")
            : t("import_unlisted_device")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("device_name")}
            </label>
            {/* *** THAY ĐỔI CHÍNH Ở ĐÂY *** */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
              required
              disabled={isEditing}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("category")}
              </label>
              {/* *** THAY ĐỔI CHÍNH Ở ĐÂY *** */}
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed"
                disabled={isEditing}
              >
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("status")}
              </label>
              <select
                name="status"
                value={formData.status}
                disabled
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-gray-700/50`}
              >
                <option value="available">{t("available")}</option>
              </select>
            </div>
          </div>

          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("condition")}
              </label>
              <input
                type="text"
                value={t(formData.condition)}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-gray-100 dark:bg-gray-700/50 text-gray-900 dark:text-gray-200"
                disabled
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("quantity")}
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 text-gray-900 dark:text-gray-200 focus:ring-blue-500 ${
                  isEditing
                    ? "bg-gray-100 dark:bg-gray-700/50"
                    : "bg-white dark:bg-gray-700"
                }`}
                required
                disabled={isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("price")} (VNĐ)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("serial_number_sn")}
            </label>
            {isEditing ? (
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500"
                required
              />
            ) : (
              <textarea
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                placeholder={t("add_multiple_sn_placeholder")}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-blue-500"
                rows="3"
              />
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSubmitting ? "..." : isEditing ? t("save_changes") : t("add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditModal;
