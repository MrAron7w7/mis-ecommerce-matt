'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  PackageSearch,
  AlertCircle,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { deleteProduct } from '@/actions/seller/product.seller.action';

type ProductRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  stock: number;
  isActive: boolean;
  imageUrl: string | null;
  categoryId: number;
  supplierId: number | null;
  category: { name: string };
  variants: Array<{ id: number; type: string; value: string }>;
};

type Props = { products: ProductRow[] };

export default function SellerProductsClient({ products: initialProducts }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtrar productos
  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
          ? product.isActive
          : !product.isActive;
    return matchesSearch && matchesStatus;
  });

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  function openCreate() {
    router.push('/seller/productos/nuevo');
  }

  function openEdit(id: number) {
    router.push(`/seller/productos/${id}`);
  }

  function openView(id: number) {
    router.push(`/seller/productos/${id}`);
  }

  function handleDelete(id: number) {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
    setDeletingId(id);
    setDeleteError(null);

    startTransition(async () => {
      const result = await deleteProduct({ id });

      if (!result.success) {
        setDeleteError(result.error);
      }

      router.refresh();
    });
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(parseFloat(price));
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return { label: 'Sin stock', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle };
    if (stock < 5)
      return {
        label: `Stock bajo (${stock})`,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        icon: TrendingDown,
      };
    return {
      label: `Stock disponible (${stock})`,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      icon: TrendingUp,
    };
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Productos</h1>
            <p className="text-sm text-gray-500">
              {initialProducts.length} producto{initialProducts.length !== 1 ? 's' : ''} registrado
              {initialProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo producto
        </button>
      </div>

      {/* Error banner */}
      {deleteError && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
          {deleteError}
          <button
            onClick={() => setDeleteError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                statusFilter === 'active'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Activos
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                statusFilter === 'inactive'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Inactivos
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {initialProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <PackageSearch className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-700 font-semibold text-base mb-1">Sin productos aún</p>
            <p className="text-gray-400 text-sm mb-6">
              Crea tu primer producto para comenzar a vender
            </p>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium border border-emerald-200 hover:border-emerald-300 px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear producto
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Filter className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-700 font-semibold text-base mb-1">No hay resultados</p>
            <p className="text-gray-400 text-sm mb-6">
              No se encontraron productos con los filtros aplicados
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium border border-emerald-200 hover:border-emerald-300 px-4 py-2 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedProducts.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    const StockIcon = stockStatus.icon;

                    return (
                      <tr key={product.id} className="hover:bg-gray-50/60 transition-colors group">
                        {/* Nombre + imagen */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-4 h-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 line-clamp-1">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">ID #{product.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Categoría */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                            {product.category.name}
                          </span>
                        </td>

                        {/* Precio */}
                        <td className="px-6 py-4">
                          <span className="font-semibold text-emerald-600">
                            {formatPrice(product.price)}
                          </span>
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${stockStatus.bg} ${stockStatus.color} text-xs font-medium rounded-full`}
                          >
                            <StockIcon className="w-3.5 h-3.5" />
                            {product.stock === 0 ? 'Sin stock' : `${product.stock} unidades`}
                          </span>
                        </td>

                        {/* Estado */}
                        <td className="px-6 py-4">
                          {product.isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full border border-gray-200">
                              <XCircle className="w-3.5 h-3.5" />
                              Inactivo
                            </span>
                          )}
                        </td>

                        {/* Acciones */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => openView(product.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 text-gray-600 text-xs font-medium transition-all shadow-sm"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Ver
                            </button>
                            <button
                              onClick={() => openEdit(product.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 text-gray-600 text-xs font-medium transition-all shadow-sm"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              disabled={isPending && deletingId === product.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-red-300 hover:text-red-600 text-gray-600 text-xs font-medium transition-all shadow-sm disabled:opacity-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              {isPending && deletingId === product.id ? '...' : 'Eliminar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
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
      </div>
    </div>
  );
}
