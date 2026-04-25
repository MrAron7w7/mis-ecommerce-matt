import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { PublicProduct } from '../productos/types';

export default function ProductCard({ product }: { product: PublicProduct }) {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Imagen */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={product.imageUrl || '/images/placeholder.png'}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
        />
        <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-black hover:text-white transition-colors">
          <ShoppingBag size={16} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{product.name}</h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">${product.price}</span>
          {product.price > product.price && (
            <span className="text-xs text-gray-400 line-through">${product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
}
