// src/layouts/NavigationTabs.js
import React from "react";
import {
  Package,
  FileText,
  ShoppingBag,
  CheckCircle,
  LogOut,
  FilePlus,
  ClipboardList,
  Wrench,
  Trash2,
} from "lucide-react";

const NavigationTabs = ({ activeTab, setActiveTab, t, isCollapsed }) => {
  const navGroups = [
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
  ];

  return (
    <nav>
      <div className="flex flex-col space-y-4">
        {navGroups.map((group, groupIndex) => (
          <div key={group.titleKey}>
            <h3
              className={`px-4 mb-2 text-sm font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-opacity duration-300 ${
                isCollapsed ? "hidden" : "opacity-100"
              }`}
            >
              {t(group.titleKey)}
            </h3>
            <div className="flex flex-col space-y-1">
              {group.items.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    title={isCollapsed ? tab.name : ""}
                    className={`w-full flex items-center space-x-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                      isCollapsed ? "justify-center px-2" : "px-4 ml-4"
                    } ${
                      isActive
                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className={isCollapsed ? "hidden" : "block"}>
                      {tab.name}
                    </span>
                  </button>
                );
              })}
            </div>
            {isCollapsed && groupIndex < navGroups.length - 1 && (
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default NavigationTabs;