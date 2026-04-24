// app/page.tsx
import Navbar from '@/components/header/Navbar';
import Footer from '@/components/layouts/user/Footer';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag,
  Truck,
  Shield,
  RefreshCw,
  Star,
  TrendingUp,
  Clock,
  ChevronRight,
  ArrowRight,
  User,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Inicio | Tu Tienda - Moda y Tecnología',
  description:
    'Descubre productos exclusivos en moda, tecnología y hogar. Envíos gratis en compras superiores a $50.',
  keywords: 'tienda online, moda, tecnología, hogar, ofertas',
};

// Datos mock - En producción vendrían de una API
const featuredProducts = [
  {
    id: 1,
    img: '/img/inicio/audifonosINA.jpg',
    name: 'Audífonos inalámbricos',
    price: 59,
    originalPrice: 89,
    rating: 4.5,
    reviews: 128,
    badge: 'Oferta',
  },
  {
    id: 2,
    img: '/img/inicio/smartwatch.png',
    name: 'Smartwatch deportivo',
    price: 120,
    originalPrice: 199,
    rating: 4.8,
    reviews: 245,
    badge: 'Más vendido',
  },
  {
    id: 3,
    img: '/img/inicio/licuadora.jpg',
    name: 'Licuadora multifuncional',
    price: 85,
    originalPrice: 129,
    rating: 4.6,
    reviews: 89,
    badge: null,
  },
  {
    id: 4,
    img: '/img/inicio/mochila.jpg',
    name: 'Mochila urbana',
    price: 45,
    originalPrice: 69,
    rating: 4.7,
    reviews: 312,
    badge: 'Envío gratis',
  },
  {
    id: 5,
    img: '/img/inicio/sillaErgo.jpg',
    name: 'Silla ergonómica',
    price: 150,
    originalPrice: 249,
    rating: 4.9,
    reviews: 167,
    badge: null,
  },
  {
    id: 6,
    img: '/img/inicio/cartera.jpg',
    name: 'Cartera de cuero',
    price: 79,
    originalPrice: 129,
    rating: 4.4,
    reviews: 94,
    badge: 'Nuevo',
  },
];

const categories = [
  { img: '/img/inicio/cartera.jpg', name: 'Carteras', items: 45, href: '/carteras' },
  { img: '/img/inicio/short.jpg', name: 'Shorts', items: 32, href: '/shorts' },
  { img: '/img/inicio/faldas.jpg', name: 'Faldas', items: 28, href: '/faldas' },
];

const benefits = [
  { icon: Truck, title: 'Envío gratis', description: 'En compras mayores a $50' },
  { icon: Shield, title: 'Compra segura', description: 'Protegemos tus datos' },
  { icon: RefreshCw, title: '30 días', description: 'Devoluciones fáciles' },
  { icon: Clock, title: '24/7 Soporte', description: 'Atención al cliente' },
];

export default function HomePage() {
  return (
    <main className="bg-white">
      <Navbar />

      {/* Hero Section - Mejorado */}
      <HeroSection />

      {/* Benefits Bar */}
      <BenefitsBar benefits={benefits} />

      {/* Categories Grid */}
      <CategoriesSection categories={categories} />

      {/* Featured Products */}
      <FeaturedProducts products={featuredProducts} />

      {/* Promotional Banners */}
      <PromotionalBanners />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}

// ==================== COMPONENTES ====================

function HeroSection() {
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
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
              <Link
                href="/ofertas"
                className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-all"
              >
                Ver ofertas
                <ChevronRight size={18} />
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

function BenefitsBar({ benefits }: { benefits: typeof benefits }) {
  return (
    <div className="bg-gray-50 border-y border-gray-200 py-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-3">
              <benefit.icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">{benefit.title}</p>
                <p className="text-xs text-gray-500 hidden sm:block">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoriesSection({ categories }: { categories: typeof categories }) {
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
              href={category.href}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4]"
            >
              <Image
                src={category.img}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                <p className="text-sm text-gray-200">{category.items} productos</p>
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

function FeaturedProducts({ products }: { products: typeof featuredProducts }) {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8 sm:mb-12">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-2">
              Productos destacados
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">Los más vendidos de esta semana</p>
          </div>
          <Link
            href="/productos"
            className="text-sm font-medium text-gray-600 hover:text-black transition flex items-center gap-1"
          >
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: (typeof featuredProducts)[0] }) {
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-2 left-2 z-10">
          <span className="inline-block px-2 py-1 bg-black text-white text-xs rounded-lg">
            {product.badge}
          </span>
        </div>
      )}

      {discount > 0 && (
        <div className="absolute top-2 right-2 z-10">
          <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs rounded-lg">
            -{discount}%
          </span>
        </div>
      )}

      {/* Imagen */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={product.img}
          alt={product.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
        />
        <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-black hover:text-white transition-colors">
          <ShoppingBag size={16} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{product.name}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs text-gray-600">{product.rating}</span>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">${product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">${product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function PromotionalBanners() {
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

function NewsletterSection() {
  return (
    <section className="py-16 sm:py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-4">
            Compra fácil, rápido y seguro
          </h2>
          <p className="text-gray-300 mb-8 text-sm sm:text-base">
            Encuentra todo lo que necesitas con unos pocos clics. Disfruta de una experiencia de
            compra sencilla, con múltiples opciones y entregas confiables directamente a tu puerta.
          </p>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: 'María González',
      role: 'Cliente frecuente',
      comment: 'Excelente servicio y productos de calidad. Los envíos son muy rápidos.',
      rating: 5,
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Comprador verificado',
      comment: 'Me encanta la variedad de productos. Siempre encuentro lo que busco.',
      rating: 5,
    },
    {
      name: 'Ana Martínez',
      role: 'Cliente premium',
      comment: 'El soporte al cliente es increíble. Muy recomendable.',
      rating: 5,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-center mb-8 sm:mb-12">
          Lo que dicen nuestros clientes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4">"{testimonial.comment}"</p>
              <div>
                <p className="font-medium text-gray-900">{testimonial.name}</p>
                <p className="text-xs text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
