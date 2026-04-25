// components/user/tiendas/StoreCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Store, ShoppingBag, Star } from 'lucide-react';
import { Store as StoreType } from '@/actions/user/store.user.action';

type StoreCardProps = {
  store: StoreType;
};

export default function StoreCard({ store }: StoreCardProps) {
  const sellerFullName = store.sellerLastName
    ? `${store.sellerName} ${store.sellerLastName}`
    : store.sellerName;

  const featuredProducts = store.products.slice(0, 4);

  return (
    <Link href={`/tiendas/${store.id}`} className="block group">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-gray-800 to-gray-900 relative">
          <div className="absolute -bottom-8 left-6">
            <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
              {store.image ? (
                <Image
                  src={store.image}
                  alt={store.sellerName}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Store size={28} className="text-gray-500" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="pt-10 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition line-clamp-1">
                {sellerFullName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">4.8</span>
                </div>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{store.productCount} productos</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Desde</p>
              <p className="text-xs font-medium text-gray-700">
                {new Date(store.since).getFullYear()}
              </p>
            </div>
          </div>

          {/* Productos destacados */}
          {featuredProducts.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                Productos destacados
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {featuredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden"
                  >
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={16} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ver tienda */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Ver tienda</span>
              <span className="text-gray-900 group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
