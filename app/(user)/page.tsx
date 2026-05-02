import { Metadata } from 'next';
import { getPublicProducts, getPublicCategories } from '@/actions/user/product.user.action';
import UserLayoutClient from '@/components/layouts/user/UserLayout';

export const metadata: Metadata = {
  title: 'ZonaRetail | Tienda Online',
  description:
    'Descubre productos exclusivos en moda, tecnología y hogar. Envíos gratis en compras superiores a $50.',
  keywords: 'tienda online, moda, tecnología, hogar, ofertas',
};

export default async function HomePage() {
  const [products, categories] = await Promise.all([getPublicProducts(), getPublicCategories()]);

  return <UserLayoutClient products={products} categories={categories} />;
}
