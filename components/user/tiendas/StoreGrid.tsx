'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import StoreCard from './StoreCard';
import { Store as StoreIcon } from 'lucide-react';
import { Store } from '@/actions/user/store.user.action';

type StoreGridProps = {
  stores: Store[];
};

export default function StoreGrid({ stores }: StoreGridProps) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'products' | 'newest'>('name');

  // Leer parámetros de URL al inicio
  useEffect(() => {
    const search = searchParams?.get('search') || '';
    const sort = (searchParams?.get('sort') as 'name' | 'products' | 'newest') || 'name';
    setSearchTerm(search);
    setSortBy(sort);
  }, [searchParams]);

  // Filtrar tiendas
  const filteredStores = useMemo(() => {
    let filtered = [...stores];

    if (searchTerm) {
      filtered = filtered.filter(
        (store) =>
          store.sellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (store.sellerLastName &&
            store.sellerLastName.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.sellerName.localeCompare(b.sellerName);
        case 'products':
          return b.productCount - a.productCount;
        case 'newest':
          return new Date(b.since).getTime() - new Date(a.since).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [stores, searchTerm, sortBy]);

  if (filteredStores.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <StoreIcon size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No encontramos tiendas</h3>
          <p className="text-gray-500 text-sm">
            {searchTerm
              ? `No hay tiendas que coincidan con "${searchTerm}"`
              : 'No hay tiendas disponibles por el momento'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          Mostrando <span className="font-medium text-gray-900">{filteredStores.length}</span> de{' '}
          {stores.length} tiendas
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
}
