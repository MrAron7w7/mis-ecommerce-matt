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
  { name: 'Dashboard', path: '/seller', icon: LayoutDashboard, badge: null },
  { name: 'Productos', path: '/seller/productos', icon: Package, badge: '128' },
  { name: 'Categorías', path: '/seller/categorias', icon: Tags, badge: null },
  { name: 'Órdenes', path: '/seller/ordenes', icon: CreditCard, badge: null },
];

export const managementNavItems: NavItem[] = [
  { name: 'Pedidos', path: '/seller/pedidos', icon: CreditCard, badge: '12' },
  { name: 'Envíos', path: '/seller/envios', icon: Truck, badge: null },
  { name: 'Clientes', path: '/seller/clientes', icon: Users, badge: null },
  { name: 'Configuración', path: '/seller/configuracion', icon: Settings, badge: null },
];

export const allNavItems: NavItem[] = [...primaryNavItems, ...managementNavItems];