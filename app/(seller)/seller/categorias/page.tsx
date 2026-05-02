import { requireRole } from '@/lib/helpers/session';

export default async function CategoriesPage() {
  await requireRole(['ADMIN']);
  return <></>;
}
