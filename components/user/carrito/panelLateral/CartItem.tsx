'use client';

import { useCartStore } from '@/store/cartStore';
import type { CartItemType } from '@/store/cartStore';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQty, removeItem } = useCartStore();

  return (
    <li className="flex gap-4 items-start">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
        <p className="text-sm font-semibold mt-1">${item.price.toFixed(2)}</p>
      </div>

      <div className="flex flex-col items-end gap-2">
        {/* Control de cantidad */}
        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md">
          <button
            onClick={() => updateQty(item.id, item.quantity - 1)}
            className="px-2 py-1 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-l-md transition-colors"
            aria-label="Reducir cantidad"
          >
            −
          </button>
          <span className="px-3 py-1 text-sm border-x border-gray-200 dark:border-gray-700 min-w-[32px] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQty(item.id, item.quantity + 1)}
            className="px-2 py-1 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-r-md transition-colors"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        {/* Eliminar */}
        <button
          onClick={() => removeItem(item.id)}
          className="text-xs text-red-400 hover:text-red-600 transition-colors"
          aria-label={`Eliminar ${item.name}`}
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}
