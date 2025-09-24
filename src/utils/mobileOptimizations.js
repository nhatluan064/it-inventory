// src/utils/mobileOptimizations.js
// Mobile responsive optimizations and touch improvements

export const mobileTableOptimizations = {
  // Enhanced scrolling for tables
  horizontalScrollConfig: {
    className: "overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600",
    style: {
      WebkitOverflowScrolling: 'touch', // iOS smooth scrolling
      scrollbarWidth: 'thin'
    }
  },

  // Touch-friendly cell padding
  touchCellPadding: "px-3 py-4", // Increased vertical padding for easier touch

  // Sticky header for long tables
  stickyHeaderClass: "sticky top-0 bg-white dark:bg-gray-800 z-10 shadow-sm",

  // Mobile-specific column width handling
  responsiveColumns: {
    name: "min-w-[120px]",
    status: "min-w-[100px]", 
    date: "min-w-[100px]",
    actions: "min-w-[80px]"
  }
};

export const modalMobileOptimizations = {
  // Full-screen on small devices
  containerClass: "fixed inset-0 z-50 overflow-y-auto",
  
  // Mobile-friendly modal sizing
  modalClass: `
    mx-4 my-8 
    sm:mx-auto sm:my-16 
    max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl
    min-h-0 sm:min-h-fit
  `,

  // Better touch targets
  buttonClass: "min-h-[44px] px-4 py-3",
  
  // Improved input sizing
  inputClass: "min-h-[44px] px-3 py-2 text-base",

  // Safe area handling for iOS
  safeAreaPadding: "pb-safe-bottom pt-safe-top"
};

export const touchInteractionImprovements = {
  // Larger touch targets for buttons
  buttonMinSize: "min-w-[44px] min-h-[44px]",
  
  // Visual feedback for touches
  touchFeedback: "active:scale-95 transition-transform duration-100",
  
  // Prevent text selection on interactive elements
  noSelect: "select-none",
  
  // Better focus indicators for accessibility
  focusRing: "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
};

// Apply mobile optimizations to existing components
export const applyMobileOptimizations = (component, isMobile) => {
  if (!isMobile) return component;
  
  // Add mobile-specific props/classes based on component type
  return {
    ...component,
    props: {
      ...component.props,
      className: `${component.props.className || ''} ${touchInteractionImprovements.touchFeedback}`.trim()
    }
  };
};