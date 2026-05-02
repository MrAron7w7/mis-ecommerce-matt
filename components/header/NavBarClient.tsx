'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import UserMenu from './userMenu';
import SearchModal from './SearchModal';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import { SessionUser } from '@/lib/types/session-user';
import { PublicProduct } from '@/lib/types/type.public';

type NavBarClientProps = {
  session: SessionUser | null;
  products: PublicProduct[];
};

export default function NavBarClient({ session, products }: NavBarClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const { toggleCart, totalItems } = useCartStore();

  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    setCartCount(totalItems());
  }, [totalItems]);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo — mismo truco que el footer */}
            <Link href="/" className="shrink-0">
              <div className="w-25 h-12.5 relative">
                <Image
                  fill
                  src="/img/inicio/logo.webp"
                  alt="Logo"
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Nav links — siempre visibles */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavLink href="/" pathname={pathname}>
                INICIO
              </NavLink>
              <NavLink href="/productos" pathname={pathname}>
                PRODUCTOS
              </NavLink>
              <NavLink href="/tiendas" pathname={pathname}>
                TIENDAS
              </NavLink>
            </div>

            <div className="flex items-center space-x-4 lg:space-x-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:block hover:opacity-60 transition"
                aria-label="Buscar productos"
              >
                <Search size={20} />
              </button>

              <button
                onClick={toggleCart}
                className="relative hover:opacity-60 transition"
                aria-label="Abrir carrito"
              >
                <ShoppingCart size={20} />
                {/* cartCount en vez de totalItems() — seguro en SSR */}
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-black text-white rounded-full px-1.5 min-w-4.5 text-center ">
                    {cartCount}
                  </span>
                )}
              </button>

              <UserMenu session={session} />

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                aria-label="Abrir menú"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <MobileDrawer onClose={() => setIsMobileMenuOpen(false)} pathname={pathname} />
      )}

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
      />
    </>
  );
}

// NavLink component
function NavLink({
  href,
  pathname,
  children,
}: {
  href: string;
  pathname: string;
  children: React.ReactNode;
}) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`text-sm  transition font-light tracking-tight ${
        isActive ? 'text-black' : 'text-gray-600 hover:text-black'
      }`}
    >
      {children}
    </Link>
  );
}

// MobileDrawer component
function MobileDrawer({ onClose, pathname }: { onClose: () => void; pathname: string }) {
  const menuItems = [
    { href: '/productos', label: 'Productos' },
    { href: '/tiendas', label: 'Tiendas' },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="w-20 h-10 relative">
            <Image fill src="/img/inicio/logo.webp" alt="Logo" className="object-contain" />
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={22} />
          </button>
        </div>

        <div className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`block px-3 py-3 rounded-lg transition ${
                pathname === item.href ? 'bg-gray-100 text-black' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
