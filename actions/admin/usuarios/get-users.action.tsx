/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { requireRole } from '@/lib/helpers/session';
import prisma from '@/lib/prisma';
import { AdminUserView, Role } from '@/lib/types/type-models';
import { revalidatePath } from 'next/cache';

export async function getUsers(): Promise<AdminUserView[]> {
  await requireRole(['ADMIN']);

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBlocked: true,
        createdAt: true,
        image: true,
        sellerProfile: {
          select: { storeName: true },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role, // Prisma devuelve el enum como string
      isBlocked: user.isBlocked,
      createdAt: user.createdAt.toISOString(),
      location: 'Perú',
      image: user.image,
      totalOrders: user._count.products,
      sellerProfile: user.sellerProfile,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function changeUserRole(userId: string, role: 'USER' | 'SELLER') {
  await requireRole(['ADMIN']);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (user.role === 'ADMIN') {
      throw new Error('No puedes modificar un administrador');
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        role,
      },
    });

    // Opcional: crear perfil seller automáticamente
    if (role === 'SELLER') {
      await prisma.sellerProfile.upsert({
        where: { userId },
        update: {},
        create: {
          userId,
          storeName: `Tienda de ${updated.name}`,
        },
      });
    }

    revalidatePath('/admin/users');

    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
