// src/modals/AllocationModal.js
import React, { useState, useEffect } from "react";
import {
  User,
  Building,
  ClipboardList,
  Badge,
  Briefcase,
  Hash,
  Calendar,
} from "lucide-react";
import { positions, departments } from "../constants";

const AllocationModal = ({ show, onClose, onSubmit, item, t }) => {
  const [formData, setFormData] = useState({
    recipientName: "",
    employeeId: "",
    position: positions[0]?.id || "",
    positionDescription: "",
    department: departments[0]?.id || "",
    condition: "",
    handoverDate: new Date().toISOString(),
  });

  const toInputDateTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    // Adjust for local timezone to display correctly in the input
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (show && item) {
      let displayCondition = "---";
      if (item.condition) {
        if (typeof item.condition === "object" && item.condition.key) {
          displayCondition = t(item.condition.key, item.condition.params);
        } else {
          const conditionText = t(String(item.condition));
          displayCondition = item.isRecalled
            ? t("recalled_prefix", { conditionText: conditionText })
            : conditionText;
        }
      }

      // Reset form when modal opens
      setFormData({
        recipientName: "",
        employeeId: "",
        position: positions[0]?.id || "",
        positionDescription: "",
        department: departments[0]?.id || "",
        condition: displayCondition,
        handoverDate: new Date().toISOString(),
      });
    }
  }, [show, item, t]);

  if (!show || !item) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "handoverDate") {
      const date = new Date(value);
      setFormData((prev) => ({ ...prev, [name]: date.toISOString() }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const originalConditionKey = item.condition
      ? typeof item.condition === "object"
        ? item.condition.key
        : String(item.condition)
      : "condition_new";

    onSubmit({
      ...formData,
      condition: originalConditionKey,
      serialNumber: item.serialNumber, // SN is now fixed from the item
      equipmentId: item.id,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
          {t("allocate_device")}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t("allocating")}: <span className="font-semibold">{item.name}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("recipient_name")}
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("employee_id")}
              </label>
              <div className="relative mt-1">
                <Badge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("position")}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 appearance-none"
                  required
                >
                  {positions.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      {t(pos.tKey)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <input
                  type="text"
                  name="positionDescription"
                  placeholder="Mô tả thêm (ví dụ: Kỹ sư IT)"
                  value={formData.positionDescription}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("department")}
            </label>
            <div className="relative mt-1">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 appearance-none"
                required
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {t(dept.tKey)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("serial_number_sn")}
              </label>
              <div className="relative mt-1">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                {/* --- TRƯỜNG SN ĐÃ ĐƯỢC ĐƠN GIẢN HÓA --- */}
                <input
                  type="text"
                  value={item.serialNumber || ""}
                  className="w-full pl-10 pr-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700/50 dark:border-gray-600 cursor-not-allowed"
                  disabled
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("handover_date")}
              </label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="datetime-local"
                  name="handoverDate"
                  value={toInputDateTime(formData.handoverDate)}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("condition_on_handover")}
            </label>
            <div className="relative mt-1">
              <ClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="condition"
                value={formData.condition}
                className="w-full pl-10 pr-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700/50 dark:border-gray-600 cursor-not-allowed"
                disabled
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {t("confirm_allocation")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllocationModal;
