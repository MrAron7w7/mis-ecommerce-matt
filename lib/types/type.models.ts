/* eslint-disable @typescript-eslint/no-explicit-any */
// ====================
// type.models.ts
// Espejo exacto del schema de Prisma.
// USO INTERNO ÚNICAMENTE — solo en server actions y queries de Prisma.
// Nunca importar en componentes 'use client'.
// ====================

// ====================
// ENUMS
// ====================

export type Role = 'USER' | 'SELLER' | 'ADMIN';

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'YAPE' | 'PLIN';

export type DocumentType = 'DNI' | 'RUC' | 'CE' | 'PASAPORTE';

// ====================
// BETTER AUTH TABLES
// ====================

export type User = {
  id: string;
  name: string;
  lastName: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: Role;
  documentType: DocumentType | null;
  documentNumber: string | null;
  phone: string | null;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones opcionales (solo presentes si se hace include/select)
  sessions?: Session[];
  accounts?: Account[];
  reviews?: Review[];
  carts?: Cart[];
  orders?: Order[];
  products?: Product[];        // SellerProducts
  sellerProfile?: SellerProfile | null;
  sellerRequests?: SellerRequest[];
  orderItems?: OrderItem[];    // SellerOrderItems
};

export type Session = {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;

  // Relaciones
  user?: User;
};

export type Account = {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: Date | null;
  refreshTokenExpiresAt: Date | null;
  scope: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  user?: User;
};

export type Verification = {
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

// ====================
// SELLER SYSTEM
// ====================

export type SellerProfile = {
  id: string;
  userId: string;
  storeName: string;
  description: string | null;
  logo: string | null;
  coverImage: string | null;


  email:   string | null;
  phone :  string | null;
  address: string | null;
  website :string | null;

  socialMedia:   any | null;
  businessHours: any | null;


  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  user?: User;
};

export type SellerRequest = {
  id: string;
  userId: string;
  status: RequestStatus;
  businessName: string | null;
  businessType: string | null;
  address: string | null;
  message: string | null;
  taxId: string;
  phone: string;
  experience: string | null;
  documents: any | null;       // Json de Prisma
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  user?: User;
};

// ====================
// CATALOG
// ====================

export type Category = {
  id: bigint;
  name: string;
  slug: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  products?: Product[];
  _count?: {
    products: number;
  };
};

export type Supplier = {
  id: bigint;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  products?: Product[];
};

export type Product = {
  id: bigint;
  name: string;
  slug: string;
  description: string | null;
  price: any;                  // Prisma Decimal — usar Number() al serializar
  stock: number;
  isActive: boolean;
  isApproved: boolean;
  imageUrl: string | null;
  categoryId: bigint;
  supplierId: bigint | null;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  category?: Category;
  supplier?: Supplier | null;
  seller?: User;
  variants?: ProductVariant[];
  reviews?: Review[];
  cartItems?: CartItem[];
  orderItems?: OrderItem[];
  _count?: {
    reviews: number;
    cartItems: number;
    orderItems: number;
    variants: number;
  };
};

export type ProductVariant = {
  id: bigint;
  type: string;
  value: string;
  productId: bigint;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  product?: Product;
};

// ====================
// REVIEWS
// ====================

export type Review = {
  id: bigint;
  userId: string;
  productId: bigint;
  rating: number;
  comment: string | null;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  user?: User;
  product?: Product;
};

// ====================
// CART
// ====================

export type Cart = {
  id: bigint;
  userId: string;
  total: any;                  // Prisma Decimal
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  user?: User;
  items?: CartItem[];
};

export type CartItem = {
  id: bigint;
  cartId: bigint;
  productId: bigint;
  quantity: number;
  unitPrice: any;              // Prisma Decimal
  totalPrice: any;             // Prisma Decimal
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  cart?: Cart;
  product?: Product;
};

// ====================
// ORDERS
// ====================

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  total: any;                  // Prisma Decimal
  shippingAddress: string;
  paymentMethod: PaymentMethod | null;
  receiptUrl: string | null;
  paymentReceiptUrl: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  user?: User;
  items?: OrderItem[];
};

export type OrderItem = {
  id: bigint;
  orderId: string;
  productId: bigint;
  quantity: number;
  unitPrice: any;              // Prisma Decimal
  totalPrice: any;             // Prisma Decimal
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;

  // Relaciones
  order?: Order;
  product?: Product;
  seller?: User;
};

// ====================
// TIPOS COMPUESTOS (con relaciones populadas)
// Para tipar el resultado de queries con include
// ====================

export type UserWithProfile = User & {
  sellerProfile: SellerProfile | null;
  sellerRequests: SellerRequest[];
};

export type UserWithCounts = User & {
  _count: {
    products: number;
    orders: number;
    reviews: number;
  };
};

export type ProductWithRelations = Product & {
  category: Category;
  supplier: Supplier | null;
  seller: User;
  variants: ProductVariant[];
  reviews: Review[];
};

export type ProductWithCounts = Product & {
  _count: {
    reviews: number;
    cartItems: number;
    orderItems: number;
    variants: number;
  };
};

export type CategoryWithCounts = Category & {
  _count: {
    products: number;
  };
};

export type OrderWithItems = Order & {
  user: User;
  items: (OrderItem & {
    product: Product;
    seller: User;
  })[];
};

export type CartWithItems = Cart & {
  user: User;
  items: (CartItem & {
    product: Product;
  })[];
};

// ====================
// RESULTADO DE ACTIONS
// Tipo genérico para retorno de server actions
// ====================

export type ActionResult<T = null> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };