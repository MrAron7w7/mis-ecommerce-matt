import { getPendingSellerCountAction } from '@/actions/admin/notificaciones/get-pending-count.action';
import { SellerRequestsProvider } from '@/components/admin/seller-requests-provider';
import { LayoutAdminDashboard } from '@/components/layouts/admin/LayoutAdminDashboard';
import { requireRole } from '@/lib/helpers/session';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(['ADMIN']);
  const { count, requests } = await getPendingSellerCountAction();
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
    <>
      <SellerRequestsProvider initialCount={count} initialRequests={requests} />
      <LayoutAdminDashboard user={user}>{children}</LayoutAdminDashboard>
    </>
  );
}
