// src/components/App/AppLayout.js
import React from "react";
import { Toaster } from "react-hot-toast";
import { Menu, Package } from "lucide-react";

import Sidebar from "../../layouts/Sidebar";
import DashboardView from "../../views/DashboardView";

const AppLayout = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  t,
  isSidebarCollapsed,
  toggleSidebar,
  isMobile,
  isMobileSidebarOpen,
  setMobileSidebarOpen,
  onSettingsClick,
  onViewProfile,
  children,
  // Dashboard props
  equipment,
  pendingPurchaseCount,
  purchasingCount,
  purchasedCount,
  masterListCount,
  reportsCount,
  dashboardScrollPosition,
  setDashboardScrollPosition,
}) => {
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabClick}
        currentUser={currentUser}
        onLogout={onLogout}
        t={t}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        isMobileOpen={isMobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        onSettingsClick={onSettingsClick}
        onViewProfile={onViewProfile}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Toaster
          position="top-right"
          reverseOrder={false}
          containerStyle={{ top: 20, right: 20 }}
        />

        {/* Mobile Header */}
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

        {/* Desktop Header */}
        <header className="hidden lg:block p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-grow min-w-0">
            <DashboardView
              t={t}
              equipment={equipment}
              pendingPurchaseCount={pendingPurchaseCount}
              purchasingCount={purchasingCount}
              purchasedCount={purchasedCount}
              masterListCount={masterListCount}
              reportsCount={reportsCount}
              setActiveTab={handleTabClick}
              scrollPosition={dashboardScrollPosition}
              setScrollPosition={setDashboardScrollPosition}
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Mobile Dashboard */}
          <div className="lg:hidden flex-shrink-0 -mx-4 -mt-4 sm:-mx-6 sm:-mt-6">
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <DashboardView
                t={t}
                equipment={equipment}
                pendingPurchaseCount={pendingPurchaseCount}
                purchasingCount={purchasingCount}
                purchasedCount={purchasedCount}
                masterListCount={masterListCount}
                reportsCount={reportsCount}
                setActiveTab={handleTabClick}
                scrollPosition={dashboardScrollPosition}
                setScrollPosition={setDashboardScrollPosition}
              />
            </div>
          </div>

          {/* View Content */}
          <div className="flex-1 min-h-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;