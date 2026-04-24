// components/header/UserMenu.tsx
'use client';

import { useState } from 'react';
import { User, ChevronDown } from 'lucide-react';
import UserDropdown from './UserDropdown';
import { useModal } from './ModalProvider';

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

type UserMenuProps = {
  session: SessionUser | null;
};

export default function UserMenu({ session }: UserMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { openAuthModal } = useModal();

  const user = session?.user;
  const isAuthenticated = !!user;

  const handleUserClick = () => {
    if (isAuthenticated) {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      openAuthModal('login');
    }
  };

  const handleLogoutClick = () => {
    openAuthModal('logout');
    setIsDropdownOpen(false);
  };

  // Mostrar nombre completo o solo nombre
  const displayName = user?.lastName ? `${user.name} ${user.lastName}` : user?.name;

  return (
    <div className="relative">
      <button
        onClick={handleUserClick}
        className="flex items-center gap-2 hover:opacity-70 transition px-2 py-1 rounded-lg hover:bg-gray-100"
        aria-label="Menú de usuario"
      >
        <User size={20} />
        {isAuthenticated && displayName && (
          <>
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {displayName.split(' ')[0]}
            </span>
            <ChevronDown
              size={16}
              className={`hidden md:block transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </>
        )}
      </button>

      {isAuthenticated && isDropdownOpen && (
        <UserDropdown
          user={{
            ...user,
            name: displayName || user.name || '',
          }}
          onClose={() => setIsDropdownOpen(false)}
          onLogout={handleLogoutClick}
        />
      )}
    </div>
  );
}
