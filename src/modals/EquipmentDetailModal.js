// src/modals/EquipmentDetailModal.js
import React from "react";
import { X } from "lucide-react";

const EquipmentDetailModal = ({
  show,
  onClose,
  item,
  categories,
  statusLabels,
  t,
}) => {
  if (!show || !item) {
    return null;
  }

  const category = categories.find((c) => c.id === item.category);

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "in-use":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "broken":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {t("device_details")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("device_name")}
              </label>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {item.name}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("category")}
              </label>
              <p className="text-gray-800 dark:text-gray-200">
                {category?.name || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("status")}
              </label>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  item.status
                )}`}
              >
                {statusLabels[item.status] || "N/A"}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("location")}
              </label>
              <p className="text-gray-800 dark:text-gray-200">
                {/* ##### FIX: Translate location key ##### */}
                {t(item.location) || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("quantity")}
              </label>
              <p className="text-gray-800 dark:text-gray-200">
                {item.quantity || 0}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("price")}
              </label>
              <p className="text-gray-800 dark:text-gray-200">
                {item.price ? item.price.toLocaleString("vi-VN") : "0"} VNĐ
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                {t("serial_number_sn")}
              </label>
              <p className="text-gray-800 dark:text-gray-200 font-mono">
                {item.serialNumber || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailModal;
