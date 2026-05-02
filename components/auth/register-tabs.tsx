// components/auth/register-tabs.tsx
'use client';

import { useState } from 'react';
import { ClientRegisterForm } from './client-register-form';
import { SellerRegisterForm } from './seller-register-form';

export function RegisterTabs() {
  const [tab, setTab] = useState<'client' | 'seller'>('client');

  return (
    <div>
      {/* Tabs simples */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        <button
          onClick={() => setTab('client')}
          className={`pb-3 text-sm font-medium transition-colors ${
            tab === 'client'
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Cliente
        </button>
        <button
          onClick={() => setTab('seller')}
          className={`pb-3 text-sm font-medium transition-colors ${
            tab === 'seller'
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Vendedor
        </button>
      </div>

      {/* Banner vendedor */}
      {tab === 'seller' && (
        <div className="mb-5 p-3 bg-gray-50 border-l-2 border-gray-400 text-sm text-gray-600">
          Completa tus datos y los de tu negocio. Tu solicitud será revisada en 24-48 horas.
        </div>
      )}

      {tab === 'client' ? <ClientRegisterForm /> : <SellerRegisterForm />}
    </div>
  );
}
