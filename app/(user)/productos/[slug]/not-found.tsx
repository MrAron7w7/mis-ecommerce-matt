import Link from 'next/link';
import { Package, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/header/Navbar';
import Footer from '@/components/layouts/user/Footer';

export default function ProductNotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Package size={48} className="text-gray-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-3">
            Producto no encontrado
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Lo sentimos, el producto que buscas no está disponible o ha sido descontinuado.
          </p>
          <Link
            href="/productos"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition text-sm"
          >
            <ArrowLeft size={18} />
            Ver todos los productos
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
