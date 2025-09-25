// src/components/AnimatedButton.js
import React from 'react';

export const AnimatedButton = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  loading = false, 
  icon = null,
  onClick,
  className = "",
  ...props 
}) => {
  const baseClasses = "relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 transform active:scale-95";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 hover:shadow-lg hover:-translate-y-0.5",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 hover:shadow-lg hover:-translate-y-0.5", 
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 hover:shadow-lg hover:-translate-y-0.5",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 hover:shadow-lg hover:-translate-y-0.5",
    warning: "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 hover:shadow-lg hover:-translate-y-0.5",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500",
    ghost: "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base", 
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl"
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        </div>
      )}
      
      <div className={`flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </div>
    </button>
  );
};

export const FloatingActionButton = ({ 
  children, 
  onClick, 
  position = "bottom-right",
  color = "blue",
  size = "md",
  className = "" 
}) => {
  const positions = {
    "bottom-right": "fixed bottom-6 right-6",
    "bottom-left": "fixed bottom-6 left-6", 
    "top-right": "fixed top-6 right-6",
    "top-left": "fixed top-6 left-6"
  };

  const colors = {
    blue: "bg-blue-600 hover:bg-blue-700 text-white",
    green: "bg-green-600 hover:bg-green-700 text-white",
    red: "bg-red-600 hover:bg-red-700 text-white",
    purple: "bg-purple-600 hover:bg-purple-700 text-white"
  };

  const sizes = {
    sm: "w-12 h-12",
    md: "w-14 h-14",
    lg: "w-16 h-16"
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${positions[position]} ${colors[color]} ${sizes[size]}
        rounded-full shadow-lg hover:shadow-xl
        transition-all duration-300 ease-out
        hover:scale-110 active:scale-95
        z-50 animate-bounce
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export const RippleButton = ({ children, onClick, className = "", ...props }) => {
  const handleClick = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.height, rect.width);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");
    
    const rippleContainer = button.querySelector(".ripple-container");
    rippleContainer.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
    
    if (onClick) onClick(e);
  };

  return (
    <button
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      {...props}
    >
      <div className="ripple-container absolute inset-0"></div>
      {children}
      <style jsx>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        }
        
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
};