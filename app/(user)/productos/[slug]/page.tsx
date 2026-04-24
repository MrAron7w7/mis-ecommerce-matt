// app/(user)/productos/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/header/Navbar';
import Footer from '@/components/layouts/user/Footer';
import {
  getPublicProductBySlug,
  getPublicProducts,
  PublicProduct,
} from '@/actions/user/product.user.action';
import { ChevronLeft } from 'lucide-react';
import ProductDetailClient from '@/components/user/productos/ProductDetailClient';

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

// Generar metadata dinámica para SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // ✅ CORREGIDO: await params
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    return {
      title: 'Producto no encontrado',
      description: 'El producto que buscas no está disponible',
    };
  }

  return {
    title: `${product.name} | Tu Tienda`,
    description:
      product.description ||
      `Compra ${product.name} al mejor precio. Envíos gratis en compras mayores a $100.`,
  };
}

// Generar páginas estáticas para mejor performance (ISR)
export async function generateStaticParams() {
  const products = await getPublicProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await getPublicProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-900 transition">
                Inicio
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/productos" className="text-gray-500 hover:text-gray-900 transition">
                Productos
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900 font-medium line-clamp-1 max-w-[200px] sm:max-w-md">
                {product.name}
              </span>
            </div>
          </div>
        </div>

        {/* Botón volver atrás - móvil */}
        <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
          >
            <ChevronLeft size={16} />
            Volver a productos
          </Link>
        </div>

        {/* Product Detail Client Component */}
        <ProductDetailClient product={product} />

        {/* Productos relacionados */}
        <RelatedProducts currentProductId={product.id} category={product.category} />
      </main>
      <Footer />
    </>
  );
}

// Server Component para productos relacionados
async function RelatedProducts({
  currentProductId,
  category,
}: {
  currentProductId: number;
  category: string;
}) {
  const { getPublicProducts } = await import('@/actions/user/product.user.action');
  const allProducts = await getPublicProducts();

  const relatedProducts = allProducts
    .filter((p) => p.id !== currentProductId && p.category === category)
    .slice(0, 4);

  if (relatedProducts.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2">
            Productos relacionados
          </h2>
          <p className="text-gray-500 text-sm">También te puede interesar</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {relatedProducts.map((product) => (
            <RelatedProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedProductCard({ product }: { product: PublicProduct }) {
  return (
    <Link href={`/productos/${product.slug}`} className="group">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all">
        <div className="relative aspect-square bg-gray-100">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Sin imagen
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
          <p className="text-lg font-semibold text-gray-900 mt-1">${product.price}</p>
        </div>
      </div>
    </Link>
  );
}
