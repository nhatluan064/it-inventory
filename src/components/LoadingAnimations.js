// src/components/LoadingAnimations.js
import React from 'react';

// Spinner Loading Component
export const LoadingSpinner = ({ size = "md", color = "blue" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
    purple: "text-purple-600",
    white: "text-white"
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}>
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

// Dots Loading Component
export const LoadingDots = ({ color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600", 
    red: "bg-red-600",
    yellow: "bg-yellow-600",
    purple: "bg-purple-600",
    gray: "bg-gray-600"
  };

  return (
    <div className="flex space-x-1 justify-center items-center">
      <div className={`h-2 w-2 ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '0s' }}></div>
      <div className={`h-2 w-2 ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
      <div className={`h-2 w-2 ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
    </div>
  );
};

// Pulse Loading Component
export const LoadingPulse = ({ text = "Đang tải...", className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <div className="text-gray-600 dark:text-gray-300 animate-pulse">{text}</div>
    </div>
  );
};

// Skeleton Loading Component
export const LoadingSkeleton = ({ lines = 3, className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="mb-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-shimmer"></div>
        </div>
      ))}
    </div>
  );
};

// Card Skeleton Loading
export const CardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-pulse">
          <div className="flex space-x-4">
            <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-10 w-10"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

// Progress Bar Loading
export const LoadingProgress = ({ progress = 0, className = "" }) => {
  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}>
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

// Breathing Loading Component  
export const LoadingBreathing = ({ text = "Đang xử lý..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-breathe"></div>
      <div className="text-gray-600 dark:text-gray-300 animate-pulse">{text}</div>
    </div>
  );
};

// Full Screen Loading Overlay
export const LoadingOverlay = ({ isVisible, text = "Đang tải...", blur = true }) => {
  if (!isVisible) return null;

  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center
      bg-black bg-opacity-50 
      ${blur ? 'backdrop-blur-sm' : ''}
      animate-fadeIn
    `}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-2xl max-w-sm w-full mx-4 animate-scaleIn">
        <div className="text-center">
          <LoadingSpinner size="xl" color="blue" />
          <div className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-200">
            {text}
          </div>
        </div>
      </div>
    </div>
  );
};