// src/modals/RecallModal.js
import React, { useState, useEffect } from "react";

const RecallModal = ({ show, onClose, onSubmit, item, t }) => {
  const [reasonKey, setReasonKey] = useState("condition_good_as_new");
  const [maintenanceNote, setMaintenanceNote] = useState("");

  const isMaintenance = reasonKey === "condition_damaged_needs_maintenance";

  // --- CẬP NHẬT DANH SÁCH LỰA CHỌN ---
  const recallOptions = [
    // Tình trạng vật lý
    { key: "condition_good_as_new", type: "condition" },
    { key: "condition_used", type: "condition" },
    // Lý do thu hồi
    { key: "recall_reason_resigned", type: "reason" },
    { key: "recall_reason_replacement", type: "reason" },
    { key: "recall_reason_upgrade", type: "reason" },
  ];

  useEffect(() => {
    if (show && item) {
      setReasonKey("condition_good_as_new");
      setMaintenanceNote("");
    }
  }, [show, item]);

  if (!show || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...item,
      recallReason: reasonKey, // Đổi tên thuộc tính để rõ nghĩa hơn
      maintenanceNote: maintenanceNote,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">
          {t("recall_device")}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {t("recalling_from")}:{" "}
          <span className="font-semibold">{item.name}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("condition_on_recall")} {/* Tên label vẫn giữ nguyên */}
            </label>
            <select
              value={reasonKey}
              onChange={(e) => setReasonKey(e.target.value)}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            >
              {recallOptions.map(opt => (
                <option key={opt.key} value={opt.key}>
                  {t(opt.key)}
                </option>
              ))}
            </select>
          </div>
          
          {isMaintenance && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("failure_note")}
              </label>
              <textarea
                value={maintenanceNote}
                onChange={(e) => setMaintenanceNote(e.target.value)}
                placeholder={t("failure_note_placeholder")}
                className="mt-1 block w-full h-24 p-2 border rounded-md"
                rows="3"
              ></textarea>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              {t("confirm_recall")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecallModal;