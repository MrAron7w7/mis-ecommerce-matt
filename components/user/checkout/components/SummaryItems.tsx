'use client';

import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '../utils/checkout.utils';

export function SummaryItems() {
  const { items } = useCartStore();

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
            <p className="text-xs text-gray-400">x{item.quantity}</p>
          </div>
          <p className="text-xs font-semibold text-gray-900 flex-shrink-0">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      ))}
    </div>
  );
}
