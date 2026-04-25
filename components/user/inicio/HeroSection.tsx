import { ChevronRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-[70vh] md:min-h-[85vh] w-full overflow-hidden">
      {/* Imagen de fondo con optimización */}
      <div className="absolute inset-0">
        <Image
          src="/img/inicio/mainn.jpg"
          alt="Moda sostenible y tecnología"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
      </div>

      {/* Contenido */}
      <div className="relative min-h-[70vh] md:min-h-screen flex items-center">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-4">
              🔥 Hasta 40% OFF
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
              Encuentra todo
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                en un solo lugar
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 max-w-lg">
              Miles de productos, mejores precios y envíos rápidos. Descubre las mejores ofertas hoy
              mismo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/productos"
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all hover:scale-105 transform duration-200"
              >
                Explorar productos
                <ShoppingBag size={18} />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/20 max-w-md">
              <div>
                <p className="text-2xl font-bold">+10k</p>
                <p className="text-xs text-gray-300">Productos</p>
              </div>
              <div>
                <p className="text-2xl font-bold">+5k</p>
                <p className="text-xs text-gray-300">Clientes felices</p>
              </div>
              <div>
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-xs text-gray-300">Soporte</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
