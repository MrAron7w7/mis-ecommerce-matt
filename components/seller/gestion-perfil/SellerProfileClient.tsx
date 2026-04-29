/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRef, useState } from 'react';
import {
  Store,
  Edit2,
  Save,
  X,
  Camera,
  Mail,
  Phone,
  MapPin,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  ExternalLink,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SellerProfile } from '@/lib/types/type.models';
import {
  saveStoreProfile,
  uploadSellerCover,
  uploadSellerLogo,
} from '@/actions/seller/profile.seller.action';
import { useToast } from '@/components/ui/custom-toast';
import Facebook from '@/components/svgs/facebook';
import Instagram from '@/components/svgs/Instagram';
import Whatsapp from '@/components/svgs/Whatsapp';
import Tiktok from '@/components/svgs/Tiktok';

type SocialNetwork = {
  name: string;
  key: string;
  icon: any;
  url: string;
  enabled: boolean;
  color: string;
  placeholder: string;
};

type BusinessHours = {
  monday: { open: string; close: string; isOpen: boolean };
  tuesday: { open: string; close: string; isOpen: boolean };
  wednesday: { open: string; close: string; isOpen: boolean };
  thursday: { open: string; close: string; isOpen: boolean };
  friday: { open: string; close: string; isOpen: boolean };
  saturday: { open: string; close: string; isOpen: boolean };
  sunday: { open: string; close: string; isOpen: boolean };
};

type StoreProfile = {
  storeName: string;
  description: string;
  logo: string | null;
  coverImage: string | null;
  email: string;
  phone: string;
  address: string;
  website: string;
  socialMedia: SocialNetwork[];
  businessHours: BusinessHours;
};

// Definición base de redes sociales (metadatos fijos)
const SOCIAL_DEFAULTS: Omit<SocialNetwork, 'url' | 'enabled'>[] = [
  {
    name: 'Facebook',
    key: 'facebook',
    icon: Facebook,
    color: 'text-blue-600',
    placeholder: 'https://facebook.com/tutienda',
  },
  {
    name: 'Instagram',
    key: 'instagram',
    icon: Instagram,
    color: 'text-pink-600',
    placeholder: 'https://instagram.com/tutienda',
  },
  {
    name: 'WhatsApp',
    key: 'whatsapp',
    icon: Whatsapp,
    color: 'text-emerald-600',
    placeholder: 'https://wa.me/tunumero',
  },
  {
    name: 'Tiktok',
    key: 'tiktok',
    icon: Tiktok,
    color: 'text-pink-600',
    placeholder: 'https://tiktok.com/tutienda',
  },
];

const DEFAULT_HOURS: BusinessHours = {
  monday: { open: '09:00', close: '18:00', isOpen: true },
  tuesday: { open: '09:00', close: '18:00', isOpen: true },
  wednesday: { open: '09:00', close: '18:00', isOpen: true },
  thursday: { open: '09:00', close: '18:00', isOpen: true },
  friday: { open: '09:00', close: '18:00', isOpen: true },
  saturday: { open: '10:00', close: '14:00', isOpen: true },
  sunday: { open: '09:00', close: '13:00', isOpen: false },
};

const DAYS = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
];

// Construye el estado inicial leyendo los datos de BD
function buildInitialProfile(initialData: SellerProfile | null): StoreProfile {
  // Leer socialMedia guardado en BD (formato: { facebook: { url, enabled }, ... })
  const savedSocial = (initialData?.socialMedia ?? {}) as Record<
    string,
    { url: string; enabled: boolean }
  >;

  // Leer businessHours guardado en BD
  const savedHours = (initialData?.businessHours ?? {}) as Partial<BusinessHours>;

  return {
    storeName: initialData?.storeName ?? '',
    description: initialData?.description ?? '',
    logo: initialData?.logo ?? null,
    coverImage: initialData?.coverImage ?? null,
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    address: initialData?.address ?? '',
    website: initialData?.website ?? '',
    socialMedia: SOCIAL_DEFAULTS.map((s) => ({
      ...s,
      url: savedSocial[s.key]?.url ?? '',
      enabled: savedSocial[s.key]?.enabled ?? false,
    })),
    businessHours: {
      monday: { ...DEFAULT_HOURS.monday, ...(savedHours.monday ?? {}) },
      tuesday: { ...DEFAULT_HOURS.tuesday, ...(savedHours.tuesday ?? {}) },
      wednesday: { ...DEFAULT_HOURS.wednesday, ...(savedHours.wednesday ?? {}) },
      thursday: { ...DEFAULT_HOURS.thursday, ...(savedHours.thursday ?? {}) },
      friday: { ...DEFAULT_HOURS.friday, ...(savedHours.friday ?? {}) },
      saturday: { ...DEFAULT_HOURS.saturday, ...(savedHours.saturday ?? {}) },
      sunday: { ...DEFAULT_HOURS.sunday, ...(savedHours.sunday ?? {}) },
    },
  };
}

