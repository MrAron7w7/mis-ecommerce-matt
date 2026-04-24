import { PublicProduct } from '@/actions/user/product.user.action';

export type Category = {
  id: string;
  name: string;
  productCount: number;
};

export type FilterCategory = Category & {
  id: string;
  name: string;
  productCount: number;
};

// Re-exportamos PublicProduct para que esté disponible
export type { PublicProduct };