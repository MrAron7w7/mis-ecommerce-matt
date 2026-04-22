'use client';

import { logoutAction } from '@/actions/auth/auth.action';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async (): Promise<void> => {
    setIsLoading(true);
    const result = await logoutAction();

    if (result.error) {
      setIsLoading(false);
      return;
    }

    router.push('/iniciar-sesion');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? 'Cerrando sesión...' : 'Cerrar sesión'}
    </button>
  );
}
