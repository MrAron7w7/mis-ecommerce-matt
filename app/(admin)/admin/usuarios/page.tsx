import { getUsers } from '@/actions/admin/usuarios/get-users.action';
import AdminUserClient from '@/components/admin/usuarios/AdminUserClient';

export default async function Page() {
  const users = await getUsers();

  return <AdminUserClient initialUsers={users} />;
}
