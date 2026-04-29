// ====================
// type.admin.ts
// Tipos para el panel de admin y seller.
// Más campos que los públicos, pero igualmente serializables.
// ====================

import { Role, RequestStatus, OrderStatus, PaymentMethod } from './type.models';

// --------------------
// USUARIOS (admin)
// --------------------

export type AdminUserView = {
  id: string;
  name: string;
  lastName: string | null;
  email: string;
  image: string | null;
  role: Role;
  documentType: string | null;
  documentNumber: string | null;
  phone: string | null;
  isBlocked: boolean;
  createdAt: string;        // ISO string
  totalOrders: number;
  sellerProfile: {
    storeName: string;
  } | null;
};

// --------------------
// SELLERS (admin)
// --------------------

export type AdminSellerView = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  isBlocked: boolean;
  storeName: string | null;
  description: string | null;
  logo: string | null;
  totalProducts: number;
  createdAt: string;        // ISO string
};

// --------------------
// SOLICITUDES DE SELLER (admin)
// --------------------

export type AdminSellerRequestView = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string | null;
  businessName: string | null;
  businessType: string | null;
  taxId: string;
  phone: string;
  address: string | null;
  experience: string | null;
  documents: unknown[];
  status: RequestStatus;
  createdAt: string;        // ISO string
  updatedAt: string;        // ISO string
};

// --------------------
// PRODUCTOS (seller/admin)
// --------------------

export type SellerProductView = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  isApproved: boolean;
  imageUrl: string | null;
  categoryId: number;
  supplierId: number | null;
  sellerId: string;
  createdAt: string;        // ISO string
  category: {
    id: number;
    name: string;
    slug: string;
  };
  variants: {
    id: number;
    type: string;
    value: string;
  }[];
};

// --------------------
// ÓRDENES (admin/seller)
// --------------------

export type AdminOrderView = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  paymentMethod: PaymentMethod | null;
  shippingAddress: string;
  receiptUrl: string | null;
  paymentReceiptUrl: string | null;
  createdAt: string;        // ISO string
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  items: AdminOrderItemView[];
};

export type AdminOrderItemView = {
  id: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    id: number;
    name: string;
    slug: string;
    imageUrl: string | null;
  };
  seller: {
    id: string;
    name: string;
  };
};

// Vista resumida para tablas/listas
export type AdminOrderSummary = Omit<AdminOrderView, 'items'> & {
  itemCount: number;
};

// --------------------
// ESTADÍSTICAS (admin dashboard)
// --------------------

export type AdminStats = {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingSellerRequests: number;
  pendingOrders: number;
};