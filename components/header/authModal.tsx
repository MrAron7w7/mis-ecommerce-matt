'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogoutButton } from '../auth/logout-button';

type AuthModalProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  action: 'switch' | 'logout';
};

export default function AuthModal({ open, setOpen, action }: AuthModalProps) {
  const router = useRouter();

  const isSwitch = action === 'switch';

  // ESC CLOSE
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setOpen]);

  // BLOCK SCROLL
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white p-8 rounded-2xl w-[420px] text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TITLE */}
        <h2 className="text-xl font-bold mb-2">{isSwitch ? 'Iniciar Sesión' : 'Cerrar sesión'}</h2>

        {/* DESCRIPTION */}
        <p className="text-gray-500 mb-6">
          {isSwitch ? 'Serás redirigido al login' : '¿Seguro que deseas cerrar sesión?'}
        </p>

        {/* ACTIONS */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            Cancelar
          </button>

          {isSwitch ? (
            <button
              onClick={() => router.push('/iniciar-sesion')}
              className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-80 transition"
            >
              Continuar
            </button>
          ) : (
            <LogoutButton onSuccess={() => setOpen(false)} />
          )}
        </div>
      </div>
    </div>
  );
}
