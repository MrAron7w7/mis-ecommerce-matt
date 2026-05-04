'use client';

import { useState } from 'react';
import {
  Store,
  Phone,
  Building2,
  MapPin,
  Briefcase,
  CheckCircle,
  XCircle,
  Loader2,
  TrendingUp,
  Shield,
  Truck,
  FileText,
  Globe,
  Clock,
  BadgeCheck,
} from 'lucide-react';
import { createSellerRequest, type SellerRequestInput } from '@/actions/user/seller.request.action';
import type { DocumentType } from '@/lib/types/type.models';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type FeedbackState = {
  type: 'success' | 'error';
  message: string;
} | null;

type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | null;

type UserPrefill = {
  phone?: string | null;
  documentType?: DocumentType | null;
  documentNumber?: string | null;
  role?: string | null;
};

type Props = {
  prefill: UserPrefill;
  /** Si ya existe una solicitud previa, se pasa su estado para mostrar el banner correcto */
  existingRequestStatus?: RequestStatus;
};

// ─── Constantes ──────────────────────────────────────────────────────────────

const DOCUMENT_TYPES: { value: DocumentType; label: string; icon: React.ElementType }[] = [
  { value: 'DNI', label: 'DNI', icon: FileText },
  { value: 'RUC', label: 'RUC', icon: Building2 },
  { value: 'CE', label: 'Carnet de Extranjería', icon: Globe },
  { value: 'PASAPORTE', label: 'Pasaporte', icon: Globe },
];

const BUSINESS_TYPES = [
  'Ropa y Moda',
  'Electrónica',
  'Hogar y Decoración',
  'Alimentos y Bebidas',
  'Salud y Belleza',
  'Deportes',
  'Tecnología',
  'Otros',
];

const INPUT_CLASS =
  'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black outline-none transition-all duration-200 hover:border-gray-300 text-sm';

// ─── Componente principal ─────────────────────────────────────────────────────

