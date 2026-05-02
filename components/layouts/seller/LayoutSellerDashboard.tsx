'use client';

import { useState } from 'react';
import { SellerSidebar } from './sidebar/SellerSidebar';
import { MobileSidebar } from './sidebar/MobileSidebar';
import { SellerHeader } from './sidebar/SellerHeader';

interface SessionUser {
  name: string;
  email: string;
  image?: string | null;
  role?: string;
}

interface Props {
  children: React.ReactNode;
  user: SessionUser;
}

export function LayoutSellerDashboard({ children, user }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <SellerSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />
      <div
        className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}
      >
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
