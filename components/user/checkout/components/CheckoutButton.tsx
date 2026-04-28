'use client';

import { useState } from 'react';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useCheckoutStore } from '@/store/checkoutStore';
import { useRouter } from 'next/navigation';
import { calcOrderTotals, formatPrice } from '../utils/checkout.utils';

export function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const { items, clearCart } = useCartStore();
  const {
    deliveryMethod,
    paymentMethod,
    deliveryAddress,
    selectedStore,
    cardData, // datos de tarjeta guardados
    yapePhone, // teléfono yape guardado
  } = useCheckoutStore();

  const router = useRouter();
  const { total } = calcOrderTotals(items, deliveryMethod);
  const isEmpty = items.length === 0;

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // Advertencia si faltan datos del método de pago seleccionado
  const getPaymentWarning = (): string | null => {
    if (paymentMethod === 'card' && !cardData)
      return 'Ingresa los datos de tu tarjeta haciendo clic en "Tarjeta"';
    if (paymentMethod === 'yape' && !yapePhone)
      return 'Vincula tu número Yape haciendo clic en "Yape / Plin"';
    return null;
  };

  const paymentWarning = getPaymentWarning();

  const handleConfirmOrder = async () => {
    if (!email.trim()) {
      setEmailError('Ingresa tu correo electrónico');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Ingresa un correo válido');
      return;
    }
    if (paymentWarning) return;

    setEmailError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          items,
          deliveryMethod,
          paymentMethod,
          deliveryAddress,
          selectedStore,
          cardData,
          yapePhone,
          total,
        }),
      });

      if (!res.ok) throw new Error('Error al procesar la orden');

      clearCart();
      router.push('/'); // ✅ redirige al inicio
    } catch (error) {
      console.error('Error al confirmar orden:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Email */}
      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
          <Mail size={12} />
          Correo para confirmación de compra
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }}
          placeholder="tucorreo@ejemplo.com"
          className={`
            w-full px-4 py-2.5 text-sm border rounded-xl
            focus:outline-none focus:border-gray-900 transition-colors
            ${emailError ? 'border-red-400 bg-red-50' : 'border-gray-200'}
          `}
        />
        {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
        {!emailError && email && validateEmail(email) && (
          <p className="text-xs text-green-600 mt-1">
            ✓ Te enviaremos la confirmación a este correo
          </p>
        )}
      </div>

      {/* Advertencia método de pago incompleto */}
      {paymentWarning && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">{paymentWarning}</p>
        </div>
      )}

      {/* Botón */}
      <button
        onClick={handleConfirmOrder}
        disabled={isEmpty || isLoading || !!paymentWarning}
        className="
          w-full py-4 rounded-xl text-sm font-semibold
          flex items-center justify-center gap-2
          bg-gray-900 text-white
          hover:bg-gray-700 transition-all duration-200
          disabled:opacity-40 disabled:cursor-not-allowed
          active:scale-[0.98]
        "
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <Lock size={15} />
            Confirmar pedido · {formatPrice(total)}
          </>
        )}
      </button>
    </div>
  );
}
