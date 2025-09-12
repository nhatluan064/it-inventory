// src/modals/CancelNoteModal.js
import React, { useState } from "react";

const CancelNoteModal = ({ show, onClose, onSubmit, itemName, t }) => {
  const [note, setNote] = useState("");

  if (!show) return null;

  const handleSubmit = () => {
    if (!note.trim()) {
      alert(t("please_enter_cancellation_reason"));
      return;
    }
    onSubmit(note);
    setNote("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">
          {t("reason_for_cancellation")}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {t("cancelling_purchase_for")}:{" "}
          <span className="font-semibold">{itemName}</span>
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t("cancellation_reason_placeholder")}
          className="w-full h-24 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
          rows="4"
        ></textarea>
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            {t("close")}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            {t("confirm_cancellation")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelNoteModal;
