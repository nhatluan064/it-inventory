// src/components/App/AppModals.js
import React from "react";

// Modals
import AddEditModal from "../../modals/AddEditModal";
import ConfirmDeleteModal from "../../modals/ConfirmDeleteModal";
import EquipmentDetailModal from "../../modals/EquipmentDetailModal";
import EquipmentTypeModal from "../../modals/EquipmentTypeModal";
import AllocationModal from "../../modals/AllocationModal";
import EditAllocationModal from "../../modals/EditAllocationModal";
import CancelNoteModal from "../../modals/CancelNoteModal";
import BulkEditModal from "../../modals/BulkEditModal";
import RecallModal from "../../modals/RecallModal";
import InfoModal from "../../modals/InfoModal";
import AddFromMasterModal from "../../modals/AddFromMasterModal";
import NoteModal from "../../modals/NoteModal";
import RepairNoteModal from "../../modals/RepairNoteModal";
import UserInfoModal from "../../modals/UserInfoModal";
import FeedbackModal from "../../modals/FeedbackModal";

const AppModals = ({
  modals,
  categories,
  departmentsList,
  positionsList,
  statusLabels,
  statusColors,
  masterItems,
  pendingPurchaseItems,
  inventory,
  currentUser,
  passwordReset,
  t,
}) => {
  // Helper function để lấy confirmation details
  const getConfirmationDetails = () => {
    const name = modals.currentItem?.name || "";
    const strongName = `<strong class="text-red-600">${name}</strong>`;
    switch (modals.deleteType) {
      case "master":
        return {
          title: t("confirm_delete_master_title"),
          text: t("confirm_delete_master_text", { itemName: strongName }),
        };
      case "inventory":
        return {
          title: t("confirm_delete_inventory_title"),
          text: t("confirm_delete_inventory_text", { itemName: strongName }),
        };
      case "liquidate":
        return {
          title: t("confirm_liquidate_title"),
          text: t("confirm_liquidate_text", { itemName: strongName }),
        };
      case "reset":
        return {
          title: t("reset_data"),
          text: t("are_you_sure_reset_data", {
            itemName: `<strong class="text-red-600">${t("all_data")}</strong>`,
          }),
        };
      case "delete_logs":
        return {
          title: t("delete_activity_log"),
          text: t("delete_log_warning"),
        };
      case "move-to-liquidation":
        return {
          title: t("confirm_move_to_liquidation_title"),
          text: t("confirm_move_to_liquidation_text", { itemName: strongName }),
        };
      default:
        return { title: t("confirm"), text: t("are_you_sure_generic") };
    }
  };

  const handleConfirmDelete = () => {
    const { deleteType, currentItem, closeModal } = modals;
    if (deleteType === "master") inventory.deleteMasterItem(currentItem);
    else if (deleteType === "inventory") inventory.deleteItem(currentItem);
    else if (deleteType === "liquidate") inventory.liquidateItem(currentItem);
    else if (deleteType === "move-to-liquidation")
      inventory.markUnrepairable(currentItem);
    else if (deleteType === "reset") inventory.resetData();
    else if (deleteType === "delete_logs") inventory.deleteLogs();
    closeModal("delete");
  };

  return (
    <>
      {/* Bulk Edit Modal */}
      <BulkEditModal
        show={modals.modalState.bulkEdit}
        onClose={() => modals.closeModal("bulkEdit")}
        onSubmit={inventory.batchUpdateItems}
        group={modals.currentItem}
        categories={categories}
        t={t}
      />

      {/* Equipment Type Modal */}
      <EquipmentTypeModal
        show={modals.modalState.type}
        onClose={() => modals.closeModal("type")}
        onSubmit={
          modals.currentItem?.id
            ? inventory.updateMasterItem
            : inventory.addEquipmentType
        }
        categories={categories}
        fullEquipmentList={inventory.equipment}
        t={t}
        initialData={modals.currentItem}
      />

      {/* Add/Edit Modal */}
      <AddEditModal
        show={modals.modalState.addEdit}
        onClose={() => modals.closeModal("addEdit")}
        onSubmit={
          modals.currentItem ? inventory.updateItem : inventory.addLegacyItem
        }
        initialData={modals.currentItem}
        categories={categories}
        t={t}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        show={modals.modalState.delete}
        onClose={() => modals.closeModal("delete")}
        onConfirm={handleConfirmDelete}
        title={getConfirmationDetails().title}
        confirmationText={getConfirmationDetails().text}
        t={t}
      />

      {/* Equipment Detail Modal */}
      <EquipmentDetailModal
        show={modals.modalState.view}
        onClose={() => modals.closeModal("view")}
        item={modals.currentItem}
        categories={categories}
        departmentsList={departmentsList}
        positionsList={positionsList}
        statusLabels={statusLabels}
        statusColors={statusColors}
        t={t}
      />

      {/* Allocation Modal */}
      <AllocationModal
        show={modals.modalState.allocation}
        onClose={() => modals.closeModal("allocation")}
        onSubmit={inventory.allocateItem}
        item={modals.currentItem}
        departmentsList={departmentsList}
        positionsList={positionsList}
        t={t}
      />

      {/* Edit Allocation Modal (mobile edit) */}
      <EditAllocationModal
        show={modals.modalState.editAllocation}
        onClose={() => modals.closeModal("editAllocation")}
        onSubmit={inventory.updateAllocationDetails}
        item={modals.currentItem}
        departmentsList={departmentsList}
        positionsList={positionsList}
        t={t}
      />

      {/* Cancel Note Modal */}
      <CancelNoteModal
        show={modals.modalState.cancelNote}
        onClose={() => modals.closeModal("cancelNote")}
        onSubmit={(note) => inventory.cancelWithNote(modals.currentItem, note)}
        itemName={modals.currentItem?.name}
        t={t}
      />

      {/* Recall Modal */}
      <RecallModal
        show={modals.modalState.recall}
        onClose={() => modals.closeModal("recall")}
        onSubmit={inventory.recallItem}
        item={modals.currentItem}
        t={t}
      />

      {/* Info Modal */}
      <InfoModal
        show={modals.modalState.info}
        onClose={() => modals.closeModal("info")}
        message={modals.infoMessage}
        t={t}
      />

      {/* Add From Master Modal */}
      <AddFromMasterModal
        show={modals.modalState.addFromMaster}
        onClose={() => modals.closeModal("addFromMaster")}
        masterItems={masterItems}
        pendingItems={pendingPurchaseItems}
        onAddItem={inventory.requestFromMaster}
        categories={categories}
        t={t}
      />

      {/* Reset Confirm Modal */}
      <ConfirmDeleteModal
        show={modals.modalState.resetConfirm}
        onClose={() => modals.closeModal("resetConfirm")}
        onConfirm={inventory.resetData}
        title={t("reset_data")}
        confirmationText={t("are_you_sure_reset_data", {
          itemName: `<strong class="text-red-600">${t("all_data")}</strong>`,
        })}
        t={t}
      />

      {/* Note Modal */}
      <NoteModal
        show={modals.modalState.note}
        onClose={() => modals.closeModal("note")}
        onSubmit={(newNote) =>
          inventory.updateMaintenanceNote(modals.currentItem, newNote, false)
        }
        initialNote={modals.currentItem?.condition?.params?.note?.value || ""}
        title={t("edit_failure_note")}
        t={t}
      />

      {/* Repair Note Modal */}
      <RepairNoteModal
        show={modals.modalState.repairNote}
        onClose={() => modals.closeModal("repairNote")}
        onSubmit={inventory.completeRepair}
        item={modals.currentItem}
        t={t}
      />

      {/* Direct Maintenance Note Modal */}
      <NoteModal
        show={modals.modalState.directMaintenanceNote}
        onClose={() => modals.closeModal("directMaintenanceNote")}
        onSubmit={(note) => {
          inventory.markAsDamaged(modals.currentItem, note, false);
          modals.closeModal("directMaintenanceNote");
        }}
        initialNote=""
        title={t("failure_note")}
        t={t}
      />

      {/* User Info Modal */}
      <UserInfoModal
        show={modals.modalState.userInfo}
        onClose={() => modals.closeModal("userInfo")}
        currentUser={modals.currentItem}
        onPasswordReset={passwordReset}
        t={t}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={modals.modalState.feedback}
        onClose={() => modals.closeModal("feedback")}
        user={currentUser}
        t={t}
      />
    </>
  );
};

export default AppModals;
