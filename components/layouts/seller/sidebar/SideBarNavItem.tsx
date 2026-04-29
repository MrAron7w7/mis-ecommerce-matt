import Link from 'next/link';
import type { NavItem } from './nav-config';

interface NavItemProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
}

export function SidebarNavItem({ item, isActive, isCollapsed }: NavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.path}
      title={isCollapsed ? item.name : undefined}
      className={`
        relative flex items-center rounded-xl transition-all duration-200 group
        ${isCollapsed ? 'justify-center p-3' : 'px-4 py-2.5 gap-3'}
        ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-100'}
      `}
    >
      {/* Indicador activo */}
      {isActive && !isCollapsed && (
        <span className="absolute left-0 w-1 h-8 bg-emerald-600 rounded-r-full" />
      )}

      <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-emerald-600' : 'text-gray-500'}`} />

      {!isCollapsed && (
        <>
          <span className="flex-1 font-medium text-sm">{item.name}</span>
          {item.badge && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
              {item.badge}
            </span>
          )}
        </>
      )}

      {/* Tooltip al colapsar */}
      {isCollapsed && (
        <span
          className="
          absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-md
          whitespace-nowrap opacity-0 pointer-events-none
          group-hover:opacity-100 transition-opacity duration-150 z-50
        "
        >
          {item.name}
          {item.badge && (
            <span className="ml-1.5 bg-emerald-500 text-white text-xs px-1.5 rounded-full">
              {item.badge}
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
