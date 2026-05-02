import SellerDashboardClient from '@/components/seller/SellerDashboardClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Vendedor',
};

export default async function page() {
  return (
    <>
      <SellerDashboardClient />
    </>
  );
}
