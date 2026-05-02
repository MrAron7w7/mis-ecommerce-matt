'use client';

import { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  X,
  Send,
  FileText,
  Clock,
  ChevronRight,
  Star,
  Package,
  Truck,
  CreditCard,
} from 'lucide-react';
import {
  addTicketResponse,
  createTicket,
  getMyTickets,
  getTicketById,
} from '@/actions/seller/ticker.seller.action';
import { useToast } from '@/components/ui/custom-toast';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type TicketStatus = 'PENDING' | 'IN_REVIEW' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export type TicketResponse = {
  id: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
};

export type Ticket = {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: string;
  categoryName: string;
  status: TicketStatus;
  statusLabel: string;
  priority: TicketPriority;
  priorityLabel: string;
  createdAt: string;
  updatedAt: string;
  attachments?: unknown;
  orderNumber?: string | null;
  productName?: string | null;
  responses?: TicketResponse[];
};

type SupportCategory = {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
  bgColor: string;
};

type FormData = {
  title: string;
  category: string;
  description: string;
  priority: TicketPriority;
  orderNumber: string;
  productName: string;
};

type Props = {
  initialTickets: Ticket[];
};

// ─── Constantes ───────────────────────────────────────────────────────────────

const SUPPORT_CATEGORIES: SupportCategory[] = [
  {
    id: 'feature_product',
    name: 'Destacar producto',
    icon: Star,
    description: 'Solicita que tu producto aparezca destacado',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'order_problem',
    name: 'Problema con pedido',
    icon: Package,
    description: 'Problemas con envíos, entregas o productos',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'payment_validation',
    name: 'Validar pago',
    icon: CreditCard,
    description: 'Solicita validación de comprobantes de pago',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    id: 'shipping_issue',
    name: 'Problema de envío',
    icon: Truck,
    description: 'Problemas con la logística de envío',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    id: 'product_issue',
    name: 'Problema con producto',
    icon: AlertCircle,
    description: 'Producto dañado, incorrecto o defectuoso',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    id: 'other',
    name: 'Otro',
    icon: HelpCircle,
    description: 'Otra consulta o solicitud',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
  },
];

