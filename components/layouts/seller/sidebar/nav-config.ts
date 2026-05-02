import {
  LayoutDashboard,
  Package,
  CreditCard,
  Truck,
  Users,
  Settings,
  Settings2,
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
  { name: 'Gestión de productos', path: '/seller/productos', icon: Package, badge: null },
  //{ name: 'Categorías', path: '/seller/categorias', icon: Tags, badge: null },
  { name: 'Órdenes', path: '/seller/ordenes', icon: CreditCard, badge: null },
  {
    name: 'Gestión de perfil de tienda',
    path: '/seller/gestion-perfil',
    icon: Settings2,
    badge: null,
  },
  //{ name: 'Solicitudes', path: '/seller/solicitudes', icon:  Send, badge: null },
];

export const managementNavItems: NavItem[] = [
  { name: 'Pedidos', path: '/seller/pedidos', icon: CreditCard, badge: '12' },
  { name: 'Envíos', path: '/seller/envios', icon: Truck, badge: null },
  { name: 'Clientes', path: '/seller/clientes', icon: Users, badge: null },
  { name: 'Configuración', path: '/seller/configuracion', icon: Settings, badge: null },
];

export const allNavItems: NavItem[] = [...primaryNavItems, ...managementNavItems];
