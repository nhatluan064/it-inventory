// src/layouts/Sidebar.js
import React, { useRef, useEffect } from "react";
import NavigationTabs from "./NavigationTabs";
import {
  SlidersHorizontal,
  Settings,
  LogOut,
  ChevronsLeft,
  X,
  Package,
} from "lucide-react";

const Sidebar = ({
  currentUser,
  onLogout,
  onSettingsClick,
  activeTab,
  setActiveTab,
  t,
  isCollapsed,
  toggleSidebar,
  isMobile,
  isMobileOpen,
  setMobileOpen,
  onViewProfile,
}) => {
  const SidebarContent = () => {
    const navRef = useRef(null);

    useEffect(() => {
      const navElement = navRef.current;
      if (!navElement) return;

      const handleWheel = (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          navElement.scrollTop += e.deltaY;
        }
      };

      navElement.addEventListener("wheel", handleWheel);

      return () => {
        navElement.removeEventListener("wheel", handleWheel);
      };
    }, []);

    return (
      <>
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 h-16 flex-shrink-0">
          <div
            className={`flex items-center space-x-3 overflow-hidden transition-opacity duration-300 ${
              isCollapsed && !isMobile ? "opacity-0 w-0" : "opacity-100"
            }`}
          >
            {isMobile ? (
              <>
                <SlidersHorizontal className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {t("actioninventory")}
                </h1>
              </>
            ) : (
              <>
                <Package className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {t("it_inventory")}
                </h1>
              </>
            )}
          </div>

          {/* Collapsed Logo */}
          {isCollapsed && !isMobile && (
             <div className="flex items-center justify-center w-full">
                <Package className="w-8 h-8 text-blue-600" />
             </div>
          )}

          {!isMobile && (
             <div className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  aria-label="Toggle sidebar"
                >
                  <ChevronsLeft />
                </button>
            </div>
          )}
          
           {isCollapsed && !isMobile && (
             <div className="absolute top-4 right-[-14px] z-10">
                 <button
                    onClick={toggleSidebar}
                    className="p-1.5 text-gray-500 bg-white dark:bg-gray-800 border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full shadow-md"
                    aria-label="Toggle sidebar"
                  >
                    <ChevronsLeft className="rotate-180 w-4 h-4" />
                </button>
            </div>
          )}


          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <nav ref={navRef} className="flex-grow overflow-y-auto p-4 hide-scrollbar">
          <NavigationTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            t={t}
            isCollapsed={isCollapsed && !isMobile}
          />
        </nav>

        <div className="p-4 border-t dark:border-gray-700 flex-shrink-0">
          <div className={`space-y-3 ${isCollapsed && !isMobile ? "hidden" : ""}`}>
            <div className="flex flex-col items-center text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('hello')},</p>
              <div className="w-12 h-12 my-2 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl font-medium">
                  {currentUser.displayName
                    ? currentUser.displayName.charAt(0).toUpperCase()
                    : currentUser.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="font-semibold text-gray-800 dark:text-gray-200 truncate w-full">
                {currentUser.displayName || currentUser.email}
              </p>
              <button onClick={onViewProfile} className="text-xs text-blue-500 hover:underline mt-1">
                ({t('view_info')})
              </button>
            </div>
            <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md p-1">
              <button onClick={onSettingsClick} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-md flex-1 flex justify-center" title={t("settings")}>
                <Settings className="w-5 h-5" />
              </button>
              <div className="border-l border-gray-300 dark:border-gray-600 h-5"></div>
              <button onClick={onLogout} className="p-2 text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-md flex-1 flex justify-center" title={t("logout")}>
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          {isCollapsed && !isMobile && (
            <div className="flex flex-col items-center justify-center space-y-3">
              
              <div className="w-full flex justify-center">
                  <button onClick={onViewProfile} className="p-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-md font-medium">
                        {currentUser.displayName
                          ? currentUser.displayName.charAt(0).toUpperCase()
                          : currentUser.email.charAt(0).toUpperCase()}
                      </span>
                    </div>                  
                  </button>
              </div>
              <h4 className="text-gray-300">{currentUser.displayName}</h4>
              <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md p-1 space-x-2">
                <button
                  onClick={onSettingsClick}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
                  title={t("settings")}
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg" title={t("logout")}>
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
          
          <div className={`text-center text-xs text-gray-500 mt-4`}>
            © 2025 Make by Nhật Luân
          </div>
        </div>
      </>
    );
  };

  const desktopClasses = `relative hidden md:flex flex-col h-full bg-white dark:bg-gray-800 shadow-lg border-r dark:border-gray-700 transition-all duration-300 ease-in-out ${
    isCollapsed ? "w-28" : "w-72" // Increased collapsed width
  }`;
  const mobileClasses = `fixed inset-y-0 right-0 z-50 transform flex flex-col h-full bg-white dark:bg-gray-800 shadow-lg border-l dark:border-gray-700 transition-transform duration-300 ease-in-out w-72 ${
    isMobileOpen ? "translate-x-0" : "translate-x-full"
  }`;

  return (
    <>
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        ></div>
      )}
      <div className={isMobile ? mobileClasses : desktopClasses}>
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;

