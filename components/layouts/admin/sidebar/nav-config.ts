import {
  LayoutDashboard,
  Package,
  Tags,
  CreditCard,
  Users,
  BarChart3,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
  badge?: string | null;
}

export const primaryNavItems: NavItem[] = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, badge: null },
  
];

export const managementNavItems: NavItem[] = [
  { name: 'Usuarios', path: '/admin/usuarios', icon: Users, badge: null },
  { name: 'Solicitudes de vendedores', path: '/admin/vendedores', icon:  Users, badge: null },
  { name: 'Productos', path: '/admin/productos', icon: Package, badge: null },
  { name: 'Categorías', path: '/admin/categorias', icon: Tags, badge: null },
  { name: 'Pedidos', path: '/admin/pedidos', icon: BarChart3, badge: null },
  { name: 'Reportes', path: '/admin/categorias', icon:  CreditCard, badge: null },
];

export const allNavItems: NavItem[] = [...primaryNavItems, ...managementNavItems];