// src/components/LoadingStates/GlobalLoader.js
import React from 'react';
import { Loader2 } from 'lucide-react';

const GlobalLoader = ({ message, t }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50/95 to-purple-50/95 dark:from-gray-900/95 dark:to-blue-900/95 backdrop-blur-md z-50 flex items-center justify-center loading-overlay">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md mx-4 text-center transform scale-100 auth-profile-setup">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-blue-600 enhanced-spin" />
            <div className="absolute inset-0 w-12 h-12 border-2 border-blue-200 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 auth-success-celebration">
          {t ? t('loading') : 'Loading...'}
        </h3>
        
        {message && (
          <p className="text-sm text-gray-600 dark:text-gray-300 auth-loading-text">
            {message}
          </p>
        )}

        {/* Loading Progress Indicator */}
        <div className="mt-6 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// Enhanced loading states for different components
export const TableLoadingSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="animate-pulse">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="border-b border-gray-200 dark:border-gray-700 py-4">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const CardLoadingSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse"
      >
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      </div>
    ))}
  </div>
);

export const ChartLoadingSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
  </div>
);

export default GlobalLoader;