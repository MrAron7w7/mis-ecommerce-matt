import { LayoutAdminDashboard } from '@/components/layouts/admin/LayoutAdminDashboard';
import { requireRole } from '@/lib/helpers/session';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole(['ADMIN']);
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

  return <LayoutAdminDashboard user={user}>{children}</LayoutAdminDashboard>;
}
