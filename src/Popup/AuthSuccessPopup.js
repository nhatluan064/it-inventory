// src/Popup/AuthSuccessPopup.js
import React, { useState, useEffect } from "react";
import { MailCheck } from "lucide-react";

const AuthSuccessPopup = ({ type, onFinished, t }) => {
  // State để đếm ngược
  const [countdown, setCountdown] = useState(3);

  const content = {
    register: {
      icon: MailCheck,
      title: t("register_success_title"),
      message: "Email xác thực đã được gửi. Vui lòng kiểm tra hộp thư của bạn.",
    },
  };

  useEffect(() => {
    if (countdown <= 0) {
      onFinished(); // Gọi hàm để đóng popup khi đếm ngược kết thúc
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, onFinished]);

  const currentContent = content[type] || content["register"];
  const Icon = currentContent.icon;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6 text-center animate-fade-in-up">
        <div className="flex justify-center">
          <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
            <Icon className="w-10 h-10 text-green-600 dark:text-green-400" />
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

        <div className="flex justify-center items-center pt-4 text-gray-500">
          <span>Tự động quay lại sau...</span>
          <span className="font-bold text-lg ml-2 text-blue-600">
            {countdown}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccessPopup;
