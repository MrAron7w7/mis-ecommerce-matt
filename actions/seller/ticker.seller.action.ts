'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { requireRole } from '@/lib/helpers/session';

// Tipos
export type TicketCategory = 'FEATURE_PRODUCT' | 'ORDER_PROBLEM' | 'PAYMENT_VALIDATION' | 'SHIPPING_ISSUE' | 'PRODUCT_ISSUE' | 'OTHER';

const categoryNames: Record<TicketCategory, string> = {
  FEATURE_PRODUCT: 'Destacar producto',
  ORDER_PROBLEM: 'Problema con pedido',
  PAYMENT_VALIDATION: 'Validar pago',
  SHIPPING_ISSUE: 'Problema de envío',
  PRODUCT_ISSUE: 'Problema con producto',
  OTHER: 'Otro',
};

export async function createTicket(data: {
  title: string;
  category: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  orderNumber?: string;
  productName?: string;
  attachments?: string[];
}) {
  try {
    const session = await requireRole(['SELLER']);
    if (!session?.user?.id) {
      return { error: 'No autorizado' };
    }

    // Mapear categoría
    const categoryMap: Record<string, TicketCategory> = {
      'Destacar producto': 'FEATURE_PRODUCT',
      'Problema con pedido': 'ORDER_PROBLEM',
      'Validar pago': 'PAYMENT_VALIDATION',
      'Problema de envío': 'SHIPPING_ISSUE',
      'Problema con producto': 'PRODUCT_ISSUE',
      'Otro': 'OTHER',
    };

    const category = categoryMap[data.category] || 'OTHER';

    // Generar número de ticket
    const lastTicket = await prisma.supportTicket.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { ticketNumber: true },
    });

    let nextNumber = 1;
    if (lastTicket?.ticketNumber) {
      const match = lastTicket.ticketNumber.match(/TKT-(\d+)/);
      if (match) nextNumber = parseInt(match[1]) + 1;
    }
    const ticketNumber = `TKT-${String(nextNumber).padStart(3, '0')}`;

    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId: session.user.id,
        title: data.title,
        description: data.description,
        category,
        priority: data.priority,
        orderNumber: data.orderNumber,
        productName: data.productName,
        attachments: data.attachments || [],
        status: 'PENDING',
      },
    });

    revalidatePath('/seller/solicitudes');
    return { success: true, ticket };
  } catch (error) {
    console.error('Error creating ticket:', error);
    return { error: 'Error al crear el ticket' };
  }
}

export async function getMyTickets() {
  try {
    const session = await requireRole(['SELLER']);
    if (!session?.user?.id) {
      return [];
    }

    const tickets = await prisma.supportTicket.findMany({
      where: { userId: session.user.id },
      include: {
        responses: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return tickets.map(ticket => ({
      ...ticket,
      categoryName: categoryNames[ticket.category],
      priorityLabel: {
        LOW: 'Baja',
        MEDIUM: 'Media',
        HIGH: 'Alta',
      }[ticket.priority],
      statusLabel: {
        PENDING: 'Pendiente',
        IN_REVIEW: 'En revisión',
        RESOLVED: 'Resuelto',
        CLOSED: 'Cerrado',
      }[ticket.status],
    }));
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }
}

export async function getTicketById(ticketId: string) {
  try {
    const session = await requireRole(['SELLER']);
    if (!session?.user?.id) {
      return null;
    }

    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id: ticketId,
        userId: session.user.id,
      },
      include: {
        responses: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) return null;

    return {
      ...ticket,
      categoryName: categoryNames[ticket.category],
      priorityLabel: {
        LOW: 'Baja',
        MEDIUM: 'Media',
        HIGH: 'Alta',
      }[ticket.priority],
      statusLabel: {
        PENDING: 'Pendiente',
        IN_REVIEW: 'En revisión',
        RESOLVED: 'Resuelto',
        CLOSED: 'Cerrado',
      }[ticket.status],
    };
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return null;
  }
}

export async function addTicketResponse(ticketId: string, message: string, attachments?: string[]) {
  try {
    const session = await requireRole(['SELLER']);
    if (!session?.user?.id) {
      return { error: 'No autorizado' };
    }

    const ticket = await prisma.supportTicket.findFirst({
      where: {
        id: ticketId,
        userId: session.user.id,
      },
    });

    if (!ticket) {
      return { error: 'Ticket no encontrado' };
    }

    // Añadir respuesta
    await prisma.ticketResponse.create({
      data: {
        ticketId,
        message,
        isAdmin: false,
        attachments: attachments || [],
      },
    });

    // Actualizar estado del ticket si estaba pendiente
    if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
      await prisma.supportTicket.update({
        where: { id: ticketId },
        data: { status: 'IN_REVIEW', updatedAt: new Date() },
      });
    }

    revalidatePath(`/seller/solicitudes/${ticketId}`);
    return { success: true };
  } catch (error) {
    console.error('Error adding response:', error);
    return { error: 'Error al enviar respuesta' };
  }
}