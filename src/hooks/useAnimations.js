// src/hooks/useAnimations.js
import { useState, useEffect, useRef } from 'react';

// Hook for intersection observer animations
export const useInViewAnimation = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasAnimated, options]);

  return [ref, isInView];
};

// Hook for staggered animations
export const useStaggeredAnimation = (items = [], delay = 100) => {
  const [visibleItems, setVisibleItems] = useState(0);

  useEffect(() => {
    if (visibleItems < items.length) {
      const timer = setTimeout(() => {
        setVisibleItems(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [visibleItems, items.length, delay]);

  const reset = () => setVisibleItems(0);
  
  return { visibleItems, reset };
};

// Hook for hover animations
export const useHoverAnimation = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false)
  };

  return [isHovered, hoverProps];
};

// Hook for loading animations
export const useLoadingAnimation = (isLoading) => {
  const [showLoading, setShowLoading] = useState(isLoading);
  
  useEffect(() => {
    if (isLoading) {
      setShowLoading(true);
    } else {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 300); // Allow animation to complete

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return showLoading;
};

// Hook for page transitions
export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const startTransition = () => {
    setIsTransitioning(true);
    return new Promise(resolve => {
      setTimeout(() => {
        setIsTransitioning(false);
        resolve();
      }, 300);
    });
  };

  return { isTransitioning, startTransition };
};

// Hook for toast notifications
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      ...options
    };

    setToasts(prev => [...prev, toast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, options.duration || 4000);

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts
  };
};

// Hook for ripple effect
export const useRipple = () => {
  const [ripples, setRipples] = useState([]);

  const addRipple = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.height, rect.width);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = {
      id: Date.now(),
      x,
      y,
      size
    };

    setRipples(prev => [...prev, ripple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 600);
  };

  return { ripples, addRipple };
};

// Hook for animation delays
export const useAnimationDelay = (items = [], baseDelay = 0, increment = 100) => {
  const getDelay = (index) => baseDelay + (index * increment);
  
  const getDelayStyle = (index) => ({
    animationDelay: `${getDelay(index)}ms`
  });

  return { getDelay, getDelayStyle };
};