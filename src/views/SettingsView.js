// src/views/SettingsView.js
import React, { useContext } from "react";
import AppContext from "../context/AppContext";
import { Settings, Monitor, Sun, Moon, Globe } from "lucide-react";
import ViewHeader from "../components/ViewHeader";

const SettingsView = ({ t }) => {
  const { theme, setTheme, language, setLanguage } = useContext(AppContext);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="animate-slideInDown">
        <ViewHeader title={t("system_settings")} />
      </div>
      {/* Interface Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-slideInUp">
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Settings className="w-4 h-4 mr-2" /> {t("interface")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("theme")}
            </label>
            <div className="flex space-x-2 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
              <button
                onClick={() => setTheme("light")}
                className={`w-full flex items-center justify-center gap-2 p-2 rounded-md text-xs animate-hoverScale ${
                  theme === "light"
                    ? "bg-white dark:bg-gray-500 shadow"
                    : "hover:bg-white/50 dark:hover:bg-gray-600"
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> {t("light_mode")}
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`w-full flex items-center justify-center gap-2 p-2 rounded-md text-xs animate-hoverScale ${
                  theme === "dark"
                    ? "bg-white dark:bg-gray-800 shadow"
                    : "hover:bg-white/50 dark:hover:bg-gray-600"
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> {t("dark_mode")}
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`w-full flex items-center justify-center gap-2 p-2 rounded-md text-xs animate-hoverScale ${
                  theme === "system"
                    ? "bg-white dark:bg-gray-500 shadow"
                    : "hover:bg-white/50 dark:hover:bg-gray-600"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> {t("auto_mode")}
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("language")}
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="vi">{t("lang_vi")}</option>
                <option value="en">{t("lang_en")}</option>
                <option value="zh">{t("lang_zh")}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
