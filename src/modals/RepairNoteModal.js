// src/modals/RepairNoteModal.js
import React, { useState, useEffect } from "react";

const RepairNoteModal = ({ show, onClose, onSubmit, item, t }) => {
  const noteOptions = [
    "repair_note_successful",
    "repair_note_replace_pcu",
    "repair_note_reinstall_os",
    "repair_note_replace_screen",
    "repair_note_other",
  ];

  const [noteKey, setNoteKey] = useState(noteOptions[0]);
  const [customNote, setCustomNote] = useState("");

  useEffect(() => {
    if (show) {
      setNoteKey(noteOptions[0]);
      setCustomNote("");
    }
  }, [show]);

  if (!show || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Luôn lấy text cuối cùng để gửi đi
    const noteValue = noteKey === "repair_note_other" ? customNote : noteKey;
    const isNoteKey = noteKey !== "repair_note_other";
    onSubmit(item, noteValue, isNoteKey); // Cập nhật tham số cho hàm onSubmit
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[70] flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          {t("repair_completed_with_note")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t("select_repair_note")}
            </label>
            <select
              value={noteKey}
              onChange={(e) => setNoteKey(e.target.value)}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
            >
              {noteOptions.map((key) => (
                <option key={key} value={key}>
                  {t(key)}
                </option>
              ))}
            </select>
          </div>
          {noteKey === "repair_note_other" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("note")}
              </label>
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="mt-1 block w-full h-24 p-2 border rounded-md"
                required
              />
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {t("confirm")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RepairNoteModal;
