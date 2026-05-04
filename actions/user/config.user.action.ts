'use server';

import { requireSession } from '@/lib/helpers/session';
import prisma from '@/lib/prisma';
import { DocumentType } from '@/lib/types/type.models';
import { revalidatePath } from 'next/cache';

export type UpdateProfileInput = {
  name: string;
  lastName: string;
  phone: string;
  documentType: DocumentType;
  documentNumber: string;
};

export type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; error: string };

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

export async function updateProfile(input: UpdateProfileInput): Promise<ActionResult> {
  const session = await requireSession();

  if (!session?.user?.id) {
    return { success: false, error: 'No autorizado' };
  }

  const { name, lastName, phone, documentType, documentNumber } = input;

  if (!name.trim() || !lastName.trim()) {
    return { success: false, error: 'El nombre y apellido son obligatorios' };
  }

  try {
    // Verificar que el número de documento no esté en uso por otro usuario
    if (documentNumber.trim()) {
      const existing = await prisma.user.findFirst({
        where: {
          documentNumber,
          NOT: { id: session.user.id },
        },
        select: { id: true },
      });

      if (existing) {
        return {
          success: false,
          error: 'El número de documento ya está en uso por otra cuenta',
        };
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || null,
        documentType: documentType ?? null,
        documentNumber: documentNumber.trim() || null,
      },
    });

    revalidatePath('/configuracion');

    return { success: true };
  } catch {
    return { success: false, error: 'Error al actualizar el perfil' };
  }
}
