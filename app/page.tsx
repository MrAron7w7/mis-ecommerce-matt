import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/auth/logout-button';

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/iniciar-sesion');
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bienvenido, {session.user.name}</h1>
          <p className="text-gray-500 text-sm">{session.user.email}</p>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
