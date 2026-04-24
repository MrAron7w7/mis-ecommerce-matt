import { getPublicCategories, getPublicProducts } from '@/actions/user/product.user.action';
import UserProductClient from '@/components/user/productos/UserProductClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Productos - Mis E-commerce',
  description: 'Explora nuestra selección de productos',
};

export default async function ShopPage() {
  // Cargar datos en el servidor
  const [products, categories] = await Promise.all([getPublicProducts(), getPublicCategories()]);

  return <UserProductClient initialProducts={products} initialCategories={categories} />;
}
