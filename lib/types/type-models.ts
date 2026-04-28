/* eslint-disable @typescript-eslint/no-explicit-any */
export enum Role {
  USER = "USER",
  SELLER = "SELLER",
  ADMIN = "ADMIN"
}

export enum RequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

export enum PaymentMethod {
  YAPE = "YAPE",
  PLIN = "PLIN"
}

export enum DocumentType {
  DNI = "DNI",
  RUC = "RUC",
  CE = "CE",
  PASAPORTE = "PASAPORTE"
}


export interface User {
  id: string
  name: string
  lastName?: string
  email: string
  emailVerified: boolean
  isBlocked: boolean
  image?: string
  role: Role

  documentType?: DocumentType
  documentNumber?: string
  phone?: string

  createdAt: Date
  updatedAt: Date

  // relations
  sellerProfile?: SellerProfile
  products?: Product[]
}

export interface SellerProfile {
  id: string
  userId: string
  storeName: string
  description?: string
  logo?: string

  createdAt: Date
  updatedAt: Date

  user?: User
}

export interface SellerRequest {
  id: string
  userId: string
  status: RequestStatus
  message?: string
  documents?: string

  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: number
  name: string
  slug: string
  description?: string
  price: number
  stock: number

  isActive: boolean
  isApproved: boolean

  imageUrl?: string

  categoryId: number
  supplierId?: number
  sellerId: string

  createdAt: Date
  updatedAt: Date

  // relations
  category?: Category
  supplier?: Supplier
  seller?: User
  variants?: ProductVariant[]
}

export interface Category {
  id: number
  name: string
  slug: string
  imageUrl?: string
  isActive: boolean

  createdAt: Date
  updatedAt: Date

  products?: Product[]
}

export interface Supplier {
  id: number
  name: string
  email?: string
  phone?: string
  address?: string
  isActive: boolean

  createdAt: Date
  updatedAt: Date

  products?: Product[]
}

export interface ProductVariant {
  id: number
  type: string
  value: string
  productId: number

  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: number
  userId: string
  productId: number
  rating: number
  comment?: string
  isVerified: boolean

  createdAt: Date
  updatedAt: Date

  user?: User
  product?: Product
}

export interface Cart {
  id: number
  userId: string
  total: number

  createdAt: Date
  updatedAt: Date

  items?: CartItem[]
}

export interface CartItem {
  id: number
  cartId: number
  productId: number
  quantity: number

  unitPrice: number
  totalPrice: number

  createdAt: Date
  updatedAt: Date

  product?: Product
}

export interface Order {
  id: string
  orderNumber: string
  userId: string

  status: OrderStatus
  total: number

  shippingAddress: string
  paymentMethod?: PaymentMethod

  receiptUrl?: string
  paymentReceiptUrl?: string

  createdAt: Date
  updatedAt: Date

  items?: OrderItem[]
}

export interface OrderItem {
  id: number
  orderId: string
  productId: number
  quantity: number

  unitPrice: number
  totalPrice: number

  sellerId: string

  createdAt: Date
  updatedAt: Date

  product?: Product
  seller?: User
}


///////////
// ADMIN //
//////////
export interface AdminUserView {
  id: string
  name: string
  email: string
  role: Role
  isBlocked: boolean
  createdAt: string
  location: string
  image: string | null
  totalOrders: number
  sellerProfile?: { storeName: string } | null
}

export type SellerRequestAdminView = {
  id: string
  userId: string

  userName: string
  userEmail: string
  userAvatar?: string | null

  businessName: string
  businessType: string
  taxId: string
  phone: string
  address: string

  documents: any[]

  status: 'pending' | 'approved' | 'rejected'

  submittedAt: string
  reviewedAt?: string

  experience?: string
  reviewNotes?: string
}