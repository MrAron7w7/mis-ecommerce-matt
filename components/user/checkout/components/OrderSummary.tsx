'use client';

import { ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useCheckoutStore } from '@/store/checkoutStore';
import { SummaryItems } from './SummaryItems';
import { CheckoutButton } from './CheckoutButton';
import { calcOrderTotals, formatPrice, DELIVERY_COST } from '../utils/checkout.utils';

export function OrderSummary() {
  const { items } = useCartStore();
  const { deliveryMethod } = useCheckoutStore();

  // total calculado aquí, en este componente
  const { subtotal, deliveryCost, total } = calcOrderTotals(items, deliveryMethod);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
      <h2 className="text-base font-semibold text-gray-900">Resumen del pedido</h2>

      <SummaryItems />

      <div className="border-t border-gray-100" />

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Envío</span>
          {deliveryMethod === 'delivery' ? (
            <span className="font-medium text-gray-900">{formatPrice(DELIVERY_COST)}</span>
          ) : (
            <span className="font-medium text-green-600">Gratis</span>
          )}
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
          <span className="text-base font-semibold text-gray-900">Total</span>
          <span className="text-base font-bold text-gray-900">{formatPrice(total)}</span>
        </div>
      </div>

      <CheckoutButton />

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <ShieldCheck size={14} />
        <span>Pago 100% seguro y protegido</span>
      </div>
    </div>
  );
}
