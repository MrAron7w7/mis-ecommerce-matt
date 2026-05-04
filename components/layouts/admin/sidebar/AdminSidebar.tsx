'use client';

import { Store, Menu, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { primaryNavItems, managementNavItems } from './nav-config';
import { SidebarNavItem } from './SidebarNavItem';
import { LogoutModal } from '@/components/ui/logout-modal';
import Link from 'next/link';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function AdminSidebar({ isCollapsed, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>
      <aside
        className={`
          hidden lg:flex lg:flex-col fixed inset-y-0 left-0 z-40
          bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-72'}
        `}
      >
        {/* Logo */}
        <Link href={'/'}>
          <div className={`shrink-0 p-5 border-b border-gray-200 ${isCollapsed ? 'px-3' : ''}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
              <div className="w-10 h-10 bg-linear-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <Store className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <span className="text-lg font-bold text-gray-900 block leading-tight">
                    Panel de administración
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Principal */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                Principal
              </p>
            )}
            {primaryNavItems.map((item) => (
              <SidebarNavItem
                key={item.path}
                item={item}
                isActive={pathname === item.path}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>

          {/* Gestión */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                Gestión
              </p>
            )}
            {managementNavItems.map((item) => (
              <SidebarNavItem
                key={item.name}
                item={item}
                isActive={pathname === item.path}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="shrink-0 p-4 border-t border-gray-200 space-y-1">
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`
              flex items-center gap-3 px-3 py-2 w-full rounded-lg
              text-red-500 hover:bg-red-50 transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? 'Cerrar sesión' : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="font-medium text-sm">Cerrar sesión</span>}
          </button>

          <button
            onClick={onToggleCollapse}
            className={`
              flex items-center gap-3 px-3 py-2 w-full rounded-lg
              text-gray-600 hover:bg-gray-100 transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? 'Expandir menú' : undefined}
          >
            <Menu className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="font-medium text-sm">Colapsar menú</span>}
          </button>
        </div>
      </aside>

      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
    </>
  );
}
