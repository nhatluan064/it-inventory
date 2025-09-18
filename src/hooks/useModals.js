// src/hooks/useModals.js
import { useState, useCallback } from "react";

export const useModals = () => {
  const [modalState, setModalState] = useState({
    addEdit: false,
    delete: false,
    view: false,
    allocation: false,
    cancelNote: false,
    editName: false,
    recall: false,
    info: false,
    addFromMaster: false,
    note: false,
    repairNote: false,
    resetConfirm: false,
    directMaintenanceNote: false,
    userInfo: false, // Add this for the new modal
    bulkEdit: false,
  });

  const [currentItem, setCurrentItem] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [infoMessage, setInfoMessage] = useState("");

  const openModal = useCallback((modalName, item = null, options = {}) => {
    setModalState((prev) => ({ ...prev, [modalName]: true }));
    if (item) setCurrentItem(item);
    if (options.deleteType) setDeleteType(options.deleteType);
    if (options.infoMessage) setInfoMessage(options.infoMessage);
  }, []);

  const closeModal = useCallback((modalName) => {
    setModalState((prev) => ({ ...prev, [modalName]: false }));
    setCurrentItem(null);
    setDeleteType(null);
    setInfoMessage("");
  }, []);

  return {
    modalState,
    currentItem,
    deleteType,
    infoMessage,
    openModal,
    closeModal,
  };
};
