'use client';

import { Search, Bell, CheckCircle, XCircle, Eye, Store, X, Menu } from 'lucide-react';
import { useSellerRequestsStore } from '@/store/notification-store';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { approveSeller } from '@/actions/admin/vendedores/approve-seller.action';
import { rejectSeller } from '@/actions/admin/vendedores/reject-seller.action';
import Image from 'next/image';

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
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Botón de menú hamburguesa - SOLO EN MOBILE */}
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Espacio vacío en desktop */}
        <div className="hidden lg:block"></div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* 🔔 Campanita con dropdown responsivo */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notificaciones"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {pendingCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4.5 h-4.5 bg-red-500 rounded-full flex items-center justify-center px-1">
                  <span className="text-white text-[10px] font-bold leading-none">
                    {pendingCount > 99 ? '99+' : pendingCount}
                  </span>
                </span>
              )}
            </button>

            {/* Dropdown Responsivo */}
            {open && (
              <>
                {/* Overlay para mobile */}
                {isMobile && (
                  <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setOpen(false)} />
                )}

                <div
                  className={`
                    fixed z-50 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden
                    transition-all duration-200
                    ${
                      !isMobile
                        ? 'absolute right-0 mt-2 w-96'
                        : 'bottom-0 left-0 right-0 rounded-b-none rounded-t-2xl max-h-[80vh]'
                    }
                  `}
                  style={{
                    ...(!isMobile && {
                      top:
                        (
                          document.querySelector(
                            'button[aria-label="Notificaciones"]',
                          ) as HTMLElement
                        )?.getBoundingClientRect().bottom + 8 || 'auto',
                    }),
                  }}
                >
                  {/* Header del dropdown */}
                  <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-4 py-3 border-b border-gray-100">
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
                      <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Lista de solicitudes - Scrollable */}
                  <div className="max-h-[calc(80vh-120px)] lg:max-h-80 overflow-y-auto">
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
                            <div className="flex gap-3">
                              {/* Ícono */}
                              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                <Store className="w-4 h-4 text-emerald-600" />
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 break-words">
                                  {req.businessName}
                                </p>
                                <p className="text-xs text-gray-500 break-words">{req.userName}</p>
                                <p className="text-xs text-gray-400 break-words">{req.userEmail}</p>
                                <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">
                                  Solicitud de vendedor
                                </span>
                              </div>

                              {/* Acciones - Mejoradas para mobile */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => handleView(req.id)}
                                  title="Ver detalle"
                                  className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors min-w-[32px]"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleApprove(req.id)}
                                  disabled={processingId === req.id}
                                  title="Aprobar"
                                  className="p-2 rounded-lg hover:bg-emerald-100 text-gray-400 hover:text-emerald-600 transition-colors disabled:opacity-50 min-w-[32px]"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleReject(req.id)}
                                  disabled={processingId === req.id}
                                  title="Rechazar"
                                  className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 min-w-[32px]"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Footer - Sticky en mobile */}
                  {pendingRequests.length > 0 && (
                    <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3">
                      <button
                        onClick={handleViewAll}
                        className="w-full text-center text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors py-2"
                      >
                        Ver todas las solicitudes →
                      </button>
                    </div>
                  )}

                  {/* Indicador de arrastre para mobile */}
                  {isMobile && (
                    <div className="flex justify-center py-2 bg-white">
                      <div className="w-12 h-1 bg-gray-300 rounded-full" />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</p>
              <p className="text-xs text-gray-500">{roleLabels[user.role ?? ''] ?? 'Usuario'}</p>
            </div>
            {user.image ? (
              <Image
                width={36}
                height={36}
                src={user.image}
                alt={user.name}
                priority
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-linear-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-md shrink-0">
                <span className="text-white text-xs sm:text-sm font-semibold">
                  {getInitials(user.name)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra de búsqueda SOLO en mobile */}
      <div className="lg:hidden px-4 pb-3">
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
