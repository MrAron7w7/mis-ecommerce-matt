'use client';

import { useState, useEffect } from 'react';
import { useCheckoutStore } from '@/store/checkoutStore';
import { MapPin, User, Phone } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('./MapPicker'), { ssr: false });

export function DeliveryForm() {
  const { setDeliveryAddress, isCardModalOpen, isYapeModalOpen } = useCheckoutStore();
  const isAnyModalOpen = isCardModalOpen || isYapeModalOpen; // ✅ detectar si hay modal abierto

  const [coords, setCoords] = useState({ lat: -12.0464, lng: -77.0428 });
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [phone, setPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');

  useEffect(() => {
    if (address && phone && recipientName) {
      setDeliveryAddress({
        lat: coords.lat,
        lng: coords.lng,
        address,
        reference,
        phone,
        recipientName,
      });
    }
  }, [coords, address, reference, phone, recipientName]);

  return (
    <div className="space-y-5 pt-4 border-t border-gray-100">
      <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
        <MapPin size={16} className="text-gray-400" />
        Datos de entrega
      </p>

      {/* Mapa oculto con visibility cuando hay modal abierto */}
      <div
        className="rounded-xl overflow-hidden border border-gray-200 h-[280px]"
        style={{ visibility: isAnyModalOpen ? 'hidden' : 'visible' }} // ✅ clave
      >
        <MapPicker
          lat={coords.lat}
          lng={coords.lng}
          onLocationChange={(lat, lng, addr) => {
            setCoords({ lat, lng });
            if (addr) setAddress(addr);
          }}
        />
      </div>

      <p className="text-xs text-gray-400 -mt-2">
        Arrastra el marcador para ajustar la ubicación exacta
      </p>

      {/* Campos del formulario — sin cambios */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">
            Dirección de entrega *
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ej: Av. Javier Prado 1234, San Isidro"
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">
            Referencia (opcional)
          </label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Ej: Frente al parque, edificio azul"
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              <User size={12} className="inline mr-1" />
              Nombre del destinatario *
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Nombre completo"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">
              <Phone size={12} className="inline mr-1" />
              Teléfono de contacto *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="987 654 321"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
