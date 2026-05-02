import { getSellerProfile } from '@/actions/seller/profile.seller.action';
import SellerProfileClient from '@/components/seller/gestion-perfil/SellerProfileClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gestionar Perfil',
};

export default async function page() {
  const res = await getSellerProfile();
  return <SellerProfileClient initialData={res.profile} />;
}
