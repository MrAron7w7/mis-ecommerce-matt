import { getSession } from '@/lib/helpers/session';
import NavbarClient from './NavBarClient';
import { getPublicProducts } from '@/actions/user/product.user.action';

export default async function Navbar() {
  const sessionData = await getSession();
  const products = await getPublicProducts();

  const session = sessionData ? { user: sessionData.user } : null;

  return <NavbarClient session={session} products={products} />;
}
