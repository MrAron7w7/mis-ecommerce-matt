'use client';

import { Menu, Search, Bell } from 'lucide-react';

interface SessionUser {
  name: string;
  email: string;
  image?: string | null;
  role?: string;
}

interface SellerHeaderProps {
  onOpenMobileSidebar: () => void;
  user: SessionUser;
}

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrador',
  SELLER: 'Vendedor',
  USER: 'Usuario',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function SellerHeader({ onOpenMobileSidebar, user }: SellerHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenMobileSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-2 w-80 border border-transparent focus-within:border-emerald-300 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Buscar productos, pedidos..."
              className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</p>
              <p className="text-xs text-gray-500">{roleLabels[user.role ?? ''] ?? 'Usuario'}</p>
            </div>
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="w-9 h-9 bg-linear-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white text-sm font-semibold">{getInitials(user.name)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-transparent focus-within:border-emerald-300 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>
    </header>
  );
}
