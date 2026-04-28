'use server'

import { requireRole } from '@/lib/helpers/session'
import prisma from '@/lib/prisma'

export async function getSellers() {
  await requireRole(['ADMIN'])

  const sellers = await prisma.user.findMany({
    where: {
      role: 'SELLER'
    },
    include: {
      sellerProfile: true,
      products: true
    }
  })

  return sellers.map((seller) => ({
    id: seller.id,
    name: seller.name,
    email: seller.email,
    phone: seller.phone,
    isBlocked: seller.isBlocked,

    storeName: seller.sellerProfile?.storeName,
    description: seller.sellerProfile?.description,

    totalProducts: seller.products.length,

    createdAt: seller.createdAt
  }))
}