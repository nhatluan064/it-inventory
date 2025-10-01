// src/App.js - Refactored version
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Toaster } from "react-hot-toast";
import { Package } from "lucide-react";

// Custom Hooks
import { useAuth } from "./hooks/useAuth";
import { useInventory } from "./hooks/useInventory";
import { useModals } from "./hooks/useModals";
import { useViewRendering } from "./hooks/useViewRendering";
import { useDynamicData } from "./hooks/useDynamicData";

// Context
import AppContext from "./context/AppContext";

// Translations & Constants
import { translations } from "./components/Translations";
import { categoryStructure, statusColors } from "./constants";

// Layouts and Components
import LoginPage from "./Pages/LoginPage";
import AuthSuccessPopup from "./Popup/AuthSuccessPopup";
import SetupProfilePage from "./Pages/SetupProfilePage";
import AppLayout from "./components/App/AppLayout";
import AppModals from "./components/App/AppModals";
import GlobalErrorBoundary from "./components/ErrorBoundary/GlobalErrorBoundary";
import GlobalLoader from "./components/LoadingStates/GlobalLoader";
import PostLoginLoader from "./components/LoadingStates/PostLoginLoader";

// Utilities
import {
  filterInventoryItems,
  filterAllocatedItems,
  getItemsByStatus,
  DEFAULT_INVENTORY_FILTERS,
  DEFAULT_ALLOCATED_FILTERS,
} from "./utils/filterUtils";

