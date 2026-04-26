'use client';

import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';

export function CartActions() {
  const { items, clearCart, closeCart } = useCartStore();
  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  const isEmpty = items.length === 0;

  return (
    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
      <button
        onClick={handleCheckout}
        disabled={isEmpty}
        className="
          w-full py-3 rounded-xl text-sm font-medium
          bg-gray-900 text-white
          hover:bg-gray-700 transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed
        "
      >
        Proceder al pago
      </button>

      <button
        onClick={clearCart}
        disabled={isEmpty}
        className="
          w-full py-2 rounded-xl text-sm
          text-gray-400 hover:text-red-500
          hover:bg-red-50 dark:hover:bg-red-950
          transition-colors
          disabled:opacity-40 disabled:cursor-not-allowed
        "
      >
        Vaciar carrito
      </button>
    </div>
  );
}
