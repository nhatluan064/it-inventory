// src/components/AnimatedToast.js
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export const AnimatedToast = ({ 
  message, 
  type = "info", 
  duration = 4000, 
  onClose,
  position = "top-right"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Entrance animation
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Auto close
    const closeTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  };

  const typeStyles = {
    success: {
      bg: "bg-green-500",
      icon: CheckCircle,
      iconColor: "text-white"
    },
    error: {
      bg: "bg-red-500", 
      icon: AlertCircle,
      iconColor: "text-white"
    },
    warning: {
      bg: "bg-yellow-500",
      icon: AlertTriangle, 
      iconColor: "text-white"
    },
    info: {
      bg: "bg-blue-500",
      icon: Info,
      iconColor: "text-white"
    }
  };

  const positions = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4", 
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2"
  };

  const { bg, icon: Icon, iconColor } = typeStyles[type];

  return (
    <div className={`
      fixed ${positions[position]} z-50 max-w-sm w-full mx-4
      transform transition-all duration-300 ease-out
      ${isVisible && !isExiting 
        ? 'translate-x-0 opacity-100 scale-100' 
        : position.includes('right')
          ? 'translate-x-full opacity-0 scale-95'
          : '-translate-x-full opacity-0 scale-95'
      }
    `}>
      <div className={`
        ${bg} text-white rounded-lg shadow-lg p-4
        flex items-center space-x-3
        backdrop-blur-sm bg-opacity-90
        animate-bounce
      `}>
        <Icon className={`w-6 h-6 ${iconColor} flex-shrink-0`} />
        
        <div className="flex-1 font-medium">
          {message}
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-white hover:text-gray-200 transition-colors duration-150"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast, index) => (
        <AnimatedToast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          position={toast.position || "top-right"}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Progress Toast
export const ProgressToast = ({ 
  message, 
  progress = 0, 
  onClose, 
  position = "top-right" 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const positions = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4"
  };

  return (
    <div className={`
      fixed ${positions[position]} z-50 max-w-sm w-full mx-4
      transform transition-all duration-300 ease-out
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
    `}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {message}
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {progress}% hoàn thành
        </div>
      </div>
    </div>
  );
};

// Action Toast
export const ActionToast = ({ 
  message, 
  actionText = "Hoàn tác", 
  onAction,
  onClose,
  position = "bottom-center",
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 100) {
          onClose && onClose();
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onClose]);

  const positions = {
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
    "bottom-left": "bottom-4 left-4", 
    "bottom-right": "bottom-4 right-4"
  };

  return (
    <div className={`
      fixed ${positions[position]} z-50 max-w-md w-full mx-4
      transform transition-all duration-300 ease-out
      ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
    `}>
      <div className="bg-gray-800 text-white rounded-lg shadow-xl p-4 flex items-center justify-between">
        <span className="flex-1">{message}</span>
        
        <div className="flex items-center space-x-3 ml-4">
          <button
            onClick={onAction}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-150"
          >
            {actionText}
          </button>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-blue-600 rounded-b-lg transition-all duration-100 ease-linear"
             style={{ width: `${(timeLeft / duration) * 100}%` }} />
      </div>
    </div>
  );
};