const App = () => {
  // Theme and UI state
  const [dashboardScrollPosition, setDashboardScrollPosition] = useState(0);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "system"
  );
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "vi"
  );
  const [activeTab, setActiveTab] = useState("home");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filter states
  const [inventoryFilters, setInventoryFilters] = useState(
    DEFAULT_INVENTORY_FILTERS
  );
  const [allocatedFilters, setAllocatedFilters] = useState(
    DEFAULT_ALLOCATED_FILTERS
  );

  // Translation function
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

  // Custom hooks
  const {
    currentUser,
    authLoading,
    authSuccessType,
    isRegisteringFlow,
    isPostLoginLoading,
    login,
    googleSignIn,
    signUp,
    logout,
    passwordReset,
    finishAuthSuccess,
    finishPostLoginLoading,
    setupProfile,
  } = useAuth();

  const inventory = useInventory(currentUser, t, setActiveTab);
  const modals = useModals();
  const dynamicData = useDynamicData(currentUser, inventory.equipment);

  // Computed values - StatusLabels first to avoid dependency issue
  const statusLabels = useMemo(
    () => {
      const trans = translations[language] || {};
      return {
        available: trans.available || "available",
        "in-use": trans.in_use || "in-use",
        maintenance: trans.maintenance || "maintenance",
        liquidation: trans.pending_liquidation || "pending_liquidation",
        broken: trans.broken || "broken",
        "out-of-stock": trans.out_of_stock || "out_of_stock",
        "pending-purchase": trans.pending_purchase || "pending_purchase",
        purchasing: trans.purchasing || "purchasing",
        purchased: trans.purchased || "purchased",
      };
    },
    [language] // Stable dependency
  );

  // Use dynamic categories instead of hardcoded ones
  const categories = useMemo(() => {
    if (dynamicData.loading) {
      // Fallback to default categories while loading
      return categoryStructure.map((cat) => ({ ...cat, name: t(cat.tKey) }));
    }
    return dynamicData.categories;
  }, [dynamicData.categories, dynamicData.loading, t]);

  // Filtered data
  const pendingPurchaseItems = useMemo(
    () => getItemsByStatus(inventory.equipment, "pending-purchase"),
    [inventory.equipment]
  );

  const purchasingItems = useMemo(
    () => getItemsByStatus(inventory.equipment, "purchasing"),
    [inventory.equipment]
  );

  const purchasedItems = useMemo(
    () => getItemsByStatus(inventory.equipment, "purchased"),
    [inventory.equipment]
  );

  const maintenanceItems = useMemo(
    () => getItemsByStatus(inventory.equipment, "maintenance"),
    [inventory.equipment]
  );

  const liquidationItems = useMemo(
    () => getItemsByStatus(inventory.equipment, "liquidation"),
    [inventory.equipment]
  );

  const inventoryItems = inventory.inventoryItems;

  const filteredInventory = useMemo(
    () => filterInventoryItems(inventoryItems, inventoryFilters),
    [inventoryItems, inventoryFilters]
  );

  const allocatedItems = useMemo(
    () => filterAllocatedItems(inventory.equipment, allocatedFilters),
    [inventory.equipment, allocatedFilters]
  );

  const masterItems = useMemo(
    () => getItemsByStatus(inventory.equipment, "master"),
    [inventory.equipment]
  );

  const uniqueMasterItemsCount = useMemo(
    () => masterItems.length,
    [masterItems]
  );

  // Chart data for dashboard
  const inventoryStatusChartData = useMemo(() => {
    // Đếm tất cả các trạng thái theo yêu cầu
    const allEquipment = inventory.equipment;
    const pendingPurchase = allEquipment.filter(
      (e) => e.status === "pending-purchase"
    ).length;
    const purchasing = allEquipment.filter(
      (e) => e.status === "purchasing"
    ).length;
    const purchased = allEquipment.filter(
      (e) => e.status === "purchased"
    ).length;
    const totalInventory = allEquipment.filter((e) =>
      ["available", "in-use", "maintenance", "liquidation"].includes(e.status)
    ).length;
    const inUse = allEquipment.filter((e) => e.status === "in-use").length;
    const maintenance = allEquipment.filter(
      (e) => e.status === "maintenance"
    ).length;
    const liquidation = allEquipment.filter(
      (e) => e.status === "liquidation"
    ).length;

    // Tạo dữ liệu cho biểu đồ với 7 trạng thái
    const statusKeys = [
      "pending-purchase",
      "purchasing",
      "purchased",
      "total-inventory",
      "in-use",
      "maintenance",
      "liquidation",
    ];
    const labels = [
      t("pending_purchase_requests") || "Yêu cầu mua",
      t("in_purchasing_process") || "Đang mua",
      t("purchased_waiting_import") || "Đã mua",
      t("total_inventory") || "Tổng kho",
      t("in_use") || "Đã xuất",
      t("in_maintenance") || "Bảo trì",
      t("pending_liquidation") || "Thanh lý",
    ];
    const data = [
      pendingPurchase,
      purchasing,
      purchased,
      totalInventory,
      inUse,
      maintenance,
      liquidation,
    ];

    return { labels, data, statusKeys };
  }, [inventory.equipment, t]);

  // Context value
  const appContextValue = useMemo(
    () => ({ theme, setTheme, language, setLanguage, t }),
    [theme, language, t]
  );

  // Event handlers
  const handleTabClick = useCallback(
    (tabId) => {
      setActiveTab(tabId);
      if (isMobile) {
        setMobileSidebarOpen(false);
      }
    },
    [isMobile]
  );

  // View rendering hook
  const { renderCurrentView } = useViewRendering({
    activeTab,
    isMobile,
    t,
    categories,
    departmentsList: dynamicData.departmentsList,
    positionsList: dynamicData.positionsList,
    statusColors,
    statusLabels,
    inventory,
    modals,
    pendingPurchaseItems,
    purchasingItems,
    purchasedItems,
    maintenanceItems,
    liquidationItems,
    inventoryItems,
    filteredInventory,
    allocatedItems,
    masterItems,
    uniqueMasterItemsCount,
    inventoryFilters,
    setInventoryFilters,
    allocatedFilters,
    setAllocatedFilters,
    handleTabClick,
    dashboardScrollPosition,
    setDashboardScrollPosition,
    currentUser,
    passwordReset,
    inventoryStatusChartData,
  });

  // Effects
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

  // Enhanced Loading screen component
  const renderLoadingScreen = () => (
    <div className="page-loader-container">
      <div className="page-loader-content">
        {/* Logo and App Name */}
        <div className="page-loader-logo">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 auth-success-pulse">
            <Package className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 auth-success-celebration">
            IT Inventory
          </h1>
          <p className="text-blue-200 text-lg mb-8 auth-profile-setup">
            {t("loading_application")}
          </p>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="page-loader-progress">
          <div className="page-loader-bar bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500"></div>
        </div>

        {/* Loading Dots */}
        <div className="loading-dots-container">
          <span className="animate-dot1"></span>
          <span className="animate-dot2"></span>
          <span className="animate-dot3"></span>
        </div>

        {/* Loading Status */}
        <div className="mt-6 text-center">
          <p className="text-white text-sm opacity-80 auth-loading-text">
            {authLoading ? t("authenticating") : t("initializing")}
          </p>
        </div>
      </div>
    </div>
  );

  // Render logic - Early returns for different states
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

  if (authLoading || isRegisteringFlow) {
    return renderLoadingScreen();
  }

  // Hiển thị Post-Login Loading Screen
  if (isPostLoginLoading) {
    return (
      <AppContext.Provider value={appContextValue}>
        <PostLoginLoader
          onComplete={finishPostLoginLoading}
          t={t}
          user={currentUser}
        />
      </AppContext.Provider>
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
      <GlobalErrorBoundary t={t}>
        <GlobalLoader message={t("loading_inventory")} t={t} />
      </GlobalErrorBoundary>
    );
  }

  // Main app render
  return (
    <GlobalErrorBoundary t={t}>
      <AppContext.Provider value={appContextValue}>
        <AppLayout
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          onLogout={logout}
          onFeedback={() => modals.openModal("feedback")}
          t={t}
          isSidebarCollapsed={isSidebarCollapsed}
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobile={isMobile}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
          onViewProfile={() => modals.openModal("userInfo", currentUser)}
          equipment={inventory.equipment}
          pendingPurchaseCount={pendingPurchaseItems.length}
          purchasingCount={purchasingItems.length}
          purchasedCount={purchasedItems.length}
          masterListCount={uniqueMasterItemsCount}
          reportsCount={inventory.transactions.length}
          dashboardScrollPosition={dashboardScrollPosition}
          setDashboardScrollPosition={setDashboardScrollPosition}
        >
          {renderCurrentView()}
        </AppLayout>

        <AppModals
          modals={modals}
          categories={categories}
          departmentsList={dynamicData.departmentsList}
          positionsList={dynamicData.positionsList}
          statusLabels={statusLabels}
          statusColors={statusColors}
          masterItems={masterItems}
          pendingPurchaseItems={pendingPurchaseItems}
          inventory={inventory}
          currentUser={currentUser}
          passwordReset={passwordReset}
          t={t}
        />
      </AppContext.Provider>
    </GlobalErrorBoundary>
  );
};

export default App;
