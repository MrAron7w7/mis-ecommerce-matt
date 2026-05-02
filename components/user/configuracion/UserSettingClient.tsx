'use client';

import { useState } from 'react';
import {
  User,
  Camera,
  Store,
  Phone,
  Building2,
  MapPin,
  Briefcase,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';

type UserConfig = {
  name?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  documentType?: string | null;
  documentNumber?: string | null;
  image?: string | null;
  role?: string | null;
};

export default function ProfileSettingsPage({ initialConfig }: { initialConfig: UserConfig }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'seller'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Estado para el perfil
  const [profileData, setProfileData] = useState({
    name: initialConfig?.name ?? '',
    lastName: initialConfig?.lastName ?? '',
    email: initialConfig?.email ?? '',
    phone: initialConfig?.phone ?? '',
    documentType: initialConfig?.documentType ?? 'DNI',
    documentNumber: initialConfig?.documentNumber ?? '',
  });

  // Estado para la solicitud de vendedor
  const [sellerRequest, setSellerRequest] = useState({
    businessName: '',
    businessType: '',
    address: '',
    phone: '',
    taxId: '',
    experience: '',
    message: '',
  });

  const [profileImage, setProfileImage] = useState<string | null>(
    initialConfig?.image ?? '/avatar-default.jpg',
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Aquí iría la llamada a la API para actualizar el perfil
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSellerRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Aquí iría la llamada a la API para enviar la solicitud
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-2">Configuración</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-1 text-sm sm:text-base font-medium transition-colors relative ${
              activeTab === 'profile'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <User size={18} />
              Información Personal
            </div>
          </button>
          <button
            onClick={() => setActiveTab('seller')}
            className={`pb-4 px-1 text-sm sm:text-base font-medium transition-colors relative ${
              activeTab === 'seller'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Store size={18} />
              Solicitar ser Vendedor
            </div>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="text-green-600 w-5 h-5" />
          <p className="text-green-700 text-sm">
            {activeTab === 'profile'
              ? '¡Perfil actualizado exitosamente!'
              : '¡Solicitud enviada! Revisaremos tu información en las próximas 48 horas.'}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {activeTab === 'profile' ? (
          <form onSubmit={handleProfileSubmit} className="p-6 sm:p-8">
            {/* Foto de Perfil */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Foto de perfil</label>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                    {profileImage && (
                      <Image
                        src={profileImage}
                        alt="Foto de perfil"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md cursor-pointer border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Camera size={16} className="text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <p className="text-sm text-gray-600">JPG, PNG o GIF. Máximo 2MB.</p>
                  <button
                    type="button"
                    className="text-sm text-red-600 hover:text-red-700 mt-1"
                    onClick={() => setProfileImage(null)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>

            {/* Campos del formulario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellidos</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">El correo no se puede modificar</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono/Celular
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de documento
                </label>
                <select
                  value={profileData.documentType}
                  onChange={(e) => setProfileData({ ...profileData, documentType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="DNI">DNI</option>
                  <option value="RUC">RUC</option>
                  <option value="CE">Carnet de Extranjería</option>
                  <option value="PASAPORTE">Pasaporte</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de documento
                </label>
                <input
                  type="text"
                  value={profileData.documentNumber}
                  onChange={(e) =>
                    setProfileData({ ...profileData, documentNumber: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar cambios'
                )}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSellerRequestSubmit} className="p-6 sm:p-8">
            {/* Banner informativo */}
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-3">
                <Store className="text-blue-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">¿Por qué vender con nosotros?</h3>
                  <p className="text-sm text-blue-700">
                    Llega a miles de clientes, recibe pagos seguros y gestiona tus ventas
                    fácilmente. Revisaremos tu solicitud en un plazo máximo de 48 horas.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Información del negocio */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Building2 size={20} />
                  Información del negocio
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del negocio *
                    </label>
                    <input
                      type="text"
                      required
                      value={sellerRequest.businessName}
                      onChange={(e) =>
                        setSellerRequest({ ...sellerRequest, businessName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Ej: Tienda de Ropa Elegante"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de negocio *
                    </label>
                    <select
                      required
                      value={sellerRequest.businessType}
                      onChange={(e) =>
                        setSellerRequest({ ...sellerRequest, businessType: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="">Selecciona...</option>
                      <option value="Ropa y Moda">Ropa y Moda</option>
                      <option value="Electrónica">Electrónica</option>
                      <option value="Hogar y Decoración">Hogar y Decoración</option>
                      <option value="Alimentos y Bebidas">Alimentos y Bebidas</option>
                      <option value="Salud y Belleza">Salud y Belleza</option>
                      <option value="Deportes">Deportes</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Datos de contacto */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Phone size={20} />
                  Datos de contacto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono de contacto *
                    </label>
                    <input
                      type="tel"
                      required
                      value={sellerRequest.phone}
                      onChange={(e) => setSellerRequest({ ...sellerRequest, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="+51 987 654 321"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RUC / Documento tributario *
                    </label>
                    <input
                      type="text"
                      required
                      value={sellerRequest.taxId}
                      onChange={(e) => setSellerRequest({ ...sellerRequest, taxId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="20XXXXXXXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Dirección */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <MapPin size={20} />
                  Ubicación
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección del negocio *
                  </label>
                  <input
                    type="text"
                    required
                    value={sellerRequest.address}
                    onChange={(e) => setSellerRequest({ ...sellerRequest, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Av. Principal 123, Lima, Perú"
                  />
                </div>
              </div>

              {/* Experiencia y motivación */}
              <div>
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Briefcase size={20} />
                  Experiencia y motivación
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experiencia en el negocio *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={sellerRequest.experience}
                      onChange={(e) =>
                        setSellerRequest({ ...sellerRequest, experience: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Describe tu experiencia vendiendo productos similares..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Por qué quieres vender con nosotros? *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={sellerRequest.message}
                      onChange={(e) =>
                        setSellerRequest({ ...sellerRequest, message: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Cuéntanos tus motivaciones y expectativas..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Enviando solicitud...
                  </>
                ) : (
                  'Enviar solicitud'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
