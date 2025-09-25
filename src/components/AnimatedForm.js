// src/components/AnimatedForm.js
import React, { useState } from 'react';
import { Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react';

export const AnimatedInput = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  error = null,
  success = false,
  placeholder,
  icon: Icon = null,
  className = "",
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className={`
          block text-sm font-medium mb-2 transition-colors duration-200
          ${error ? 'text-red-600 dark:text-red-400' : 
            success ? 'text-green-600 dark:text-green-400' :
            'text-gray-700 dark:text-gray-300'}
        `}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon className={`
            absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-200
            ${error ? 'text-red-500' : 
              success ? 'text-green-500' :
              isFocused ? 'text-blue-500' : 'text-gray-400'}
          `} />
        )}
        
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 border-2 rounded-lg transition-all duration-200
            ${Icon ? 'pl-12' : 'pl-4'}
            ${type === "password" ? 'pr-12' : 'pr-4'}
            ${error ? 
              'border-red-500 bg-red-50 dark:bg-red-900/20 focus:border-red-600 focus:ring-red-500/20' :
              success ?
              'border-green-500 bg-green-50 dark:bg-green-900/20 focus:border-green-600 focus:ring-green-500/20' :
              'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
            }
            dark:bg-gray-700 dark:text-white
            focus:outline-none focus:ring-4
            ${isFocused ? 'transform scale-[1.02]' : ''}
          `}
          {...props}
        />
        
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        
        {(success || error) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {success && <Check className="w-5 h-5 text-green-500 animate-bounce" />}
            {error && <X className="w-5 h-5 text-red-500 animate-shake" />}
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-2 flex items-center text-red-600 dark:text-red-400 text-sm animate-slideInUp">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
      
      {success && typeof success === 'string' && (
        <div className="mt-2 flex items-center text-green-600 dark:text-green-400 text-sm animate-slideInUp">
          <Check className="w-4 h-4 mr-1" />
          {success}
        </div>
      )}
    </div>
  );
};

export const AnimatedSelect = ({ 
  label, 
  value, 
  onChange, 
  options = [], 
  error = null,
  placeholder = "Chọn một tùy chọn...",
  className = "",
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className={`
          block text-sm font-medium mb-2 transition-colors duration-200
          ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}
        `}>
          {label}
        </label>
      )}
      
      <select
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 appearance-none
          ${error ? 
            'border-red-500 bg-red-50 dark:bg-red-900/20 focus:border-red-600' :
            'border-gray-300 dark:border-gray-600 focus:border-blue-500'
          }
          dark:bg-gray-700 dark:text-white
          focus:outline-none focus:ring-4 focus:ring-blue-500/20
          ${isFocused ? 'transform scale-[1.02]' : ''}
        `}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <div className="mt-2 flex items-center text-red-600 dark:text-red-400 text-sm animate-slideInUp">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export const AnimatedTextarea = ({ 
  label, 
  value, 
  onChange, 
  error = null,
  placeholder,
  rows = 3,
  className = "",
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className={`
          block text-sm font-medium mb-2 transition-colors duration-200
          ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}
        `}>
          {label}
        </label>
      )}
      
      <textarea
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 resize-none
          ${error ? 
            'border-red-500 bg-red-50 dark:bg-red-900/20 focus:border-red-600' :
            'border-gray-300 dark:border-gray-600 focus:border-blue-500'
          }
          dark:bg-gray-700 dark:text-white
          focus:outline-none focus:ring-4 focus:ring-blue-500/20
          ${isFocused ? 'transform scale-[1.02]' : ''}
        `}
        {...props}
      />
      
      {error && (
        <div className="mt-2 flex items-center text-red-600 dark:text-red-400 text-sm animate-slideInUp">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export const AnimatedCheckbox = ({ 
  label, 
  checked, 
  onChange, 
  className = "",
  ...props 
}) => {
  return (
    <label className={`
      flex items-center cursor-pointer group ${className}
    `}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
          {...props}
        />
        <div className={`
          w-5 h-5 border-2 rounded transition-all duration-200
          ${checked ? 
            'bg-blue-600 border-blue-600 scale-110' : 
            'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 group-hover:border-blue-500'
          }
        `}>
          {checked && (
            <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5 animate-bounce" />
          )}
        </div>
      </div>
      
      {label && (
        <span className="ml-3 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200">
          {label}
        </span>
      )}
    </label>
  );
};

export const FormStep = ({ 
  children, 
  isActive, 
  direction = "forward",
  className = "" 
}) => {
  return (
    <div className={`
      transition-all duration-500 ease-out
      ${isActive ? 
        'opacity-100 translate-x-0' : 
        direction === 'forward' ? 
          'opacity-0 translate-x-8' : 
          'opacity-0 -translate-x-8'
      }
      ${className}
    `}>
      {children}
    </div>
  );
};