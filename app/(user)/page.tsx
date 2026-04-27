import Navbar from '@/components/Navbar';
import { HeroCarousel } from '@/components/HeroCarousel';
import ProductGrid from '@/components/ProductGrid'; 
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Inicio | Mi App Ecommerce',
};

export default async function HomePage() {
  const categorias = [
    { name: 'Ropa', img: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=200' },
    { name: 'Calzado', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200' },
    { name: 'Relojes', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=200' },
    { name: 'Accesorios', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200' },
    { name: 'Deportes', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200' }
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <HeroCarousel />

        {/* SECCIÓN DE BENEFICIOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 my-8 border-y border-neutral-100">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <span className="text-2xl">🚚</span>
            <div><h4 className="font-bold text-sm uppercase text-black">Envío Rápido</h4><p className="text-xs text-neutral-500">Todo el Perú</p></div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start border-y md:border-y-0 md:border-x border-neutral-100 py-6 md:py-0">
            <span className="text-2xl">🛡️</span>
            <div><h4 className="font-bold text-sm uppercase text-black">Pago Seguro</h4><p className="text-xs text-neutral-500">Garantía total</p></div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <span className="text-2xl">🔄</span>
            <div><h4 className="font-bold text-sm uppercase text-black">Devoluciones</h4><p className="text-xs text-neutral-500">30 días de cambio</p></div>
          </div>
        </div>

        {/* SECCIÓN DE CATEGORÍAS (AQUÍ VA TU CÓDIGO) */}
        <section className="py-10">
          <h3 className="text-xl font-black mb-8 uppercase tracking-tighter text-black">Explorar Categorías</h3>
          <div className="flex gap-8 overflow-x-auto pb-4 no-scrollbar justify-start">
            
            {/* INICIO DEL BLOQUE .MAP */}
            {categorias.map((cat) => (
              <div key={cat.name} className="flex-none text-center group cursor-pointer w-24">
                {/* Contenedor del Círculo */}
                <div className="w-24 h-24 rounded-full bg-neutral-100 mb-3 border border-neutral-100 overflow-hidden relative group-hover:border-black transition-all">
                  <Image 
                    src={cat.img}
                    alt={cat.name}
                    fill
                    sizes="96px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {/* Nombre de categoría - Debe estar fuera del div anterior */}
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 group-hover:text-black block">
                  {cat.name}
                </span>
              </div>
            ))}
            {/* FIN DEL BLOQUE .MAP */}

          </div>
        </section>

        {/* SECCIÓN DE PRODUCTOS */}
        <section className="mt-8 mb-20">
          <h3 className="text-3xl font-black tracking-tighter text-black uppercase mb-10">Novedades</h3>
          <ProductGrid />
        </section>
      </div>

      {/* FOOTER */}
      <footer className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-xs">
          <div><h2 className="text-xl font-black mb-6 uppercase">Mi App</h2><p className="text-neutral-400">Calidad y estilo en cada detalle.</p></div>
          <div><h4 className="font-bold mb-6 uppercase text-neutral-300">Colecciones</h4><ul className="space-y-2 text-neutral-400"><li>Hombre</li><li>Mujer</li><li>Relojes</li></ul></div>
          <div><h4 className="font-bold mb-6 uppercase text-neutral-300">Ayuda</h4><ul className="space-y-2 text-neutral-400"><li>Envíos</li><li>Contacto</li></ul></div>
          <div>
            <h4 className="font-bold mb-6 uppercase text-neutral-300">Boletín</h4>
            <div className="flex flex-col gap-2">
              <input type="email" placeholder="tu@correo.com" className="bg-neutral-900 border border-neutral-800 rounded p-2 w-full text-white outline-none focus:border-white transition-all" />
              <button className="bg-white text-black font-bold py-2 w-full rounded uppercase hover:bg-neutral-200 transition-colors">Suscribirse</button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}