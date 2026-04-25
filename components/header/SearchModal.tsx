'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { X, Search, ShoppingBag, ArrowRight } from 'lucide-react';
import { PublicProduct } from '@/actions/user/product.user.action';

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  products: PublicProduct[];
};

// ✅ Helper puro para leer localStorage fuera del componente
function loadRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function SearchModal({ isOpen, onClose, products }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Lazy initializer: se ejecuta solo una vez, sin useEffect
  const [recentSearches, setRecentSearches] = useState<string[]>(loadRecentSearches);

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Reemplaza el useEffect de filtrado con useMemo (derivar estado, no sincronizarlo)
  const results = useMemo<PublicProduct[]>(() => {
    if (searchTerm.trim().length < 2) return [];
    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .slice(0, 8);
  }, [searchTerm, products]);

  // ✅ Enfocar input cuando se abre (este useEffect es correcto: sincroniza con DOM externo)
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const id = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  // ✅ Cerrar con ESC (suscripción a evento externo — uso correcto de useEffect)
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // ✅ Bloquear scroll (sistema externo — uso correcto de useEffect)
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // ✅ Cerrar modal al cambiar de ruta (reemplaza el useEffect en NavBarClient)
  useEffect(() => {
    if (isOpen) onClose();
    // Solo queremos reaccionar al cambio de pathname, no a onClose
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!isOpen) return null;

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      saveRecentSearch(searchTerm.trim());
      // ✅ useRouter en lugar de window.location.href
      router.push(`/productos?search=${encodeURIComponent(searchTerm.trim())}`);
      onClose();
    }
  };

  const handleResultClick = (product: PublicProduct) => {
    saveRecentSearch(product.name);
    onClose();
  };

  const handleRecentClick = (term: string) => {
    setSearchTerm(term);
    saveRecentSearch(term);
    // ✅ useRouter en lugar de window.location.href
    router.push(`/productos?search=${encodeURIComponent(term)}`);
    onClose();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-x-0 top-0 z-[10000] animate-in slide-in-from-top-2 duration-200">
        <div className="bg-white shadow-2xl">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-light text-gray-900">Buscar productos</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Formulario de búsqueda */}
            <form onSubmit={handleSearch} className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="¿Qué estás buscando? Ej: audífonos, zapatos, laptop..."
                className="w-full pl-12 pr-24 py-4 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition"
              >
                Buscar
              </button>
            </form>

            {/* Resultados de búsqueda */}
            {searchTerm.length >= 2 && (
              <div className="mt-6 max-h-96 overflow-y-auto">
                {results.length > 0 ? (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        {results.length} resultados encontrados
                      </p>
                      <Link
                        href={`/productos?search=${encodeURIComponent(searchTerm)}`}
                        onClick={onClose}
                        className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1"
                      >
                        Ver todos <ArrowRight size={12} />
                      </Link>
                    </div>
                    <div className="space-y-2">
                      {results.map((product) => (
                        <Link
                          key={product.id}
                          href={`/productos/${product.slug}`}
                          onClick={() => handleResultClick(product)}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition group"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {product.imageUrl ? (
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag size={20} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 group-hover:text-gray-600 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">{product.category}</p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">${product.price}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">
                      No se encontraron productos para <strong>{searchTerm}</strong>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Prueba con otras palabras o revisa nuestra tienda
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Búsquedas recientes */}
            {searchTerm.length === 0 && recentSearches.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Búsquedas recientes
                  </p>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Limpiar
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentClick(term)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Categorías populares */}
            {searchTerm.length === 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                  Categorías populares
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Electrónica', 'Ropa', 'Hogar', 'Deportes'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleRecentClick(cat)}
                      className="px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
