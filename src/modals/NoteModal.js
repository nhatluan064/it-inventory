// src/modals/NoteModal.js
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const NoteModal = ({
  show,
  onClose,
  onSubmit,
  initialNote = "",
  title = "Ghi chú",
  t,
}) => {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (show) {
      setNote(initialNote);
    }
  }, [show, initialNote]);

  if (!show) {
    return null;
  }

  const handleSubmit = () => {
    onSubmit(note);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[70] flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full h-32 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
          rows="5"
          autoFocus
        ></textarea>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {t("save_changes")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
