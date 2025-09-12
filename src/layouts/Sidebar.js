// src/layouts/Sidebar.js
import React from "react";
import NavigationTabs from "./NavigationTabs";
import {
  Package,
  Settings,
  LogOut,
  ChevronsLeft,
  X, // Import icon X to close
} from "lucide-react";

const Sidebar = ({
  currentUser,
  onLogout,
  setActiveTab,
  activeTab,
  onSettingsClick,
  t,
  isCollapsed,
  toggleSidebar,
  // --- New Props for Responsive ---
  isMobile,
  isMobileOpen,
  setMobileOpen,
}) => {
  // --- Responsive Class Logic ---
  const desktopClasses = `relative hidden md:flex ${
    isCollapsed ? "w-20" : "w-64"
  } border-l dark:border-gray-700`; // Thêm border-l
  const mobileClasses = `fixed inset-y-0 right-0 z-50 transform ${
    // Đổi left-0 thành right-0
    isMobileOpen ? "translate-x-0" : "translate-x-full" // Đổi -translate-x-full thành translate-x-full
  } w-64 md:hidden border-l dark:border-gray-700`; // Thêm border-l

  return (
    <>
      {/* Overlay for mobile view when sidebar is open */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar Content */}
      <div
        className={`
          bg-white dark:bg-gray-800 flex flex-col h-screen shadow-lg
          transition-all duration-300 ease-in-out
          ${isMobile ? mobileClasses : desktopClasses}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 h-16">
          <div
            className={`flex items-center space-x-2 overflow-hidden transition-opacity duration-300 ${
              isCollapsed && !isMobile ? "opacity-0 w-0" : "opacity-100"
            }`}
          >
            <Package className="w-8 h-8 text-blue-600 flex-shrink-0" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
              {t("it_inventory")}
            </h1>
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg hidden md:block"
            aria-label="Toggle sidebar"
          >
            <ChevronsLeft
              className={`transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>
          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:hidden"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-grow overflow-y-auto p-4">
          <NavigationTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            t={t}
            isCollapsed={isCollapsed && !isMobile} // Only collapse on desktop
          />
        </nav>

        <div
          className={`p-4 border-t dark:border-gray-700 flex items-center ${
            isCollapsed && !isMobile ? "justify-center" : "justify-between"
          } h-16`}
        >
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {currentUser.displayName
                  ? currentUser.displayName.charAt(0).toUpperCase()
                  : currentUser.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <span
              className={`text-sm font-medium text-gray-700 dark:text-gray-200 truncate ${
                isCollapsed && !isMobile ? "hidden" : ""
              }`}
            >
              {currentUser.displayName || currentUser.email}
            </span>
          </div>
          <div
            className={`flex items-center space-x-1 ${
              isCollapsed && !isMobile ? "hidden" : "flex"
            }`}
          >
            <button
              onClick={onSettingsClick}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
              title={t("settings")}
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg"
              title={t("logout")}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
