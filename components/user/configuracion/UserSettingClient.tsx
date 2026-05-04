'use client';

import { useState } from 'react';
import {
  User,
  Camera,
  Store,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import type { DocumentType, ActionResult } from '@/lib/types/type.models';
import { updateProfile, type UpdateProfileInput } from '@/actions/user/config.user.action';
import type { RequestStatus } from '@/lib/types/type.models';
import SellerRequestTab from './SellerRequestTab. page';
import { updateAvatar } from '@/actions/general/update.profile.action';

// ─── Tipos ───────────────────────────────────────────────────────────────────

type UserConfig = {
  name?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  documentType?: DocumentType | null;
  documentNumber?: string | null;
  image?: string | null;
  role?: string | null;
};

type ActiveTab = 'profile' | 'seller';

type FeedbackState = {
  type: 'success' | 'error';
  message: string;
} | null;

// ─── Constantes ──────────────────────────────────────────────────────────────

const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: 'DNI', label: 'DNI' },
  { value: 'RUC', label: 'RUC' },
  { value: 'CE', label: 'Carnet de Extranjería' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
];

const INPUT_CLASS =
  'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black outline-none transition-all duration-200 hover:border-gray-300 text-sm';

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  initialConfig: UserConfig;
  /** Estado de la última solicitud de vendedor del usuario (si existe) */
  existingRequestStatus?: RequestStatus | null;
};

// ─── Componente principal ─────────────────────────────────────────────────────

export default function UserSettingClient({ initialConfig, existingRequestStatus }: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState<UpdateProfileInput>({
    name: initialConfig.name ?? '',
    lastName: initialConfig.lastName ?? '',
    phone: initialConfig.phone ?? '',
    documentType: initialConfig.documentType ?? 'DNI',
    documentNumber: initialConfig.documentNumber ?? '',
  });

  const [profileImage, setProfileImage] = useState<string>(
    initialConfig.image ?? '/avatar-default.jpg',
  );

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function showFeedback(fb: FeedbackState, durationMs = 4000) {
    setFeedback(fb);
    setTimeout(() => setFeedback(null), durationMs);
  }

  function handleActionResult(result: ActionResult, successMsg: string) {
    if (result.success) {
      showFeedback({ type: 'success', message: successMsg });
    } else {
      showFeedback({ type: 'error', message: result.error });
    }
  }

  // ── Handlers ────────────────────────────────────────────────────────────────

  async function handleProfileImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showFeedback({ type: 'error', message: 'La imagen no debe superar los 2 MB' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setProfileImage(base64); // preview inmediato

      const result = await updateAvatar(base64);
      if (result.success && result.imagePath) {
        setProfileImage(result.imagePath);
        showFeedback({ type: 'success', message: '¡Foto de perfil actualizada!' });
      } else {
        showFeedback({ type: 'error', message: 'Error al guardar la imagen' });
        setProfileImage(initialConfig.image ?? '/avatar-default.jpg');
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    const result = await updateProfile(profileData);
    handleActionResult(result, '¡Perfil actualizado exitosamente!');

    setIsLoading(false);
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-gray-50">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Configuración</h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl w-fit">
            <TabButton
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
              icon={<User size={17} />}
              label="Información Personal"
            />
            {initialConfig.role === 'ADMIN' ? null : (
              <TabButton
                active={activeTab === 'seller'}
                onClick={() => setActiveTab('seller')}
                icon={<Store size={17} />}
                label="Solicitar ser Vendedor"
              />
            )}
          </div>
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-3xl shadow-sm shadow-gray-200 border border-gray-100 overflow-hidden">
          {activeTab === 'profile' ? (
            <form onSubmit={handleProfileSubmit} className="p-6 sm:p-8 lg:p-10">
              {/* Feedback perfil */}
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

              {/* Avatar */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Foto de perfil
                </label>
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 ring-4 ring-white shadow-md">
                      <Image
                        src={profileImage}
                        alt="Foto de perfil"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 p-2 bg-black rounded-xl shadow-md hover:bg-gray-800 transition-all hover:scale-105"
                    >
                      <Camera size={14} className="text-white" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Sube una foto para personalizar tu cuenta
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      JPG, PNG, GIF o WebP. Máximo 2 MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Campos del perfil */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Nombre" icon={<User size={15} />} required>
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                    className={INPUT_CLASS}
                    placeholder="Tu nombre"
                  />
                </FormField>

                <FormField label="Apellidos" icon={<User size={15} />} required>
                  <input
                    type="text"
                    required
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                    className={INPUT_CLASS}
                    placeholder="Tus apellidos"
                  />
                </FormField>

                <FormField
                  label="Correo electrónico"
                  icon={<Mail size={15} />}
                  hint="El correo no se puede modificar"
                >
                  <input
                    type="email"
                    value={initialConfig.email ?? ''}
                    className={`${INPUT_CLASS} opacity-60 cursor-not-allowed`}
                    disabled
                    readOnly
                  />
                </FormField>

                <FormField label="Teléfono / Celular" icon={<Phone size={15} />}>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                    className={INPUT_CLASS}
                    placeholder="+51 987 654 321"
                  />
                </FormField>

                <FormField label="Tipo de documento">
                  <select
                    value={profileData.documentType}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        documentType: e.target.value as DocumentType,
                      }))
                    }
                    className={INPUT_CLASS}
                  >
                    {DOCUMENT_TYPES.map((dt) => (
                      <option key={dt.value} value={dt.value}>
                        {dt.label}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Número de documento">
                  <input
                    type="text"
                    value={profileData.documentNumber}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        documentNumber: e.target.value,
                      }))
                    }
                    className={INPUT_CLASS}
                    placeholder={
                      profileData.documentType === 'RUC'
                        ? '20XXXXXXXXX'
                        : profileData.documentType === 'DNI'
                          ? '12345678'
                          : 'Número de documento'
                    }
                    maxLength={
                      profileData.documentType === 'RUC'
                        ? 11
                        : profileData.documentType === 'DNI'
                          ? 8
                          : 20
                    }
                  />
                </FormField>
              </div>

              <div className="mt-8 flex justify-end pt-6 border-t border-gray-100">
                <SubmitButton
                  isLoading={isLoading}
                  label="Guardar cambios"
                  loadingLabel="Guardando..."
                />
              </div>
            </form>
          ) : (
            <SellerRequestTab
              prefill={{
                phone: initialConfig.phone,
                documentType: initialConfig.documentType,
                documentNumber: initialConfig.documentNumber,
                role: initialConfig.role,
              }}
              existingRequestStatus={existingRequestStatus ?? null}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
        active
          ? 'bg-white text-black shadow-sm'
          : 'text-gray-500 hover:text-gray-800 hover:bg-white/60'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function FormField({
  label,
  hint,
  required,
  icon,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="group">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors pointer-events-none">
            {icon}
          </div>
        )}
        <div className={icon ? '[&>input]:pl-10 [&>select]:pl-10' : ''}>{children}</div>
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
}

function SubmitButton({
  isLoading,
  label,
  loadingLabel,
}: {
  isLoading: boolean;
  label: string;
  loadingLabel: string;
}) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="px-8 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium shadow-sm"
    >
      {isLoading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {loadingLabel}
        </>
      ) : (
        <>
          {label}
          <ArrowRight size={16} />
        </>
      )}
    </button>
  );
}
