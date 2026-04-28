'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string, duration?: number) => void;
  error: (message: string, title?: string, duration?: number) => void;
  info: (message: string, title?: string, duration?: number) => void;
  warning: (message: string, title?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
  position?: ToastPosition;
  duration?: number;
  maxToasts?: number;
}

function ToastContainer({
  toasts,
  removeToast,
  position,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
  position: ToastPosition;
}) {
  const getPositionClasses = (): string => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 -translate-x-1/2';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 -translate-x-1/2';
      case 'bottom-right':
      default:
        return 'bottom-4 right-4';
    }
  };

  const getTypeStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          icon: CheckCircle,
          iconColor: 'text-emerald-500',
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: AlertCircle,
          iconColor: 'text-red-500',
        };
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          icon: AlertTriangle,
          iconColor: 'text-amber-500',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: Info,
          iconColor: 'text-blue-500',
        };
    }
  };

  return (
    <div className={`fixed z-50 flex flex-col gap-3 ${getPositionClasses()}`}>
      {toasts.map((toast) => {
        const styles = getTypeStyles(toast.type);
        const Icon = styles.icon;

        return (
          <div
            key={toast.id}
            className={`min-w-[320px] max-w-md bg-white rounded-xl shadow-lg border ${styles.border} overflow-hidden animate-in slide-in-from-right fade-in duration-300`}
            role="alert"
          >
            <div className={`px-4 py-3 ${styles.bg}`}>
              <div className="flex items-start gap-3">
                <div className="shrink-0">
                  <Icon className={`w-5 h-5 ${styles.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  {toast.title && (
                    <p className={`text-sm font-semibold ${styles.text}`}>{toast.title}</p>
                  )}
                  <p
                    className={`text-sm ${styles.text} ${!toast.title ? 'font-medium' : 'opacity-90'}`}
                  >
                    {toast.message}
                  </p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Barra de progreso */}
            <div
              className="h-1 bg-linear-to-r from-current to-current opacity-20"
              style={{
                width: '100%',
                animation: `shrink ${(toast.duration || 3000) / 1000}s linear forwards`,
                transformOrigin: 'left',
              }}
            />
          </div>
        );
      })}

      <style jsx>{`
        @keyframes shrink {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
        .animate-in {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

export function ToastProvider({
  children,
  position = 'bottom-right',
  duration = 3000,
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration: toastDuration }: Omit<Toast, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: Toast = {
        id,
        type,
        title,
        message,
        duration: toastDuration || duration,
      };

      setToasts((prev) => {
        const newToasts = [newToast, ...prev];
        return newToasts.slice(0, maxToasts);
      });

      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    },
    [duration, maxToasts, removeToast],
  );

  const success = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast({ type: 'success', title, message, duration });
    },
    [showToast],
  );

  const error = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast({ type: 'error', title, message, duration });
    },
    [showToast],
  );

  const info = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast({ type: 'info', title, message, duration });
    },
    [showToast],
  );

  const warning = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast({ type: 'warning', title, message, duration });
    },
    [showToast],
  );

  const value = {
    showToast,
    removeToast,
    success,
    error,
    info,
    warning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} position={position} />
    </ToastContext.Provider>
  );
}
