// src/layouts/Header.js
import React, { useState, useEffect, useRef } from "react";
import {
  Package,
  Bell,
  Settings,
  Edit,
  ArrowUpRight,
  ArrowDownLeft,
  FilePlus,
  ShoppingCart,
  CheckCircle,
  LogOut,
  User,
} from "lucide-react";

const Header = ({
  onSettingsClick,
  transactions,
  setActiveTab,
  currentUser,
  onLogout,
  t,
}) => {
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      )
        setNotificationOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target))
        setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationRef, userMenuRef]);

  const recentActivities = transactions ? transactions.slice(0, 5) : [];

  const logDetails = {
    // ... (nội dung logDetails giữ nguyên)
  };

  const handleShowAll = () => {
    setActiveTab("reports");
    setNotificationOpen(false);
  };
  const handleMenuClick = (tab) => {
    setActiveTab(tab);
    setUserMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-2">
              {/* ĐÃ SỬA: w-8 h-8 -> w-7 h-7 */}
              <Package className="w-7 h-7 text-blue-600" />
              {/* ĐÃ SỬA: text-xl -> text-lg */}
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 hidden sm:block">
                {t("it_inventory")}
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationOpen((prev) => !prev)}
                className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {/* ĐÃ SỬA: w-5 h-5 -> w-4 h-4 */}
                <Bell className="w-4 h-4" />
                {recentActivities.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute top-full mt-2 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20 border dark:border-gray-700">
                  <div className="p-3 font-semibold border-b dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm">
                    {t("notifications")}
                  </div>
                  <ul className="py-1 max-h-80 overflow-y-auto">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((trans) => {
                        const detailKey = `${trans.type}-${trans.reason}`;
                        const detail = logDetails[detailKey] || { icon: Edit };
                        const Icon = detail.icon;
                        return (
                          <li
                            key={trans.id}
                            className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <div className="flex items-start gap-3">
                              <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                              <div>
                                {/* ĐÃ SỬA: text-sm -> text-xs */}
                                <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                  {/* ... */}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {/* ... */}
                                </p>
                              </div>
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <li className="px-3 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
                        {t("no_new_notifications")}
                      </li>
                    )}
                  </ul>
                  <div className="p-2 border-t dark:border-gray-700">
                    <button
                      onClick={handleShowAll}
                      className="w-full text-center text-xs text-blue-600 hover:underline"
                    >
                      {t("view_all")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  {/* ĐÃ SỬA: text-sm -> text-xs */}
                  <span className="text-white text-xs font-medium">
                    {/* ... */}
                  </span>
                </div>
                {/* ĐÃ SỬA: text-sm -> text-xs */}
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                  {currentUser.displayName || currentUser.email}
                </span>
              </button>
              {isUserMenuOpen && (
                <div className="absolute top-full mt-2 right-0 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20 border dark:border-gray-700">
                  {/* ĐÃ SỬA: text-sm -> text-xs */}
                  <ul className="py-1 text-xs">
                    <li>
                      <button
                        onClick={() => handleMenuClick("account")}
                        className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <User className="w-4 h-4" />
                        <span>{t("account")}</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t("logout")}</span>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={onSettingsClick}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={t("settings")}
            >
              {/* ĐÃ SỬA: w-5 h-5 -> w-4 h-4 */}
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};