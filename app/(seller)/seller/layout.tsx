import { LayoutSellerDashboard } from '@/components/layouts/seller/LayoutSellerDashboard';
import { ToastProvider } from '@/components/ui/custom-toast';
import { requireRole } from '@/lib/helpers/session';

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(['SELLER']);

  /*
  if (!session) {
    redirect('/');
  }*/

  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image ?? null,
    role: session.user.role,
  };

  return (
    <ToastProvider>
      <LayoutSellerDashboard user={user}>{children}</LayoutSellerDashboard>
    </ToastProvider>
  );
}
