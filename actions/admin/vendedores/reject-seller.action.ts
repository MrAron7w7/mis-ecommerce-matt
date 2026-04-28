'use server'

import { requireRole } from '@/lib/helpers/session'
import prisma from '@/lib/prisma'

export async function rejectSeller(requestId: string, reason: string) {
  await requireRole(['ADMIN'])

  if (!reason.trim()) {
    throw new Error('El motivo es obligatorio')
  }

  await prisma.sellerRequest.update({
    where: { id: requestId },
    data: {
      status: 'REJECTED',
      message: reason
    }
  })

  return { success: true }
}