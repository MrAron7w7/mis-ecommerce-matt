import { getStores } from '@/actions/user/store.user.action';
import UserStoreClient from '@/components/user/tiendas/UserStoreClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tiendas | Matt',
  description: 'Descubre nuestras tiendas oficiales y sus productos exclusivos',
};

export default async function page() {
  const stores = await getStores();
  return <UserStoreClient initialStores={stores} />;
}
