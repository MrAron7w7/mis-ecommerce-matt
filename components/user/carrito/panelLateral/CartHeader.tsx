'use client';

import { useCartStore } from '@/store/cartStore';
import { X, ShoppingBag } from 'lucide-react';

export function CartHeader() {
  const { closeCart, totalItems } = useCartStore();
  const itemCount = totalItems();

  return (
    <div className="relative bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 via-transparent to-gray-50/50 dark:from-gray-800/30 dark:to-gray-800/30" />

      <div className="relative flex items-center justify-between px-6 py-5">
        {/* Left section - Title & Stats */}
        <div className="flex items-center gap-4">
          {/* Shopping bag icon with badge */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gray-900/5 dark:bg-white/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
            </div>
            {itemCount > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </div>
            )}
          </div>

          {/* Title section */}
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
              Mi Carrito
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {itemCount === 0
                    ? 'Tu carrito está vacío'
                    : `${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`}
                </p>
              </div>
              {itemCount > 0 && (
                <>
                  <span className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                    Listo para comprar
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right section - Close button with hover effect */}
        <button
          onClick={closeCart}
          aria-label="Cerrar carrito"
          className="group relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
        >
          {/* Ripple effect on hover */}
          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute inset-0 rounded-lg bg-gray-900/5 dark:bg-white/5" />
          </div>

          <X
            className="relative w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* Decorative line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
    </div>
  );
}
