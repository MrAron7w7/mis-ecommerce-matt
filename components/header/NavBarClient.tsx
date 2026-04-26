'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import UserMenu from './userMenu';
import SearchModal from './SearchModal';
import { PublicProduct } from '@/actions/user/product.user.action';
import { useCartStore } from '@/store/cartStore';

type SessionUser = {
  user?: {
    id?: string;
    name?: string;
    lastName?: string | null;
    email?: string;
    role?: 'USER' | 'SELLER' | 'ADMIN';
    image?: string;
  };
};

type NavBarClientProps = {
  session: SessionUser | null;
  products: PublicProduct[];
};

export default function NavBarClient({ session, products }: NavBarClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  const { toggleCart, totalItems } = useCartStore();

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <img
                src="img/inicio/logo.png"
                alt="Logo"
                className="w-[100px] h-[50px] object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavLink href="/productos" pathname={pathname}>
                Productos
              </NavLink>
              <NavLink href="/tiendas" pathname={pathname}>
                Tiendas
              </NavLink>
            </div>

            {/* Right Icons */}
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
                {totalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs bg-black text-white rounded-full px-1.5 min-w-[18px] text-center">
                    {totalItems()} {/* dinámico desde el store */}
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

type NavLinkProps = {
  href: string;
  pathname: string;
  children: React.ReactNode;
};

function NavLink({ href, pathname, children }: NavLinkProps) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition ${
        isActive ? 'text-black' : 'text-gray-600 hover:text-black'
      }`}
    >
      {children}
    </Link>
  );
}

type MobileDrawerProps = {
  onClose: () => void;
  pathname: string;
};

function MobileDrawer({ onClose, pathname }: MobileDrawerProps) {
  const menuItems = [
    { href: '/productos', label: 'Shop' },
    { href: '/new', label: 'New Arrivals' },
    { href: '/sales', label: 'Sales' },
    { href: '/journal', label: 'Journal' },
    { href: '/stores', label: 'Stores' },
    { href: '/favorites', label: 'Favorites' },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 shadow-xl animate-slide-in">
        <div className="flex justify-between items-center p-4 border-b">
          <img src="img/inicio/logo.png" alt="Logo" className="w-[80px] h-[40px] object-contain" />
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

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
