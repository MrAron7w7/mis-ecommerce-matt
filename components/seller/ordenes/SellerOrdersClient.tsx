'use client';

import { useState } from 'react';
import {
  ShoppingBag,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Package,
  User,
  CreditCard,
  Smartphone,
  Banknote,
  AlertCircle,
  Store,
} from 'lucide-react';
import Image from 'next/image';
import { updateOrderStatus } from '@/actions/seller/orders.seller.action';

type OrderStatus = 'PENDING' | 'PAID' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
type PaymentMethod = 'YAPE' | 'PLIN' | 'CARD' | 'CASH';
type DeliveryMethod = 'DELIVERY' | 'PICKUP';

type OrderItem = {
  id: string;
  productId: number;
  productName: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string | null;
  deliveryMethod: DeliveryMethod;
  pickupStore: string | null;
  status: OrderStatus;
  paymentMethod: PaymentMethod | null;
  paymentReceiptUrl: string | null;
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
};

type Props = {
  initialOrders?: Order[];
};

export default function SellerOrdersClient({ initialOrders = [] }: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: string; order: Order | null }>({
    type: '',
    order: null,
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 5;

  // Filtrar pedidos
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Paginación
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'PAID':
        return {
          label: 'Pagado',
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          icon: CheckCircle,
          nextStatus: 'CONFIRMED',
          nextAction: 'Confirmar pedido',
        };
      case 'CONFIRMED':
        return {
          label: 'Confirmado',
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: CheckCircle,
          nextStatus: 'SHIPPED',
          nextAction: 'Marcar como enviado',
        };
      case 'SHIPPED':
        return {
          label: 'Enviado',
          color: 'text-purple-600',
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          icon: Truck,
          nextStatus: 'DELIVERED',
          nextAction: 'Marcar como entregado',
        };
      case 'DELIVERED':
        return {
          label: 'Entregado',
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: CheckCircle,
          nextStatus: null,
          nextAction: null,
        };
      case 'PENDING':
        return {
          label: 'Pendiente',
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          icon: Clock,
          nextStatus: null,
          nextAction: null,
        };
      case 'CANCELLED':
        return {
          label: 'Cancelado',
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: XCircle,
          nextStatus: null,
          nextAction: null,
        };
      default:
        return {
          label: status,
          color: 'text-gray-500',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: AlertCircle,
          nextStatus: null,
          nextAction: null,
        };
    }
  };

  const getPaymentMethodConfig = (method: PaymentMethod | null) => {
    switch (method) {
      case 'YAPE':
        return {
          icon: Smartphone,
          label: 'Yape',
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          description: 'Pago vía Yape',
        };
      case 'PLIN':
        return {
          icon: Smartphone,
          label: 'Plin',
          color: 'text-purple-600',
          bg: 'bg-purple-50',
          description: 'Pago vía Plin',
        };
      case 'CARD':
        return {
          icon: CreditCard,
          label: 'Tarjeta',
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
          description: 'Pago con tarjeta',
        };
      case 'CASH':
        return {
          icon: Banknote,
          label: 'Efectivo',
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          description: 'Pago contra entrega',
        };
      default:
        return {
          icon: CreditCard,
          label: 'No especificado',
          color: 'text-gray-500',
          bg: 'bg-gray-50',
          description: 'Método no especificado',
        };
    }
  };

  const getDeliveryMethodConfig = (method: DeliveryMethod) => {
    if (method === 'DELIVERY') {
      return {
        icon: Truck,
        label: 'Delivery',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        description: 'Envío a domicilio',
      };
    }
    return {
      icon: Store,
      label: 'Recojo en tienda',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      description: 'Recoger en tienda',
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-PE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
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

  // Reemplaza el setTimeout mock por esto:
  const handleUpdateStatus = async () => {
    if (!confirmAction.order) return;
    setIsLoading(true);

    const statusConfig = getStatusConfig(confirmAction.order.status);
    if (!statusConfig.nextStatus) return;

    const result = await updateOrderStatus(
      confirmAction.order.id,
      statusConfig.nextStatus as 'CONFIRMED' | 'SHIPPED' | 'DELIVERED',
    );

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === confirmAction.order!.id
            ? {
                ...o,
                status: statusConfig.nextStatus as OrderStatus,
                updatedAt: new Date().toISOString(),
              }
            : o,
        ),
      );
      setMessage({
        type: 'success',
        text: `Pedido ${confirmAction.order.orderNumber} actualizado correctamente`,
      });
      if (selectedOrder?.id === confirmAction.order.id) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: statusConfig.nextStatus as OrderStatus } : null,
        );
      }
    }

    setTimeout(() => setMessage(null), 3000);
    setShowConfirmModal(false);
    setConfirmAction({ type: '', order: null });
    setIsLoading(false);
  };

  const openUpdateModal = (order: Order) => {
    setConfirmAction({ type: 'update_status', order });
    setShowConfirmModal(true);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    paid: orders.filter((o) => o.status === 'PAID').length,
    shipped: orders.filter((o) => o.status === 'SHIPPED').length,
    delivered: orders.filter((o) => o.status === 'DELIVERED').length,
  };

  const quickFilters = [
    { label: 'Todos', value: 'all', count: stats.total },
    { label: 'Pendientes', value: 'PENDING', count: stats.pending },
    { label: 'Pagados', value: 'PAID', count: stats.paid },
    { label: 'Enviados', value: 'SHIPPED', count: stats.shipped },
    { label: 'Entregados', value: 'DELIVERED', count: stats.delivered },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Mis pedidos</h1>
          </div>
          <p className="text-sm text-gray-500">Gestiona los pedidos de tus productos</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-500" />
              Pendientes
            </p>
            <p className="text-xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              Pagados
            </p>
            <p className="text-xl font-bold text-emerald-600">{stats.paid}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Truck className="w-3 h-3 text-blue-500" />
              Enviados
            </p>
            <p className="text-xl font-bold text-blue-600">{stats.shipped}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Entregados
            </p>
            <p className="text-xl font-bold text-green-600">{stats.delivered}</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {message.text}
            <button onClick={() => setMessage(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por número de pedido, cliente o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value as OrderStatus | 'all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === filter.value
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-white/20">
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-gray-700 font-semibold text-base mb-1">No hay pedidos</p>
              <p className="text-gray-400 text-sm">
                No se encontraron pedidos con los filtros aplicados
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase">
                        Pedido
                      </th>
                      <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase">
                        Cliente
                      </th>
                      <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase">
                        Total
                      </th>
                      <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase">
                        Entrega
                      </th>
                      <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase">
                        Pago
                      </th>
                      <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase">
                        Estado
                      </th>
                      <th className="px-6 py-3.5" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedOrders.map((order) => {
                      const statusConfig = getStatusConfig(order.status);
                      const StatusIcon = statusConfig.icon;
                      const paymentConfig = getPaymentMethodConfig(order.paymentMethod);
                      const PaymentIcon = paymentConfig.icon;
                      const deliveryConfig = getDeliveryMethodConfig(order.deliveryMethod);
                      const DeliveryIcon = deliveryConfig.icon;

                      return (
                        <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {order.items.length} producto(s)
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{order.customerName}</p>
                              <p className="text-xs text-gray-400">{order.customerEmail}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-emerald-600">
                              {formatCurrency(order.total)}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${deliveryConfig.bg} ${deliveryConfig.color}`}
                            >
                              <DeliveryIcon className="w-3 h-3" />
                              {deliveryConfig.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${paymentConfig.bg} ${paymentConfig.color}`}
                            >
                              <PaymentIcon className="w-3 h-3" />
                              {paymentConfig.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowModal(true);
                                }}
                                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Ver detalles"
                              >
                                <Eye className="w-4 h-4 text-gray-500" />
                              </button>
                              {statusConfig.nextAction && (
                                <button
                                  onClick={() => openUpdateModal(order)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition-colors"
                                >
                                  {statusConfig.nextAction}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg font-semibold text-sm transition-all ${
                          currentPage === page
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de detalles del pedido */}
      {showModal && selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Detalles del pedido</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Header del pedido */}
              <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Número de pedido</p>
                  <p className="text-lg font-bold text-gray-900">{selectedOrder.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Fecha</p>
                  <p className="text-sm text-gray-700">{formatDate(selectedOrder.createdAt)}</p>
                </div>
              </div>

              {/* Estado actual */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-2">Estado actual</p>
                <div className="flex items-center gap-2">
                  {(() => {
                    const statusConfig = getStatusConfig(selectedOrder.status);
                    const StatusIcon = statusConfig.icon;
                    return (
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig.label}
                      </span>
                    );
                  })()}
                  {getStatusConfig(selectedOrder.status).nextAction && (
                    <button
                      onClick={() => {
                        setShowModal(false);
                        openUpdateModal(selectedOrder);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
                    >
                      {getStatusConfig(selectedOrder.status).nextAction}
                    </button>
                  )}
                </div>
              </div>

              {/* Método de entrega */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-400" />
                  Método de entrega
                </h3>
                {(() => {
                  const deliveryConfig = getDeliveryMethodConfig(selectedOrder.deliveryMethod);
                  const DeliveryIcon = deliveryConfig.icon;
                  return (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <DeliveryIcon className={`w-4 h-4 ${deliveryConfig.color}`} />
                        <span className="font-medium text-gray-900">{deliveryConfig.label}</span>
                      </div>
                      {selectedOrder.deliveryMethod === 'DELIVERY' &&
                      selectedOrder.shippingAddress ? (
                        <div className="mt-2 p-3 bg-white rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Dirección de envío</p>
                          <p className="text-sm text-gray-700">{selectedOrder.shippingAddress}</p>
                        </div>
                      ) : selectedOrder.deliveryMethod === 'PICKUP' && selectedOrder.pickupStore ? (
                        <div className="mt-2 p-3 bg-white rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Punto de recojo</p>
                          <p className="text-sm text-gray-700">{selectedOrder.pickupStore}</p>
                        </div>
                      ) : null}
                    </div>
                  );
                })()}
              </div>

              {/* Método de pago */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  Método de pago
                </h3>
                {(() => {
                  const paymentConfig = getPaymentMethodConfig(selectedOrder.paymentMethod);
                  const PaymentIcon = paymentConfig.icon;
                  return (
                    <div>
                      <div className="flex items-center gap-2">
                        <PaymentIcon className={`w-4 h-4 ${paymentConfig.color}`} />
                        <span className="font-medium text-gray-900">{paymentConfig.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{paymentConfig.description}</p>

                      {(selectedOrder.paymentMethod === 'YAPE' ||
                        selectedOrder.paymentMethod === 'PLIN') && (
                        <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                          <p className="text-xs text-yellow-700 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Para pagos Yape/Plin, valida el comprobante antes de confirmar el pedido
                          </p>
                        </div>
                      )}

                      {selectedOrder.paymentMethod === 'CASH' && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-700 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Pago contra entrega - El cliente pagará al recibir el producto
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Productos */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Productos</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.productImage ? (
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            width={48}
                            height={48}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.productName}</p>
                        <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(item.totalPrice)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatCurrency(item.unitPrice)} c/u
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Información del cliente */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  Información del cliente
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Nombre</p>
                    <p className="text-gray-900">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-gray-900">{selectedOrder.customerEmail}</p>
                  </div>
                  {selectedOrder.customerPhone && (
                    <div>
                      <p className="text-xs text-gray-500">Teléfono</p>
                      <p className="text-gray-900">{selectedOrder.customerPhone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Resumen de pagos */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-emerald-600">
                    {formatCurrency(selectedOrder.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {showConfirmModal && confirmAction.order && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Confirmar acción</h2>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-700 mb-1">
                    ¿Estás seguro de marcar el pedido{' '}
                    <span className="font-semibold">{confirmAction.order.orderNumber}</span> como:
                  </p>
                  <p className="text-base font-semibold text-emerald-600">
                    {getStatusConfig(confirmAction.order.status).nextAction}
                  </p>
                  {confirmAction.order.status === 'PAID' && (
                    <p className="text-xs text-gray-500 mt-2">
                      Asegúrate de haber validado el comprobante de pago antes de confirmar.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Procesando...' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
