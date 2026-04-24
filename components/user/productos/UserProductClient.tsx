import Navbar from '@/components/header/Navbar';
import Footer from '@/components/layouts/user/Footer';
import ProductGrid from './ProductGrid';
import { PublicProduct } from '@/actions/user/product.user.action';

type Category = {
  id: number;
  name: string;
  slug: string;
  productCount: number;
};

export default function UserProductClient({
  initialProducts,
  initialCategories,
}: {
  initialProducts: PublicProduct[];
  initialCategories: Category[];
}) {
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
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl font-light tracking-wide text-gray-900">
              Productos
            </h1>
            <p className="text-gray-500 mt-2 text-sm max-w-md">
              {initialProducts.length} productos disponibles
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ProductGrid initialProducts={initialProducts} categories={filterCategories} />
        </div>
      </main>
      <Footer />
    </>
  );
}
