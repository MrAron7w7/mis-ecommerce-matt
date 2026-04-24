'use client';

import { Heart } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PublicProduct } from '@/actions/user/product.user.action';

type ProductCardProps = {
  product: PublicProduct;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  console.log('ProductCard:', product.slug);

  return (
    <div
      className="group relative flex flex-col gap-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/productos/${product.slug}`} className="block">
        <div className="relative overflow-hidden aspect-[3/4] w-full rounded-xl bg-gray-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Sin imagen
            </div>
          )}

          {product.stock < 5 && product.stock > 0 && (
            <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              ¡Últimas {product.stock}!
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                Agotado
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLiked(!liked);
            }}
            className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 transition-all hover:scale-110 shadow-sm"
            aria-label="Agregar a favoritos"
          >
            <Heart size={16} className={liked ? 'fill-gray-900 text-gray-900' : 'text-gray-600'} />
          </button>
        </div>

        {/* Product Info */}
        <div className="mt-3 space-y-1">
          <p className="text-xs text-gray-400 uppercase tracking-wider">{product.category}</p>
          <p className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors line-clamp-2">
            {product.name}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-gray-900">${product.price}</span>
          </div>

          {/* Colors preview */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {product.colors.slice(0, 3).map((color, i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full border border-gray-200"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[10px] text-gray-400">+{product.colors.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
