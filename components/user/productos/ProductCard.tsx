// components/user/productos/ProductCard.tsx (actualizado)
'use client';

import { Heart } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import QuickViewModal from './QuickViewModal';
import { PublicProduct } from '@/actions/user/product.user.action';

export default function ProductCard({
  product,
  viewMode = 'grid',
}: {
  product: PublicProduct;
  viewMode?: 'grid' | 'list';
}) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  if (viewMode === 'list') {
    return (
      <>
        <div
          className="flex gap-4 p-4 border border-gray-100 rounded-lg hover:shadow-md transition-all cursor-pointer group"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                Sin imagen
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500 mt-1">${product.price}</p>
              {product.colors.length > 0 && (
                <div className="flex gap-1.5 mt-2">
                  {product.colors.slice(0, 3).map((color, i) => (
                    <span
                      key={i}
                      className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowQuickView(true)}
              className="mt-3 w-full py-2 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Vista rápida
            </button>
          </div>
        </div>
        <QuickViewModal
          product={product}
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
        />
      </>
    );
  }

  return (
    <>
      <div
        className="group relative flex flex-col gap-2 cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative overflow-hidden aspect-[3/4] w-full rounded-lg bg-gray-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Sin imagen
            </div>
          )}

          <button
            onClick={() => setLiked(!liked)}
            className="absolute top-3 right-3 z-10 transition-all duration-300 hover:scale-110"
          >
            <Heart
              size={20}
              className={`transition-all duration-300 ${
                liked ? 'fill-gray-900 text-gray-900' : 'text-gray-600 hover:text-gray-900'
              }`}
            />
          </button>
          <button
            onClick={() => setShowQuickView(true)}
            className={`
              absolute inset-x-4 bottom-4 py-2.5 bg-white text-gray-900 text-sm font-medium rounded-full
              transition-all duration-300 shadow-md hover:shadow-lg
              ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            `}
          >
            Vista rápida
          </button>
        </div>

        {product.variants.length > 0 && (
          <div className="mt-1 flex gap-1">
            {product.variants.slice(0, 2).map((variant, i) => (
              <span key={i} className="text-[15px] text-gray-400">
                {variant.type}: {variant.value}
                {i < Math.min(product.variants.length, 2) - 1 && ' • '}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-0.5 px-0.5">
          <p className="text-sm font-light text-gray-800 tracking-wide leading-snug hover:text-gray-600 transition-colors">
            {product.name}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">${product.price}</p>
            {product.stock < 5 && product.stock > 0 && (
              <span className="text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                ¡Últimas unidades!
              </span>
            )}
          </div>
        </div>
      </div>

      <QuickViewModal
        key={product.id}
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
}
