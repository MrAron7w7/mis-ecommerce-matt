'use client';

import { useCartStore } from '@/store/cartStore';
import { CartItem } from './CartItem';

export function CartItemsList() {
  const { items } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path
            d="M6 6h4l6 24h20l4-16H14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="38" r="2" fill="currentColor" />
          <circle cx="34" cy="38" r="2" fill="currentColor" />
        </svg>
        <p className="text-sm">Tu carrito está vacío</p>
      </div>
    );
  }

  return (
    <ul className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </ul>
  );
}