export default function SellerRequestTab({ prefill, existingRequestStatus }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [submitted, setSubmitted] = useState(
    existingRequestStatus === 'PENDING' || existingRequestStatus === 'APPROVED',
  );

  // Pre-rellenar con datos del perfil del usuario
  const [form, setForm] = useState<SellerRequestInput>({
    businessName: '',
    businessType: '',
    address: '',
    phone: prefill.phone ?? '',
    taxIdType: prefill.documentType ?? 'DNI',
    taxIdNumber: prefill.documentNumber ?? '',
    experience: '',
    message: '',
  });

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function showFeedback(fb: FeedbackState, durationMs = 5000) {
    setFeedback(fb);
    setTimeout(() => setFeedback(null), durationMs);
  }

  function setField<K extends keyof SellerRequestInput>(key: K, value: SellerRequestInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const completionPercentage = Math.round(
    (Object.values(form).filter((v) => String(v).trim() !== '').length / Object.keys(form).length) *
      100,
  );

  // ── Handlers ────────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    const result = await createSellerRequest(form);

    setIsLoading(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      showFeedback({ type: 'error', message: result.error });
    }
  }

  // ── Estados especiales ───────────────────────────────────────────────────────

  // Ya es vendedor
  if (prefill.role === 'SELLER') {
    return (
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
          <div className="p-4 bg-green-50 rounded-full">
            <BadgeCheck className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">¡Ya eres vendedor!</h3>
          <p className="text-gray-500 text-sm max-w-sm">
            Tu cuenta tiene acceso de vendedor. Puedes gestionar tus productos y pedidos desde el
            panel de vendedor.
          </p>
        </div>
      </div>
    );
  }

  // Solicitud enviada / pendiente
  if (submitted || existingRequestStatus === 'PENDING') {
    return (
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
          <div className="p-4 bg-blue-50 rounded-full">
            <Clock className="w-12 h-12 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Solicitud en revisión</h3>
          <p className="text-gray-500 text-sm max-w-sm">
            Tu solicitud fue enviada correctamente. El equipo la revisará en un plazo máximo de{' '}
            <strong>48 horas</strong>. Te notificaremos por correo cuando haya una respuesta.
          </p>
        </div>
      </div>
    );
  }

  // Solicitud rechazada — puede volver a enviar
  const wasRejected = existingRequestStatus === 'REJECTED';

  // ── Render principal ─────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10">
      {/* Banner de solicitud rechazada */}
      {wasRejected && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3">
          <XCircle className="text-amber-600 w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Solicitud anterior rechazada</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Puedes enviar una nueva solicitud con información actualizada.
            </p>
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-2xl flex items-center gap-3 border ${
            feedback.type === 'success'
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="text-green-600 w-5 h-5 shrink-0" />
          ) : (
            <XCircle className="text-red-600 w-5 h-5 shrink-0" />
          )}
          <p
            className={`text-sm font-medium ${
              feedback.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {feedback.message}
          </p>
        </div>
      )}

      {/* Banner informativo */}
      <div className="mb-8 p-5 bg-gray-50 border border-gray-100 rounded-2xl">
        <div className="flex gap-4">
          <div className="p-2.5 bg-white border border-gray-200 rounded-xl shrink-0">
            <Store className="text-gray-700 w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">¿Por qué vender con nosotros?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Revisaremos tu solicitud en un plazo máximo de 48 horas hábiles.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <TrendingUp size={13} className="text-blue-500" />
                +10K ventas/mes
              </span>
              <span className="flex items-center gap-1.5">
                <Shield size={13} className="text-green-500" />
                Pagos seguros
              </span>
              <span className="flex items-center gap-1.5">
                <Truck size={13} className="text-purple-500" />
                Logística integrada
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Completitud de la solicitud</span>
          <span className="font-semibold text-gray-700">{completionPercentage}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-8">
        {/* ── Información del negocio ─────────────────────────────────────── */}
        <section>
          <SectionTitle icon={<Building2 size={18} />} title="Información del negocio" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Nombre del negocio" required>
              <input
                type="text"
                required
                value={form.businessName}
                onChange={(e) => setField('businessName', e.target.value)}
                className={INPUT_CLASS}
                placeholder="Ej: Tienda Elegante SAC"
              />
            </FormField>

            <FormField label="Tipo de negocio" required>
              <select
                required
                value={form.businessType}
                onChange={(e) => setField('businessType', e.target.value)}
                className={INPUT_CLASS}
              >
                <option value="">Selecciona una categoría</option>
                {BUSINESS_TYPES.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </section>

        {/* ── Documento tributario ────────────────────────────────────────── */}
        <section>
          <SectionTitle icon={<FileText size={18} />} title="Documento tributario" />

          {/* Selector tipo documento */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de documento <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DOCUMENT_TYPES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setField('taxIdType', value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 ${
                    form.taxIdType === value
                      ? 'border-black bg-black text-white shadow-sm'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-white'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <FormField label={`Número de ${form.taxIdType}`} required>
            <input
              type="text"
              required
              value={form.taxIdNumber}
              onChange={(e) => setField('taxIdNumber', e.target.value)}
              className={INPUT_CLASS}
              placeholder={
                form.taxIdType === 'RUC'
                  ? '20XXXXXXXXX'
                  : form.taxIdType === 'DNI'
                    ? '12345678'
                    : form.taxIdType === 'PASAPORTE'
                      ? 'AB123456'
                      : '000123456'
              }
              maxLength={form.taxIdType === 'RUC' ? 11 : form.taxIdType === 'DNI' ? 8 : 20}
            />
          </FormField>

          {/* Aviso si ya tiene documento registrado */}
          {prefill.documentNumber && (
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <CheckCircle size={12} className="text-green-500" />
              Usando el documento registrado en tu perfil. Puedes cambiarlo si es necesario.
            </p>
          )}
        </section>

        {/* ── Contacto ────────────────────────────────────────────────────── */}
        <section>
          <SectionTitle icon={<Phone size={18} />} title="Contacto del negocio" />
          <FormField
            label="Teléfono / Celular de contacto"
            required
            hint="Se usará para contactarte sobre tu solicitud"
          >
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              className={INPUT_CLASS}
              placeholder="+51 987 654 321"
            />
          </FormField>
          {prefill.phone && (
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
              <CheckCircle size={12} className="text-green-500" />
              Pre-rellenado con el teléfono de tu perfil.
            </p>
          )}
        </section>

        {/* ── Ubicación ───────────────────────────────────────────────────── */}
        <section>
          <SectionTitle icon={<MapPin size={18} />} title="Ubicación del negocio" />
          <FormField label="Dirección completa" required>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => setField('address', e.target.value)}
              className={INPUT_CLASS}
              placeholder="Av. Principal 123, Lima, Perú"
            />
          </FormField>
        </section>

        {/* ── Experiencia y motivación ─────────────────────────────────────── */}
        <section>
          <SectionTitle icon={<Briefcase size={18} />} title="Experiencia y motivación" />
          <div className="space-y-5">
            <FormField
              label="Experiencia en ventas"
              required
              hint="Mínimo 20 caracteres. Cuéntanos qué productos vendes o has vendido."
            >
              <textarea
                required
                minLength={20}
                rows={3}
                value={form.experience}
                onChange={(e) => setField('experience', e.target.value)}
                className={`${INPUT_CLASS} resize-none`}
                placeholder="Ej: Llevo 3 años vendiendo ropa deportiva en ferias y redes sociales..."
              />
              <CharCounter current={form.experience.length} min={20} />
            </FormField>

            <FormField
              label="¿Por qué quieres vender con nosotros?"
              required
              hint="Cuéntanos tus expectativas y cómo planeas usar la plataforma."
            >
              <textarea
                required
                minLength={20}
                rows={3}
                value={form.message}
                onChange={(e) => setField('message', e.target.value)}
                className={`${INPUT_CLASS} resize-none`}
                placeholder="Ej: Quiero llegar a más clientes y tener una tienda online profesional..."
              />
              <CharCounter current={form.message.length} min={20} />
            </FormField>
          </div>
        </section>
      </div>

      {/* Acciones */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={() =>
            setForm({
              businessName: '',
              businessType: '',
              address: '',
              phone: prefill.phone ?? '',
              taxIdType: prefill.documentType ?? 'DNI',
              taxIdNumber: prefill.documentNumber ?? '',
              experience: '',
              message: '',
            })
          }
          className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium"
        >
          Limpiar campos
        </button>
        <button
          type="submit"
          disabled={isLoading || completionPercentage < 100}
          className="px-8 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium shadow-sm"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Store size={16} />
              Enviar solicitud
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-800">
      <div className="p-1.5 bg-gray-100 rounded-lg text-gray-600">{icon}</div>
      {title}
    </h3>
  );
}

function FormField({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
}

function CharCounter({ current, min }: { current: number; min: number }) {
  const ok = current >= min;
  return (
    <p className={`text-xs mt-1 text-right ${ok ? 'text-green-600' : 'text-gray-400'}`}>
      {current} / {min} mín.{ok && ' ✓'}
    </p>
  );
}
