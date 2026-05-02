'use server';

import { deleteImage, saveImage } from '@/lib/helpers/save-image-helper';
import { requireSession } from '@/lib/helpers/session';
import prisma from '@/lib/prisma';

export default async function getUserConfig() {
  const session = await requireSession(); // cualquier usuario autenticado
  if (!session?.user?.id) return { error: 'No autorizado' };

  const config = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      lastName: true,
      email: true,
      phone: true,
      documentType: true,
      documentNumber: true,
      image: true,
      role: true,
    },
  });

  return { success: true, config };
}
