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
      <section className="relative h-[70vh] sm:h-[75vh] md:h-[85vh] w-full">
        <Image
          src="/img/inicio/mainn.jpg"
          alt="Moda sostenible"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute inset-0 flex items-center justify-center md:justify-start">
          <div className="px-4 sm:px-6 md:ml-20 max-w-lg text-white text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-light leading-tight">
              Encuentra todo en un solo lugar
            </h1>

            <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-gray-200">
              Miles de productos, mejores precios y envíos rápidos
            </p>

            <button className="mt-5 sm:mt-6 bg-white text-black px-5 py-2 text-xs sm:text-sm hover:bg-gray-200 transition">
              Explorar productos
            </button>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <p className="text-gray-600 max-w-2xl text-sm sm:text-base leading-relaxed">
          Descubre una amplia variedad de productos para cada necesidad. Desde tecnología y hogar
          hasta moda y más, todo en un solo lugar, con la mejor calidad y precios competitivos.
        </p>
      </section>

      {/* GRID */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pb-10 sm:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            { img: '/img/inicio/cartera.jpg', label: 'Carteras →' },
            { img: '/img/inicio/short.jpg', label: 'Shorts' },
            { img: '/img/inicio/faldas.jpg', label: 'Más vendidos' },
          ].map((item, i) => (
            <div key={i} className="relative group overflow-hidden">
              <Image
                src={item.img}
                alt={item.label}
                width={500}
                height={600}
                className="w-full h-[260px] sm:h-[320px] md:h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute bottom-3 left-3 text-white text-xs sm:text-sm">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTOS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        <h3 className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">Productos destacados</h3>

        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2">
          {[
            {
              img: '/img/inicio/audifonosINA.jpg',
              name: 'Audífonos inalámbricos',
              price: '$59',
            },
            {
              img: '/img/inicio/smartwatch.png',
              name: 'Smartwatch deportivo',
              price: '$120',
            },
            {
              img: '/img/inicio/licuadora.jpg',
              name: 'Licuadora multifuncional',
              price: '$85',
            },
            {
              img: '/img/inicio/mochila.jpg',
              name: 'Mochila urbana',
              price: '$45',
            },
            {
              img: '/img/inicio/sillaErgo.jpg',
              name: 'Silla ergonómica',
              price: '$150',
            },
          ].map((item, i) => (
            <div key={i} className="min-w-[150px] sm:min-w-[180px]">
              <div className="relative bg-gray-100 p-3 sm:p-4">
                <Image
                  src={item.img}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="w-full h-[120px] sm:h-[160px] object-contain"
                />

                <button className="absolute bottom-2 right-2 text-gray-600 text-sm sm:text-lg">
                  +
                </button>
              </div>

              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-800 leading-tight">
                {item.name}
              </p>

              <p className="text-xs text-gray-500">{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BANNERS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pb-10 sm:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {[
            {
              img: '/img/inicio/nitendo.jpg',
              text: 'Tecnología de primer nivel',
            },
            {
              img: '/img/inicio/juegoMueble.jpg',
              text: 'Todo para tu hogar',
            },
          ].map((item, i) => (
            <div key={i} className="relative">
              <Image
                src={item.img}
                alt={item.text}
                width={600}
                height={800}
                className="w-full h-[280px] sm:h-[400px] md:h-[520px] object-cover"
              />
              <span className="absolute bottom-3 left-3 text-black font-bold text-xs sm:text-sm">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* TEXTO */}
      <section className="bg-gray-100 py-10 sm:py-16 px-4 sm:px-6 text-center">
        <h2 className="text-base sm:text-lg md:text-xl font-light mb-3 sm:mb-4">
          Compra fácil, rápido y seguro
        </h2>

        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-gray-600 leading-relaxed">
          Encuentra todo lo que necesitas con unos pocos clics. Disfruta de una experiencia de
          compra sencilla, con múltiples opciones y entregas confiables directamente a tu puerta.
        </p>
      </section>

      {/* INSTAGRAM */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <p className="text-center text-sm text-gray-600 mb-6 sm:mb-8">Comprar en Instagram</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {[
            '/img/inicio/camaExpress.jpg',
            '/img/inicio/zapatillas.jpg',
            '/img/inicio/belleza.jpg',
            '/img/inicio/piano.jpg',
            '/img/inicio/suplementos.jpg',
          ].map((img, i) => (
            <Image
              key={i}
              src={img}
              alt="Instagram"
              width={200}
              height={200}
              className="w-full h-[100px] sm:h-[120px] md:h-[140px] object-cover"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
