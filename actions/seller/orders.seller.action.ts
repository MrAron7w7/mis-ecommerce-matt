'use server';

import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/helpers/session';

export async function getSellerOrders() {
  const session = await requireRole(['SELLER']);
  if (!session?.user?.id) return [];

  // Buscar órdenes que tengan al menos un item del vendedor
  const orderItems = await prisma.orderItem.findMany({
    where: { sellerId: session.user.id },
    include: {
      order: {
        include: {
          user: true,
          items: {
            where: { sellerId: session.user.id }, // solo SUS items
            include: { product: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Deduplicar por orderId (puede haber varios items del mismo pedido)
  const seen = new Set<string>();
  const orders = orderItems
    .filter(({ order }) => {
      if (seen.has(order.id)) return false;
      seen.add(order.id);
      return true;
    })
    .map(({ order }) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.user.name,
      customerEmail: order.user.email,
      customerPhone: order.user.phone ?? null,
      shippingAddress: order.shippingAddress ?? null,
      status: order.status,
      paymentMethod: order.paymentMethod ?? null,
      paymentReceiptUrl: order.paymentReceiptUrl ?? null,
      total: order.items.reduce((sum, i) => sum + Number(i.totalPrice), 0),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      items: order.items.map((i) => ({
        id: String(i.id),
        productId: Number(i.productId),
        productName: i.product.name,
        productImage: i.product.imageUrl ?? null,
        quantity: i.quantity,
        unitPrice: Number(i.unitPrice),
        totalPrice: Number(i.totalPrice),
      })),
    }));

  return orders;
}

export async function updateOrderStatus(
  orderId: string,
  status: 'CONFIRMED' | 'SHIPPED' | 'DELIVERED',
) {
  const session = await requireRole(['SELLER']);
  if (!session?.user?.id) return { error: 'No autorizado' };

  // Verificar que el vendedor tiene items en este pedido
  const hasItems = await prisma.orderItem.findFirst({
    where: { orderId, sellerId: session.user.id },
  });
  if (!hasItems) return { error: 'No autorizado para este pedido' };

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  return { success: true };
}
