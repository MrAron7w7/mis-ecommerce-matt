import { getMyTickets } from '@/actions/seller/ticker.seller.action';
import SellerRequestClient from '@/components/seller/solicitudes/SellerRequestClient';
import type { Ticket } from '@/components/seller/solicitudes/SellerRequestClient';
import { redirect } from 'next/navigation';

export default async function Page() {
  redirect('/seller');
  const raw = await getMyTickets();

  // Serializar fechas de Date → string para el cliente
  const tickets: Ticket[] = raw.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    responses: t.responses?.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  }));

  return <SellerRequestClient initialTickets={tickets} />;
}
