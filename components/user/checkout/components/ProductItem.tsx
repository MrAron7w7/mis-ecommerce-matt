'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '../utils/checkout.utils';
import { CheckoutItem } from '../types/checkout.types';

interface ProductItemProps {
  item: CheckoutItem;
}

export function ProductItem({ item }: ProductItemProps) {
  const { updateQty, removeItem } = useCartStore();
  const subtotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 py-5">
      {/* Imagen */}
      <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            Sin imagen
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
            {item.category && (
              <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">
                {item.category}
              </p>
            )}
            {item.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">{formatPrice(item.price)} por unidad</p>
          </div>
          <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
            {formatPrice(subtotal)}
          </p>
        </div>

        {/* Controles cantidad */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-200 rounded-full">
            <button
              onClick={() => updateQty(item.id, item.quantity - 1)}
              className="p-1.5 hover:bg-gray-50 rounded-l-full transition-colors"
              aria-label="Reducir cantidad"
            >
              <Minus size={14} />
            </button>
            <span className="px-3 text-sm font-medium min-w-[32px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQty(item.id, item.quantity + 1)}
              className="p-1.5 hover:bg-gray-50 rounded-r-full transition-colors"
              aria-label="Aumentar cantidad"
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
            aria-label={`Eliminar ${item.name}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
