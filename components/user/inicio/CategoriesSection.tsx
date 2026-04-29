import { CategoryModel } from '@/lib/types/types';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesSection({ categories }: { categories: CategoryModel[] }) {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-3">
            Compra por categorías
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Encuentra lo que necesitas en nuestras categorías destacadas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, i) => (
            <Link
              key={i}
              href={`/productos/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl aspect-3/4"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.imageUrl || '/placeholder-category.jpg'}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover object-center 
             transition-transform duration-700 ease-out 
             group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                <p className="text-sm text-gray-200">{category.productCount} productos</p>
                <div className="flex items-center gap-1 mt-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver más <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
