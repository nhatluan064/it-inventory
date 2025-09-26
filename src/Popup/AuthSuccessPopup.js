// src/Popup/AuthSuccessPopup.js
import React, { useState, useEffect } from "react";
import { MailCheck, CheckCircle, Sparkles } from "lucide-react";

const AuthSuccessPopup = ({ type, onFinished, t }) => {
  // State để đếm ngược và animation - Tăng lên 5 giây cho user thưởng thức animation
  const [countdown, setCountdown] = useState(5);
  const [showConfetti, setShowConfetti] = useState(false);

  const content = {
    register: {
      icon: MailCheck,
      title: t("register_success_title"),
      message: "Email xác thực đã được gửi. Vui lòng kiểm tra hộp thư của bạn.",
    },
    login: {
      icon: CheckCircle,
      title: "Đăng nhập thành công!",
      message: "Chào mừng bạn đã quay trở lại với hệ thống quản lý kho IT.",
    },
  };

  useEffect(() => {
    // Trigger confetti effect
    setShowConfetti(true);
    
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

  // Tạo confetti particles
  const renderConfetti = () => {
    return Array.from({ length: 12 }).map((_, index) => (
      <div
        key={index}
        className={`absolute w-3 h-3 auth-confetti`}
        style={{
          left: `${Math.random() * 100}%`,
          backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)],
          borderRadius: Math.random() > 0.5 ? '50%' : '0',
          animationDelay: `${Math.random() * 2}s`,
        }}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {renderConfetti()}
        </div>
      )}

      {/* Sparkle Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles className="absolute top-20 left-20 w-6 h-6 text-yellow-400 animate-ping" style={{ animationDelay: '0.5s' }} />
        <Sparkles className="absolute top-32 right-24 w-4 h-4 text-blue-400 animate-ping" style={{ animationDelay: '1s' }} />
        <Sparkles className="absolute bottom-40 left-32 w-5 h-5 text-green-400 animate-ping" style={{ animationDelay: '1.5s' }} />
        <Sparkles className="absolute bottom-20 right-16 w-6 h-6 text-purple-400 animate-ping" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6 text-center auth-success-celebration relative z-10">
        
        {/* Success Icon with Animated Checkmark */}
        <div className="flex justify-center">
          <div className="success-checkmark-container auth-success-pulse">
            <svg className="success-checkmark auth-checkmark" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>

        {/* Content with Welcome Animation */}
        <div className="space-y-4 auth-welcome-slide">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 auth-success-celebration">
            {currentContent.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            {currentContent.message}
          </p>
        </div>

        {/* Success Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>Thao tác thành công</span>
        </div>

        {/* Countdown with Glow Effect */}
        <div className="flex flex-col items-center gap-2 pt-4">
          <span className="text-gray-500 dark:text-gray-400">Tự động chuyển trang sau</span>
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold loading-progress-glow">
            {countdown}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-1000 loading-progress-glow"
            style={{ width: `${((5 - countdown) / 5) * 100}%` }}
          />
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default AuthSuccessPopup;
