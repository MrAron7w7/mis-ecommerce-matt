import Navbar from '@/components/header/Navbar';
import Footer from '@/components/layouts/user/Footer';
import { Store } from '@/actions/user/store.user.action';
import StoreFilters from './StoreFilters';
import StoreGrid from './StoreGrid';

type UserStoreClientProps = {
  initialStores: Store[];
};

export default function UserStoreClient({ initialStores }: UserStoreClientProps) {
  const stores = initialStores;
  const totalStores = stores?.length || 0;
  const totalProducts = stores?.reduce((acc, store) => acc + store.productCount, 0) || 0;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <div className="relative bg-gray-950 overflow-hidden">
          <div className="absolute inset-0"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '32px 32px' }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs text-gray-400 mb-6 border border-white/10">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Vendedores verificados
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
                Tiendas Oficiales
              </h1>
              <p className="text-gray-400 text-base md:text-lg">
                Descubre productos únicos de nuestros vendedores verificados
              </p>

              <div className="flex items-center justify-center gap-12 mt-10">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{totalStores}</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Tiendas</p>
                </div>
                <div className="w-px h-10 bg-gray-800" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{totalProducts}</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Productos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <StoreFilters />
        <StoreGrid stores={stores} />
      </main>
      <Footer />
    </>
  );
}