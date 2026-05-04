'use server';

import { requireSession } from '@/lib/helpers/session';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import type { ActionResult, DocumentType } from '@/lib/types/type.models';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type SellerRequestInput = {
  businessName: string;
  businessType: string;
  address: string;
  phone: string;
  taxIdType: DocumentType;
  taxIdNumber: string;
  experience: string;
  message: string;
};

// ─── Action ──────────────────────────────────────────────────────────────────

export async function createSellerRequest(input: SellerRequestInput): Promise<ActionResult> {
  const session = await requireSession();

  if (!session?.user?.id) {
    return { success: false, error: 'No autorizado' };
  }

  const {
    businessName,
    businessType,
    address,
    phone,
    taxIdType,
    taxIdNumber,
    experience,
    message,
  } = input;

  // Validaciones básicas
  if (!businessName.trim())
    return { success: false, error: 'El nombre del negocio es obligatorio' };
  if (!businessType.trim()) return { success: false, error: 'El tipo de negocio es obligatorio' };
  if (!address.trim()) return { success: false, error: 'La dirección es obligatoria' };
  if (!phone.trim()) return { success: false, error: 'El teléfono es obligatorio' };
  if (!taxIdNumber.trim())
    return { success: false, error: 'El número de documento es obligatorio' };
  if (!experience.trim()) return { success: false, error: 'La experiencia es obligatoria' };
  if (!message.trim()) return { success: false, error: 'La motivación es obligatoria' };

  try {
    // Verificar que el usuario no tenga ya una solicitud PENDING o APPROVED
    const existing = await prisma.sellerRequest.findFirst({
      where: {
        userId: session.user.id,
        status: { in: ['PENDING', 'APPROVED'] },
      },
      select: { id: true, status: true },
    });

    if (existing?.status === 'APPROVED') {
      return { success: false, error: 'Tu cuenta ya fue aprobada como vendedor' };
    }

    if (existing?.status === 'PENDING') {
      return {
        success: false,
        error: 'Ya tienes una solicitud pendiente. El equipo la revisará pronto.',
      };
    }

    // Verificar que el número de documento no esté en uso por otro usuario
    const docInUse = await prisma.user.findFirst({
      where: {
        documentNumber: taxIdNumber.trim(),
        NOT: { id: session.user.id },
      },
      select: { id: true },
    });

    if (docInUse) {
      return {
        success: false,
        error: 'El número de documento ya está en uso por otra cuenta',
      };
    }

    // Actualizar documentType y documentNumber en el usuario también
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        phone: phone.trim() || null,
        documentType: taxIdType,
        documentNumber: taxIdNumber.trim(),
      },
    });

    // Crear la solicitud
    await prisma.sellerRequest.create({
      data: {
        userId: session.user.id,
        businessName: businessName.trim(),
        businessType: businessType.trim(),
        address: address.trim(),
        phone: phone.trim(),
        taxId: `${taxIdType}: ${taxIdNumber.trim()}`,
        experience: experience.trim(),
        message: message.trim(),
        status: 'PENDING',
      },
    });

    revalidatePath('/configuracion');
    return { success: true, data: null };
  } catch {
    return { success: false, error: 'Error al enviar la solicitud. Inténtalo de nuevo.' };
  }
}

// ─── Query: estado de solicitud actual ───────────────────────────────────────

export async function getSellerRequestStatus(): Promise<
  ActionResult<{ status: string; createdAt: Date } | null>
> {
  const session = await requireSession();

  if (!session?.user?.id) {
    return { success: false, error: 'No autorizado' };
  }

  try {
    const request = await prisma.sellerRequest.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: { status: true, createdAt: true },
    });

    return { success: true, data: request ?? null };
  } catch {
    return { success: false, error: 'Error al consultar el estado' };
  }
}
