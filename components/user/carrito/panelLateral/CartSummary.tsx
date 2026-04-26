'use client';

import { useCartStore } from '@/store/cartStore';

const IGV = 0.18;

export function CartSummary() {
  const { totalPrice, items } = useCartStore();

  if (items.length === 0) return null;

  const subtotal = totalPrice();
  const tax = subtotal * IGV;
  const total = subtotal + tax;

  return (
    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 space-y-2 text-sm">
      <div className="flex justify-between text-gray-500">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-gray-500">
        <span>Envío</span>
        <span className="text-green-500">Gratis</span>
      </div>
      <div className="flex justify-between text-gray-500">
        <span>IGV (18%)</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-semibold text-base text-gray-900 dark:text-white border-t border-gray-100 dark:border-gray-800 pt-3 mt-1">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
