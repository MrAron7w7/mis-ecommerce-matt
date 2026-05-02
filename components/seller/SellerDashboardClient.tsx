/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
  Home,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  ShoppingCart,
  Users,
  Star,
  Clock,
  ChevronRight,
  Download,
  Calendar,
  Filter,
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: 'pending' | 'paid' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  items: number;
  paymentMethod: 'YAPE' | 'PLIN';
};

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  sales: number;
  image: string | null;
  status: 'active' | 'inactive';
  views: number;
};

export default function SellerDashboardClient() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Datos de ejemplo
  const stats = {
    totalSales: 12450,
    totalProducts: 156,
    totalOrders: 234,
    totalEarnings: 11205, // 90% de comisión (ejemplo)
    commissionRate: 10,
    salesGrowth: 12.5,
    ordersGrowth: 8.3,
    productsGrowth: 5.2,
    earningsGrowth: 11.8,
  };

  const recentOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      customerName: 'María González',
      customerEmail: 'maria@email.com',
      total: 1299.0,
      status: 'paid',
      createdAt: '2024-01-15T10:30:00',
      items: 2,
      paymentMethod: 'YAPE',
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      customerName: 'Carlos Rodríguez',
      customerEmail: 'carlos@email.com',
      total: 2499.0,
      status: 'shipped',
      createdAt: '2024-01-14T15:20:00',
      items: 1,
      paymentMethod: 'PLIN',
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      customerName: 'Ana Martínez',
      customerEmail: 'ana@email.com',
      total: 499.0,
      status: 'delivered',
      createdAt: '2024-01-13T09:45:00',
      items: 3,
      paymentMethod: 'YAPE',
    },
    {
      id: '4',
      orderNumber: 'ORD-004',
      customerName: 'Luis Fernández',
      customerEmail: 'luis@email.com',
      total: 799.0,
      status: 'pending',
      createdAt: '2024-01-12T14:00:00',
      items: 1,
      paymentMethod: 'PLIN',
    },
  ];

  const topProducts: Product[] = [
    {
      id: 1,
      name: 'Smartphone XYZ Pro',
      price: 1299.0,
      stock: 45,
      sales: 28,
      image: null,
      status: 'active',
      views: 1240,
    },
    {
      id: 2,
      name: 'Laptop Ultrabook',
      price: 2499.0,
      stock: 12,
      sales: 15,
      image: null,
      status: 'active',
      views: 890,
    },
    {
      id: 3,
      name: 'Auriculares Bluetooth',
      price: 89.9,
      stock: 120,
      sales: 67,
      image: null,
      status: 'active',
      views: 2340,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return {
          label: 'Pagado',
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
          icon: CheckCircle,
        };
      case 'shipped':
        return { label: 'Enviado', color: 'text-blue-600', bg: 'bg-blue-50', icon: Truck };
      case 'delivered':
        return {
          label: 'Entregado',
          color: 'text-green-600',
          bg: 'bg-green-50',
          icon: CheckCircle,
        };
      case 'pending':
        return { label: 'Pendiente', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock };
      case 'cancelled':
        return { label: 'Cancelado', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle };
      default:
        return { label: status, color: 'text-gray-500', bg: 'bg-gray-50', icon: AlertCircle };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-PE', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Resumen de tu actividad como vendedor</p>
        </div>

        {/* Acciones rápidas */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6">
          <Link
            href="/seller/productos/nuevo"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all group"
          >
            <div>
              <p className="font-medium text-gray-900">Agregar producto</p>
              <p className="text-xs text-gray-500 mt-0.5">Publica un nuevo producto</p>
            </div>
            <Package className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          </Link>

          <Link
            href="/seller/ventas"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all group"
          >
            <div>
              <p className="font-medium text-gray-900">Reporte de ventas</p>
              <p className="text-xs text-gray-500 mt-0.5">Descarga tus ventas</p>
            </div>
            <Download className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          </Link>

          <Link
            href="/seller/gestion-perfil"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all group"
          >
            <div>
              <p className="font-medium text-gray-900">Configurar tienda</p>
              <p className="text-xs text-gray-500 mt-0.5">Actualiza tu perfil</p>
            </div>
            <Settings className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
          </Link>
        </div>

        {/* Period Selector */}
        <div className="flex justify-end mb-6">
          <div className="flex gap-1 bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                period === 'week' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                period === 'month' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Mes
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                period === 'year' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Año
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Total Ventas */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
              </div>
              <span
                className={`text-sm font-medium flex items-center gap-1 ${stats.salesGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {stats.salesGrowth >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stats.salesGrowth}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSales)}</p>
            <p className="text-xs text-gray-500 mt-1">Ventas totales</p>
          </div>

          {/* Productos Publicados */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <span
                className={`text-sm font-medium flex items-center gap-1 ${stats.productsGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {stats.productsGrowth >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stats.productsGrowth}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            <p className="text-xs text-gray-500 mt-1">Productos publicados</p>
          </div>

          {/* Pedidos */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
              </div>
              <span
                className={`text-sm font-medium flex items-center gap-1 ${stats.ordersGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {stats.ordersGrowth >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stats.ordersGrowth}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            <p className="text-xs text-gray-500 mt-1">Pedidos recibidos</p>
          </div>

          {/* Ganancias */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
              <span
                className={`text-sm font-medium flex items-center gap-1 ${stats.earningsGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {stats.earningsGrowth >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stats.earningsGrowth}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.totalEarnings)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Ganancias netas ({stats.commissionRate}% comisión)
            </p>
          </div>
        </div>

        {/* Comisión Info */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-5 mb-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-white/80">Comisión actual</p>
              <p className="text-2xl font-bold">{stats.commissionRate}%</p>
              <p className="text-xs text-white/70 mt-1">
                Pagas {stats.commissionRate}% de comisión por cada venta
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">Próximo pago estimado</p>
              <p className="text-xl font-bold">15 de febrero, 2024</p>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pedidos recientes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">Pedidos recientes</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Últimos pedidos recibidos</p>
                </div>
                <Link
                  href="/seller/pedidos"
                  className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  Ver todos
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {recentOrders.map((order) => {
                  const StatusIcon = getStatusBadge(order.status).icon;
                  const statusInfo = getStatusBadge(order.status);
                  return (
                    <div key={order.id} className="px-6 py-4 hover:bg-gray-50/60 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">
                              {order.orderNumber}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusInfo.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{order.customerName}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-400">
                            <span>{order.items} producto(s)</span>
                            <span>{order.paymentMethod}</span>
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(order.total)}
                          </p>
                          <button className="mt-1 text-xs text-emerald-600 hover:text-emerald-700">
                            Ver detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Productos más vendidos */}
          <div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Top productos</h2>
                <p className="text-xs text-gray-500 mt-0.5">Los más vendidos</p>
              </div>

              <div className="divide-y divide-gray-100">
                {topProducts.map((product) => (
                  <div key={product.id} className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/seller/productos/${product.id}`}
                          className="font-medium text-gray-900 hover:text-emerald-600 text-sm line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs">
                          <span className="text-gray-500">{product.sales} ventas</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">{product.views} vistas</span>
                          <span className="text-gray-400">•</span>
                          <span className="font-semibold text-emerald-600">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                <Link
                  href="/seller/productos"
                  className="flex items-center justify-between text-sm text-gray-600 hover:text-emerald-600"
                >
                  <span>Ver todos los productos</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Resumen rápido de productos */}
            <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Estado de productos</h3>
                <Eye className="w-4 h-4 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Activos</span>
                  <span className="font-semibold text-gray-900">142</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Inactivos</span>
                  <span className="font-semibold text-gray-900">14</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Próximos a agotarse</span>
                  <span className="font-semibold text-amber-600">5</span>
                </div>
                <div className="pt-3 mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '91%' }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">91% de productos activos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icono Settings (si no está importado)
const Settings = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.05.06A10 10 0 0 0 12 19.2a10 10 0 0 0 6.8-2.8l.05-.06z" />
    <path d="M4.6 9a1.65 1.65 0 0 0-.33 1.82c.26.61.85 1 1.51 1h12.44c.66 0 1.25-.39 1.51-1 .26-.61.13-1.3-.33-1.82L19.4 7a10 10 0 0 0-6.8-2.8A10 10 0 0 0 5.78 7z" />
  </svg>
);
