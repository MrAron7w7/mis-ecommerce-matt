import Navbar from '@/components/header/Navbar';
import Footer from '@/components/layouts/user/Footer';
import UserFavoriteClient from '@/components/user/favoritos/UserFavoriteClient';
import React from 'react';

function page() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="grow">
        <UserFavoriteClient />
      </div>
      <Footer />
    </div>
  );
}

export default page;
