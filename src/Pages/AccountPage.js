// src/Pages/AccountPage.js
import React from "react";
import { User, Mail, Calendar, Key } from "lucide-react";
import toast from 'react-hot-toast';

const AccountPage = ({ currentUser, onPasswordReset, t }) => {
  
  const handlePasswordReset = () => {
    onPasswordReset(currentUser.email)
      .then(() => {
        toast.success(t("login_password_reset_sent"));
      })
      .catch((error) => {
        toast.error(t("login_error_password_reset"));
      });
  };

  const getCreationDate = () => {
    if (currentUser.metadata && currentUser.metadata.creationTime) {
      return new Date(currentUser.metadata.creationTime).toLocaleDateString(t('locale_string'));
    }
    return t('not_available');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 mb-4 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-4xl font-medium">
            {currentUser.displayName
              ? currentUser.displayName.charAt(0).toUpperCase()
              : currentUser.email.charAt(0).toUpperCase()}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {currentUser.displayName || t('no_name_provided')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('user_profile')}</p>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <Mail className="w-5 h-5 text-gray-400 mr-4 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">{t('login_email')}</p>
            <p className="text-md font-medium text-gray-800 dark:text-gray-200 break-all">{currentUser.email}</p>
          </div>
        </div>
        <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <User className="w-5 h-5 text-gray-400 mr-4 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">{t('display_name')}</p>
            <p className="text-md font-medium text-gray-800 dark:text-gray-200">{currentUser.displayName || currentUser.email}</p>
          </div>
        </div>
        <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <Calendar className="w-5 h-5 text-gray-400 mr-4 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">{t('account_creation_date')}</p>
            <p className="text-md font-medium text-gray-800 dark:text-gray-200">{getCreationDate()}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t dark:border-gray-700 pt-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t("change_password")}
        </h3>
        <button
          onClick={handlePasswordReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Key className="w-4 h-4" /> {t('change_password_button')}
        </button>
        <p className="text-xs text-center text-gray-500 mt-2">{t('password_reset_info')}</p>
      </div>
    </div>
  );
};

export default AccountPage;
