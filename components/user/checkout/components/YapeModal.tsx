'use client';

import { useState } from 'react';
import { X, Smartphone, Check, ArrowRight } from 'lucide-react';
import { useCheckoutStore } from '@/store/checkoutStore';

type YapeStep = 'phone' | 'saved';

export function YapeModal() {
  const { closeYapeModal, setYapePhone } = useCheckoutStore();

  const [step, setStep] = useState<YapeStep>('phone');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = async () => {
    if (phone.replace(/\s/g, '').length < 9) {
      setPhoneError('Ingresa un número válido de 9 dígitos');
      return;
    }
    setPhoneError('');
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);

    // Solo guarda el teléfono, NO procesa el pago
    setYapePhone(phone);
    setStep('saved');
    setTimeout(() => closeYapeModal(), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeYapeModal} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#6C1AE0] flex items-center justify-center">
              <Smartphone size={16} className="text-white" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">
              {step === 'phone' ? 'Vincular Yape / Plin' : '¡Número vinculado!'}
            </h3>
          </div>
          <button onClick={closeYapeModal} className="p-1 hover:bg-gray-100 rounded-lg transition">
            <X size={18} />
          </button>
        </div>

        {/* Step: Teléfono */}
        {step === 'phone' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              Ingresa el número asociado a tu Yape o Plin. El cobro se realizará al confirmar el
              pedido.
            </p>
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                Número de celular
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-500 flex-shrink-0">
                  🇵🇪 +51
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  placeholder="987 654 321"
                  className={`flex-1 px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-purple-500 transition-colors
                    ${phoneError ? 'border-red-400' : 'border-gray-200'}`}
                />
              </div>
              {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
            </div>
            <button
              onClick={handlePhoneSubmit}
              disabled={isLoading}
              className="w-full py-3 bg-[#6C1AE0] text-white rounded-xl text-sm font-semibold
                flex items-center justify-center gap-2 hover:bg-[#5a14c0] transition-all
                disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Vincular número <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        )}

        {/* Step: Guardado */}
        {step === 'saved' && (
          <div className="py-6 flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
              <Check size={32} className="text-[#6C1AE0]" />
            </div>
            <p className="text-base font-semibold text-gray-900">Número vinculado</p>
            <p className="text-sm text-gray-500">
              +51 {phone} · El cobro se realizará al confirmar tu pedido desde el resumen
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
