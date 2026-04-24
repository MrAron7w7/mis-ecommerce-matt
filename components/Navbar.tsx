import Link from 'next/link';
import { LogoutButton } from './auth/logout-button';
import { getSession } from '@/lib/helpers/session';

export default async function Navbar() {
  const session = await getSession();
  const isAdmin = session?.user?.role === 'ADMIN';
  const isSeller = session?.user?.role === 'SELLER';

  return (
    <nav className="flex justify-between p-4 border-b">
      <Link href="/">
        <span className="font-bold">Mi App</span>
      </Link>

      {session ? (
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link href="/admin">
              <button>Admin</button>
            </Link>
          )}
          {isSeller && (
            <Link href="/seller">
              <button>Seller</button>
            </Link>
          )}

          <span>{session.user.name}</span>
          <LogoutButton />
        </div>
      ) : (
        <div className="flex gap-4">
          <Link href="/iniciar-sesion">
            <button className="px-4 py-2 border rounded">Iniciar sesión</button>
          </Link>

          <Link href="/registrarse">
            <button className="px-4 py-2 bg-black text-white rounded">Registrarse</button>
          </Link>
        </div>
      )}
    </nav>
  );
}
