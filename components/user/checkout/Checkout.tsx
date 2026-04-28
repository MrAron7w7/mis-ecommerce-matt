'use client';

import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { ProductList } from './components/ProductList';
import { DeliveryMethod } from './components/DeliveryMethod';
import { PaymentMethod } from './components/PaymentMethod';
import { OrderSummary } from './components/OrderSummary';

export function Checkout() {
  const { items } = useCartStore();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-400">
        <ShoppingBag size={48} strokeWidth={1} />
        <p className="text-base">Tu carrito está vacío</p>
        <button
          onClick={() => router.push('/productos')}
          className="px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-700 transition"
        >
          Ver productos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Finalizar compra</h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Columna izquierda */}
        <div className="flex-1 space-y-6 w-full">
          <ProductList />
          <DeliveryMethod />
          <PaymentMethod />
        </div>

        {/* Columna derecha — sticky */}
        <div className="w-full lg:w-[380px] flex-shrink-0">
          <div className="sticky top-24">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
