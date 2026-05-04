import { getSellerRequests } from '@/actions/admin/vendedores/get-seller-request.action';
import AdminSellerClient from '@/components/admin/vendedores/AdminSellerClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vendedores | Admin',
  description: 'Administrar vendedores',
};

export default async function Page() {
  const data = await getSellerRequests();

  return <AdminSellerClient initialRequests={data} />;
}
