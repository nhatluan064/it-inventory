// src/App.js - Refactored version
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Toaster } from "react-hot-toast";

// Custom Hooks
import { useAuth } from "./hooks/useAuth";
import { useInventory } from "./hooks/useInventory";
import { useModals } from "./hooks/useModals";
import { useViewRendering } from "./hooks/useViewRendering";

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

// Utilities
import {
  filterInventoryItems,
  filterAllocatedItems,
  getItemsByStatus,
  getInventoryItems,
  DEFAULT_INVENTORY_FILTERS,
  DEFAULT_ALLOCATED_FILTERS,
} from "./utils/filterUtils";

const App = () => {
  // Theme and UI state
  const [dashboardScrollPosition, setDashboardScrollPosition] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "system");
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "vi");
  const [activeTab, setActiveTab] = useState("home");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filter states
  const [inventoryFilters, setInventoryFilters] = useState(DEFAULT_INVENTORY_FILTERS);
  const [allocatedFilters, setAllocatedFilters] = useState(DEFAULT_ALLOCATED_FILTERS);

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
    login,
    googleSignIn,
    signUp,
    logout,
    passwordReset,
    finishAuthSuccess,
    setupProfile,
  } = useAuth();
  
  const inventory = useInventory(currentUser, t, setActiveTab);
  const modals = useModals();

  // Computed values - StatusLabels first to avoid dependency issue
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

  const categories = useMemo(
    () => categoryStructure.map((cat) => ({ ...cat, name: t(cat.tKey) })),
    [t]
  );

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

  const inventoryItems = useMemo(
    () => getInventoryItems(inventory.equipment),
    [inventory.equipment]
  );

  const filteredInventory = useMemo(
    () => filterInventoryItems(inventoryItems, inventoryFilters, t),
    [inventoryItems, inventoryFilters, t]
  );

  const allocatedItems = useMemo(
    () => filterAllocatedItems(inventory.equipment, allocatedFilters, t),
    [inventory.equipment, allocatedFilters, t]
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
    // Chỉ tính các thiết bị trong kho chính, không tính quy trình mua hàng
    const mainInventory = inventoryItems;

    const counts = mainInventory.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    const statusKeys = Object.keys(counts);
    const labels = statusKeys.map((key) => statusLabels[key] || key);
    const data = statusKeys.map((key) => counts[key]);

    return { labels, data, statusKeys };
  }, [inventoryItems, statusLabels]);

  // Context value
  const appContextValue = useMemo(
    () => ({ theme, setTheme, language, setLanguage, t }),
    [theme, language, t]
  );

  // Event handlers
  const handleTabClick = useCallback((tabId) => {
    setActiveTab(tabId);
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  }, [isMobile]);

  // View rendering hook
  const { renderCurrentView } = useViewRendering({
    activeTab,
    isMobile,
    t,
    categories,
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

  // Loading screen component
  const renderLoadingScreen = () => (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-gray-500 rounded-full animate-dot1"></div>
        <div className="w-3 h-3 bg-gray-500 rounded-full animate-dot2"></div>
        <div className="w-3 h-3 bg-gray-500 rounded-full animate-dot3"></div>
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
        <GlobalLoader message={t('loading_inventory')} t={t} />
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
        t={t}
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobile={isMobile}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
        onSettingsClick={() => handleTabClick("settings")}
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