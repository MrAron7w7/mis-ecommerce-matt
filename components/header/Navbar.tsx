import { getSession } from '@/lib/helpers/session';
import NavbarClient from './NavBarClient';
import { getPublicProducts } from '@/actions/user/product.user.action';

export default async function Navbar() {
  const session = await getSession();
  const products = await getPublicProducts();

  return <NavbarClient session={session} products={products} />;
}
