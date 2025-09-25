// src/modals/ConfirmDeleteModal.js
import React, { useRef, useEffect } from "react";
import { AnimatedButton } from "../components/AnimatedButton";

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
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center animate-fadeIn"
      onKeyDown={handleKeyDown}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md animate-scaleIn animate-pulse-glow"
        style={{ backdropFilter: 'blur(4px)' }}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {title || t("confirm")}
        </h2>
        <p
          className="text-gray-600 dark:text-gray-300 mb-6"
          dangerouslySetInnerHTML={{
            __html: confirmationText || t("are_you_sure_generic"),
          }}
        />
        <div className="flex justify-end space-x-3 animate-slideInUp">
          <AnimatedButton
            ref={cancelButtonRef}
            onClick={onClose}
            variant="secondary"
            className="px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {t("cancel")}
          </AnimatedButton>
          <AnimatedButton
            ref={deleteButtonRef}
            onClick={onConfirm}
            variant="danger"
            className="px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {t("confirm")}
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
