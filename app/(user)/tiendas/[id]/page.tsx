import UserStoreClientID from '@/components/user/tiendas/UserStoreClientID';
import { Metadata } from 'next';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Tiendas | Matt',
  description: 'Descubre nuestras tiendas oficiales y sus productos exclusivos',
};

async function page({ params }: PageProps) {
  const { id } = await params;
  return <UserStoreClientID />;
}

export default page;