interface SellerProfileClientProps {
  initialData: SellerProfile | null;
}
export default function SellerProfileClient({ initialData }: SellerProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const toast = useToast();

  const [profile, setProfile] = useState<StoreProfile>(() => buildInitialProfile(initialData));
  const [formData, setFormData] = useState<StoreProfile>(() => buildInitialProfile(initialData));

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        socialMedia: formData.socialMedia.reduce<Record<string, { url: string; enabled: boolean }>>(
          (acc, s) => ({ ...acc, [s.key]: { url: s.url, enabled: s.enabled } }),
          {},
        ),
      };
      const res = await saveStoreProfile(payload);

      if (!res.success) {
        showMessage('error', res.error || 'Error al guardar');
        return;
      }

      setProfile(formData);
      setIsEditing(false);
      showMessage('success', 'Perfil actualizado correctamente');
    } catch (err) {
      console.error(err);
      showMessage('error', 'Error al guardar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile); // descarta cambios
    setIsEditing(false);
  };

  const handleToggleDay = (day: string) => {
    const key = day as keyof BusinessHours;
    setFormData((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [key]: { ...prev.businessHours[key], isOpen: !prev.businessHours[key].isOpen },
      },
    }));
  };

  const handleHoursChange = (day: string, field: 'open' | 'close', value: string) => {
    const key = day as keyof BusinessHours;
    setFormData((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [key]: { ...prev.businessHours[key], [field]: value },
      },
    }));
  };

  const handleSocialToggle = (index: number) => {
    setFormData((prev) => {
      const updated = [...prev.socialMedia];
      updated[index] = { ...updated[index], enabled: !updated[index].enabled };
      return { ...prev, socialMedia: updated };
    });
  };

  const handleSocialUrlChange = (index: number, url: string) => {
    setFormData((prev) => {
      const updated = [...prev.socialMedia];
      updated[index] = { ...updated[index], url };
      return { ...prev, socialMedia: updated };
    });
  };

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview inmediato
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;

      // Actualizar preview local
      setProfile((p) => ({ ...p, logo: base64 }));
      setFormData((p) => ({ ...p, logo: base64 }));

      // Subir al servidor
      setUploadingLogo(true);
      try {
        const res = await uploadSellerLogo(base64);
        if (!res.success) throw new Error(res.error);
        // Reemplazar base64 por la URL real
        setProfile((p) => ({ ...p, logo: res.logoUrl }));
        setFormData((p) => ({ ...p, logo: res.logoUrl }));
        showMessage('success', 'Logo actualizado');
      } catch (err) {
        console.error(err);
        showMessage('error', 'Error al subir el logo');
        // Revertir preview si falla
        setProfile((p) => ({ ...p, logo: initialData?.logo ?? null }));
        setFormData((p) => ({ ...p, logo: initialData?.logo ?? null }));
      } finally {
        setUploadingLogo(false);
        e.target.value = ''; // reset input
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;

      setProfile((p) => ({ ...p, coverImage: base64 }));
      setFormData((p) => ({ ...p, coverImage: base64 }));

      setUploadingCover(true);
      try {
        const res = await uploadSellerCover(base64);
        if (!res.success) throw new Error(res.error);
        setProfile((p) => ({ ...p, coverImage: res.coverUrl }));
        setFormData((p) => ({ ...p, coverImage: res.coverUrl }));
        showMessage('success', 'Portada actualizada');
      } catch (err) {
        console.error(err);
        showMessage('error', 'Error al subir la portada');
        setProfile((p) => ({ ...p, coverImage: initialData?.coverImage ?? null }));
        setFormData((p) => ({ ...p, coverImage: initialData?.coverImage ?? null }));
      } finally {
        setUploadingCover(false);
        e.target.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con imagen de portada */}
      <div className="relative h-48 bg-linear-to-r from-gray-800 to-gray-900">
        {/* Input oculto */}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleCoverChange}
        />

        {profile.coverImage && (
          <Image src={profile.coverImage} alt="Cover" fill className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40" />

        {isEditing && (
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={uploadingCover}
            className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-all text-sm disabled:opacity-50"
          >
            {uploadingCover ? (
              <span className="w-3.5 h-3.5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera className="w-3.5 h-3.5" />
            )}
            {uploadingCover ? 'Subiendo...' : 'Cambiar portada'}
          </button>
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Perfil Header */}
        <div className="relative -mt-16 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex items-center gap-5">
                  {/* Logo */}
                  <div className="relative">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleLogoChange}
                    />

                    <div className="w-24 h-24 rounded-xl bg-gray-100 border-4 border-white shadow-sm overflow-hidden">
                      {profile.logo ? (
                        <Image src={profile.logo} alt="Logo" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-emerald-100 to-emerald-200">
                          <Store className="w-8 h-8 text-emerald-600" />
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        disabled={uploadingLogo}
                        className="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition-all disabled:opacity-50"
                      >
                        {uploadingLogo ? (
                          <span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin block" />
                        ) : (
                          <Camera className="w-3 h-3 text-gray-500" />
                        )}
                      </button>
                    )}
                  </div>

                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.storeName}
                        onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                        className="text-xl font-bold text-gray-900 border-b-2 border-emerald-400 outline-none px-1"
                      />
                    ) : (
                      <h1 className="text-xl font-bold text-gray-900">{profile.storeName}</h1>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-gray-600">4.8</span>
                      </div>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">Verificada</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Editar
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isLoading || uploadingLogo || uploadingCover}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                      >
                        {isLoading ? (
                          'Guardando...'
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" /> Guardar
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
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

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descripción */}
            <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3">Descripción</h3>
              {isEditing ? (
                <textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 outline-none transition-all resize-none text-sm"
                  placeholder="Describe tu negocio..."
                />
              ) : (
                <p className="text-gray-600 text-sm leading-relaxed">{profile.description}</p>
              )}
            </div>

            {/* Horario */}
            <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                Horario de atención
              </h3>
              <div className="space-y-2">
                {DAYS.map((day) => {
                  const hours =
                    formData.businessHours[day.key as keyof typeof formData.businessHours];
                  return (
                    <div key={day.key} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <button
                            onClick={() => handleToggleDay(day.key)}
                            className={`w-4 h-4 rounded border transition-all ${
                              hours.isOpen
                                ? 'bg-emerald-500 border-emerald-500'
                                : 'bg-white border-gray-300'
                            }`}
                          />
                        ) : (
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${hours.isOpen ? 'bg-emerald-500' : 'bg-gray-300'}`}
                          />
                        )}
                        <span className="text-sm text-gray-600 w-20">{day.label}</span>
                      </div>
                      {isEditing && hours.isOpen ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={hours.open}
                            onChange={(e) => handleHoursChange(day.key, 'open', e.target.value)}
                            className="px-2 py-1 text-sm rounded border border-gray-200 focus:border-emerald-400 outline-none"
                          >
                            {['08:00', '09:00', '10:00', '11:00'].map((t) => (
                              <option key={t}>{t}</option>
                            ))}
                          </select>
                          <span className="text-gray-400 text-xs">a</span>
                          <select
                            value={hours.close}
                            onChange={(e) => handleHoursChange(day.key, 'close', e.target.value)}
                            className="px-2 py-1 text-sm rounded border border-gray-200 focus:border-emerald-400 outline-none"
                          >
                            {['17:00', '18:00', '19:00', '20:00', '21:00'].map((t) => (
                              <option key={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      ) : hours.isOpen ? (
                        <span className="text-sm text-gray-500">
                          {hours.open} - {hours.close}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Cerrado</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Redes Sociales - Con checkbox para activar/desactivar */}
            <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
              <h3 className="font-medium text-gray-900 mb-1">Redes sociales</h3>
              <p className="text-xs text-gray-500 mb-5">
                Activa las redes que usas y agrega tus enlaces
              </p>

              {/* MODO LECTURA */}
              {!isEditing && (
                <div className="flex gap-3 flex-wrap">
                  {formData.socialMedia.map((social) => {
                    const Icon = social.icon;
                    return (
                      <div key={social.key} className="relative group">
                        <a
                          href={social.enabled && social.url ? social.url : undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-center w-11 h-11 rounded-xl border transition-all ${
                            social.enabled && social.url
                              ? 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 cursor-pointer'
                              : 'border-gray-100 bg-gray-50 opacity-35 cursor-default pointer-events-none'
                          }`}
                        >
                          <Icon
                            className={`w-5 h-5 ${social.enabled && social.url ? social.color : 'text-gray-400'}`}
                          />
                        </a>

                        {/* Tooltip */}
                        <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <div className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 shadow-sm whitespace-nowrap">
                            <p className="text-xs font-medium text-gray-800">{social.name}</p>
                            <p className="text-[11px] text-gray-400 max-w-40 truncate">
                              {social.url
                                ? social.url.replace(/^https?:\/\//, '')
                                : 'No configurado'}
                            </p>
                          </div>
                          {/* flecha */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gray-200" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* MODO EDICIÓN */}
              {isEditing && (
                <div className="flex flex-col gap-3">
                  {formData.socialMedia.map((social, idx) => {
                    const Icon = social.icon;
                    return (
                      <div key={social.key} className="flex items-center gap-3">
                        {/* Toggle switch */}
                        <button
                          type="button"
                          role="switch"
                          aria-checked={social.enabled}
                          onClick={() => handleSocialToggle(idx)}
                          className={`relative w-9 h-5 rounded-full shrink-0 transition-colors duration-200 ${
                            social.enabled ? 'bg-emerald-500' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                              social.enabled ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>

                        {/* Icono + nombre */}
                        <div className="flex items-center gap-1.5 w-24 shrink-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 ${
                              social.enabled ? social.color : 'text-gray-300'
                            }`}
                          />
                          <span
                            className={`text-sm ${
                              social.enabled ? 'text-gray-700' : 'text-gray-400'
                            }`}
                          >
                            {social.name}
                          </span>
                        </div>

                        {/* Input URL */}
                        <div className="flex-1">
                          <input
                            type="url"
                            value={social.url}
                            onChange={(e) => handleSocialUrlChange(idx, e.target.value)}
                            disabled={!social.enabled}
                            placeholder={social.placeholder}
                            className={`w-full px-3 py-1.5 text-sm rounded-lg border outline-none transition-all ${
                              !social.enabled
                                ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'
                                : social.url
                                  ? 'bg-white border-gray-200 text-gray-900 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100'
                                  : 'bg-white border-gray-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100'
                            }`}
                          />
                        </div>

                        {/* Indicador de estado */}
                        <div
                          className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                            social.enabled && social.url.startsWith('http')
                              ? 'bg-emerald-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Contacto */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-sm">
              <h3 className="font-medium text-gray-900 mb-4">Contacto</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:border-emerald-400 outline-none"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{profile.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                    <Phone className="w-3 h-3" />
                    Teléfono
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:border-emerald-400 outline-none"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{profile.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3" />
                    Dirección
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:border-emerald-400 outline-none"
                    />
                  ) : (
                    <p className="text-sm text-gray-900">{profile.address}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                    <Globe className="w-3 h-3" />
                    Sitio web
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:border-emerald-400 outline-none"
                      placeholder="tu-sitio.com"
                    />
                  ) : (
                    profile.website && (
                      <a
                        href={`https://${profile.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
                      >
                        {profile.website}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estado de la tienda</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Activa
                  </span>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-2">¿Necesitas ayuda?</h3>
              <p className="text-sm text-gray-500 mb-3">Consulta nuestra guía para vendedores</p>
              <Link
                href="/soporte"
                className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium hover:text-emerald-700"
              >
                Centro de ayuda
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
