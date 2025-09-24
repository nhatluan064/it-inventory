// src/components/Performance/MemoizedComponents.js
import React from 'react';

// Memoized StatCard for Dashboard
export const MemoizedStatCard = React.memo(({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  onClick,
  className = ""
}) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${color || 'bg-blue-100 dark:bg-blue-900'}`}>
            <Icon className={`w-6 h-6 ${color ? 'text-white' : 'text-blue-600 dark:text-blue-300'}`} />
          </div>
        )}
      </div>
    </div>
  );
});

MemoizedStatCard.displayName = 'MemoizedStatCard';

// Memoized Table Row
export const MemoizedTableRow = React.memo(({ 
  item, 
  columns, 
  onRowClick,
  isSelected = false,
  className = ""
}) => {
  return (
    <tr 
      className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      } ${className}`}
      onClick={() => onRowClick?.(item)}
    >
      {columns.map((column, index) => (
        <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
          {typeof column.render === 'function' 
            ? column.render(item[column.key], item)
            : item[column.key] || '-'
          }
        </td>
      ))}
    </tr>
  );
});

MemoizedTableRow.displayName = 'MemoizedTableRow';

// Memoized Filter Button
export const MemoizedFilterButton = React.memo(({ 
  label, 
  isActive, 
  onClick, 
  count,
  icon: Icon 
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
        isActive
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
      {count !== undefined && (
        <span className={`px-2 py-1 rounded-full text-xs ${
          isActive 
            ? 'bg-white/20 text-white' 
            : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
});

MemoizedFilterButton.displayName = 'MemoizedFilterButton';

// Memoized Search Input
export const MemoizedSearchInput = React.memo(({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  className = "" 
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
});

MemoizedSearchInput.displayName = 'MemoizedSearchInput';

// Memoized Modal Wrapper
export const MemoizedModal = React.memo(({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md',
  className = ""
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl', 
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        <div className={`relative inline-block w-full ${sizeClasses[size]} transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle ${className}`}>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
});

MemoizedModal.displayName = 'MemoizedModal';

// Performance optimization helper
export const shouldComponentUpdate = (prevProps, nextProps, keys = []) => {
  if (keys.length === 0) {
    // Deep comparison if no specific keys provided
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  }
  
  // Compare only specified keys
  for (const key of keys) {
    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }
  
  return true;
};

// HOC for easy memoization
export const withMemo = (Component, compareFunction) => {
  const MemoizedComponent = React.memo(Component, compareFunction);
  MemoizedComponent.displayName = `Memo(${Component.displayName || Component.name})`;
  return MemoizedComponent;
};
