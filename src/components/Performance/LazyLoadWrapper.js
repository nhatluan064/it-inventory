// src/components/Performance/LazyLoadWrapper.js
import React, { lazy, Suspense } from 'react';
import { ChartLoadingSkeleton } from '../LoadingStates/GlobalLoader';

// Lazy load heavy components
export const LazyReportsView = lazy(() => import('../../views/ReportsView'));
export const LazyMasterListView = lazy(() => import('../../views/MasterListView'));
export const LazySettingsView = lazy(() => import('../../views/SettingsView'));

// Lazy load chart components
export const LazyDailyActivityChart = lazy(() => import('../charts/DailyActivityChart'));
export const LazyTopDevicesChart = lazy(() => import('../charts/TopDevicesChart'));
export const LazyMonthlyTrendChart = lazy(() => import('../charts/MonthlyTrendChart'));

// Generic lazy load wrapper with loading fallback
export const LazyComponentWrapper = ({ 
  component: Component, 
  fallback = <ChartLoadingSkeleton />,
  ...props 
}) => (
  <Suspense fallback={fallback}>
    <Component {...props} />
  </Suspense>
);

// Performance optimized component renderer
export const PerformantRenderer = React.memo(({ 
  shouldRender, 
  children,
  fallback = null 
}) => {
  if (!shouldRender) return fallback;
  return children;
});

export default LazyComponentWrapper;