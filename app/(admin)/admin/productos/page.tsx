'use client';

import { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  AlertCircle,
  Store,
  Clock,
  RefreshCw,
  Image as ImageIcon,
  Tag,
} from 'lucide-react';

type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  stock: number;
  isActive: boolean;
  isApproved: boolean; // Para moderación
  imageUrl: string | null;
  categoryId: number;
  sellerId: number;
  sellerName: string;
  sellerEmail: string;
  category: { name: string };
  createdAt: string;
  variants: Array<{ id: number; type: string; value: string }>;
  rejectionReason?: string;
};

// Datos de ejemplo
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Smartphone XYZ Pro',
    slug: 'smartphone-xyz-pro',
    description: 'Teléfono inteligente con cámara de 108MP',
    price: '1299.00',
    stock: 45,
    isActive: true,
    isApproved: true,
    imageUrl: null,
    categoryId: 1,
    sellerId: 101,
    sellerName: 'María González',
    sellerEmail: 'maria.gonzalez@email.com',
    category: { name: 'Electrónica' },
    createdAt: '2024-01-15T10:30:00',
    variants: [],
  },
  {
    id: 2,
    name: 'Laptop Ultrabook',
    slug: 'laptop-ultrabook',
    description: 'Laptop de última generación con 16GB RAM',
    price: '2499.00',
    stock: 12,
    isActive: true,
    isApproved: false,
    imageUrl: null,
    categoryId: 1,
    sellerId: 102,
    sellerName: 'Carlos Rodríguez',
    sellerEmail: 'carlos.rodriguez@email.com',
    category: { name: 'Electrónica' },
    createdAt: '2024-01-18T14:20:00',
    variants: [],
  },
  {
    id: 3,
    name: 'Camiseta Deportiva',
    slug: 'camiseta-deportiva',
    description: 'Camiseta transpirable para running',
    price: '49.90',
    stock: 0,
    isActive: false,
    isApproved: true,
    imageUrl: null,
    categoryId: 2,
    sellerId: 101,
    sellerName: 'María González',
    sellerEmail: 'maria.gonzalez@email.com',
    category: { name: 'Ropa' },
    createdAt: '2024-01-10T09:15:00',
    variants: [],
  },
  {
    id: 4,
    name: 'Producto No Aprobado',
    slug: 'producto-no-aprobado',
    description: 'Este producto está pendiente de moderación',
    price: '99.99',
    stock: 5,
    isActive: true,
    isApproved: false,
    imageUrl: null,
    categoryId: 3,
    sellerId: 103,
    sellerName: 'Ana Martínez',
    sellerEmail: 'ana.martinez@email.com',
    category: { name: 'Hogar' },
    createdAt: '2024-01-20T11:45:00',
    variants: [],
    rejectionReason: 'Descripción incompleta',
  },
  {
    id: 5,
    name: 'Producto Inapropiado',
    slug: 'producto-inapropiado',
    description: 'Contenido que viola las políticas',
    price: '999.99',
    stock: 10,
    isActive: true,
    isApproved: false,
    imageUrl: null,
    categoryId: 3,
    sellerId: 104,
    sellerName: 'Luis Fernández',
    sellerEmail: 'luis.fernandez@email.com',
    category: { name: 'Otros' },
    createdAt: '2024-01-19T16:30:00',
    variants: [],
  },
];

type Props = {
  initialProducts?: Product[];
};