const INITIAL_FORM: FormData = {
  title: '',
  category: '',
  description: '',
  priority: 'MEDIUM',
  orderNumber: '',
  productName: '',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusBadge(status: TicketStatus) {
  const map = {
    PENDING: { label: 'Pendiente', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
    IN_REVIEW: {
      label: 'En revisión',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      icon: MessageSquare,
    },
    RESOLVED: {
      label: 'Resuelto',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      icon: CheckCircle,
    },
    CLOSED: { label: 'Cerrado', color: 'text-gray-500', bg: 'bg-gray-50', icon: X },
  } satisfies Record<
    TicketStatus,
    { label: string; color: string; bg: string; icon: React.ElementType }
  >;

  return (
    map[status] ?? { label: status, color: 'text-gray-500', bg: 'bg-gray-50', icon: AlertCircle }
  );
}

function getPriorityBadge(priority: TicketPriority) {
  const map = {
    HIGH: { label: 'Alta', color: 'text-red-600', bg: 'bg-red-50' },
    MEDIUM: { label: 'Media', color: 'text-amber-600', bg: 'bg-amber-50' },
    LOW: { label: 'Baja', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  } satisfies Record<TicketPriority, { label: string; color: string; bg: string }>;

  return map[priority] ?? { label: priority, color: 'text-gray-500', bg: 'bg-gray-50' };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const diff = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
  if (diff < 1) return 'Hace unos minutos';
  if (diff < 24) return `Hace ${diff} hora${diff === 1 ? '' : 's'}`;
  return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
}

function serializeTicket(t: Awaited<ReturnType<typeof getTicketById>>): Ticket | null {
  if (!t) return null;
  return {
    ...t,
    createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : String(t.createdAt),
    updatedAt: t.updatedAt instanceof Date ? t.updatedAt.toISOString() : String(t.updatedAt),
    responses: t.responses?.map((r) => ({
      ...r,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
    })),
  };
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function SellerRequestClient({ initialTickets }: Props) {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'new' | 'my_tickets' | 'detail'>('new');
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets); // ← usa initialTickets
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendingResponse, setSendingResponse] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);

  // Categorías que requieren campos extra
  const needsOrderNumber = selectedCategory === 'order_problem';
  const needsProductName =
    selectedCategory === 'feature_product' || selectedCategory === 'product_issue';

  // ── Acciones ────────────────────────────────────────────────────────────────

  const refreshTickets = async () => {
    setLoadingTickets(true);
    const raw = await getMyTickets();
    const serialized: Ticket[] = raw.map((t) => ({
      ...t,
      createdAt: t.createdAt instanceof Date ? t.createdAt.toISOString() : String(t.createdAt),
      updatedAt: t.updatedAt instanceof Date ? t.updatedAt.toISOString() : String(t.updatedAt),
      responses: t.responses?.map((r) => ({
        ...r,
        createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
      })),
    }));
    setTickets(serialized);
    setLoadingTickets(false);
  };

  const openTicketDetail = async (ticketId: string) => {
    const raw = await getTicketById(ticketId);
    const ticket = serializeTicket(raw);
    if (ticket) {
      setSelectedTicket(ticket);
      setActiveTab('detail');
    }
  };

  const handleCategorySelect = (category: SupportCategory) => {
    setSelectedCategory(category.id);
    setFormData({ ...INITIAL_FORM, category: category.name });
    setShowTicketForm(true);
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await createTicket({
      title: formData.title,
      category: formData.category,
      description: formData.description,
      priority: formData.priority,
      orderNumber: formData.orderNumber || undefined,
      productName: formData.productName || undefined,
    });

    if (result.success) {
      toast.success('Ticket creado. Te responderemos pronto.');
      setShowTicketForm(false);
      setSelectedCategory(null);
      setFormData(INITIAL_FORM);
      await refreshTickets();
      setActiveTab('my_tickets');
    } else {
      toast.error(result.error ?? 'Error al crear el ticket');
    }

    setSubmitting(false);
  };

  const handleSendResponse = async () => {
    if (!responseMessage.trim() || !selectedTicket) return;
    setSendingResponse(true);

    const result = await addTicketResponse(selectedTicket.id, responseMessage);

    if (result.success) {
      toast.success('Respuesta enviada');
      setResponseMessage('');
      const raw = await getTicketById(selectedTicket.id);
      const updated = serializeTicket(raw);
      if (updated) setSelectedTicket(updated);
    } else {
      toast.error(result.error ?? 'Error al enviar respuesta');
    }

    setSendingResponse(false);
  };

  const pendingCount = tickets.filter(
    (t) => t.status === 'PENDING' || t.status === 'IN_REVIEW',
  ).length;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Soporte al vendedor</h1>
          </div>
          <p className="text-sm text-gray-500 ml-13">
            Envía tus consultas, solicitudes o reporta problemas al equipo de administración
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-lg p-1 border border-gray-200 mb-6 w-fit">
          <button
            onClick={() => {
              setActiveTab('new');
              setShowTicketForm(false);
              setSelectedCategory(null);
            }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'new' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Nueva solicitud
          </button>
          <button
            onClick={() => {
              setActiveTab('my_tickets');
              refreshTickets();
            }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'my_tickets'
                ? 'bg-emerald-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Mis tickets
            {pendingCount > 0 && (
              <span
                className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                  activeTab === 'my_tickets'
                    ? 'bg-white/20 text-white'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* ── Tab: Nueva solicitud ─────────────────────────────────────────── */}
        {activeTab === 'new' && (
          <div>
            {!showTicketForm ? (
              /* Selección de categoría */
              <div>
                <p className="text-sm text-gray-600 mb-4">Selecciona el tipo de solicitud:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SUPPORT_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat)}
                        className="bg-white rounded-xl border border-gray-200 p-5 text-left hover:shadow-md hover:border-emerald-200 transition-all group"
                      >
                        <div
                          className={`w-10 h-10 ${cat.bgColor} rounded-lg flex items-center justify-center mb-3`}
                        >
                          <Icon className={`w-5 h-5 ${cat.color}`} />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-gray-500">{cat.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Formulario */
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => {
                      setShowTicketForm(false);
                      setSelectedCategory(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors text-lg"
                  >
                    ←
                  </button>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {SUPPORT_CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                    </h2>
                    <p className="text-xs text-gray-500">Completa los detalles de tu solicitud</p>
                  </div>
                </div>

                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  {/* Título */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Resume tu solicitud en pocas palabras"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm"
                    />
                  </div>

                  {/* Prioridad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prioridad
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value as TicketPriority })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm bg-white"
                    >
                      <option value="LOW">Baja</option>
                      <option value="MEDIUM">Media</option>
                      <option value="HIGH">Alta</option>
                    </select>
                  </div>

                  {/* Número de pedido (condicional) */}
                  {needsOrderNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de pedido
                      </label>
                      <input
                        type="text"
                        value={formData.orderNumber}
                        onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                        placeholder="Ej: ORD-001"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm"
                      />
                    </div>
                  )}

                  {/* Nombre de producto (condicional) */}
                  {needsProductName && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del producto
                      </label>
                      <input
                        type="text"
                        value={formData.productName}
                        onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                        placeholder="Nombre exacto del producto"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm"
                      />
                    </div>
                  )}

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe con detalle tu solicitud o problema..."
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none text-sm"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowTicketForm(false);
                        setSelectedCategory(null);
                      }}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Enviar solicitud
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Mis tickets ─────────────────────────────────────────────── */}
        {activeTab === 'my_tickets' && (
          <div className="space-y-4">
            {loadingTickets ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">No tienes tickets aún</p>
                <p className="text-sm text-gray-400 mt-1">Crea tu primera solicitud de soporte</p>
                <button
                  onClick={() => setActiveTab('new')}
                  className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Nueva solicitud
                </button>
              </div>
            ) : (
              tickets.map((ticket) => {
                const statusInfo = getStatusBadge(ticket.status);
                const priorityInfo = getPriorityBadge(ticket.priority);
                const StatusIcon = statusInfo.icon;

                return (
                  <div
                    key={ticket.id}
                    onClick={() => openTicketDetail(ticket.id)}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {ticket.ticketNumber}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </span>
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${priorityInfo.bg} ${priorityInfo.color}`}
                          >
                            {priorityInfo.label}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{ticket.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {ticket.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(ticket.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {ticket.categoryName}
                          </span>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium">
                        Ver detalles
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── Tab: Detalle del ticket ──────────────────────────────────────── */}
        {activeTab === 'detail' && selectedTicket && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('my_tickets')}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ←
                  </button>
                  <h2 className="font-semibold text-gray-900">{selectedTicket.title}</h2>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Ticket #{selectedTicket.ticketNumber}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedTicket.status).bg} ${getStatusBadge(selectedTicket.status).color}`}
              >
                {getStatusBadge(selectedTicket.status).label}
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedTicket.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-gray-200 text-xs text-gray-400">
                  <span>Categoría: {selectedTicket.categoryName}</span>
                  <span>Prioridad: {selectedTicket.priorityLabel}</span>
                  <span>{formatDate(selectedTicket.createdAt)}</span>
                </div>
              </div>

              {/* Respuestas */}
              {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Respuestas</h3>
                  {selectedTicket.responses.map((response) => (
                    <div
                      key={response.id}
                      className={`p-4 rounded-xl ${response.isAdmin ? 'bg-emerald-50 ml-8' : 'bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-medium ${response.isAdmin ? 'text-emerald-600' : 'text-gray-600'}`}
                        >
                          {response.isAdmin ? 'Administrador' : 'Tú'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(response.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {response.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Responder */}
              {selectedTicket.status !== 'CLOSED' && selectedTicket.status !== 'RESOLVED' && (
                <div className="border-t border-gray-200 pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Responder</label>
                  <textarea
                    rows={3}
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none text-sm"
                  />
                  <button
                    onClick={handleSendResponse}
                    disabled={sendingResponse || !responseMessage.trim()}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {sendingResponse ? 'Enviando...' : 'Enviar respuesta'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
