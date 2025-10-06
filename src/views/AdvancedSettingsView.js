// src/views/AdvancedSettingsView.js
import React, { useState } from "react";
import {
  Database,
  Upload,
  Download,
  Trash2,
  History,
  Settings,
  ChevronRight,
} from "lucide-react";
import ViewHeader from "../components/ViewHeader";
import DynamicDataManager from "../components/DynamicDataManager";
import { useAuth } from "../hooks/useAuth";

const AdvancedSettingsView = ({
  onBackupData,
  onResetData,
  onImportData,
  onDeleteLogs,
  t,
}) => {
  const { currentUser } = useAuth();
  const fileInputRef = React.useRef(null);
  const [activeSection, setActiveSection] = useState(null);

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleSectionClick = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const renderDatabaseSection = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-slideInUp">
      <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <Database className="w-4 h-4 mr-2" /> {t("data_management")}
      </h3>
      <div className="space-y-4">
        {/* Import Data */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {t("confirm_override_data")}
          </p>
          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 animate-hoverScale"
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
          <button
            onClick={onBackupData}
            className="mt-2 flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 animate-hoverScale"
          >
            <Download className="w-3.5 h-3.5" /> {t("backup_button_text")}
          </button>
        </div>

        {/* Delete Activity Logs */}
        <div className="border-t dark:border-gray-700 pt-4">
          <p className="font-medium text-orange-600 dark:text-orange-400">
            {t("delete_activity_log")}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {t("delete_log_warning")}
          </p>
          <button
            onClick={onDeleteLogs}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 animate-hoverScale"
          >
            <History className="w-3.5 h-3.5" /> {t("delete_log_button")}
          </button>
        </div>

        {/* Reset Data */}
        <div className="border-t dark:border-gray-700 pt-4">
          <p className="font-medium text-red-600 dark:text-red-400">
            {t("reset_data")}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {t("reset_data_warning")}
          </p>
          <button
            onClick={onResetData}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 animate-hoverScale"
          >
            <Trash2 className="w-3.5 h-3.5" /> {t("reset_button_text")}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSystemSection = () => (
    <div className="animate-slideInUp">
      <DynamicDataManager currentUser={currentUser} />
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="animate-slideInDown">
        <ViewHeader title={t("advanced_settings")} />
      </div>

      {/* Selection Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideInUp">
        {/* Database Management Button */}
        <button
          onClick={() => handleSectionClick("database")}
          className={`p-6 rounded-lg shadow-lg border transition-all duration-300 animate-hoverScale ${
            activeSection === "database"
              ? "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`p-3 rounded-lg ${
                  activeSection === "database"
                    ? "bg-blue-100 dark:bg-blue-800"
                    : "bg-blue-50 dark:bg-blue-900/30"
                }`}
              >
                <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Database
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("data_management")}
                </p>
              </div>
            </div>
            <ChevronRight
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                activeSection === "database" ? "rotate-90" : ""
              }`}
            />
          </div>
        </button>

        {/* Interface System Button */}
        <button
          onClick={() => handleSectionClick("system")}
          className={`p-6 rounded-lg shadow-lg border transition-all duration-300 animate-hoverScale ${
            activeSection === "system"
              ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`p-3 rounded-lg ${
                  activeSection === "system"
                    ? "bg-green-100 dark:bg-green-800"
                    : "bg-green-50 dark:bg-green-900/30"
                }`}
              >
                <Settings className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Interface System
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("system_data_management")}
                </p>
              </div>
            </div>
            <ChevronRight
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                activeSection === "system" ? "rotate-90" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Content Sections */}
      {activeSection === "database" && renderDatabaseSection()}
      {activeSection === "system" && renderSystemSection()}
    </div>
  );
};

export default AdvancedSettingsView;
