'use client';

import { useState } from 'react';
import { X, CreditCard, Lock, Check } from 'lucide-react';
import { useCheckoutStore } from '@/store/checkoutStore';

export function CardModal() {
  const { closeCardModal, setCardData } = useCheckoutStore();

  const [form, setForm] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaved, setIsSaved] = useState(false); // guardado, no "procesando pago"

  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(.{4})/g, '$1 ')
      .trim();

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (form.cardNumber.replace(/\s/g, '').length < 16)
      newErrors.cardNumber = 'Número de tarjeta inválido';
    if (!form.cardHolder.trim()) newErrors.cardHolder = 'Ingresa el nombre del titular';
    if (form.expiry.length < 5) newErrors.expiry = 'Fecha inválida';
    if (form.cvv.length < 3) newErrors.cvv = 'CVV inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCardType = () => {
    const num = form.cardNumber.replace(/\s/g, '');
    if (num.startsWith('4')) return 'VISA';
    if (num.startsWith('5')) return 'MASTERCARD';
    return null;
  };

  // Solo guarda los datos, cierra el modal
  const handleSaveCard = () => {
    if (!validate()) return;
    setCardData({
      cardNumber: form.cardNumber,
      cardHolder: form.cardHolder,
      expiry: form.expiry,
      cvv: form.cvv,
    });
    setIsSaved(true);
    setTimeout(() => closeCardModal(), 1500); // cierra tras mostrar confirmación
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeCardModal} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard size={20} className="text-gray-700" />
            <h3 className="text-base font-semibold text-gray-900">Datos de tarjeta</h3>
          </div>
          <button onClick={closeCardModal} className="p-1 hover:bg-gray-100 rounded-lg transition">
            <X size={18} />
          </button>
        </div>

        {isSaved ? (
          // Confirmación de datos guardados (no de pago procesado)
          <div className="py-8 flex flex-col items-center gap-3 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={32} className="text-green-600" />
            </div>
            <p className="text-base font-semibold text-gray-900">¡Datos guardados!</p>
            <p className="text-sm text-gray-500">
              Confirma tu pedido desde el resumen para completar la compra
            </p>
          </div>
        ) : (
          <>
            {/* Vista previa tarjeta */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white space-y-4">
              <div className="flex justify-between items-center">
                <div className="w-10 h-7 bg-yellow-400 rounded-md opacity-80" />
                <span className="text-xs font-medium opacity-70">{getCardType() || 'TARJETA'}</span>
              </div>
              <p className="text-lg font-mono tracking-widest">
                {form.cardNumber || '•••• •••• •••• ••••'}
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs opacity-50">Titular</p>
                  <p className="text-sm font-medium uppercase">
                    {form.cardHolder || 'NOMBRE APELLIDO'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-50">Vence</p>
                  <p className="text-sm font-medium">{form.expiry || 'MM/AA'}</p>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Número de tarjeta
                </label>
                <input
                  type="text"
                  value={form.cardNumber}
                  onChange={(e) =>
                    setForm({ ...form, cardNumber: formatCardNumber(e.target.value) })
                  }
                  placeholder="1234 5678 9012 3456"
                  className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-gray-900 transition-colors font-mono
                    ${errors.cardNumber ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.cardNumber && (
                  <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Nombre del titular
                </label>
                <input
                  type="text"
                  value={form.cardHolder}
                  onChange={(e) => setForm({ ...form, cardHolder: e.target.value.toUpperCase() })}
                  placeholder="JUAN PÉREZ"
                  className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-gray-900 transition-colors
                    ${errors.cardHolder ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.cardHolder && (
                  <p className="text-xs text-red-500 mt-1">{errors.cardHolder}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Fecha de vencimiento
                  </label>
                  <input
                    type="text"
                    value={form.expiry}
                    onChange={(e) => setForm({ ...form, expiry: formatExpiry(e.target.value) })}
                    placeholder="MM/AA"
                    className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-gray-900 transition-colors
                      ${errors.expiry ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.expiry && <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">CVV</label>
                  <input
                    type="password"
                    value={form.cvv}
                    maxLength={4}
                    onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, '') })}
                    placeholder="•••"
                    className={`w-full px-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-gray-900 transition-colors
                      ${errors.cvv ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}
                </div>
              </div>
            </div>

            {/* ✅ Botón guarda datos, NO procesa pago */}
            <button
              onClick={handleSaveCard}
              className="w-full py-3.5 bg-gray-900 text-white rounded-xl text-sm font-semibold
                flex items-center justify-center gap-2
                hover:bg-gray-700 transition-all"
            >
              <Lock size={14} />
              Guardar datos de tarjeta
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Lock size={12} />
              Tus datos están cifrados y protegidos
            </div>
          </>
        )}
      </div>
    </div>
  );
}
