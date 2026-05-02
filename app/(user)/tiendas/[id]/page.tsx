import UserStoreClientID from '@/components/user/tiendas/UserStoreClientID';
import { getStoreBySellerId } from '@/actions/user/store.user.action';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: 'Tiendas | Matt',
  description: 'Descubre nuestras tiendas oficiales y sus productos exclusivos',
};

async function page({ params }: PageProps) {
  const { id } = await params;
  const store = await getStoreBySellerId(id);

  //console.log('DATOS DE LA TIENDA ::', store);

  if (!store) return notFound();

  return <UserStoreClientID store={store} />;
}

export default page;
