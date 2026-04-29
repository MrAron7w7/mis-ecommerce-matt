'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Star, ArrowUpRight } from 'lucide-react';
import { Store as StoreType } from '@/actions/user/store.user.action';

type StoreCardProps = {
  store: StoreType;
};

export default function StoreCard({ store }: StoreCardProps) {
  const sellerFullName = store.sellerLastName
    ? `${store.sellerName} ${store.sellerLastName}`
    : store.sellerName;

  const displayName = store.storeName ?? sellerFullName;

  const initials = `${store.sellerName?.[0] ?? ''}${store.sellerLastName?.[0] ?? ''}`.toUpperCase();
  const featuredProducts = store.products.slice(0, 4);

  return (
    <Link href={`/tiendas/${store.id}`} className="block group">
      <div className="relative bg-white rounded-3xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-xl transition-all duration-500">
        {/* Banner / Cover */}
        <div className="h-28 relative overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-gray-700">
          {store.storeCover ? (
            <Image
              src={store.storeCover}
              alt={displayName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />
          )}
          {/* overlay sutil para legibilidad si hay cover */}
          {store.storeCover && <div className="absolute inset-0 bg-black/30" />}
          <div className="absolute top-3 right-3 z-10">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
              <ArrowUpRight
                size={14}
                className="text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* Logo / Avatar */}
        <div className="absolute top-16 left-5 z-10">
          <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border-2 border-white overflow-hidden flex items-center justify-center">
            {store.storeLogo ? (
              <Image
                src={store.storeLogo}
                alt={displayName}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            ) : store.image ? (
              <Image
                src={store.image}
                alt={sellerFullName}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <span className="text-white font-bold text-xl">{initials}</span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="pt-14 px-5 pb-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-base leading-tight group-hover:text-gray-600 transition-colors">
                {displayName}
              </h3>
              {/* Si tiene storeName, muestra también el nombre real del vendedor */}
              {store.storeName && <p className="text-xs text-gray-400 mt-0.5">{sellerFullName}</p>}
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium text-gray-700">4.8</span>
                </div>
                <span className="text-gray-200">·</span>
                <span className="text-xs text-gray-400">
                  Desde {new Date(store.since).getFullYear()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-gray-50 rounded-full px-2.5 py-1">
              <ShoppingBag size={11} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-600">{store.productCount}</span>
            </div>
          </div>

          {/* Descripción corta si existe */}
          {store.description && (
            <p className="text-xs text-gray-400 leading-relaxed mb-3 line-clamp-2">
              {store.description}
            </p>
          )}

          {/* Preview productos */}
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-4 gap-1.5 mt-3">
              {featuredProducts.map((product, i) => (
                <div
                  key={product.id}
                  className={`aspect-square rounded-xl overflow-hidden bg-gray-100 ${
                    i === 0 ? 'col-span-2 row-span-2' : ''
                  }`}
                >
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={i === 0 ? 300 : 150}
                      height={i === 0 ? 300 : 150}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <ShoppingBag size={14} className="text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 h-16 rounded-xl bg-gray-50 flex items-center justify-center">
              <p className="text-xs text-gray-400">Sin productos aún</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
