'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Heart, Search, ShoppingCart, Menu, X } from 'lucide-react';
import UserMenu from './userMenu';

export default function NavbarClient({ session }: { session: any }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={33}
                className="w-auto h-8 lg:h-10"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavLink href="/productos" pathname={pathname}>
                Shop
              </NavLink>
              <NavLink href="/new" pathname={pathname}>
                New Arrivals
              </NavLink>
              <NavLink href="/sales" pathname={pathname}>
                Sales
              </NavLink>
              <NavLink href="/journal" pathname={pathname}>
                Journal
              </NavLink>
              <NavLink href="/stores" pathname={pathname}>
                Stores
              </NavLink>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4 lg:space-x-6">
              <button className="hidden sm:block hover:opacity-60 transition">
                <Search size={20} />
              </button>

              <Link href="/favorites" className="hover:opacity-60 transition">
                <Heart size={20} />
              </Link>

              <Link href="/cart" className="relative hover:opacity-60 transition">
                <ShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 text-xs bg-black text-white rounded-full px-1.5 min-w-[18px] text-center">
                  2
                </span>
              </Link>

              <UserMenu session={session} />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <MobileDrawer onClose={() => setIsMobileMenuOpen(false)} pathname={pathname} />
      )}
    </>
  );
}

// Helper components
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
      className={`text-sm font-medium transition ${isActive ? 'text-black' : 'text-gray-600 hover:text-black'}`}
    >
      {children}
    </Link>
  );
}

function MobileDrawer({ onClose, pathname }: { onClose: () => void; pathname: string }) {
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
          <Image src="/logo.png" alt="Logo" width={80} height={26} />
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
