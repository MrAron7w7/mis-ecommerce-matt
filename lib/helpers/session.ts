import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import prisma from '../prisma';

type Role = 'USER' | 'SELLER' | 'ADMIN';

// Obtener sesión completa con todos los datos del usuario
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  // Obtener datos adicionales del usuario desde Prisma
  const userData = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      lastName: true,
      role: true,
      documentType: true,
      documentNumber: true,
      phone: true,
      image: true,
    },
  });

  return {
    ...session,
    user: {
      ...session.user,
      ...userData,
    },
  };
}

export async function requireSession() {
  const session = await getSession();
  if (!session) redirect('/');
  return session;
}

export async function requireRole(roles: Role[]) {
  const session = await getSession();

  if (!session) redirect('/');

  const userRole = session.user.role as Role | undefined;

  if (!userRole || !roles.includes(userRole)) redirect('/');

  return session;
}
