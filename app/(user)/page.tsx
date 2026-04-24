import Navbar from '@/components/header/Navbar';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'Mi App',
};

export default function HomePage() {
  return (
    <main className="bg-white text-gray-900">
      <Navbar />

      {/* HERO */}
      <section className="relative h-[85vh] w-full">
        <Image
          src="/images/hero.jpg"
          alt="Moda sostenible"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay suave */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Contenido */}
        <div className="absolute inset-0 flex items-center">
          <div className="ml-10 md:ml-20 max-w-lg text-white">
            <h1 className="text-4xl md:text-5xl font-light leading-tight">Eleva tu estilo</h1>

            <p className="mt-4 text-sm md:text-base text-gray-200">
              Moda atemporal, decisiones sostenibles
            </p>

            <button className="mt-6 bg-white text-black px-6 py-2 text-sm hover:bg-gray-200 transition">
              Comprar ahora
            </button>
          </div>
        </div>
      </section>

      {/* TEXTO INTRO */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 py-12">
        <p className="text-gray-600 max-w-2xl text-sm md:text-base leading-relaxed">
          Eleva tu estilo de vida con un armario más inteligente y sofisticado. Nuestra colección
          está diseñada de forma sostenible, pensada para durar en el tiempo.
        </p>
      </section>

      {/* GRID */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD 1 */}
          <div className="relative group overflow-hidden">
            <Image
              src="/images/card1.jpg"
              alt="Nuevos productos"
              width={500}
              height={600}
              className="w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute bottom-4 left-4 text-white text-sm">Nuevos productos →</span>
          </div>

          {/* CARD 2 */}
          <div className="relative group overflow-hidden">
            <Image
              src="/images/card2.jpg"
              alt="Estilo casual"
              width={500}
              height={600}
              className="w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute bottom-4 left-4 text-white text-sm">Estilo casual</span>
          </div>

          {/* CARD 3 */}
          <div className="relative group overflow-hidden">
            <Image
              src="/images/card3.jpg"
              alt="Más vendidos"
              width={500}
              height={600}
              className="w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute bottom-4 left-4 text-white text-sm">Más vendidos</span>
          </div>
        </div>
      </section>
    </main>
  );
}
