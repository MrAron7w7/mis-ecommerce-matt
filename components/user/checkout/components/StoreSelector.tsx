'use client';

import { useEffect, useState } from 'react';
import { useCheckoutStore } from '@/store/checkoutStore';
import { getStores } from '@/actions/user/store.user.action';
import { MapPin, Store, Check } from 'lucide-react';

export function StoreSelector() {
  const { selectedStore, setSelectedStore } = useCheckoutStore();
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStores()
      .then(setStores)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="pt-4 border-t border-gray-100 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="pt-4 border-t border-gray-100 space-y-3">
      <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
        <Store size={16} className="text-gray-400" />
        Selecciona una tienda
      </p>

      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
        {stores.map((store) => {
          const isSelected = selectedStore?.id === store.id;
          const name = store.sellerLastName
            ? `${store.sellerName} ${store.sellerLastName}`
            : store.sellerName;

          return (
            <button
              key={store.id}
              onClick={() =>
                setSelectedStore({
                  id: store.id,
                  name,
                  address: store.address || 'Dirección no disponible',
                })
              }
              className={`
                w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left
                transition-all duration-200
                ${
                  isSelected
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {store.image ? (
                  <img src={store.image} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <Store size={18} className="text-gray-400" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}
                >
                  {name}
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPin size={10} />
                  {store.address || 'Ver dirección en tienda'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {store.productCount} productos disponibles
                </p>
              </div>

              {/* Check */}
              {isSelected && (
                <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedStore && (
        <div className="p-3 bg-green-50 border border-green-100 rounded-xl">
          <p className="text-xs text-green-700 font-medium">✓ Recogerás en: {selectedStore.name}</p>
          {selectedStore.address && (
            <p className="text-xs text-green-600 mt-0.5">{selectedStore.address}</p>
          )}
        </div>
      )}
    </div>
  );
}
