import { getSellerProduct } from '@/actions/seller/product.seller.action';
import EditProductForm from '@/components/seller/productos/EditProductForm';
import { requireRole } from '@/lib/helpers/session';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

type Props = {
  params: { id: string };
};

export default async function EditProductPage({ params }: Props) {
  await requireRole(['SELLER']);

  const { id } = await params;
  const productId = parseInt(id);

  if (isNaN(productId)) {
    notFound();
  }

  // Obtener producto
  const result = await getSellerProduct({ id: productId });

  if (!result.success || !result.data) {
    notFound();
  }

  // Obtener categorías activas
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return (
    <EditProductForm
      product={result.data}
      categories={categories.map((c) => ({
        id: Number(c.id),
        name: c.name,
      }))}
    />
  );
}
