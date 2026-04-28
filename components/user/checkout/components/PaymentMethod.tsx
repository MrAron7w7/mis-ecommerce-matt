'use client';

import { CreditCard, Smartphone, Banknote } from 'lucide-react';
import { useCheckoutStore } from '@/store/checkoutStore';
import { CardModal } from './CardModal';
import { YapeModal } from './YapeModal';

export function PaymentMethod() {
  const {
    paymentMethod,
    setPaymentMethod,
    openCardModal,
    openYapeModal,
    isCardModalOpen,
    isYapeModalOpen,
  } = useCheckoutStore();

  const options = [
    {
      id: 'card' as const,
      label: 'Tarjeta',
      description: 'Crédito o débito',
      icon: CreditCard,
    },
    {
      id: 'yape' as const,
      label: 'Yape / Plin',
      description: 'Pago por QR',
      icon: Smartphone,
    },
    {
      id: 'cash' as const,
      label: 'Efectivo',
      description: 'Contra entrega',
      icon: Banknote,
    },
  ];

  const handleSelect = (id: 'card' | 'yape' | 'cash') => {
    setPaymentMethod(id);
    if (id === 'card') openCardModal();
    if (id === 'yape') openYapeModal();
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-1">Método de pago</h2>
      <p className="text-xs text-gray-400 mb-5">Selecciona cómo deseas pagar</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = paymentMethod === option.id;
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`
                flex flex-col items-center gap-3 p-4 rounded-xl border-2 text-center
                transition-all duration-200
                ${
                  isSelected
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div
                className={`p-3 rounded-xl transition-colors
                ${isSelected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}
              >
                <Icon size={20} />
              </div>
              <div>
                <p
                  className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}
                >
                  {option.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{option.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Modales */}
      {isCardModalOpen && <CardModal />}
      {isYapeModalOpen && <YapeModal />}
    </div>
  );
}
