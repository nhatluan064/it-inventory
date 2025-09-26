// src/components/LoadingStates/PostLoginLoader.js
import React, { useState, useEffect, useMemo } from "react";
import { Package, CheckCircle, Star, Sparkles } from "lucide-react";

const PostLoginLoader = ({ onComplete, t, user }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = useMemo(() => [
    { icon: CheckCircle, text: t('login_success'), duration: 1000 },
    { icon: Package, text: t('loading_inventory_system'), duration: 1500 },
    { icon: Star, text: t('preparing_dashboard'), duration: 1500 },
    { icon: Sparkles, text: t('almost_ready'), duration: 1000 }
  ], [t]);

  useEffect(() => {
    let progressTimer;
    let stepTimer;
    let totalDuration = 0;
    
    // Calculate total duration
    steps.forEach(step => totalDuration += step.duration);
    
    // Progress animation
    const startTime = Date.now();
    progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(progressTimer);
        setTimeout(onComplete, 300); // Small delay after 100%
      }
    }, 50);

    // Step animation
    let stepDuration = 0;
    steps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index);
      }, stepDuration);
      stepDuration += step.duration;
    });

    return () => {
      clearInterval(progressTimer);
      clearTimeout(stepTimer);
    };
  }, [onComplete, steps, t]);

  const CurrentIcon = steps[currentStep]?.icon || Package;

  return (
    <div className="post-login-loader">
      <div className="post-login-content">
        
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="post-login-bg-decoration post-login-bg-1"></div>
          <div className="post-login-bg-decoration post-login-bg-2"></div>
          <div className="post-login-bg-decoration post-login-bg-3"></div>
        </div>

        {/* Welcome Message */}
        <div className="post-login-welcome">
          <div className="post-login-avatar">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 post-login-avatar-pulse">
              <span className="text-white text-2xl font-bold">
                {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2 post-login-title-slide">
            {t('welcome_back')} {user?.displayName || t('user')}!
          </h1>
          
          <p className="text-blue-100 text-lg mb-8 post-login-subtitle-fade">
            {t('setting_up_your_workspace')}
          </p>
        </div>

        {/* Current Step Indicator */}
        <div className="post-login-step-indicator">
          <div className="post-login-step-icon">
            <CurrentIcon className="w-12 h-12 text-white post-login-icon-bounce" />
          </div>
          <p className="text-white text-lg font-medium mt-4 post-login-step-text">
            {steps[currentStep]?.text}
          </p>
        </div>

        {/* Progress Section */}
        <div className="post-login-progress-section">
          
          {/* Main Progress Bar */}
          <div className="post-login-progress-container">
            <div className="post-login-progress-track">
              <div 
                className="post-login-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Progress Text */}
          <div className="flex justify-between items-center mt-3 text-blue-200">
            <span className="text-sm">{Math.round(progress)}%</span>
            <span className="text-sm">{t('loading')}</span>
          </div>

          {/* Step Dots */}
          <div className="post-login-step-dots">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`post-login-step-dot ${
                  index <= currentStep ? 'post-login-step-dot-active' : 'post-login-step-dot-inactive'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="post-login-floating-elements">
          <Sparkles className="post-login-sparkle post-login-sparkle-1" />
          <Sparkles className="post-login-sparkle post-login-sparkle-2" />
          <Sparkles className="post-login-sparkle post-login-sparkle-3" />
          <Star className="post-login-star post-login-star-1" />
          <Star className="post-login-star post-login-star-2" />
        </div>

      </div>
    </div>
  );
};

export default PostLoginLoader;