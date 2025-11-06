
import { useContext } from 'react';
import { ToastContext, ToastType } from '../context/ToastContext';

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  // FIX: Spread the full context to expose `toasts` and `removeToast` in addition to helper functions.
  return {
    ...context,
    success: (message: string, duration?: number) => context.toast(message, 'success', duration),
    error: (message: string, duration?: number) => context.toast(message, 'error', duration),
    info: (message: string, duration?: number) => context.toast(message, 'info', duration),
  };
};