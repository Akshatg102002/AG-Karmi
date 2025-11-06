import React, { createContext, useState, ReactNode, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: number) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [idCounter, setIdCounter] = useState(0);

  const toast = useCallback((message: string, type: ToastType, duration?: number) => {
    setToasts(prevToasts => {
      const newToast: Toast = { id: idCounter, message, type, duration };
      return [...prevToasts, newToast];
    });
    setIdCounter(prev => prev + 1);
  }, [idCounter]);

  const removeToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const contextValue = {
    toasts,
    toast: (message: string, type: ToastType, duration?: number) => {
        toast(message, type, duration);
    },
    removeToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};
