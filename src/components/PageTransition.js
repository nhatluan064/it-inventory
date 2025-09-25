// src/components/PageTransition.js
import React from 'react';

const PageTransition = ({ 
  children, 
  className = "",
  animationType = "slideUp", // slideUp, slideLeft, slideRight, zoom, flipX, flipY, fade
  duration = 600,
  enableStagger = false
}) => {
  const getAnimationClass = () => {
    // Simple, stable animation classes
    switch (animationType) {
      case "slideLeft":
        return "animate-slideInLeft";
      case "slideRight":
        return "animate-slideInRight";
      case "zoom":
        return "animate-zoomIn";
      case "flipX":
        return "animate-flipInX";
      case "flipY":
        return "animate-flipInY";
      case "fade":
        return "animate-fadeIn";
      default:
        return "animate-slideInUp";
    }
  };

  const getStaggerClass = () => {
    return enableStagger ? "stagger-fade-in" : "";
  };

  return (
    <div 
      className={`
        ${getAnimationClass()}
        ${getStaggerClass()}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      style={{
        animationDuration: `${duration}ms`,
        opacity: 1, // Ensure visibility
        transform: 'none' // Prevent transform conflicts
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;