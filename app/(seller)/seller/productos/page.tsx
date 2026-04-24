import { getSellerProducts } from '@/actions/seller/product.seller.action';
import SellerProductsClient from '@/components/seller/productos/SellerProductsClient';
import { requireRole } from '@/lib/helpers/session';
import { redirect } from 'next/navigation';

export default async function SellerProductsPage() {
  await requireRole(['SELLER']);

  const result = await getSellerProducts();

  if (!result.success) redirect('/');

  return <SellerProductsClient products={result.data} />;
}
