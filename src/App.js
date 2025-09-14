// src/App.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { Menu, Package } from "lucide-react";

// Custom Hooks
import { useAuth } from "./hooks/useAuth";
import { useInventory } from "./hooks/useInventory";
import { useModals } from "./hooks/useModals";

// Context
import AppContext from "./context/AppContext";

// Translations & Constants
import { translations } from "./components/Translations";
import { categoryStructure, statusColors } from "./constants";

// Layouts and Pages
import LoginPage from "./Pages/LoginPage";
import AccountPage from "./Pages/AccountPage";
import Sidebar from "./layouts/Sidebar";
import AuthSuccessPopup from "./Popup/AuthSuccessPopup";
import SetupProfilePage from "./Pages/SetupProfilePage";
import HomeView from "./views/HomeView";

// Views
import DashboardView from "./views/DashboardView";
import InventoryView from "./views/InventoryView";
import ReportsView from "./views/ReportsView";
import SettingsView from "./views/SettingsView";
import PurchasingView from "./views/PurchasingView";
import PurchasedView from "./views/PurchasedView";
import AllocatedView from "./views/AllocatedView";
import PendingPurchaseView from "./views/PendingPurchaseView";
import MasterListView from "./views/MasterListView";
import MaintenanceView from "./views/MaintenanceView";
import LiquidationView from "./views/LiquidationView";

// Modals
import AddEditModal from "./modals/AddEditModal";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";
import EquipmentDetailModal from "./modals/EquipmentDetailModal";
import EquipmentTypeModal from "./modals/EquipmentTypeModal";
import AllocationModal from "./modals/AllocationModal";
import CancelNoteModal from "./modals/CancelNoteModal";
// import EditNameModal from "./modals/EditNameModal";
import RecallModal from "./modals/RecallModal";
import InfoModal from "./modals/InfoModal";
import AddFromMasterModal from "./modals/AddFromMasterModal";
import NoteModal from "./modals/NoteModal";
import RepairNoteModal from "./modals/RepairNoteModal";
import UserInfoModal from "./modals/UserInfoModal";

