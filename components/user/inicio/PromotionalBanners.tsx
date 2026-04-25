import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PromotionalBanners() {
  const banners = [
    {
      img: '/img/inicio/nitendo.jpg',
      title: 'Tecnología de primer nivel',
      subtitle: 'Hasta 30% OFF',
      cta: 'Comprar ahora',
      href: '/tecnologia',
      bgPosition: 'center',
    },
    {
      img: '/img/inicio/juegoMueble.jpg',
      title: 'Todo para tu hogar',
      subtitle: 'Envío gratis',
      cta: 'Ver colección',
      href: '/hogar',
      bgPosition: 'center',
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner, i) => (
            <Link
              key={i}
              href={banner.href}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] md:aspect-auto md:h-[400px]"
            >
              <Image
                src={banner.img}
                alt={banner.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                <p className="text-sm font-medium mb-2">{banner.subtitle}</p>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3">{banner.title}</h3>
                <div className="inline-flex items-center gap-2 text-sm font-medium border-b-2 border-white pb-1 group-hover:gap-3 transition-all">
                  {banner.cta} <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
