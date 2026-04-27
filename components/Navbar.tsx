import Link from 'next/link';
import { LogoutButton } from './auth/logout-button';
import { getSession } from '@/lib/helpers/session';
import { CartIcon } from './CartIcon'; // Importamos el nuevo ícono cliente

export default async function Navbar() {
  const session = await getSession();

  return (
    <nav className="flex justify-between items-center p-4 border-b bg-white">
      <Link href="/">
        <span className="font-bold text-xl tracking-tight uppercase">Mi App</span>
      </Link>

      <div className="flex items-center gap-6">
        {/* Usamos el componente cliente aquí */}
        <CartIcon />

        {session ? (
          <div className="flex items-center gap-4 border-l pl-4">
            <span className="text-sm font-medium">{session.user.name}</span>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href="/iniciar-sesion">
              <button className="px-4 py-2 border border-black rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                Iniciar sesión
              </button>
            </Link>
            <Link href="/registrarse">
              <button className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
                Registrarse
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}