import {
  LayoutDashboard,
  Package,
  Tags,
  CreditCard,
  Truck,
  Users,
  Settings,
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
  { name: 'Productos', path: '/admin/productos', icon: Package, badge: '128' },
  { name: 'Categorías', path: '/admin/categorias', icon: Tags, badge: null },
];

export const managementNavItems: NavItem[] = [
  { name: 'Pedidos', path: '/admin/pedidos', icon: CreditCard, badge: '12' },
  { name: 'Envíos', path: '/admin/envios', icon: Truck, badge: null },
  { name: 'Clientes', path: '/admin/clientes', icon: Users, badge: null },
  { name: 'Configuración', path: '/admin/configuracion', icon: Settings, badge: null },
];

export const allNavItems: NavItem[] = [...primaryNavItems, ...managementNavItems];