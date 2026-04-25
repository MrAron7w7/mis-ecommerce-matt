'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export default function StoreFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'products' | 'newest'>('name');

  // Actualizar URL con los filtros
  const updateFilters = (search: string, sort: string) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (sort !== 'name') params.set('sort', sort);
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateFilters(value, sortBy);
  };

  const handleSort = (value: 'name' | 'products' | 'newest') => {
    setSortBy(value);
    updateFilters(searchTerm, value);
  };

  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar tiendas por nombre..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-gray-400 focus:bg-white transition-all text-sm"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex justify-end mt-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:inline">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value as 'name' | 'products' | 'newest')}
              className="text-sm bg-transparent border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900 cursor-pointer"
            >
              <option value="name">Nombre</option>
              <option value="products">Más productos</option>
              <option value="newest">Más recientes</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
