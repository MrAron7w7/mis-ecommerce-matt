import Navbar from '@/components/header/Navbar';
import Footer from '@/components/layouts/user/Footer';
import ProductGrid from './ProductGrid';

type Category = {
  id: number;
  name: string;
  slug: string;
  productCount: number;
};

type UserProductClientProps = {
  initialProducts: PublicProduct[];
  initialCategories: Category[];
};

export default function UserProductClient({
  initialProducts,
  initialCategories,
}: UserProductClientProps) {
  // Transform categories para el filtro
  const filterCategories = [
    { id: 'all', name: 'Todos', productCount: initialProducts.length },
    ...initialCategories.map((cat) => ({
      id: cat.slug,
      name: cat.name,
      productCount: cat.productCount,
    })),
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero Section - Matching home page style */}
        <div className="relative bg-gray-50 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-gray-50 via-white to-gray-50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900/5 rounded-full text-sm text-gray-600 mb-4">
                <span className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                Colección {new Date().getFullYear()}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-gray-900 mb-4">
                Nuestros Productos
              </h1>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                Descubre nuestra colección exclusiva, diseñada para inspirar tu estilo de vida
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar - Sticky */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <ProductSearchBar products={initialProducts} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <ProductGrid initialProducts={initialProducts} categories={filterCategories} />
        </div>
      </main>
      <Footer />
    </>
  );
}

// Importamos ProductSearchBar después de definirlo
import ProductSearchBar from './ProductSearchBar';
import { PublicProduct } from '@/lib/types/type.public';
