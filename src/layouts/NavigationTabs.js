// src/layouts/NavigationTabs.js
import React from "react";
import {
  Home,
  Package,
  FileText,
  ShoppingBag,
  CheckCircle,
  LogOut,
  FilePlus,
  ClipboardList,
  Wrench,
  Trash2,
  Settings,
  Sliders,
} from "lucide-react";

const NavigationTabs = ({ activeTab, setActiveTab, t, isCollapsed }) => {
  const navGroups = [
    {
      titleKey: "nav_title_main",
      items: [{ id: "home", name: t("home"), icon: Home }],
    },
    {
      titleKey: "nav_title_purchasing",
      items: [
        { id: "masterList", name: t("master_list"), icon: ClipboardList },
        { id: "pendingPurchase", name: t("pending_purchase"), icon: FilePlus },
        { id: "purchasing", name: t("purchasing"), icon: ShoppingBag },
        { id: "purchased", name: t("purchased"), icon: CheckCircle },
      ],
    },
    {
      titleKey: "nav_title_assets",
      items: [
        { id: "inventory", name: t("inventory_management"), icon: Package },
        { id: "allocated", name: t("allocated"), icon: LogOut },
      ],
    },
    {
      titleKey: "nav_title_lifecycle",
      items: [
        { id: "maintenance", name: t("maintenance"), icon: Wrench },
        { id: "liquidation", name: t("liquidation"), icon: Trash2 },
      ],
    },
    {
      titleKey: "nav_title_reports",
      items: [{ id: "reports", name: t("reports"), icon: FileText }],
    },
    {
      titleKey: "nav_title_system",
      items: [
        { id: "settings", name: t("settings"), icon: Settings },
        { id: "advancedSettings", name: t("advanced_settings"), icon: Sliders },
      ],
    },
  ];

  return (
    <nav>
      <div className="flex flex-col space-y-1">
        {navGroups.map((group, groupIndex) => (
          <div key={group.titleKey}>
            {groupIndex > 0 && (
              <div
                className={`h-px transition-all duration-300 ${
                  isCollapsed
                    ? "w-8 mx-auto my-2 bg-gray-600"
                    : "mx-4 my-1.5 bg-gray-200 dark:bg-gray-700"
                }`}
              ></div>
            )}

            {!isCollapsed && (
              <h3
                className="px-4 mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
              >
                {t(group.titleKey)}
              </h3>
            )}
            
            <div
              className={`flex flex-col items-center space-y-0.5 ${
                isCollapsed ? "" : "pl-4 items-stretch"
              }`}
            >
              {group.items.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    title={isCollapsed ? tab.name : ""}
                    className={`
                      flex items-center font-medium text-xs transition-all duration-300 rounded-lg group
                      ${
                        isCollapsed
                          ? "w-10 h-10 justify-center transform hover:scale-110 hover:rotate-12"
                          : "w-full space-x-3 py-1.5 px-4"
                      }
                      ${
                        isActive
                          ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300"
                          : "text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
                      }
                    `}
                    style={{
                      boxShadow: isActive 
                        ? '0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)' 
                        : undefined,
                      transition: 'box-shadow 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300 ${isCollapsed && !isActive ? 'group-hover:rotate-12' : ''}`} />
                    <span
                      // ---- DÒNG ĐÃ THAY ĐỔI: Thêm class "hidden" vào trạng thái thu gọn ----
                      className={`transition-all duration-300 ease-out transform group-hover:translate-x-1 ${
                        isCollapsed
                          ? "opacity-0 pointer-events-none hidden"
                          : "opacity-100"
                      }`}
                    >
                      {tab.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default NavigationTabs;