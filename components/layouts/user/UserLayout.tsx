import Navbar from '@/components/header/Navbar';
import React from 'react';
import Footer from './Footer';

function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

export default UserLayout;
