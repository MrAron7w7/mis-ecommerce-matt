'use client';

import { CartHeader } from './CartHeader';
import { CartItemsList } from './CartItemsList';
import { CartSummary } from './CartSummary';
import { CartActions } from './CartActions';

interface PanelProps {
  isOpen: boolean;
}

export function Panel({ isOpen }: PanelProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compras"
      className={`
        fixed top-0 right-0 h-full w-[420px] max-w-full
        bg-white dark:bg-gray-900
        shadow-2xl z-50
        flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      <CartHeader />
      <CartItemsList />
      <CartSummary />
      <CartActions />
    </div>
  );
}
