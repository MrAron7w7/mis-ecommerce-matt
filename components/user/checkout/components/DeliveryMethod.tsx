'use client';

import { Truck, Store } from 'lucide-react';
import { useCheckoutStore, DELIVERY_COST } from '@/store/checkoutStore';
import { formatPrice } from '../utils/checkout.utils';
import { DeliveryForm } from './DeliveryForm';
import { StoreSelector } from './StoreSelector';

export function DeliveryMethod() {
  const { deliveryMethod, setDeliveryMethod } = useCheckoutStore();

  const options = [
    {
      id: 'delivery' as const,
      label: 'Delivery',
      description: 'Recibe tu pedido en casa',
      badge: formatPrice(DELIVERY_COST),
      badgeColor: 'text-gray-900',
      icon: Truck,
    },
    {
      id: 'pickup' as const,
      label: 'Recojo en tienda',
      description: 'Sin costo adicional',
      badge: 'Gratis',
      badgeColor: 'text-green-600',
      icon: Store,
    },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-1">Método de entrega</h2>
        <p className="text-xs text-gray-400">Elige cómo quieres recibir tu pedido</p>
      </div>

      {/* Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = deliveryMethod === option.id;
          return (
            <button
              key={option.id}
              onClick={() => setDeliveryMethod(option.id)}
              className={`
                flex items-start gap-4 p-4 rounded-xl border-2 text-left
                transition-all duration-200
                ${
                  isSelected
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div
                className={`p-2 rounded-lg flex-shrink-0 transition-colors
                ${isSelected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}
              >
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p
                    className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}
                  >
                    {option.label}
                  </p>
                  <span className={`text-xs font-semibold ${option.badgeColor}`}>
                    {option.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{option.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Formulario condicional */}
      {deliveryMethod === 'delivery' && <DeliveryForm />}
      {deliveryMethod === 'pickup' && <StoreSelector />}
    </div>
  );
}
