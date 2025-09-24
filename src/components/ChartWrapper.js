// src/components/ChartWrapper.js
import React, { useEffect, useRef } from "react";
import { ErrorBoundary } from "./Performance/LazyComponents";

const ChartWrapper = React.memo(({ children, title, isLoading = false, hasData = true }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const currentRef = chartRef.current;
    // Cleanup function to destroy chart instances
    return () => {
      if (currentRef) {
        // Force cleanup any chart instances
        const canvas = currentRef.querySelector('canvas');
        if (canvas) {
          const chart = window.Chart?.getChart(canvas);
          if (chart) {
            chart.destroy();
          }
        }
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
        {title && (
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">
            {title}
          </h3>
        )}
        <div className="relative h-64 md:h-80 flex items-center justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full animate-dot1"></div>
            <div className="w-3 h-3 bg-gray-500 rounded-full animate-dot2"></div>
            <div className="w-3 h-3 bg-gray-500 rounded-full animate-dot3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
        {title && (
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">
            {title}
          </h3>
        )}
        <div className="relative h-64 md:h-80 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            Không có dữ liệu hiển thị
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6" ref={chartRef}>
      {title && (
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>
      )}
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </div>
  );
});

ChartWrapper.displayName = 'ChartWrapper';

export default ChartWrapper;