import { getCategories } from '@/actions/seller/category.seller.action';
import SellerCategoriesClient from '@/components/seller/categorias/SellerCategoriesClient';
import { requireRole } from '@/lib/helpers/session';
import { redirect } from 'next/navigation';

export default async function CategoriesPage() {
  await requireRole(['SELLER']);

  const result = await getCategories();
  if (!result.success) redirect('/');

  return <SellerCategoriesClient initialCategories={result.data} />;
}
