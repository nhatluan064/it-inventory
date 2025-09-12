// src/modals/ConfirmDeleteModal.js
import React, { useRef, useEffect } from "react";

const ConfirmDeleteModal = ({
  show,
  onClose,
  onConfirm,
  title,
  confirmationText,
  t,
}) => {
  const cancelButtonRef = useRef(null);
  const deleteButtonRef = useRef(null);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleKeyDown = (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const focusedElement = document.activeElement;
    if (e.key === "ArrowRight" && focusedElement === cancelButtonRef.current) {
      deleteButtonRef.current?.focus();
    }
    if (e.key === "ArrowLeft" && focusedElement === deleteButtonRef.current) {
      cancelButtonRef.current?.focus();
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {title || t("confirm")}
        </h2>
        <p
          className="text-gray-600 dark:text-gray-300 mb-6"
          dangerouslySetInnerHTML={{
            __html: confirmationText || t("are_you_sure_generic"),
          }}
        />
        <div className="flex justify-end space-x-3">
          <button
            ref={cancelButtonRef}
            onClick={onClose}
            className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {t("cancel")}
          </button>
          <button
            ref={deleteButtonRef}
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
