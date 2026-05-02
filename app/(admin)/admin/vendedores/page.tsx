import { getSellerRequests } from '@/actions/admin/vendedores/get-seller-request.action';
import AdminSellerClient from '@/components/admin/vendedores/AdminSellerClient';

export default async function Page() {
  const data = await getSellerRequests();

  return <AdminSellerClient initialRequests={data} />;
}
