import { getCategories } from '@/actions/seller/category.seller.action';
import AdminCategoriesClient from '@/components/admin/categorias/AdminCategoryClient';
import { requireRole } from '@/lib/helpers/session';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Categorias | Admin',
  description: 'Administrar categorias',
};

export default async function CategoriasPage() {
  await requireRole(['ADMIN']);
  const result = await getCategories();
  if (!result.success) redirect('/');
  return <AdminCategoriesClient initialCategories={result.data} />;
}
