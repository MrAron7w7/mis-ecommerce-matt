'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image'; // Importación necesaria para las fotos

const slides = [
  { 
    id: 1, 
    title: "NUEVA COLECCIÓN 2026", 
    desc: "Descubre las últimas tendencias.", 
    // Añadimos la propiedad img con una URL real
    img: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200" 
  },
  { 
    id: 2, 
    title: "OFERTAS EXCLUSIVAS", 
    desc: "Hasta 50% de descuento por tiempo limitado.", 
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200" 
  }
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-2xl shadow-lg border border-neutral-200 bg-black">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 flex flex-col items-center justify-center text-white p-6 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* 1. LA IMAGEN DE FONDO */}
          <div className="absolute inset-0 -z-10">
            <Image 
              src={slide.img}
              alt={slide.title}
              fill
              priority={index === 0} // Carga prioritaria para el primer slide
              className="object-cover opacity-60" // 'object-cover' evita que se deforme
            />
            {/* 2. CAPA DE OSCURECIMIENTO: Garantiza que el texto sea legible */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* 3. CONTENIDO: Se mantiene sobre la imagen gracias al z-index */}
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-center relative z-10">
            {slide.title}
          </h2>
          <p className="text-neutral-100 text-lg mb-8 text-center max-w-md relative z-10">
            {slide.desc}
          </p>
          <button className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-all active:scale-95 relative z-10">
            COMPRAR AHORA
          </button>
        </div>
      ))}
      
      {/* Indicadores */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} />
        ))}
      </div>
    </div>
  );
}