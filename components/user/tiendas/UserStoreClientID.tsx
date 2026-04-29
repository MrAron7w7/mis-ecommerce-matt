import Navbar from '@/components/header/Navbar';
import Footer from '@/components/layouts/user/Footer';
import { Store, StoreProduct } from '@/actions/user/store.user.action';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ArrowLeft, Calendar, ShoppingBag, Star } from 'lucide-react';

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

export default function UserStoreClientID({ store }: UserStoreClientIDProps) {
  const fullName = [store.sellerName, store.sellerLastName].filter(Boolean).join(' ');
  const displayName = store.storeName ?? fullName;
  const initials = `${store.sellerName?.[0] ?? ''}${store.sellerLastName?.[0] ?? ''}`.toUpperCase();
  const sinceDate = new Date(store.since).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
  });

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
              <div className="flex flex-col sm:flex-row  items-center sm:items-start gap-5">
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
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center ">
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
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                      {store.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Productos */}
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Productos de la tienda
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({store.products.length})
            </span>
          </h2>

          {store.products.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 mb-12">
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
      </main>
      <Footer />
    </>
  );
}
