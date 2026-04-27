'use client';
import { useCart } from '@/app/(user)/context/CartContext'; // Asegúrate de que la ruta sea correcta
import Image from 'next/image'; // Importamos el componente para manejar las fotos

export default function ProductGridClient() {
  const { addToCart } = useCart();

  // Definimos productos de prueba con imágenes reales de Unsplash
  const productosMock = [
    { 
      id: 1, 
      name: 'Polo Premium Blanco', 
      price: 85.00, 
      img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      id: 2, 
      name: 'Casaca Denim Urbana', 
      price: 180.00, 
      img: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      id: 3, 
      name: 'Reloj Minimalista Negro', 
      price: 135.00, 
      img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' 
    },
    { 
      id: 4, 
      name: 'Zapatillas Blancas Pro', 
      price: 220.00, 
      img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80' 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
      {productosMock.map((prod) => (
        <div key={prod.id} className="group cursor-pointer">
          <div className="relative aspect-[3/4] bg-neutral-50 rounded-2xl mb-4 border border-neutral-100 flex items-center justify-center overflow-hidden">
            
            {/* Renderizado de la imagen de prueba */}
            <Image 
              src={prod.img}
              alt={prod.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 25vw"
            />

            <button 
              onClick={() => addToCart({ id: prod.id, name: prod.name, price: prod.price, quantity: 1 })}
              className="absolute bottom-4 left-4 right-4 bg-black text-white py-3 rounded-xl translate-y-20 group-hover:translate-y-0 transition-transform duration-300 text-xs font-bold uppercase z-10"
            >
              Agregar al carrito
            </button>
          </div>
          <h4 className="font-bold text-black uppercase text-sm tracking-tight">{prod.name}</h4>
          <p className="text-neutral-500 text-sm mt-1">S/ {prod.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}