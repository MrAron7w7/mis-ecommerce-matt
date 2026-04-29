/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  User,
  Settings,
  ShoppingBag,
  Heart,
  LogOut,
  LayoutDashboard,
  Package,
  BarChart3,
  Truck,
  Users,
} from 'lucide-react';

type User = {
  id?: string;
  name?: string;
  email?: string;
  role?: 'USER' | 'SELLER' | 'ADMIN';
  image?: string;
};

type UserDropdownProps = {
  user: User;
  onClose: () => void;
  onLogout: () => void;
};

export default function UserDropdown({ user, onClose, onLogout }: UserDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Cerrar con ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const userRole = user.role || 'USER';

  // Opciones comunes para todos los usuarios
  const commonLinks = [
    { href: '/perfil', label: 'Mi Perfil', icon: User },
    { href: '/mis-compras', label: 'Mis Compras', icon: ShoppingBag },
    { href: '/favoritos', label: 'Favoritos', icon: Heart },
    { href: '/configuracion', label: 'Configuración', icon: Settings },
  ];

  // Opciones específicas según el rol
  const roleLinks = {
    USER: [] as { href: string; label: string; icon: any }[],

    SELLER: [
      { href: '/seller/', label: 'Dashboard Vendedor', icon: LayoutDashboard },
      { href: '/seller/productos', label: 'Mis Productos', icon: Package },
      { href: '/seller/ventas', label: 'Mis Ventas', icon: BarChart3 },
      { href: '/seller/ordenes', label: 'Órdenes', icon: Truck },
    ],

    ADMIN: [
      { href: '/admin/', label: 'Dashboard Admin', icon: LayoutDashboard },
      { href: '/admin/usuarios', label: 'Usuarios', icon: Users },
      { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
    ],
  };

  const getRoleBadge = () => {
    switch (userRole) {
      case 'ADMIN':
        return { text: 'Administrador', className: 'bg-purple-100 text-purple-700' };
      case 'SELLER':
        return { text: 'Vendedor', className: 'bg-blue-100 text-blue-700' };
      default:
        return { text: 'Cliente', className: 'bg-gray-100 text-gray-700' };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <>
      {/* Overlay para cerrar en móvil */}
      <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose} />

      <div
        ref={dropdownRef}
        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      >
        {/* Header del usuario */}
        <div className="p-4 bg-linear-to-r from-gray-50 to-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center">
              <span className="text-lg font-medium">
                {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user.name || 'Usuario'}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <span
                className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${roleBadge.className}`}
              >
                {roleBadge.text}
              </span>
            </div>
          </div>
        </div>

        {/* Links comunes */}
        <div className="py-2">
          {commonLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <link.icon size={18} className="text-gray-400" />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Separador si hay links de rol */}
        {roleLinks[userRole].length > 0 && (
          <>
            <div className="border-t border-gray-100">
              <div className="px-4 py-2">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Panel de {userRole === 'ADMIN' ? 'Administrador' : 'Vendedor'}
                </p>
              </div>
              {roleLinks[userRole].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <link.icon size={18} className="text-gray-400" />
                  {link.label}
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Separador y botón de logout */}
        <div className="border-t border-gray-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
}
