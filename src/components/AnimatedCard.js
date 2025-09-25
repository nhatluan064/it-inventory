// src/components/AnimatedCard.js
import React, { useState } from 'react';

export const AnimatedCard = ({ 
  children, 
  className = "", 
  hoverEffect = "lift",
  delay = 0,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const hoverEffects = {
    lift: "hover:transform hover:-translate-y-2 hover:shadow-xl",
    scale: "hover:transform hover:scale-105",
    rotate: "hover:transform hover:rotate-1",
    glow: "hover:shadow-2xl hover:shadow-blue-500/25",
    flip: "hover:transform hover:rotateY-12",
    none: ""
  };

  return (
    <div
      className={`
        transition-all duration-300 ease-out
        ${hoverEffects[hoverEffect]}
        ${className}
      `}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </div>
  );
};

export const FlipCard = ({ frontContent, backContent, className = "" }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`group perspective-1000 ${className}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`
        relative w-full h-full transition-transform duration-700 preserve-3d
        ${isFlipped ? 'rotate-y-180' : ''}
      `}>
        {/* Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          {frontContent}
        </div>
        
        {/* Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          {backContent}
        </div>
      </div>
    </div>
  );
};

export const StaggeredCards = ({ children, staggerDelay = 100 }) => {
  return (
    <div className="space-y-4">
      {React.Children.map(children, (child, index) => (
        <div
          className="animate-slideInUp"
          style={{ 
            animationDelay: `${index * staggerDelay}ms`,
            animationFillMode: 'both'
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export const PulsingCard = ({ children, className = "", intensity = "normal" }) => {
  const intensities = {
    subtle: "animate-pulse",
    normal: "animate-breathe", 
    strong: "animate-bounce"
  };

  return (
    <div className={`${intensities[intensity]} ${className}`}>
      {children}
    </div>
  );
};

export const SlideInCard = ({ 
  children, 
  direction = "up", 
  delay = 0, 
  className = "" 
}) => {
  const directions = {
    up: "animate-slideInUp",
    down: "animate-slideInDown", 
    left: "animate-slideInLeft",
    right: "animate-slideInRight"
  };

  return (
    <div 
      className={`${directions[direction]} ${className}`}
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'both'
      }}
    >
      {children}
    </div>
  );
};

export const GlowCard = ({ 
  children, 
  glowColor = "blue", 
  intensity = "medium",
  className = "" 
}) => {
  const glowColors = {
    blue: "hover:shadow-blue-500/50",
    green: "hover:shadow-green-500/50", 
    red: "hover:shadow-red-500/50",
    purple: "hover:shadow-purple-500/50",
    yellow: "hover:shadow-yellow-500/50"
  };

  const intensities = {
    low: "hover:shadow-lg",
    medium: "hover:shadow-xl",
    high: "hover:shadow-2xl"
  };

  return (
    <div className={`
      transition-all duration-300 ease-out
      ${glowColors[glowColor]} ${intensities[intensity]}
      ${className}
    `}>
      {children}
    </div>
  );
};