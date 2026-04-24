import CreateProductForm from '@/components/seller/productos/CreateProductForm';
import { requireRole } from '@/lib/helpers/session';
import prisma from '@/lib/prisma';

export default async function CreateProductPage() {
  await requireRole(['SELLER']);

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return (
    <CreateProductForm
      categories={categories.map((c) => ({
        id: Number(c.id),
        name: c.name,
      }))}
    />
  );
}
