// src/layouts/Sidebar.js
import React from "react";
import NavigationTabs from "./NavigationTabs";
import {
  Package,
  Settings,
  LogOut,
  ChevronsLeft,
  X,
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
  isMobile,
  isMobileOpen,
  setMobileOpen,
}) => {
  const desktopClasses = `relative hidden md:flex ${
    isCollapsed ? "w-20" : "w-64"
  }`;
  const mobileClasses = `fixed inset-y-0 right-0 z-50 transform ${
    isMobileOpen ? "translate-x-0" : "translate-x-full"
  } w-64 md:hidden`;

  return (
    <>
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <div
        className={`
          bg-white dark:bg-gray-800 flex flex-col h-full shadow-lg border-l dark:border-gray-700
          transition-all duration-300 ease-in-out
          ${isMobile ? mobileClasses : desktopClasses}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 h-16 flex-shrink-0">
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
           {isCollapsed && !isMobile && (
             <Package className="w-8 h-8 text-blue-600 flex-shrink-0" />
            )}

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
            isCollapsed={isCollapsed && !isMobile}
          />
        </nav>

        <div className="p-4 border-t dark:border-gray-700 flex-shrink-0">
            <div className={`flex items-center ${ isCollapsed && !isMobile ? 'justify-center' : 'justify-between' }`}>
                 <div className={`flex items-center space-x-2 overflow-hidden flex-grow ${isCollapsed && !isMobile ? 'hidden' : ''}`}>
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                        {currentUser.displayName
                        ? currentUser.displayName.charAt(0).toUpperCase()
                        : currentUser.email.charAt(0).toUpperCase()}
                    </span>
                    </div>
                    <span
                    className={`text-sm font-medium text-gray-700 dark:text-gray-200 truncate`}
                    >
                    {currentUser.displayName || currentUser.email}
                    </span>
                </div>
                 {isCollapsed && !isMobile && (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">
                            {currentUser.displayName
                            ? currentUser.displayName.charAt(0).toUpperCase()
                            : currentUser.email.charAt(0).toUpperCase()}
                        </span>
                    </div>
                 )}
                <div className={`items-center space-x-1 ${isCollapsed && !isMobile ? 'hidden' : 'flex'}`}>
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
        
        <div className={`text-center text-xs text-gray-400 dark:text-gray-500 py-2 flex-shrink-0 ${isCollapsed && !isMobile ? 'hidden' : ''}`}>
            © 2025 Make by Nhật Luân
        </div>
      </div>
    </>
  );
};

export default Sidebar;

