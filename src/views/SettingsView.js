// src/views/SettingsView.js
import React, { useContext } from "react";
import AppContext from "../context/AppContext";
import {
  Settings,
  Monitor,
  Sun,
  Moon,
  Globe,
  Database,
  Upload,
  Download,
  Trash2,
} from "lucide-react";
import ViewHeader from "../components/ViewHeader";

const SettingsView = ({ onBackupData, onResetData, onImportData, t }) => {
  const { theme, setTheme, language, setLanguage } = useContext(AppContext);
  const fileInputRef = React.useRef(null);

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <ViewHeader title={t("system_settings")} />

      {/* Interface Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {/* ĐÃ SỬA: text-lg -> text-base, w-5 h-5 -> w-4 h-4 */}
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Settings className="w-4 h-4 mr-2" /> {t("interface")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme Selection */}
          <div>
            {/* ĐÃ SỬA: text-sm -> text-xs */}
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("theme")}
            </label>
            <div className="flex space-x-2 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
              {/* ĐÃ SỬA: text-sm -> text-xs, w-4 h-4 -> w-3.5 h-3.5 */}
              <button
                onClick={() => setTheme("light")}
                className={`w-full flex items-center justify-center gap-2 p-2 rounded-md text-xs ${
                  theme === "light"
                    ? "bg-white dark:bg-gray-500 shadow"
                    : "hover:bg-white/50 dark:hover:bg-gray-600"
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> {t("light_mode")}
              </button>
              {/* ĐÃ SỬA: text-sm -> text-xs, w-4 h-4 -> w-3.5 h-3.5 */}
              <button
                onClick={() => setTheme("dark")}
                className={`w-full flex items-center justify-center gap-2 p-2 rounded-md text-xs ${
                  theme === "dark"
                    ? "bg-white dark:bg-gray-800 shadow"
                    : "hover:bg-white/50 dark:hover:bg-gray-600"
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> {t("dark_mode")}
              </button>
              {/* ĐÃ SỬA: text-sm -> text-xs, w-4 h-4 -> w-3.5 h-3.5 */}
              <button
                onClick={() => setTheme("system")}
                className={`w-full flex items-center justify-center gap-2 p-2 rounded-md text-xs ${
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
            {/* ĐÃ SỬA: text-sm -> text-xs */}
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("language")}
            </label>
            <div className="relative">
              {/* ĐÃ SỬA: w-5 h-5 -> w-4 h-4 */}
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

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {/* ĐÃ SỬA: text-lg -> text-base, w-5 h-5 -> w-4 h-4 */}
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <Database className="w-4 h-4 mr-2" /> {t("data_management")}
        </h3>
        <div className="space-y-4">
          {/* Import Data */}
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {t("import_data")}
            </p>
            {/* ĐÃ SỬA: text-sm -> text-xs */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {t("confirm_override_data")}
            </p>
            {/* ĐÃ SỬA: text-sm -> text-xs, w-4 h-4 -> w-3.5 h-3.5 */}
            <button
              onClick={handleImportClick}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Upload className="w-3.5 h-3.5" /> {t("import_button_text")}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onImportData}
              className="hidden"
              accept=".json"
            />
          </div>

          {/* Backup Data */}
          <div>
            <p className="font-medium text-gray-800 dark:text-gray-200">
              {t("backup_data")}
            </p>
            {/* ĐÃ SỬA: text-sm -> text-xs, w-4 h-4 -> w-3.5 h-3.5 */}
            <button
              onClick={onBackupData}
              className="mt-2 flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              <Download className="w-3.5 h-3.5" /> {t("backup_button_text")}
            </button>
          </div>

          {/* Reset Data */}
          <div className="border-t dark:border-gray-700 pt-4">
            <p className="font-medium text-red-600 dark:text-red-400">
              {t("reset_data")}
            </p>
            {/* ĐÃ SỬA: text-sm -> text-xs */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {t("reset_data_warning")}
            </p>
            {/* ĐÃ SỬA: text-sm -> text-xs, w-4 h-4 -> w-3.5 h-3.5 */}
            <button
              onClick={onResetData}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              <Trash2 className="w-3.5 h-3.5" /> {t("reset_button_text")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;