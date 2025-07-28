import React, { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  useEffect(() => {
    // Auto-remove toasts (handled in store, but this ensures cleanup)
    const timers = toasts.map(toast => 
      setTimeout(() => removeToast(toast.id), toast.duration || 5000)
    );

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [toasts, removeToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`max-w-sm rounded-lg shadow-lg border p-4 ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400'
              : toast.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400'
              : 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};