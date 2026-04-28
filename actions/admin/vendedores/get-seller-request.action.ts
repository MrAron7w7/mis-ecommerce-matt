'use server'

import { requireRole } from '@/lib/helpers/session'
import prisma from '@/lib/prisma'
import { SellerRequestAdminView } from '@/lib/types/type-models'

export async function getSellerRequests(): Promise<SellerRequestAdminView[]> {
  await requireRole(['ADMIN'])

  const requests = await prisma.sellerRequest.findMany({
    include: {
      user: {
        include: {
          sellerProfile: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return requests.map((req) => ({
    id: req.id,
    userId: req.userId,

    userName: req.user.name,
    userEmail: req.user.email,
    userAvatar: req.user.image,

    businessName:
      req.user.sellerProfile?.storeName ||
      req.businessName ||
      'Sin nombre',

    businessType: req.businessType || 'General',

    taxId: req.taxId || req.user.documentNumber || 'N/A',

    phone: req.phone || req.user.phone || '',
    address: req.address || 'No especificado',

    documents: Array.isArray(req.documents) ? req.documents : [],

    status: req.status.toLowerCase() as 'pending' | 'approved' | 'rejected',

    submittedAt: req.createdAt.toISOString(),
    reviewedAt: req.updatedAt?.toISOString(),

    experience: req.experience || '',
    reviewNotes: req.message || ''
  }))
}