'use client';

import { useState } from 'react';
import AuthModal from './authModal';
import { User } from 'lucide-react';

export default function UserMenu({ session }: any) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<'switch' | 'logout'>('switch');

  const handleOpenModal = () => {
    // lógica clara:
    // si hay sesión → logout
    // si no hay sesión → login
    setAction(session ? 'logout' : 'switch');
    setOpen(true);
  };

  return (
    <>
      {/* USER BUTTON */}
      <button
        onClick={handleOpenModal}
        className="flex items-center gap-2 hover:opacity-70 transition"
      >
        <User size={20} />

        {session?.user?.name && (
          <span className="hidden md:block text-xs">{session.user.name}</span>
        )}
      </button>

      {/* MODAL */}
      <AuthModal open={open} setOpen={setOpen} action={action} />
    </>
  );
}
