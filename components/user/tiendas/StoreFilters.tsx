'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function StoreFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams?.get('search') || '';
  const sort = searchParams?.get('sort') || 'name';

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-gray-50 rounded-2xl p-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar vendedor..."
            defaultValue={search}
            onChange={(e) => updateParams('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm">
          <SlidersHorizontal size={14} className="text-gray-400" />
          <select
            defaultValue={sort}
            onChange={(e) => updateParams('sort', e.target.value)}
            className="text-sm bg-transparent focus:outline-none cursor-pointer text-gray-700"
          >
            <option value="name">Nombre A-Z</option>
            <option value="products">Más productos</option>
            <option value="newest">Más recientes</option>
          </select>
        </div>
      </div>
    </div>
  );
}