const App = () => {
  // --- UI and Translation States ---
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "system"
  );
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "vi"
  );
  const [activeTab, setActiveTab] = useState("home");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // --- Filter States ---
  const [inventoryFilters, setInventoryFilters] = useState({
    search: "",
    category: "all",
    importDate: "",
    status: "all",
    condition: "all",
    location: "all",
  });

  const [allocatedFilters, setAllocatedFilters] = useState({
    search: "",
    category: "all",
    department: "all",
    handoverDate: "",
  });

  // --- Responsive States ---
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const t = useCallback(
    (key, params = {}) => {
      let translation = translations[language]?.[key] || key;
      Object.keys(params).forEach((pKey) => {
        translation = translation.replace(`{${pKey}}`, params[pKey]);
      });
      return translation;
    },
    [language]
  );

  // --- Custom Hooks for Logic Management ---
  const {
    currentUser,
    authLoading,
    authSuccessType,
    login,
    googleSignIn,
    signUp,
    logout,
    passwordReset,
    finishAuthSuccess,
    setupProfile,
  } = useAuth();
  const inventory = useInventory(currentUser, t);
  const modals = useModals();

  // --- Derived Data using useMemo for Performance ---
  const categories = useMemo(
    () => categoryStructure.map((cat) => ({ ...cat, name: t(cat.tKey) })),
    [t]
  );
  const statusLabels = useMemo(
    () => ({
      available: t("available"),
      "in-use": t("in_use"),
      maintenance: t("maintenance"),
      liquidation: t("pending_liquidation"),
      broken: t("broken"),
      "out-of-stock": t("out_of_stock"),
      "pending-purchase": t("pending_purchase"),
      purchasing: t("purchasing"),
      purchased: t("purchased"),
    }),
    [t]
  );
  const pendingPurchaseItems = useMemo(
    () =>
      inventory.equipment.filter((item) => item.status === "pending-purchase"),
    [inventory.equipment]
  );
  const purchasingItems = useMemo(
    () => inventory.equipment.filter((item) => item.status === "purchasing"),
    [inventory.equipment]
  );
  const purchasedItems = useMemo(
    () => inventory.equipment.filter((item) => item.status === "purchased"),
    [inventory.equipment]
  );
  const maintenanceItems = useMemo(
    () => inventory.equipment.filter((item) => item.status === "maintenance"),
    [inventory.equipment]
  );
  const liquidationItems = useMemo(
    () => inventory.equipment.filter((item) => item.status === "liquidation"),
    [inventory.equipment]
  );

  const inventoryItems = useMemo(
    () =>
      inventory.equipment.filter(
        (item) =>
          !["pending-purchase", "purchasing", "purchased", "master"].includes(
            item.status
          )
      ),
    [inventory.equipment]
  );

  const filteredInventory = useMemo(() => {
    return inventoryItems.filter((item) => {
      const { search, category, importDate, status, condition } =
        inventoryFilters;
      const query = search.toLowerCase();

      const searchMatch =
        !query ||
        item.name?.toLowerCase().includes(query) ||
        item.serialNumber?.toLowerCase().includes(query);

      const categoryMatch = category === "all" || item.category === category;
      const dateMatch =
        !importDate ||
        new Date(item.importDate).toLocaleDateString("en-CA") === importDate;
      const statusMatch = status === "all" || item.status === status;

      const getConditionKey = (cond) => {
        if (typeof cond === "object" && cond !== null) return cond.key;
        return cond;
      };
      const conditionMatch =
        condition === "all" || getConditionKey(item.condition) === condition;

      return (
        searchMatch &&
        categoryMatch &&
        dateMatch &&
        statusMatch &&
        conditionMatch
      );
    });
  }, [inventoryItems, inventoryFilters]);

  const allocatedItems = useMemo(() => {
    return inventory.equipment.filter((item) => {
      if (item.status !== "in-use") return false;

      const { search, category, department, handoverDate } = allocatedFilters;
      const query = search.toLowerCase();
      const details = item.allocationDetails || {};

      const searchMatch =
        !query ||
        item.name?.toLowerCase().includes(query) ||
        item.serialNumber?.toLowerCase().includes(query) ||
        details.recipientName?.toLowerCase().includes(query) ||
        details.employeeId?.toLowerCase().includes(query);

      const categoryMatch = category === "all" || item.category === category;
      const departmentMatch =
        department === "all" || details.department === department;
      const dateMatch =
        !handoverDate ||
        new Date(details.handoverDate).toLocaleDateString("en-CA") ===
          handoverDate;

      return searchMatch && categoryMatch && departmentMatch && dateMatch;
    });
  }, [inventory.equipment, allocatedFilters]);

  const masterItems = useMemo(() => {
    return inventory.equipment.filter((item) => item.status === "master");
  }, [inventory.equipment]);

  const uniqueMasterItemsCount = useMemo(() => {
    return masterItems.length;
  }, [masterItems]);

  // --- UI Effects ---
  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- UI Handlers ---
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

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
      case "move-to-liquidation":
        return {
          title: t("confirm_move_to_liquidation_title"),
          text: t("confirm_move_to_liquidation_text", { itemName: strongName }),
        };
      default:
        return { title: t("confirm"), text: t("are_you_sure_generic") };
    }
  };

  const appContextValue = useMemo(
    () => ({ theme, setTheme, language, setLanguage, t }),
    [theme, language, t]
  );

  // --- RENDER LOGIC ---
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        ...
      </div>
    );
  }
  if (!currentUser) {
    return (
      <AppContext.Provider value={appContextValue}>
        <Toaster position="top-center" reverseOrder={false} />
        <LoginPage
          onLogin={login}
          onGoogleSignIn={googleSignIn}
          onPasswordReset={passwordReset}
          onSignUp={signUp}
          t={t}
        />
      </AppContext.Provider>
    );
  }
  if (authSuccessType) {
    return (
      <AppContext.Provider value={appContextValue}>
        <AuthSuccessPopup
          type={authSuccessType}
          t={t}
          onFinished={finishAuthSuccess}
        />
      </AppContext.Provider>
    );
  }
  if (currentUser && !currentUser.displayName) {
    return (
      <AppContext.Provider value={appContextValue}>
        <Toaster position="top-center" reverseOrder={false} />
        <SetupProfilePage
          currentUser={currentUser}
          onProfileSetupComplete={setupProfile}
          t={t}
        />
      </AppContext.Provider>
    );
  }

  if (inventory.dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        Đang tải dữ liệu...
      </div>
    );
  }

  const handleConfirmDelete = () => {
    const { deleteType, currentItem, closeModal } = modals;
    if (deleteType === "master") inventory.deleteMasterItem(currentItem);
    else if (deleteType === "inventory") inventory.deleteItem(currentItem);
    else if (deleteType === "liquidate") inventory.liquidateItem(currentItem);
    else if (deleteType === "move-to-liquidation")
      inventory.markUnrepairable(currentItem);
    else if (deleteType === "reset") inventory.resetData();
    closeModal("delete");
  };

  const renderCurrentView = () => {
    const currentTab = activeTab || "inventory";
    const viewProps = { t, categories, statusColors, statusLabels };

    switch (currentTab) {
      case "home":
        return <HomeView {...viewProps} />;
      case "masterList":
        return (
          <MasterListView
            {...viewProps}
            allItems={masterItems}
            fullEquipmentList={inventory.equipment}
            // Mở modal EquipmentType ở chế độ Thêm mới
            onAddType={() => modals.openModal("type")}
            // Mở modal EquipmentType ở chế độ Sửa
            onEditItem={(item) => modals.openModal("type", item)}
            onDeleteItem={(item) =>
              modals.openModal("delete", item, { deleteType: "master" })
            }
          />
        );
      case "pendingPurchase":
        return (
          <PendingPurchaseView
            {...viewProps}
            items={pendingPurchaseItems}
            onStartPurchase={inventory.startPurchasing}
            // Dòng onEditItem đã được xóa
            onDeleteItem={inventory.cancelOrRevertPurchase}
            onOpenAddFromMasterModal={() => modals.openModal("addFromMaster")}
          />
        );
      case "purchasing":
        return (
          <PurchasingView
            {...viewProps}
            items={purchasingItems}
            onUpdateStatus={inventory.confirmPurchased}
            onCancel={(type, item) =>
              type === "cancel-purchasing"
                ? modals.openModal("cancelNote", item)
                : inventory.cancelOrRevertPurchase(type, item)
            }
          />
        );
      case "purchased":
        return (
          <PurchasedView
            {...viewProps}
            items={purchasedItems}
            onImportItem={inventory.importPurchasedItems}
            fullInventory={inventory.equipment}
          />
        );
      case "inventory":
        return (
          <InventoryView
            {...viewProps}
            equipment={filteredInventory}
            unfilteredEquipment={inventoryItems}
            filters={inventoryFilters}
            setFilters={setInventoryFilters}
            onEditItem={(item) => modals.openModal("addEdit", item)}
            onDeleteItem={(item) =>
              modals.openModal("delete", item, { deleteType: "inventory" })
            }
            onViewItem={(item) => modals.openModal("view", item)}
            onAllocateItem={(item) => modals.openModal("allocation", item)}
            onAddLegacyItem={() => modals.openModal("addEdit")}
          />
        );
      case "allocated":
        return (
          <AllocatedView
            {...viewProps}
            items={allocatedItems}
            unfilteredAllocatedItems={inventory.equipment.filter(
              (i) => i.status === "in-use"
            )}
            onRecallItem={(item) => modals.openModal("recall", item)}
            onMarkDamaged={(item) =>
              modals.openModal("directMaintenanceNote", item)
            }
            filters={allocatedFilters}
            setFilters={setAllocatedFilters}
          />
        );
      case "maintenance":
        return (
          <MaintenanceView
            {...viewProps}
            items={maintenanceItems}
            // Thêm 2 dòng dưới đây
            statusLabels={statusLabels}
            statusColors={statusColors}
            onRepairComplete={(item) => modals.openModal("repairNote", item)}
            onMarkUnrepairable={(item) =>
              modals.openModal("delete", item, {
                deleteType: "move-to-liquidation",
              })
            }
            onEditNote={(item) => modals.openModal("note", item)}
          />
        );
      case "liquidation":
        return (
          <LiquidationView
            {...viewProps}
            items={liquidationItems}
            onLiquidateItem={(item) =>
              modals.openModal("delete", item, { deleteType: "liquidate" })
            }
          />
        );
      case "reports":
        return (
          <ReportsView {...viewProps} transactions={inventory.transactions} />
        );
      case "settings":
        return (
          <SettingsView
            {...viewProps}
            onBackupData={inventory.backupData}
            onResetData={() =>
              modals.openModal("delete", null, { deleteType: "reset" })
            }
            onImportData={(e) => inventory.importData(e.target.files[0])}
          />
        );
      case "account":
        return (
          <AccountPage
            {...viewProps}
            currentUser={currentUser}
            onPasswordReset={passwordReset}
          />
        );
      default:
        return <HomeView {...viewProps} />;
    }
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabClick}
          currentUser={currentUser}
          onLogout={logout}
          t={t}
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobile={isMobile}
          isMobileOpen={isMobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
          onSettingsClick={() => handleTabClick("settings")}
          onViewProfile={() => modals.openModal("userInfo", currentUser)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Toaster
            position="top-right"
            reverseOrder={false}
            containerStyle={{ top: 20, right: 20 }}
          />

          <header className="lg:hidden sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {t("it_inventory")}
              </h1>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 text-gray-600 dark:text-gray-300"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </header>

          <header className="hidden lg:block p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-grow min-w-0">
              <DashboardView
                t={t}
                equipment={inventory.equipment}
                pendingPurchaseCount={pendingPurchaseItems.length}
                purchasingCount={purchasingItems.length}
                purchasedCount={purchasedItems.length}
                masterListCount={uniqueMasterItemsCount}
                reportsCount={inventory.transactions.length}
                setActiveTab={handleTabClick}
              />
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="lg:hidden mb-6 -mx-4 -mt-4 sm:-mx-6 sm:-mt-6">
              <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <DashboardView
                  t={t}
                  equipment={inventory.equipment}
                  pendingPurchaseCount={pendingPurchaseItems.length}
                  purchasingCount={purchasingItems.length}
                  purchasedCount={purchasedItems.length}
                  masterListCount={uniqueMasterItemsCount}
                  reportsCount={inventory.transactions.length}
                  setActiveTab={handleTabClick}
                />
              </div>
            </div>

            {renderCurrentView()}
          </main>
        </div>

        {/* Modals */}
        <EquipmentTypeModal
          show={modals.modalState.type}
          onClose={() => modals.closeModal("type")}
          // Thêm logic để gọi đúng hàm onSubmit
          onSubmit={
            modals.currentItem?.id
              ? inventory.updateMasterItem
              : inventory.addEquipmentType
          }
          categories={categories}
          t={t}
          // Truyền initialData cho chế độ Sửa
          initialData={modals.currentItem}
        />
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
        {/* <EditNameModal
          show={modals.modalState.editName}
          onClose={() => modals.closeModal("editName")}
          onSubmit={inventory.updateMasterName}
          initialData={modals.currentItem}
          t={t}
        /> */}
        <ConfirmDeleteModal
          show={modals.modalState.delete}
          onClose={() => modals.closeModal("delete")}
          onConfirm={handleConfirmDelete}
          title={getConfirmationDetails().title}
          confirmationText={getConfirmationDetails().text}
          t={t}
        />
        <EquipmentDetailModal
          show={modals.modalState.view}
          onClose={() => modals.closeModal("view")}
          item={modals.currentItem}
          categories={categories}
          statusLabels={statusLabels}
          t={t}
        />
        <AllocationModal
          show={modals.modalState.allocation}
          onClose={() => modals.closeModal("allocation")}
          onSubmit={inventory.allocateItem}
          item={modals.currentItem}
          t={t}
        />
        <CancelNoteModal
          show={modals.modalState.cancelNote}
          onClose={() => modals.closeModal("cancelNote")}
          onSubmit={(note) =>
            inventory.cancelWithNote(modals.currentItem, note)
          }
          itemName={modals.currentItem?.name}
          t={t}
        />
        <RecallModal
          show={modals.modalState.recall}
          onClose={() => modals.closeModal("recall")}
          onSubmit={inventory.recallItem}
          item={modals.currentItem}
          t={t}
        />
        <InfoModal
          show={modals.modalState.info}
          onClose={() => modals.closeModal("info")}
          message={modals.infoMessage}
          t={t}
        />
        <AddFromMasterModal
          show={modals.modalState.addFromMaster}
          onClose={() => modals.closeModal("addFromMaster")}
          masterItems={masterItems}
          pendingItems={pendingPurchaseItems}
          onAddItem={inventory.requestFromMaster}
          t={t}
        />
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
        <NoteModal
          show={modals.modalState.note}
          onClose={() => modals.closeModal("note")}
          onSubmit={(newNote) =>
            inventory.updateMaintenanceNote(modals.currentItem, newNote)
          }
          initialNote={modals.currentItem?.condition}
          title={t("edit_failure_note")}
          t={t}
        />
        <RepairNoteModal
          show={modals.modalState.repairNote}
          onClose={() => modals.closeModal("repairNote")}
          onSubmit={inventory.completeRepair}
          item={modals.currentItem}
          t={t}
        />
        <NoteModal
          show={modals.modalState.directMaintenanceNote}
          onClose={() => modals.closeModal("directMaintenanceNote")}
          onSubmit={(note) => {
            inventory.markAsDamaged(modals.currentItem, note);
            modals.closeModal("directMaintenanceNote");
          }}
          initialNote=""
          title={t("failure_note")}
          t={t}
        />
        <UserInfoModal
          show={modals.modalState.userInfo}
          onClose={() => modals.closeModal("userInfo")}
          currentUser={modals.currentItem}
          onPasswordReset={passwordReset}
          t={t}
        />
      </div>
    </AppContext.Provider>
  );
};

export default App;
