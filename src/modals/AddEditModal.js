import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AnimatedForm } from "../components/AnimatedForm";
import { AnimatedButton } from "../components/AnimatedButton";

const defaultFormState = {
  name: "",
  category: "pc",
  status: "available",
  location: "location_in_stock",
  condition: "condition_legacy_import",
  quantity: 1,
  price: 0,
  serialNumber: "",
  importDate: new Date().toISOString(),
  handoverDate: null,
};

const toInputDate = (isoString) => {
  if (!isoString) return "";
  try {
    return new Date(isoString).toISOString().slice(0, 10);
  } catch (e) {
    return "";
  }
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
  const isInUse = isEditing && initialData.status === "in-use";

  useEffect(() => {
    if (show) {
      if (isEditing) {
        const formattedData = {
          ...initialData,
          importDate: toInputDate(initialData.importDate),
          handoverDate: toInputDate(
            initialData.allocationDetails?.handoverDate
          ),
        };
        setFormData(formattedData);
      } else {
        setFormData({
          ...defaultFormState,
          importDate: toInputDate(new Date().toISOString()),
        });
      }
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
    try {
      let dataToSubmit = { ...formData };
      dataToSubmit.importDate = new Date(dataToSubmit.importDate).toISOString();

      if (isInUse && dataToSubmit.handoverDate) {
        dataToSubmit.allocationDetails = {
          ...initialData.allocationDetails,
          handoverDate: new Date(dataToSubmit.handoverDate).toISOString(),
        };
      }
      delete dataToSubmit.handoverDate;

      const success = await onSubmit(dataToSubmit);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Failed to submit item:", error);
      toast.error(t("error_occurred"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = categories.filter((c) => c.id !== "all");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fadeIn">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-lg animate-scaleIn"
        style={{ backdropFilter: 'blur(8px)' }}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          {isEditing
            ? t("edit_device_modal_title")
            : t("import_unlisted_device")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên Thiết bị và Ngày Nhập kho */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("device_name")}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600"
                required
                disabled={isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("import_date")}
              </label>
              <input
                type="date"
                name="importDate"
                value={formData.importDate}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
          </div>

          {/* Danh mục và Trạng thái */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("category")}
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600"
                required
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
                className="mt-1 block w-full border rounded-md shadow-sm p-2 bg-gray-100 dark:bg-gray-700/50 dark:border-gray-600"
              >
                <option value="available">{t("available")}</option>
                <option value="in-use">{t("in_use")}</option>
              </select>
            </div>
          </div>

          {/* Ngày bàn giao */}
          {isInUse && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("handover_date")}
                </label>
                <input
                  type="date"
                  name="handoverDate"
                  value={formData.handoverDate || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          )}

          {/* Số lượng và Giá thành */}
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
                className="mt-1 block w-full border rounded-md shadow-sm p-2 bg-gray-100 dark:bg-gray-700/50 dark:border-gray-600"
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
                className="mt-1 block w-full border rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Số Serial */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("serial_number_sn")}
            </label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-md shadow-sm p-2 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 animate-slideInUp">
            <AnimatedButton
              type="button"
              onClick={onClose}
              variant="secondary"
              className="px-4 py-2"
            >
              {t("cancel")}
            </AnimatedButton>
            <AnimatedButton
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              className="px-4 py-2"
            >
              {isSubmitting ? "..." : isEditing ? t("save_changes") : t("add")}
            </AnimatedButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditModal;
