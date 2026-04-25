import Navbar from '@/components/header/Navbar';
import Footer from '@/components/layouts/user/Footer';

import { Store } from '@/actions/user/store.user.action';
import StoreFilters from './StoreFilters';
import StoreGrid from './StoreGrid';

type UserStoreClientProps = {
  initialStores: Store[];
};

export default function UserStoreClient({ initialStores }: UserStoreClientProps) {
  const stores = initialStores; // Porque usaste Promise.all
  const totalStores = stores?.length || 0;
  const totalProducts = stores?.reduce((acc, store) => acc + store.productCount, 0) || 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative bg-gray-50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900/5 rounded-full text-sm text-gray-600 mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                Nuestros Vendedores
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-gray-900 mb-4">
                Tiendas Oficiales
              </h1>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                Descubre productos únicos directamente de nuestros vendedores verificados
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 mt-8">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900">{totalStores}</p>
                  <p className="text-xs text-gray-500">Tiendas</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="text-center">
                  <p className="text-2xl font-semibold text-gray-900">{totalProducts}</p>
                  <p className="text-xs text-gray-500">Productos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters y Grid - Client Component para interactividad */}
        <StoreFilters />
        <StoreGrid stores={stores} />
      </main>
      <Footer />
    </>
  );
}
