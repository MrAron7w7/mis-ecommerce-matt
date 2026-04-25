export type CategoryModel = {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
  productCount: number;
};

export type ProductModel = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  variants: Variant[];
  sizes: string[];
  category: string;
  colors: string[]; 
  stock: number;
};

export type Variant = {
  type: string;
  value: string;
};