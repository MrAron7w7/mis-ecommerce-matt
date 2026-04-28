'use client';

import { useState } from 'react';
import {
  Store,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Clock,
  AlertCircle,
  Download,
  Mail,
  Calendar,
  Building2,
  CreditCard,
  MessageSquare,
  Image as ImageIcon,
} from 'lucide-react';
import { SellerRequestAdminView } from '@/lib/types/type-models';
import { approveSeller } from '@/actions/admin/vendedores/approve-seller.action';
import { rejectSeller } from '@/actions/admin/vendedores/reject-seller.action';
import { useToast } from '@/components/ui/custom-toast';

type Props = {
  initialRequests?: SellerRequestAdminView[];
};

export default function AdminSellerClient({ initialRequests }: Props) {
  const toast = useToast();
  const [requests, setRequests] = useState<SellerRequestAdminView[]>(initialRequests || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>(
    'all',
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<SellerRequestAdminView | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const itemsPerPage = 4;

  // Filtrar solicitudes
  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Paginación
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-PE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircle,
          text: 'Aprobado',
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
        };
      case 'rejected':
        return {
          icon: XCircle,
          text: 'Rechazado',
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
        };
      default:
        return {
          icon: Clock,
          text: 'Pendiente',
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
        };
    }
  };

  const handleApprove = async (request: SellerRequestAdminView) => {
    try {
      setProcessingId(request.id);

      await approveSeller(request.id);

      setRequests((prev) =>
        prev.map((r) =>
          r.id === request.id
            ? { ...r, status: 'approved', reviewedAt: new Date().toISOString() }
            : r,
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (request: SellerRequestAdminView) => {
    if (!rejectionReason.trim()) {
      toast.error('Debes ingresar un motivo de rechazo');
      return;
    }

    try {
      setProcessingId(request.id);

      await rejectSeller(request.id, rejectionReason);

      // ✅ UPDATE UI (optimista)
      setRequests((prev) =>
        prev.map((req) =>
          req.id === request.id
            ? {
                ...req,
                status: 'rejected',
                reviewedAt: new Date().toISOString(),
                reviewNotes: rejectionReason,
              }
            : req,
        ),
      );

      toast.success(`Solicitud de ${request.businessName} rechazada correctamente.`);

      setRejectionReason('');
      setShowRejectModal(false);
      setSelectedRequest(null);
      setShowModal(false);
    } catch (error) {
      console.error(error);

      toast.error('Error al rechazar la solicitud. Inténtalo de nuevo.');
    } finally {
      setProcessingId(null);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Store className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Solicitudes de vendedores</h1>
            <p className="text-sm text-gray-500">
              {requests.length} solicitud{requests.length !== 1 ? 'es' : ''} total
              {requests.length !== 1 ? 'es' : ''}
              {pendingCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                  {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>
        </div>
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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o negocio..."
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
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Pendientes
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                statusFilter === 'approved'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Aprobados
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                statusFilter === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Rechazados
            </button>
          </div>
        </div>
      </div>

      {/* Requests Grid */}
      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Store className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-700 font-semibold text-base mb-1">Sin solicitudes</p>
            <p className="text-gray-400 text-sm">No hay solicitudes de vendedores registradas</p>
          </div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Filter className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-700 font-semibold text-base mb-1">No hay resultados</p>
            <p className="text-gray-400 text-sm">
              No se encontraron solicitudes con los filtros aplicados
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5">
            {paginatedRequests.map((request) => {
              const StatusIcon = getStatusBadge(request.status).icon;
              const statusInfo = getStatusBadge(request.status);

              return (
                <div
                  key={request.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      {/* Left side - User info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-100 to-emerald-200 flex items-center justify-center flex-shrink-0">
                          {request.userAvatar ? (
                            <img
                              src={request.userAvatar}
                              alt={request.userName}
                              className="w-full h-full rounded-xl object-cover"
                            />
                          ) : (
                            <span className="text-emerald-700 font-semibold text-sm">
                              {getInitials(request.userName)}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{request.businessName}</h3>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color} border ${statusInfo.border}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {statusInfo.text}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">{request.userName}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {request.userEmail}
                          </p>

                          <div className="flex flex-wrap gap-4 mt-3 text-xs">
                            <span className="flex items-center gap-1 text-gray-500">
                              <Building2 className="w-3.5 h-3.5" />
                              {request.businessType}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500">
                              <CreditCard className="w-3.5 h-3.5" />
                              {request.taxId}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500">
                              <Calendar className="w-3.5 h-3.5" />
                              Solicitado: {formatDate(request.submittedAt).split(',')[0]}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right side - Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowModal(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 text-gray-600 text-sm font-medium transition-all"
                        >
                          <Eye className="w-4 h-4" />
                          Revisar
                        </button>
                      </div>
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

      {/* Modal para revisar solicitud */}
      {showModal && selectedRequest && (
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
                  <FileText className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Revisar solicitud</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Información del negocio */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  Información del negocio
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Nombre del negocio</p>
                      <p className="font-medium text-gray-900">{selectedRequest.businessName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Tipo de negocio</p>
                      <p className="font-medium text-gray-900">{selectedRequest.businessType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">RUC / Documento</p>
                      <p className="font-medium text-gray-900">{selectedRequest.taxId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Teléfono</p>
                      <p className="font-medium text-gray-900">{selectedRequest.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Dirección</p>
                    <p className="font-medium text-gray-900">{selectedRequest.address}</p>
                  </div>
                </div>
              </div>

              {/* Experiencia */}
              {selectedRequest.experience && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    Experiencia / Motivación
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-700">{selectedRequest.experience}</p>
                  </div>
                </div>
              )}

              {/* Documentos */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Documentos adjuntos
                </h3>
                <div className="space-y-2">
                  {selectedRequest.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                          <ImageIcon className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-400">{doc.type}</p>
                        </div>
                      </div>
                      <button className="p-2 text-gray-500 hover:text-emerald-600 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acciones */}
              {selectedRequest.status === 'pending' && (
                <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={processingId === selectedRequest.id}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-red-300 text-red-600 hover:bg-red-50 font-medium transition-all disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Rechazar
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest)}
                    disabled={processingId === selectedRequest.id}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {processingId === selectedRequest.id ? 'Procesando...' : 'Aprobar solicitud'}
                  </button>
                </div>
              )}

              {selectedRequest.status !== 'pending' && (
                <div className="border-t border-gray-200 pt-6">
                  {selectedRequest.status === 'approved' ? (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl text-emerald-700">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">
                        Esta solicitud fue aprobada el {formatDate(selectedRequest.reviewedAt!)}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-red-700">
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm">
                          Esta solicitud fue rechazada el {formatDate(selectedRequest.reviewedAt!)}
                        </span>
                      </div>
                      {selectedRequest.reviewNotes && (
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1">Motivo del rechazo:</p>
                          <p className="text-sm text-gray-700">{selectedRequest.reviewNotes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de rechazo con feedback */}
      {showRejectModal && selectedRequest && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowRejectModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Rechazar solicitud</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                ¿Estás seguro de rechazar la solicitud de{' '}
                <span className="font-semibold">{selectedRequest.businessName}</span>?
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo del rechazo (feedback para el usuario)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-400 focus:ring-2 focus:ring-red-200 outline-none transition-all resize-none"
                placeholder="Ej: Documentación incompleta, no cumple con los requisitos mínimos..."
              />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleReject(selectedRequest)}
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
