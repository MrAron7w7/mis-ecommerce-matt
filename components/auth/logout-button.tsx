'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutAction } from '@/actions/auth/auth.action';

type LogoutButtonProps = {
  onSuccess?: () => void;
};

export default function LogoutButton({ onSuccess }: LogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    const result = await logoutAction();

    if (result.error) {
      setIsLoading(false);
      return;
    }

    onSuccess?.();
    router.push('/');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 font-medium"
    >
      {isLoading ? 'Cerrando...' : 'Cerrar sesión'}
    </button>
  );
}
