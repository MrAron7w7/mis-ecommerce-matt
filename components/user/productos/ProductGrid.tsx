'use client';

import { useState, useMemo } from 'react';
import { Filter, X, ArrowUpDown } from 'lucide-react';
import ProductCard from './ProductCard';
import { PublicProduct } from '@/lib/types/type.public';

type Category = {
  id: string;
  name: string;
  productCount: number;
};

type ProductGridProps = {
  initialProducts: PublicProduct[];
  categories: Category[];
};

type ColorOption = string;

export default function ProductGrid({ initialProducts, categories }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState<ColorOption[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const maxPrice = useMemo(
    () => Math.max(...initialProducts.map((p) => p.price), 0),
    [initialProducts],
  );

  const [priceRange, setPriceRange] = useState<[number, number]>(() => [0, maxPrice]);

  const allColors = useMemo(() => {
    const colors = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.colors && p.colors.length > 0) {
        p.colors.forEach((color) => colors.add(color));
      }
    });
    return Array.from(colors);
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = initialProducts;

    if (activeCategory !== 'all') {
      filtered = filtered.filter((p) => p.category.toLowerCase() === activeCategory);
    }

    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (selectedColors.length > 0) {
      filtered = filtered.filter((p) => p.colors?.some((color) => selectedColors.includes(color)));
    }

    if (inStockOnly) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    return filtered;
  }, [activeCategory, initialProducts, priceRange, selectedColors, inStockOnly]);

  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  const hasActiveFilters =
    activeCategory !== 'all' ||
    priceRange[1] < maxPrice ||
    selectedColors.length > 0 ||
    inStockOnly;

  const clearAllFilters = () => {
    setActiveCategory('all');
    setPriceRange([0, maxPrice]);
    setSelectedColors([]);
    setInStockOnly(false);
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200"
        >
          <Filter size={18} />
          <span className="text-sm font-medium">Filtrar productos</span>
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 bg-gray-900 text-white text-xs rounded-full">
              {filteredProducts.length}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-72 shrink-0">
          <FilterSidebar
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            maxPrice={maxPrice}
            allColors={allColors}
            selectedColors={selectedColors}
            onColorToggle={(color: string) => {
              setSelectedColors((prev) =>
                prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
              );
            }}
            inStockOnly={inStockOnly}
            onStockChange={setInStockOnly}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearAllFilters}
          />
        </aside>

        {/* Products Section */}
        <div className="flex-1">
          {/* Controls Bar */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Mostrando <span className="font-medium text-gray-900">{sortedProducts.length}</span>{' '}
                de <span className="font-medium text-gray-900">{filteredProducts.length}</span>{' '}
                productos
              </span>
            </div>

            <div className="flex items-center gap-3">
              <ArrowUpDown size={16} className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm bg-transparent border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-900 cursor-pointer"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name-asc">Nombre: A-Z</option>
                <option value="name-desc">Nombre: Z-A</option>
              </select>
            </div>
          </div>

          {/* Active Filters Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {activeCategory !== 'all' && (
                <FilterChip
                  label={`Categoría: ${categories.find((c) => c.id === activeCategory)?.name || activeCategory}`}
                  onRemove={() => setActiveCategory('all')}
                />
              )}
              {priceRange[1] < maxPrice && (
                <FilterChip
                  label={`Precio máximo: $${priceRange[1]}`}
                  onRemove={() => setPriceRange([0, maxPrice])}
                />
              )}
              {selectedColors.map((color) => (
                <FilterChip
                  key={color}
                  label={`Color: ${color}`}
                  onRemove={() => setSelectedColors((prev) => prev.filter((c) => c !== color))}
                />
              ))}
              {inStockOnly && (
                <FilterChip label="Solo en stock" onRemove={() => setInStockOnly(false)} />
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-gray-500 hover:text-gray-900 underline"
              >
                Limpiar todos
              </button>
            </div>
          )}

          {/* Products Grid - solo vista grid por defecto */}
          {sortedProducts.length === 0 ? (
            <EmptyState onClear={clearAllFilters} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        maxPrice={maxPrice}
        allColors={allColors}
        selectedColors={selectedColors}
        onColorToggle={(color: string) => {
          setSelectedColors((prev) =>
            prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
          );
        }}
        inStockOnly={inStockOnly}
        onStockChange={setInStockOnly}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearAllFilters}
      />
    </>
  );
}

// ==================== COMPONENTES AUXILIARES ====================

type FilterChipProps = {
  label: string;
  onRemove: () => void;
};

function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-gray-900" aria-label="Remover filtro">
        <X size={12} />
      </button>
    </span>
  );
}

type EmptyStateProps = {
  onClear: () => void;
};

function EmptyState({ onClear }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <Filter size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No encontramos productos</h3>
      <p className="text-gray-500 text-sm mb-4">Prueba con otros filtros o categorías</p>
      <button onClick={onClear} className="text-sm text-gray-900 underline hover:no-underline">
        Limpiar todos los filtros
      </button>
    </div>
  );
}

// ==================== FILTER SIDEBAR ====================

type FilterSidebarProps = {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  allColors: string[];
  selectedColors: string[];
  onColorToggle: (color: string) => void;
  inStockOnly: boolean;
  onStockChange: (value: boolean) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

function FilterSidebar({
  categories,
  activeCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  allColors,
  selectedColors,
  onColorToggle,
  inStockOnly,
  onStockChange,
  hasActiveFilters,
  onClearFilters,
}: FilterSidebarProps) {
  return (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900 mb-4">
          Categorías
        </h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`
                w-full text-left px-3 py-2 text-sm rounded-lg transition-all
                flex justify-between items-center
                ${
                  activeCategory === cat.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <span>{cat.name}</span>
              <span
                className={`text-xs ${activeCategory === cat.id ? 'text-gray-300' : 'text-gray-400'}`}
              >
                {cat.productCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900 mb-4">Precio</h3>
        <div className="px-1">
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min={0}
            max={maxPrice}
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
          />
        </div>
      </div>

      {/* Colors */}
      {allColors.length > 0 && (
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wide text-gray-900 mb-4">
            Colores
          </h3>
          <div className="flex flex-wrap gap-2">
            {allColors.map((color) => (
              <button
                key={color}
                onClick={() => onColorToggle(color)}
                className={`
                  relative w-8 h-8 rounded-full transition-all
                  ring-2 ring-offset-2 hover:scale-110
                  ${
                    selectedColors.includes(color)
                      ? 'ring-gray-900 ring-offset-2'
                      : 'ring-gray-200 hover:ring-gray-400'
                  }
                `}
                style={{ backgroundColor: color }}
                title={color}
                aria-label={`Color ${color}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Stock */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onStockChange(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
          />
          <span className="text-sm text-gray-700">Solo productos en stock</span>
        </label>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="pt-4 border-t">
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-500 hover:text-gray-900 underline"
          >
            Limpiar todos los filtros
          </button>
        </div>
      )}
    </div>
  );
}

// ==================== MOBILE FILTER DRAWER ====================

type MobileFilterDrawerProps = FilterSidebarProps & {
  isOpen: boolean;
  onClose: () => void;
};

function MobileFilterDrawer({ isOpen, onClose, ...props }: MobileFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-xl overflow-y-auto animate-slide-in lg:hidden">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
          <h2 className="font-medium text-gray-900">Filtrar productos</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <FilterSidebar {...props} />
        </div>
      </div>
    </>
  );
}
