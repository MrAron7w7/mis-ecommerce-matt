import { getUsers } from '@/actions/admin/usuarios/get-users.action';
import AdminUserClient from '@/components/admin/usuarios/AdminUserClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Usuarios | Admin',
  description: 'Administrar usuarios',
};

export default async function Page() {
  const users = await getUsers();

  return <AdminUserClient initialUsers={users} />;
}
