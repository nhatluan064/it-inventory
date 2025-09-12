// src/Pages/AccountPage.js
import React from "react";
import { User, Mail } from "lucide-react";

const AccountPage = ({ currentUser, t }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sm:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
        <User /> {t("account_information")}
      </h2>

      <div className="space-y-4 mb-8">
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Email
          </label>
          <div className="flex items-center gap-2 mt-1">
            <Mail className="w-5 h-5 text-gray-400" />
            <p className="text-gray-800 dark:text-gray-200">
              {currentUser.email}
            </p>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t("display_name")}
          </label>
          <div className="flex items-center gap-2 mt-1">
            <User className="w-5 h-5 text-gray-400" />
            <p className="text-gray-800 dark:text-gray-200">
              {currentUser.displayName || currentUser.email}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t pt-6 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t("change_password")}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("password_change_disabled")}
        </p>
      </div>
    </div>
  );
};

export default AccountPage;
