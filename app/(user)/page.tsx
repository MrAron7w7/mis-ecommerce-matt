import Navbar from '@/components/Navbar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'Mi App',
};

export default async function HomePage() {
  return (
    <div>
      <Navbar />
      <div className="p-8">
        <div className="flex items-center justify-between">
          <h1>Pagina principal del ecommerce</h1>
        </div>
      </div>
    </div>
  );
}
