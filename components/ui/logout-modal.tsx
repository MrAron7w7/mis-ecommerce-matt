'use client';

import { ConfirmModal } from '@/components/ui/confirm-modal';
import { logoutAction } from '@/actions/auth/auth.action';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);

    const result = await logoutAction();

    if (!result.success) {
      // Si falla, dejar de cargar y cerrar igualmente
      console.error('Error al cerrar sesión:', result.error);
    }

    // Cerrar el modal primero, luego navegar
    setIsLoading(false);
    onClose();
    router.push('/');
    router.refresh(); // limpia el cache del router para que el navbar actualice la sesión
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleLogout}
      title="Cerrar sesión"
      message="¿Estás seguro de que quieres cerrar sesión?"
      confirmText="Cerrar sesión"
      cancelText="Cancelar"
      icon="danger"
      isLoading={isLoading}
    />
  );
}
