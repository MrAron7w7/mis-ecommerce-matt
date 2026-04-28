import Navbar from '@/components/header/Navbar';
import Footer from '@/components/layouts/user/Footer';
import { Metadata } from 'next';

import HeroSection from '@/components/user/inicio/HeroSection';
import BenefitsBar from '@/components/user/inicio/BenefitsBar';
import CategoriesSection from '@/components/user/inicio/CategoriesSection';
import FeaturedProducts from '@/components/user/inicio/FeaturedProducts';
import NewsletterSection from '@/components/user/inicio/NewsletterSection';
import TestimonialsSection from '@/components/user/inicio/TestimonialsSection';
import { PublicProduct } from '@/actions/user/product.user.action';
import { CategoryModel } from '@/lib/types/types';
import ChatbotWidget from '@/components/chatbotIA/ChatBotIA';

export const metadata: Metadata = {
  title: 'Inicio | Mat - Moda y Tecnología',
  description:
    'Descubre productos exclusivos en moda, tecnología y hogar. Envíos gratis en compras superiores a $50.',
  keywords: 'tienda online, moda, tecnología, hogar, ofertas',
};

export default function UserLayoutClient({
  products,
  categories,
}: {
  products: PublicProduct[];
  categories: CategoryModel[];
}) {
  return (
    <main className="bg-white">
      <Navbar />

      {/* Hero Section - Mejorado */}
      <HeroSection />

      {/* Benefits Bar */}
      <BenefitsBar />

      {/* Categories Grid */}
      <CategoriesSection categories={categories} />

      {/* Featured Products */}
      <FeaturedProducts products={products} />

      {/* Promotional Banners */}
      {/* <PromotionalBanners /> */}

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Testimonials */}
      <TestimonialsSection />

      <ChatbotWidget />

      {/* Footer */}
      <Footer />
    </main>
  );
}
