// components/admin/admin-header.tsx
'use client';

import { Search, Bell, CheckCircle, XCircle, Eye, Store, X } from 'lucide-react';
import { useSellerRequestsStore } from '@/store/notification-store';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { approveSeller } from '@/actions/admin/vendedores/approve-seller.action';
import { rejectSeller } from '@/actions/admin/vendedores/reject-seller.action';

interface SessionUser {
  name: string;
  email: string;
  image?: string | null;
  role?: string;
}

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
  user: SessionUser;
}

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrador',
  SELLER: 'Vendedor',
  USER: 'Usuario',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function AdminHeader({ onOpenMobileSidebar, user }: AdminHeaderProps) {
  const router = useRouter();
  const { pendingCount, pendingRequests, decrement } = useSellerRequestsStore();
  const [open, setOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cierra el dropdown al hacer click afuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setProcessingId(id);
      await approveSeller(id);
      decrement(id);
    } catch {
      // maneja error si quieres
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setProcessingId(id);
      await rejectSeller(id, 'Rechazado desde notificaciones');
      decrement(id);
    } catch {
      // maneja error si quieres
    } finally {
      setProcessingId(null);
    }
  };

  const handleView = (id: string) => {
    setOpen(false);
    router.push(`/admin/vendedores?id=${id}`);
  };

  const handleViewAll = () => {
    setOpen(false);
    router.push('/admin/vendedores');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-3">
        <div></div>

        <div className="flex items-center gap-3">
          {/* 🔔 Campanita con dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notificaciones"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {pendingCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center px-1">
                  <span className="text-white text-[10px] font-bold leading-none">
                    {pendingCount > 99 ? '99+' : pendingCount}
                  </span>
                </span>
              )}
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                {/* Header del dropdown */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-900">Notificaciones</span>
                    {pendingCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Lista de solicitudes */}
                <div className="max-h-80 overflow-y-auto">
                  {pendingRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                        <Bell className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-600">Sin notificaciones</p>
                      <p className="text-xs text-gray-400 mt-1">No hay solicitudes pendientes</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-50">
                      {pendingRequests.map((req) => (
                        <li key={req.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start gap-3">
                            {/* Ícono */}
                            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                              <Store className="w-4 h-4 text-emerald-600" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {req.businessName}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{req.userName}</p>
                              <p className="text-xs text-gray-400 truncate">{req.userEmail}</p>
                              <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">
                                Solicitud de vendedor
                              </span>
                            </div>

                            {/* Acciones */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleView(req.id)}
                                title="Ver detalle"
                                className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleApprove(req.id)}
                                disabled={processingId === req.id}
                                title="Aprobar"
                                className="p-1.5 rounded-lg hover:bg-emerald-100 text-gray-400 hover:text-emerald-600 transition-colors disabled:opacity-50"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleReject(req.id)}
                                disabled={processingId === req.id}
                                title="Rechazar"
                                className="p-1.5 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Footer */}
                {pendingRequests.length > 0 && (
                  <div className="border-t border-gray-100 px-4 py-3">
                    <button
                      onClick={handleViewAll}
                      className="w-full text-center text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      Ver todas las solicitudes →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</p>
              <p className="text-xs text-gray-500">{roleLabels[user.role ?? ''] ?? 'Usuario'}</p>
            </div>
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="w-9 h-9 bg-linear-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-white text-sm font-semibold">{getInitials(user.name)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 border border-transparent focus-within:border-emerald-300 focus-within:bg-white transition-all">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>
    </header>
  );
}
