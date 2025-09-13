// src/layouts/Sidebar.js
import React, { useRef } from "react";
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

    return (
      <>
        {/* Phần Header của Sidebar giữ nguyên */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 h-16 flex-shrink-0">
          <div
            className={`flex items-center space-x-3 overflow-hidden transition-opacity duration-300 ${
              isCollapsed && !isMobile ? "opacity-0 w-0" : "opacity-100"
            }`}
          >
            {isMobile ? (
              <>
                <SlidersHorizontal className="w-7 h-7 text-blue-600 flex-shrink-0" />
                <h1 className="text-base font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {t("actioninventory")}
                </h1>
              </>
            ) : (
              <>
                <Package className="w-7 h-7 text-blue-600 flex-shrink-0" />
                <h1 className="text-base font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                  {t("it_inventory")}
                </h1>
              </>
            )}
          </div>
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
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav ref={navRef} className="flex-grow p-4 hide-scrollbar">
          <NavigationTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            t={t}
            isCollapsed={isCollapsed && !isMobile}
          />
        </nav>
        
        {/* ---- BẮT ĐẦU KHU VỰC ĐÃ TÁI CẤU TRÚC ---- */}
        <div className="p-4 border-t dark:border-gray-700 flex-shrink-0">
          {/* Chế độ xem Mở Rộng */}
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              isCollapsed && !isMobile
                ? "grid-rows-[0fr] opacity-0"
                : "grid-rows-[1fr] opacity-100"
            }`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col items-center text-center space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('hello')},</p>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-medium">
                    {currentUser.displayName
                      ? currentUser.displayName.charAt(0).toUpperCase()
                      : currentUser.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="font-semibold text-gray-800 dark:text-gray-200 truncate w-full text-sm">
                  {currentUser.displayName || currentUser.email}
                </p>
                <button onClick={onViewProfile} className="text-xs text-blue-500 hover:underline">
                  ({t('view_info')})
                </button>
              </div>
              {/* ---- KHỐI NÚT ĐÃ SỬA ---- */}
              <div className="mt-3 space-y-1 pl-4">
                <button onClick={onLogout} className="w-full flex items-center space-x-3 py-1.5 px-4 rounded-lg font-medium text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                  <LogOut className="w-4 h-4" />
                  <span>{t("logout")}</span>
                </button>
                <button onClick={onSettingsClick} className="w-full flex items-center space-x-3 py-1.5 px-4 rounded-lg font-medium text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                  <Settings className="w-4 h-4" />
                   <span>{t("settings")}</span>
                </button>
              </div>
              <div className="text-center text-xs text-gray-500 mt-3">
                © 2025 Make by Nhật Luân
              </div>
            </div>
          </div>

          {/* Chế độ xem Thu Gọn */}
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              isCollapsed && !isMobile
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col items-center justify-center">
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
                {/* ---- KHỐI NÚT ĐÃ SỬA ---- */}
                <div className="mt-2 space-y-1">
                  <button onClick={onLogout} title={t("logout")} className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                      <LogOut className="w-4 h-4" />
                  </button>
                   <button onClick={onSettingsClick} title={t("settings")} className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                      <Settings className="w-4 h-4" />
                  </button>
                </div>
                 <div className="text-center text-xs text-gray-500 pt-2">
                    © 2025 Make by Nhật Luân
                 </div>
              </div>
            </div>
          </div>
        </div>
        {/* ---- KẾT THÚC KHU VỰC TÁI CẤU TRÚC ---- */}
      </>
    );
  };

  const desktopClasses = `relative hidden md:flex flex-col h-full bg-white dark:bg-gray-800 shadow-lg border-r dark:border-gray-700 transition-all duration-300 ease-in-out ${
    isCollapsed ? "w-20" : "w-64"
  }`;
  const mobileClasses = `fixed inset-y-0 right-0 z-50 transform flex flex-col h-full bg-white dark:bg-gray-800 shadow-lg border-l dark:border-gray-700 transition-transform duration-300 ease-in-out w-64 ${
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