// src/components/AuthSuccessPopup.js
// import React, { useEffect } from 'react';
import { Package, CheckCircle } from 'lucide-react';
// import { useEffect } from 'react';
// import toast from 'react-hot-toast';

const AuthSuccessPopup = ({ type, onFinished, t }) => {
  const content = {
    login: {
      title: t('login_success_title'),
      message: t('login_success_message'),
    },
    register: {
      title: t('register_success_title'),
      message: t('register_success_message'),
    },
  };

  const currentContent = content[type] || content['login'];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6 text-center animate-fade-in-up">
        
        <div className="flex justify-center">
            <div className="relative">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                    <Package className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
            </div>
        </div>

        <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {currentContent.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
                {currentContent.message}
            </p>
        </div>

        {/* 👉 Nút quay lại đăng nhập */}
        <button
        onClick={onFinished}
        className="mt-6 w-full py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
        {
            type === "register" 
                ? t("register_back_to_login")  // 👉 khi Đăng ký xong thì nút là Quay lại đăng nhập
                : t("login_continue_button")  // 👉 khi Đăng nhập xong thì nút là Vào hệ thống
        }
        </button>

        {/* Vòng xoay loading */}
        <div className="flex justify-center items-center pt-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccessPopup;
