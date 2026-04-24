'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  ImageOff,
  CheckCircle2,
  XCircle,
  PackageSearch,
  AlertCircle,
} from 'lucide-react';
import { deleteCategory } from '@/actions/seller/category.seller.action';
import CategoryForm from './SellerCategoryForm';

type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  isActive: boolean;
  _count: { products: number };
  createdAt: string;
};

type Props = { initialCategories: CategoryRow[] };

export default function SellerCategoriesClient({ initialCategories }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(cat: CategoryRow) {
    setEditing(cat);
    setModalOpen(true);
  }

  function handleSuccess() {
    setModalOpen(false);
    router.refresh();
  }

  function handleDelete(id: number) {
    if (!confirm('¿Eliminar esta categoría? Esta acción no se puede deshacer.')) return;
    setDeletingId(id);
    setDeleteError(null);

    startTransition(async () => {
      const result = await deleteCategory({ id });

      if (!result.success) {
        setDeleteError(result.error);
      }

      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Tag className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Categorías</h1>
            <p className="text-sm text-gray-500">
              {initialCategories.length} categoría{initialCategories.length !== 1 ? 's' : ''}{' '}
              registrada
              {initialCategories.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nueva categoría
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

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {initialCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <PackageSearch className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-700 font-semibold text-base mb-1">Sin categorías aún</p>
            <p className="text-gray-400 text-sm mb-6">
              Crea tu primera categoría para organizar los productos
            </p>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium border border-emerald-200 hover:border-emerald-300 px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear categoría
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Productos
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/60 transition-colors group">
                  {/* Nombre + imagen */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                        {cat.imageUrl ? (
                          <img
                            src={cat.imageUrl}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageOff className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{cat.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">ID #{cat.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-mono rounded-lg border border-gray-200">
                      /{cat.slug}
                    </span>
                  </td>

                  {/* Productos */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                        cat._count.products === 0 ? 'text-gray-400' : 'text-gray-700'
                      }`}
                    >
                      <PackageSearch className="w-4 h-4" />
                      {cat._count.products}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="px-6 py-4">
                    {cat.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Activa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full border border-gray-200">
                        <XCircle className="w-3.5 h-3.5" />
                        Inactiva
                      </span>
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end ">
                      <button
                        onClick={() => openEdit(cat)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 text-gray-600 text-xs font-medium transition-all shadow-sm"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        disabled={isPending && deletingId === cat.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-red-300 hover:text-red-600 text-gray-600 text-xs font-medium transition-all shadow-sm disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {isPending && deletingId === cat.id ? '...' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal crear/editar */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          {/* Panel */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
            <CategoryForm
              defaultValues={
                editing
                  ? {
                      id: editing.id,
                      name: editing.name,
                      imageUrl: editing.imageUrl ?? '',
                      isActive: editing.isActive,
                    }
                  : undefined
              }
              onSuccess={handleSuccess}
              onCancel={() => setModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
