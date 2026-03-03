import React, { createContext, useContext, useState, useCallback } from 'react';

const TransitionContext = createContext();

export const TransitionProvider = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = useCallback((callback, duration = 2500) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (callback && typeof callback === 'function') {
        callback();
      }
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, duration);
  }, []);

  return (
    <TransitionContext.Provider value={{ isTransitioning, triggerTransition }}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error('useTransition must be used within TransitionProvider');
  }
  return context;
};
