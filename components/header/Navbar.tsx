import { getSession } from '@/lib/helpers/session';
import NavbarClient from './NavBarClient';

export default async function Navbar() {
  const session = await getSession();

  return <NavbarClient session={session} />;
}
