'use client';

import { useCartStore } from '@/store/cartStore';
import { ProductItem } from './ProductItem';
import { ShoppingBag } from 'lucide-react';

export function ProductList() {
  const { items } = useCartStore();

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <ShoppingBag size={16} className="text-gray-400" />
        <h2 className="text-base font-semibold text-gray-900">Productos</h2>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        {items.length} {items.length === 1 ? 'artículo' : 'artículos'} en tu pedido
      </p>

      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <ProductItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
