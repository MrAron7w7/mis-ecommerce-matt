'use client';

import { useState, useMemo } from 'react';
import { Grid, List, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductCard from './ProductCard';
import { PublicProduct } from '@/actions/user/product.user.action';

type Category = {
  id: string;
  name: string;
  productCount: number;
};

export default function ProductGrid({
  initialProducts,
  categories,
}: {
  initialProducts: PublicProduct[];
  categories: Category[];
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const maxPrice = useMemo(
    () => Math.max(...initialProducts.map((p) => p.price), 1000),
    [initialProducts],
  );

  // Filter products by category and price
  const filteredProducts = useMemo(() => {
    let filtered = initialProducts;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter((p) => p.category.toLowerCase() === activeCategory);
    }

    // Filter by price
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    return filtered;
  }, [activeCategory, initialProducts, priceRange]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  return (
    <>
      {/* Filter Bar - Mobile Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} />
            <span className="text-sm font-medium">Filtrar y ordenar</span>
          </div>
          <ChevronDown
            className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
            size={18}
          />
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`
            ${isFilterOpen ? 'block' : 'hidden'} 
            lg:block w-full lg:w-64 flex-shrink-0
            fixed lg:relative inset-0 lg:inset-auto z-40 lg:z-auto
            bg-white lg:bg-transparent p-4 lg:p-0
            overflow-y-auto lg:overflow-visible
          `}
        >
          <div className="lg:hidden flex justify-between items-center mb-4 pb-4 border-b">
            <h3 className="font-medium text-lg">Filtros</h3>
            <button onClick={() => setIsFilterOpen(false)} className="text-gray-500">
              Cerrar
            </button>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900 mb-4">
              Categorías
            </h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setIsFilterOpen(false);
                  }}
                  className={`
                    block w-full text-left px-2 py-1.5 text-sm rounded-md transition-all
                    flex justify-between items-center
                    ${
                      activeCategory === cat.id
                        ? 'bg-gray-900 text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs opacity-70">{cat.productCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900 mb-4">
              Precio
            </h3>
            <div className="px-2">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min={0}
                max={maxPrice}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
              />
            </div>
          </div>

          {/* Active filters badge */}
          {(activeCategory !== 'all' || priceRange[1] < maxPrice) && (
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setPriceRange([0, maxPrice]);
                }}
                className="text-xs text-gray-500 hover:text-gray-900 underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </aside>

        {/* Products Section */}
        <div className="flex-1">
          {/* Sort and View Controls */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 hidden sm:inline">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'producto' : 'productos'}
              </span>
              <div className="flex gap-1 border-l sm:border-l-0 pl-3 sm:pl-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-400 hover:text-gray-900'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-400 hover:text-gray-900'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600 hidden sm:block">Ordenar por:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-transparent border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-900 cursor-pointer"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name-asc">Nombre: A-Z</option>
              </select>
            </div>
          </div>

          {/* Products Grid/List */}
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No se encontraron productos</p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setPriceRange([0, maxPrice]);
                }}
                className="mt-4 text-sm text-gray-900 underline"
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8'
                  : 'space-y-6'
              }
            >
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile filter */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </>
  );
}
