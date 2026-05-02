import { getSellerOrders } from '@/actions/seller/orders.seller.action';
import SellerOrdersClient from '@/components/seller/ordenes/SellerOrdersClient';

export default async function page() {
  const orders = await getSellerOrders();
  return <SellerOrdersClient initialOrders={orders} />;
}
