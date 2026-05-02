'use client';

import { useState, useEffect } from 'react';

import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PublicProduct } from '@/lib/types/type.public';

// Tipo para producto favorito
type FavoriteProduct = PublicProduct & {
  favoritedAt: Date;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // Simular carga de favoritos (aquí conectarías con tu API)
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      // Simular llamada API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Datos de ejemplo
      const mockFavorites: FavoriteProduct[] = [
        {
          id: 1,
          name: 'Camisa de Lino Premium',
          slug: 'camisa-lino-premium',
          price: 89.99,
          stock: 15,
          category: 'Ropa',
          imageUrl: '/img/products/shirt-1.jpg',
          colors: ['#2D5A27', '#E8DCC4', '#8B7355'],
          favoritedAt: new Date('2024-01-15'),
          description: 'Camisa de lino de alta calidad',
          isActive: true,
          isApproved: true,
          sellerId: 'seller-1',
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'Zapatillas Deportivas',
          slug: 'zapatillas-deportivas',
          price: 129.99,
          stock: 8,
          category: 'Calzado',
          imageUrl: '/img/products/shoes-1.jpg',
          colors: ['#1A1A1A', '#FFFFFF', '#DC2626'],
          favoritedAt: new Date('2024-01-20'),
          description: 'Zapatillas para running',
          isActive: true,
          isApproved: true,
          sellerId: 'seller-2',
          categoryId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          name: 'Mochila Elegante',
          slug: 'mochila-elegante',
          price: 59.99,
          stock: 0,
          category: 'Accesorios',
          imageUrl: '/img/products/bag-1.jpg',
          colors: ['#8B4513', '#2F4F4F'],
          favoritedAt: new Date('2024-01-25'),
          description: 'Mochila de cuero ecológico',
          isActive: true,
          isApproved: true,
          sellerId: 'seller-3',
          categoryId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      setFavorites(mockFavorites);
      setIsLoading(false);
    };

    loadFavorites();
  }, []);

  const handleRemoveFavorite = (productId: number) => {
    setFavorites((prev) => prev.filter((p) => p.id !== productId));
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const handleToggleSelect = (productId: number) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === favorites.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(favorites.map((p) => p.id)));
    }
  };

  const handleRemoveSelected = () => {
    setFavorites((prev) => prev.filter((p) => !selectedItems.has(p.id)));
    setSelectedItems(new Set());
  };

  const handleAddAllToCart = () => {
    const selectedProducts = favorites.filter((p) => selectedItems.has(p.id));
    console.log('Agregar al carrito:', selectedProducts);
    // Aquí iría la lógica para agregar al carrito
  };

  if (isLoading) {
    return (
      <>
        <main className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-7xl mx-auto">
              {/* Skeleton Header */}
              <div className="mb-8">
                <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-2" />
                <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse" />
              </div>

              {/* Skeleton Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl overflow-hidden border border-gray-100"
                  >
                    <div className="aspect-square bg-gray-200 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                      <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                      <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-4">
                  <Heart size={14} className="fill-white" />
                  <span>Mi lista de deseos</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-2">Mis Favoritos</h1>
                <p className="text-gray-300 text-sm sm:text-base">
                  {favorites.length}{' '}
                  {favorites.length === 1 ? 'producto guardado' : 'productos guardados'}
                </p>
              </div>

              {favorites.length > 0 && (
                <div className="flex gap-3">
                  <button
                    onClick={handleSelectAll}
                    className="px-4 py-2 text-sm border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {selectedItems.size === favorites.length
                      ? 'Deseleccionar todo'
                      : 'Seleccionar todo'}
                  </button>
                  {selectedItems.size > 0 && (
                    <button
                      onClick={handleRemoveSelected}
                      className="px-4 py-2 text-sm bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      Eliminar seleccionados ({selectedItems.size})
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="max-w-7xl mx-auto">
            {favorites.length === 0 ? (
              /* Empty State */
              <div className="text-center py-16 md:py-24">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Heart size={40} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-light text-gray-900 mb-3">
                  Tu lista de favoritos está vacía
                </h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Guarda tus productos favoritos haciendo clic en el corazón ❤️ y vuelve aquí para
                  comprarlos después.
                </p>
                <Link
                  href="/productos"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all hover:scale-105 transform duration-200"
                >
                  Explorar productos
                  <ShoppingBag size={18} />
                </Link>
              </div>
            ) : (
              <>
                {/* Bulk Actions Bar */}
                {selectedItems.size > 0 && (
                  <div className="sticky top-0 z-20 mb-6 p-4 bg-white rounded-xl shadow-md border border-gray-100">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gray-900 text-white rounded flex items-center justify-center text-xs font-bold">
                          {selectedItems.size}
                        </div>
                        <span className="text-sm text-gray-600">productos seleccionados</span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleAddAllToCart}
                          className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                          <ShoppingBag size={16} />
                          Agregar al carrito
                        </button>
                        <button
                          onClick={handleRemoveSelected}
                          className="px-4 py-2 border border-red-300 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favorites.map((product) => (
                    <FavoriteCard
                      key={product.id}
                      product={product}
                      isSelected={selectedItems.has(product.id)}
                      onToggleSelect={() => handleToggleSelect(product.id)}
                      onRemove={() => handleRemoveFavorite(product.id)}
                    />
                  ))}
                </div>

                {/* Recommendation Section */}
                {favorites.length >= 2 && (
                  <div className="mt-16 pt-8 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-medium text-gray-900">
                        Productos que también te podrían interesar
                      </h2>
                      <Link
                        href="/productos"
                        className="text-sm text-gray-500 hover:text-black transition-colors flex items-center gap-1"
                      >
                        Ver más <ArrowRight size={14} />
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {getRecommendations(favorites)
                        .slice(0, 4)
                        .map((product) => (
                          <RecommendationCard key={product.id} product={product} />
                        ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

// ==================== COMPONENTES ====================

type FavoriteCardProps = {
  product: FavoriteProduct;
  isSelected: boolean;
  onToggleSelect: () => void;
  onRemove: () => void;
};

function FavoriteCard({ product, isSelected, onToggleSelect, onRemove }: FavoriteCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`group bg-white rounded-xl overflow-hidden border transition-all duration-300 ${
        isSelected
          ? 'border-gray-900 shadow-md ring-2 ring-gray-900/20'
          : 'border-gray-100 hover:shadow-lg hover:border-gray-200'
      }`}
    >
      <div className="relative">
        {/* Checkbox */}
        <div className="absolute top-3 left-3 z-10">
          <button
            onClick={onToggleSelect}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-gray-900 border-gray-900'
                : 'bg-white border-gray-300 hover:border-gray-900'
            }`}
          >
            {isSelected && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Product Image */}
        <Link
          href={`/productos/${product.slug}`}
          className="block relative aspect-square overflow-hidden bg-gray-100"
        >
          {product.imageUrl && !imageError ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingBag size={32} />
              <span className="text-xs mt-2">Sin imagen</span>
            </div>
          )}

          {/* Stock Badge */}
          {product.stock < 5 && product.stock > 0 && (
            <span className="absolute top-3 right-3 z-10 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              ¡Últimas {product.stock}!
            </span>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 backdrop-blur-sm">
              <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                Agotado
              </span>
            </div>
          )}
        </Link>

        {/* Remove Button (visible on hover) */}
        <button
          onClick={onRemove}
          className="absolute bottom-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-sm"
          aria-label="Eliminar de favoritos"
        >
          <Trash2 size={14} className="text-red-500" />
        </button>
      </div>

      <div className="p-4">
        <Link href={`/productos/${product.slug}`}>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.category}</p>
          <h3 className="font-medium text-gray-900 hover:text-gray-600 transition-colors line-clamp-2 text-sm mb-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">${product.price.toFixed(2)}</span>
          </div>
        </Link>

        {/* Colors preview */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1.5 mt-3">
            {product.colors.slice(0, 3).map((color, i) => (
              <span
                key={i}
                className="w-3.5 h-3.5 rounded-full border border-gray-200 shadow-sm"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[10px] text-gray-400">+{product.colors.length - 3}</span>
            )}
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          disabled={product.stock === 0}
          className="w-full mt-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}

type RecommendationCardProps = {
  product: PublicProduct;
};

function RecommendationCard({ product }: RecommendationCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/productos/${product.slug}`} className="group">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        {product.imageUrl && !imageError ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ShoppingBag size={24} />
          </div>
        )}
      </div>
      <div className="mt-2">
        <p className="text-xs text-gray-400">{product.category}</p>
        <p className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</p>
        <p className="text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}

// Función para obtener recomendaciones basadas en categorías de favoritos
function getRecommendations(favorites: FavoriteProduct[]): PublicProduct[] {
  // Obtener categorías más frecuentes en favoritos
  const categoryCount = new Map<string, number>();
  favorites.forEach((fav) => {
    categoryCount.set(fav.category, (categoryCount.get(fav.category) || 0) + 1);
  });

  const topCategory = Array.from(categoryCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];

  // Productos de recomendación (ejemplo)
  const recommendations: PublicProduct[] = [
    {
      id: 101,
      name: 'Pantalón de Algodón',
      slug: 'pantalon-algodon',
      price: 49.99,
      stock: 20,
      category: topCategory || 'Ropa',
      imageUrl: '/img/products/pants-1.jpg',
      description: 'Pantalón cómodo de algodón',
      isActive: true,
      isApproved: true,
      sellerId: 'seller-1',
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 102,
      name: 'Chaqueta Impermeable',
      slug: 'chaqueta-impermeable',
      price: 89.99,
      stock: 12,
      category: topCategory || 'Ropa',
      imageUrl: '/img/products/jacket-1.jpg',
      description: 'Chaqueta resistente al agua',
      isActive: true,
      isApproved: true,
      sellerId: 'seller-2',
      categoryId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 103,
      name: 'Gorra Deportiva',
      slug: 'gorra-deportiva',
      price: 24.99,
      stock: 30,
      category: 'Accesorios',
      imageUrl: '/img/products/cap-1.jpg',
      description: 'Gorra transpirable',
      isActive: true,
      isApproved: true,
      sellerId: 'seller-3',
      categoryId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 104,
      name: 'Riñonera Moderna',
      slug: 'rinonera-moderna',
      price: 34.99,
      stock: 18,
      category: 'Accesorios',
      imageUrl: '/img/products/belt-bag-1.jpg',
      description: 'Riñonera multifuncional',
      isActive: true,
      isApproved: true,
      sellerId: 'seller-3',
      categoryId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return recommendations;
}

/* CSS adicional para animaciones - agregar a globals.css */
/*
@keyframes slide-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
*/
