/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from '@/components/header/Navbar';
import Footer from '@/components/layouts/user/Footer';
import { Store, StoreProduct } from '@/actions/user/store.user.action';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  ArrowLeft,
  Calendar,
  ShoppingBag,
  Star,
  Phone,
  Mail,
  MapPin,
  Globe,
  Clock,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import Facebook from '@/components/svgs/facebook';
import Instagram from '@/components/svgs/Instagram';
import Tiktok from '@/components/svgs/Tiktok';
import Whatsapp from '@/components/svgs/Whatsapp';

type UserStoreClientIDProps = {
  store: Store;
};

function ProductCard({ product }: { product: StoreProduct }) {
  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-square bg-gray-50 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={28} className="text-gray-200" />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
        <p className="text-sm font-semibold text-gray-900 mt-1">S/ {product.price.toFixed(2)}</p>
        {product.stock <= 5 && product.stock > 0 && (
          <span className="inline-block text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full mt-1.5">
            Solo {product.stock} disponibles
          </span>
        )}
      </div>
    </Link>
  );
}

// Componente para Social Media
function SocialMediaLinks({ socialMedia }: { socialMedia: Store['socialMedia'] }) {
  if (!socialMedia) return null;

  const socialIcons: Record<string, { icon: any; label: string; color: string }> = {
    facebook: { icon: Facebook, label: 'Facebook', color: 'hover:bg-[#1877F2]' },
    instagram: { icon: Instagram, label: 'Instagram', color: 'hover:bg-[#E4405F]' },
    tiktok: {
      icon: Tiktok,
      label: 'TikTok',
      color: 'hover:bg-black',
    },
    whatsapp: { icon: Whatsapp, label: 'WhatsApp', color: 'hover:bg-[#25D366]' },
  };

  const activeSocials = Object.entries(socialMedia)
    .filter(([_, data]) => data.enabled && data.url)
    .map(([platform, data]) => ({ platform, url: data.url, ...socialIcons[platform] }))
    .filter((social) => social.icon);

  if (activeSocials.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {activeSocials.map(({ platform, url, icon: Icon, label, color }) => (
        <a
          key={platform}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-sm transition-all duration-200 ${color.replace('hover:bg', 'hover:text-white')} hover:scale-105`}
        >
          <Icon size={14} />
          <span className="text-xs">{label}</span>
        </a>
      ))}
    </div>
  );
}

// Componente para Horarios
function BusinessHours({ businessHours }: { businessHours: Store['businessHours'] }) {
  if (!businessHours) return null;

  const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const daysSpanish: Record<string, string> = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  const now = new Date();
  const currentDay = daysOrder[now.getDay() === 0 ? 6 : now.getDay() - 1];
  const currentHours = businessHours[currentDay];
  const isOpenNow =
    currentHours?.isOpen && currentHours?.open && currentHours?.close
      ? (() => {
          const nowTime = now.getHours() * 60 + now.getMinutes();
          const [openHour, openMin] = currentHours.open.split(':').map(Number);
          const [closeHour, closeMin] = currentHours.close.split(':').map(Number);
          const openTime = openHour * 60 + openMin;
          const closeTime = closeHour * 60 + closeMin;
          return nowTime >= openTime && nowTime <= closeTime;
        })()
      : false;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-gray-400" />
          <h3 className="font-semibold text-gray-900">Horario de atención</h3>
        </div>
        <div
          className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${isOpenNow ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}
        >
          {isOpenNow ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          {isOpenNow ? 'Abierto ahora' : 'Cerrado ahora'}
        </div>
      </div>

      <div className="space-y-2">
        {daysOrder.map((day) => {
          const hours = businessHours[day];
          if (!hours) return null;

          return (
            <div
              key={day}
              className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0"
            >
              <span
                className={`font-medium ${day === currentDay ? 'text-emerald-600' : 'text-gray-700'}`}
              >
                {daysSpanish[day]}
                {day === currentDay && <span className="ml-2 text-xs text-emerald-600">(Hoy)</span>}
              </span>
              {hours.isOpen ? (
                <span className="text-gray-600">
                  {hours.open} - {hours.close}
                </span>
              ) : (
                <span className="text-gray-400 text-sm">Cerrado</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Componente para Información de Contacto
function ContactInfo({ store }: { store: Store }) {
  const contactItems = [
    {
      icon: Phone,
      label: 'Teléfono',
      value: store.phone,
      href: store.phone ? `tel:${store.phone}` : null,
    },
    {
      icon: Mail,
      label: 'Email',
      value: store.email,
      href: store.email ? `mailto:${store.email}` : null,
    },
    {
      icon: MapPin,
      label: 'Dirección',
      value: store.address,
      href: store.address
        ? `https://maps.google.com/?q=${encodeURIComponent(store.address)}`
        : null,
    },
    {
      icon: Globe,
      label: 'Sitio web',
      value: store.website,
      href: store.website
        ? store.website.startsWith('http')
          ? store.website
          : `https://${store.website}`
        : null,
    },
  ];

  const activeContacts = contactItems.filter((item) => item.value);

  if (activeContacts.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Phone size={18} className="text-gray-400" />
        <h3 className="font-semibold text-gray-900">Información de contacto</h3>
      </div>

      <div className="space-y-3">
        {activeContacts.map(({ icon: Icon, label, value, href }) => (
          <div key={label} className="flex items-start gap-3 text-sm">
            <Icon size={16} className="text-gray-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">{label}</p>
              {href ? (
                <a
                  href={href}
                  target={label === 'Dirección' || label === 'Sitio web' ? '_blank' : undefined}
                  rel={
                    label === 'Dirección' || label === 'Sitio web'
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className="text-gray-700 hover:text-emerald-600 transition-colors break-words inline-flex items-center gap-1"
                >
                  {value}
                  <ExternalLink
                    size={12}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              ) : (
                <p className="text-gray-700 break-words">{value}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UserStoreClientID({ store }: UserStoreClientIDProps) {
  const fullName = [store.sellerName, store.sellerLastName].filter(Boolean).join(' ');
  const displayName = store.storeName ?? fullName;
  const initials = `${store.sellerName?.[0] ?? ''}${store.sellerLastName?.[0] ?? ''}`.toUpperCase();
  const sinceDate = new Date(store.since).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
  });

  const hasContactInfo = store.phone || store.address || store.website || store.socialMedia;
  const hasBusinessHours = store.businessHours;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Cover / Hero */}
        <div className="relative h-52 sm:h-64 bg-gray-950 overflow-hidden">
          {store.storeCover ? (
            <Image
              src={store.storeCover}
              alt={displayName}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />
          )}
          {/* overlay siempre presente para legibilidad */}
          <div className="absolute inset-0 bg-black/50" />

          {/* Botón volver */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <Link
              href="/tiendas"
              className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              Volver a tiendas
            </Link>
          </div>
        </div>

        {/* Perfil — se superpone al cover */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                {/* Logo / Avatar */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-gray-100">
                    {store.storeLogo ? (
                      <Image
                        src={store.storeLogo}
                        alt={displayName}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    ) : store.image ? (
                      <Image
                        src={store.image}
                        alt={fullName}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">{initials}</span>
                      </div>
                    )}
                  </div>
                  {/* badge activo */}
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white" />
                </div>

                {/* Info */}
                <div className="text-center sm:text-left flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{displayName}</h1>
                  {store.storeName && <p className="text-sm text-gray-400 mt-0.5">{fullName}</p>}

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      <span className="font-medium">4.8</span>
                      <span className="text-gray-400">rating</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <ShoppingBag size={13} className="text-gray-400" />
                      <span>
                        <strong>{store.productCount}</strong> productos
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Calendar size={13} className="text-gray-400" />
                      <span>
                        Desde <strong>{sinceDate}</strong>
                      </span>
                    </div>
                  </div>

                  {store.description && (
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed ">
                      {store.description}
                    </p>
                  )}

                  {/* Redes Sociales */}
                  <SocialMediaLinks socialMedia={store.socialMedia} />
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Contacto y Horarios */}
          {(hasContactInfo || hasBusinessHours) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {hasContactInfo && <ContactInfo store={store} />}
              {hasBusinessHours && <BusinessHours businessHours={store.businessHours} />}
            </div>
          )}

          {/* Productos */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Productos de la tienda
                <span className="ml-2 text-sm font-normal text-gray-400">
                  ({store.products.length})
                </span>
              </h2>
            </div>

            {store.products.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
                <Package size={40} className="mx-auto text-gray-200 mb-3" />
                <p className="text-gray-500">Esta tienda no tiene productos disponibles aún.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-12">
                {store.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
