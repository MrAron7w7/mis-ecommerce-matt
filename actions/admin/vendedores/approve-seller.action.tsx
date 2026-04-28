'use server';

import { requireRole } from '@/lib/helpers/session';
import prisma from '@/lib/prisma';

export async function approveSeller(requestId: string) {
  await requireRole(['ADMIN']);

  const request = await prisma.sellerRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) throw new Error('Request not found');

  await prisma.$transaction([
    prisma.sellerRequest.update({
      where: { id: requestId },
      data: { status: 'APPROVED' },
    }),

    prisma.user.update({
      where: { id: request.userId },
      data: { role: 'SELLER' },
    }),

    prisma.sellerProfile.upsert({
      where: { userId: request.userId },
      update: {},
      create: {
        userId: request.userId,
        storeName: request.businessName || 'Mi tienda',
      },
    }),
  ]);

  return { success: true };
}
