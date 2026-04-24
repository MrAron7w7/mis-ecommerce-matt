import Link from 'next/link';
import Image from 'next/image';
import { getSession } from '@/lib/helpers/session';
import UserMenu from './userMenu';
import { Heart, Search, ShoppingCart } from 'lucide-react';

export default async function Navbar() {
  const session = await getSession();

  return (
    <nav className="w-full border-b px-6 py-4 flex items-center justify-between">
      {/* LEFT */}
      <div className="flex items-center gap-10">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={90} height={30} />
        </Link>

        <div className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/productos" className="hover:opacity-60">
            Shop
          </Link>
          <Link href="/new" className="hover:opacity-60">
            New Arrivals
          </Link>
          <Link href="/sales" className="hover:opacity-60">
            Sales
          </Link>
          <Link href="/journal" className="hover:opacity-60">
            Journal
          </Link>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-6 text-sm">
        <button className="hover:opacity-60">
          <Search size={20} />
        </button>

        <Link href="/stores" className="hover:opacity-60">
          Stores
        </Link>

        <Link href="/favorites" className="hover:opacity-60">
          <Heart size={20} />
        </Link>

        <Link href="/cart" className="relative hover:opacity-60">
          <ShoppingCart size={20} />
          <span className="absolute -top-2 -right-2 text-xs bg-black text-white rounded-full px-1">
            2
          </span>
        </Link>

        {/* 👤 SIEMPRE visible */}
        <UserMenu session={session} />
      </div>
    </nav>
  );
}
