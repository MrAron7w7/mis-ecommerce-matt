'use server';

import { requireRole } from '@/lib/helpers/session';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleUserBlock(userId: string) {
  await requireRole(['ADMIN']);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isBlocked: true, role: true },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (user.role === 'ADMIN') {
      throw new Error('No puedes bloquear un administrador');
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        isBlocked: !user.isBlocked,
      },
    });

    revalidatePath('/admin/users');

    return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
