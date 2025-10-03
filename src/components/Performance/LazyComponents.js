// src/components/Performance/LazyComponents.js
import React, { lazy, Suspense } from 'react';
import { ChartLoadingSkeleton } from '../LoadingStates/GlobalLoader';

// Lazy load heavy views that users might not visit immediately
export const LazyReportsView = lazy(() => 
  import('../../views/ReportsView').then(module => ({
    default: module.default
  }))
);

export const LazyMasterListView = lazy(() => 
  import('../../views/MasterListView').then(module => ({
    default: module.default
  }))
);

export const LazySettingsView = lazy(() => 
  import('../../views/SettingsView').then(module => ({
    default: module.default
  }))
);

// Lazy load chart components (these are render-heavy)
export const LazyDailyActivityChart = lazy(() => 
  import('../DailyActivityChart').then(module => ({
    default: module.default
  }))
);

export const LazyMonthlyTrendChart = lazy(() => 
  import('../MonthlyTrendChart').then(module => ({
    default: module.default
  }))
);

export const LazyTopDevicesChart = lazy(() => 
  import('../TopDevicesChart').then(module => ({
    default: module.default
  }))
);

export const LazyCategoryDistributionChart = lazy(() => 
  import('../CategoryDistributionChart').then(module => ({
    default: module.default
  }))
);

// Generic lazy wrapper with error boundary
export const LazyWrapper = ({ 
  component: Component, 
  fallback = <ChartLoadingSkeleton />,
  errorFallback = <div className="text-red-500 p-4">Failed to load component</div>,
  ...props 
}) => (
  <Suspense fallback={fallback}>
    <ErrorBoundary fallback={errorFallback}>
      <Component {...props} />
    </ErrorBoundary>
  </Suspense>
);

// Error boundary for lazy components
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Optionally report to a logging service; avoid console for clean builds
    void error;
    void errorInfo;
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Preload helper for better UX
export const preloadComponent = (componentImport) => {
  if (typeof componentImport === 'function') {
    componentImport();
  }
};

// Intersection Observer hook for lazy loading on scroll
export const useIntersectionObserver = (ref, options = {}) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [ref, options]);
  
  return isIntersecting;
};
