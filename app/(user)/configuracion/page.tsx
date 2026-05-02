import UserSettingClient from '@/components/user/configuracion/UserSettingClient';
import { requireRole } from '@/lib/helpers/session';
import { Metadata } from 'next';
import Navbar from '@/components/header/Navbar';
import Footer from '@/components/layouts/user/Footer';

export const metadata: Metadata = {
  title: 'Configuración | ZonaRetail',
  description: 'Cambia tus preferencias',
};

export default async function page() {
  const session = await requireRole(['USER', 'SELLER', 'ADMIN']);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="grow">
        <UserSettingClient initialConfig={session.user} />
      </div>
      <Footer />
    </div>
  );
}
