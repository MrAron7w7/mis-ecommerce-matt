import Navbar from '@/components/header/Navbar';
import Footer from '@/components/layouts/user/Footer';

function UserStoreClientID() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        <h1 className="text-3xl font-bold text-center mt-8">Una tienda</h1>
      </main>
      <Footer />
    </>
  );
}

export default UserStoreClientID;
