import UserSettingClient from '@/components/user/configuracion/UserSettingClient';
import { requireRole } from '@/lib/helpers/session';
import { Metadata } from 'next';
import Navbar from '@/components/header/Navbar';
import Footer from '@/components/layouts/user/Footer';
import prisma from '@/lib/prisma';
import type { RequestStatus } from '@/lib/types/type.models';

export const metadata: Metadata = {
  title: 'Configuración | ZonaRetail',
  description: 'Cambia tus preferencias',
};

export default async function ConfiguracionPage() {
  const session = await requireRole(['USER', 'SELLER', 'ADMIN']);

  // Consultar si el usuario tiene alguna solicitud de vendedor previa
  const lastRequest = await prisma.sellerRequest.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: { status: true },
  });

  const existingRequestStatus = (lastRequest?.status ?? null) as RequestStatus | null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="grow">
        <UserSettingClient
          initialConfig={session.user}
          existingRequestStatus={existingRequestStatus}
        />
      </div>
      <Footer />
    </div>
  );
}
