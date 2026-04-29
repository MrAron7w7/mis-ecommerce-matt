import { getSellerProfile } from '@/actions/seller/profile.seller.action';
import SellerProfileClient from '@/components/seller/gestion-perfil/SellerProfileClient';

export default async function page() {
  const res = await getSellerProfile();
  console.log('DATOS::', res);
  return <SellerProfileClient initialData={res.profile} />;
}