export default function AdminProductsPage({ initialProducts = mockProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>(
    'all',
  );
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'approved' | 'pending_moderation'>(
    'all',
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const itemsPerPage = 6;

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === 'approved') matchesStatus = product.isApproved === true;
    if (statusFilter === 'pending')
      matchesStatus = product.isApproved === false && !product.rejectionReason;
    if (statusFilter === 'rejected') matchesStatus = !!product.rejectionReason;

    let matchesApproval = true;
    if (approvalFilter === 'approved') matchesApproval = product.isApproved === true;
    if (approvalFilter === 'pending_moderation') matchesApproval = product.isApproved === false;

    return matchesSearch && matchesStatus && matchesApproval;
  });

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-PE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(parseFloat(price));
  };

  const getApprovalBadge = (product: Product) => {
    if (product.isApproved) {
      return {
        icon: CheckCircle,
        text: 'Aprobado',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
      };
    }
    if (product.rejectionReason) {
      return {
        icon: XCircle,
        text: 'Rechazado',
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
      };
    }
    return {
      icon: Clock,
      text: 'Pendiente',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    };
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Sin stock', color: 'text-red-600', bg: 'bg-red-50' };
    if (stock < 5)
      return { label: `Stock bajo (${stock})`, color: 'text-amber-600', bg: 'bg-amber-50' };
    return { label: `Stock: ${stock}`, color: 'text-emerald-600', bg: 'bg-emerald-50' };
  };

  const handleApprove = (product: Product) => {
    setProcessingId(product.id);
    setTimeout(() => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, isApproved: true, rejectionReason: undefined } : p,
        ),
      );
      setMessage({ type: 'success', text: `Producto "${product.name}" aprobado correctamente` });
      setTimeout(() => setMessage(null), 3000);
      setProcessingId(null);
      setSelectedProduct(null);
      setShowModal(false);
    }, 500);
  };

  const handleReject = (product: Product) => {
    if (!rejectionReason.trim()) {
      setMessage({ type: 'error', text: 'Debes ingresar un motivo de rechazo' });
      return;
    }

    setProcessingId(product.id);
    setTimeout(() => {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isApproved: false, rejectionReason } : p)),
      );
      setMessage({
        type: 'success',
        text: `Producto "${product.name}" rechazado. Se ha notificado al vendedor.`,
      });
      setTimeout(() => setMessage(null), 3000);
      setProcessingId(null);
      setRejectionReason('');
      setShowRejectModal(false);
      setSelectedProduct(null);
      setShowModal(false);
    }, 500);
  };

  const handleDelete = (product: Product) => {
    setProcessingId(product.id);
    setTimeout(() => {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setMessage({ type: 'success', text: `Producto "${product.name}" eliminado permanentemente` });
      setTimeout(() => setMessage(null), 3000);
      setProcessingId(null);
      setShowDeleteConfirm(false);
      setSelectedProduct(null);
      setShowModal(false);
    }, 500);
  };

  const pendingCount = products.filter((p) => !p.isApproved && !p.rejectionReason).length;
  const rejectedCount = products.filter((p) => p.rejectionReason).length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Gestión de Productos</h1>
            <p className="text-sm text-gray-500">
              {products.length} producto{products.length !== 1 ? 's' : ''} en total
              {pendingCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                  {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
                </span>
              )}
              {rejectedCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  {rejectedCount} rechazado{rejectedCount !== 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setApprovalFilter('all');
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-sm font-medium transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Limpiar filtros
        </button>
      </div>

      {/* Message banner */}
      {message && (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {message.text}
          <button onClick={() => setMessage(null)} className="ml-auto opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, vendedor o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setApprovalFilter('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                approvalFilter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setApprovalFilter('pending_moderation')}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 text-sm ${
                approvalFilter === 'pending_moderation'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Pendientes
            </button>
            <button
              onClick={() => setApprovalFilter('approved')}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 text-sm ${
                approvalFilter === 'approved'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Aprobados
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Package className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-700 font-semibold text-base mb-1">Sin productos</p>
            <p className="text-gray-400 text-sm">No hay productos registrados en la plataforma</p>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Filter className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-700 font-semibold text-base mb-1">No hay resultados</p>
            <p className="text-gray-400 text-sm">
              No se encontraron productos con los filtros aplicados
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {paginatedProducts.map((product) => {
              const ApprovalIcon = getApprovalBadge(product).icon;
              const approvalInfo = getApprovalBadge(product);
              const stockStatus = getStockStatus(product.stock);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center shrink-0">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full rounded-xl object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${approvalInfo.bg} ${approvalInfo.color} border ${approvalInfo.border}`}
                            >
                              <ApprovalIcon className="w-3 h-3" />
                              {approvalInfo.text}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <Store className="w-3 h-3" />
                            <span>{product.sellerName}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            <span className="font-bold text-emerald-600">
                              {formatPrice(product.price)}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${stockStatus.bg} ${stockStatus.color}`}
                            >
                              {stockStatus.label}
                            </span>
                            <span className="text-xs text-gray-400">{product.category.name}</span>
                          </div>

                          {product.rejectionReason && (
                            <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                              <span className="font-medium">Motivo:</span> {product.rejectionReason}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowModal(true);
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white rounded-xl border border-gray-200">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl font-semibold text-sm transition-all ${
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
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal para revisar producto */}
      {showModal && selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Detalles del producto</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Imagen y nombre */}
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {selectedProduct.imageUrl ? (
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">ID: #{selectedProduct.id}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{selectedProduct.category.name}</span>
                  </div>
                </div>
              </div>

              {/* Información del vendedor */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Store className="w-4 h-4 text-emerald-600" />
                  Información del vendedor
                </h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-500">Nombre:</span> {selectedProduct.sellerName}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Email:</span> {selectedProduct.sellerEmail}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Fecha de publicación:</span>{' '}
                    {formatDate(selectedProduct.createdAt)}
                  </p>
                </div>
              </div>

              {/* Detalles del producto */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Precio</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {formatPrice(selectedProduct.price)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">Stock</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedProduct.stock} unidades
                  </p>
                </div>
              </div>

              {/* Descripción */}
              {selectedProduct.description && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Descripción</h4>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-700">{selectedProduct.description}</p>
                  </div>
                </div>
              )}

              {/* Variantes */}
              {selectedProduct.variants.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Variantes</h4>
                  <div className="space-y-2">
                    {selectedProduct.variants.map((variant, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-2 text-sm">
                        <span className="font-medium">{variant.type}:</span> {variant.value}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row gap-3">
                {!selectedProduct.isApproved && !selectedProduct.rejectionReason ? (
                  <>
                    <button
                      onClick={() => {
                        setShowRejectModal(true);
                      }}
                      disabled={processingId === selectedProduct.id}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-red-300 text-red-600 hover:bg-red-50 font-medium transition-all disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Rechazar
                    </button>
                    <button
                      onClick={() => handleApprove(selectedProduct)}
                      disabled={processingId === selectedProduct.id}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {processingId === selectedProduct.id ? 'Procesando...' : 'Aprobar producto'}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={processingId === selectedProduct.id}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar producto
                  </button>
                )}
              </div>

              {selectedProduct.rejectionReason && (
                <div className="p-3 bg-red-50 rounded-xl">
                  <p className="text-xs text-red-600 font-medium mb-1">Motivo del rechazo:</p>
                  <p className="text-sm text-red-700">{selectedProduct.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Eliminar producto</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-sm text-gray-700">
                  ¿Estás seguro de eliminar{' '}
                  <span className="font-semibold">{selectedProduct.name}</span>? Esta acción no se
                  puede deshacer.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(selectedProduct)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de rechazo */}
      {showRejectModal && selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowRejectModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Rechazar producto</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                ¿Por qué estás rechazando{' '}
                <span className="font-semibold">{selectedProduct.name}</span>?
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo del rechazo (feedback para el vendedor)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-200 outline-none transition-all resize-none"
                placeholder="Ej: El producto viola nuestras políticas, falta documentación, etc."
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleReject(selectedProduct)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all"
                >
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
