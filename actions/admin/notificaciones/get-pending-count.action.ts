// actions/admin/notificaciones/get-pending-count.action.ts
'use server';

import prisma from '@/lib/prisma';
import { PendingRequest } from '@/store/notification-store';

export async function getPendingSellerCountAction(): Promise<{
  count: number;
  requests: PendingRequest[];
}> {
  const requests = await prisma.sellerRequest.findMany({
    where: { status: 'PENDING' },
    select: {
      id: true,
      businessName: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10, // máximo 10 en el dropdown
  });

  return {
    count: requests.length,
    requests: requests.map((r) => ({
      id: r.id,
      businessName: r.businessName ?? 'Sin nombre',
      userName: r.user.name,
      userEmail: r.user.email,
    })),
  };
}
