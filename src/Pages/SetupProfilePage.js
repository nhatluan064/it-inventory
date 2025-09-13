// src/Pages/SetupProfilePage.js
import React, { useState } from 'react';
import { User, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SetupProfilePage = ({ currentUser, onProfileSetupComplete, t }) => {
  const [displayName, setDisplayName] = useState(currentUser.displayName || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error(t('please_enter_display_name'));
      return;
    }
    setIsLoading(true);
    try {
      await onProfileSetupComplete(displayName);
      // The parent component will handle navigation
    } catch (error) {
      toast.error(t('profile_update_failed'));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6 text-center animate-fade-in-up">
        <div className="flex justify-center">
          <div className="relative">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl font-medium">
                  {currentUser.email.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {t('complete_your_profile')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('setup_profile_welcome')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 text-left block">
              {t('display_name')}
            </label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                placeholder={t('enter_your_name')}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? t('saving') : t('save_and_continue')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupProfilePage;
