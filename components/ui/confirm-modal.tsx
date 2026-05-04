'use client';

import { useEffect } from 'react';
import { X, LogOut, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: 'danger' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
};

const iconConfig = {
  danger: {
    icon: LogOut,
    color: 'text-red-500',
    bg: 'bg-red-100',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-100',
  },
  info: {
    icon: AlertTriangle,
    color: 'text-blue-500',
    bg: 'bg-blue-100',
  },
  success: {
    icon: AlertTriangle,
    color: 'text-emerald-500',
    bg: 'bg-emerald-100',
  },
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar acción',
  message = '¿Estás seguro de que quieres realizar esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  icon = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  // Cerrar con Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, isLoading]);

  const IconComponent = iconConfig[icon].icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isLoading && onClose()}
            className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botón cerrar */}
              <button
                onClick={() => !isLoading && onClose()}
                disabled={isLoading}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition disabled:opacity-50 z-10"
              >
                <X size={20} />
              </button>

              {/* Contenido centrado */}
              <div className="p-8 text-center">
                {/* Ícono circular */}
                <div
                  className={`w-16 h-16 mx-auto mb-4 ${iconConfig[icon].bg} rounded-full flex items-center justify-center`}
                >
                  <IconComponent className={`w-8 h-8 ${iconConfig[icon].color}`} />
                </div>

                {/* Título */}
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>

                {/* Mensaje */}
                <p className="text-gray-500 mb-6">{message}</p>

                {/* Botones */}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`px-6 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2 ${
                      icon === 'danger'
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : icon === 'warning'
                          ? 'bg-amber-500 text-white hover:bg-amber-600'
                          : icon === 'success'
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      confirmText
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
