// ====================
// type.public.ts
// Tipos que se exponen al frontend (usuarios).
// Todos los campos son serializables: number, string, null — nunca bigint, Decimal, Date.
// ====================

// --------------------
// PRODUCTOS
// --------------------

export type PublicVariant = {
  type: string;
  value: string;
};

export type PublicProduct = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  stock: number;
  category: string;       // solo el nombre, no el objeto completo
  variants: PublicVariant[];
  colors: string[];       // variants filtrados por type === 'color'
  sizes: string[];        // variants filtrados por type === 'size'
};

// Cuando entras al detalle de un producto
export type PublicProductDetail = PublicProduct & {
  reviews: PublicReview[];
  rating: number;         // promedio calculado
  reviewCount: number;
};

// --------------------
// CATEGORÍAS
// --------------------

export type PublicCategory = {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  productCount: number;
};

// --------------------
// REVIEWS
// --------------------

export type PublicReview = {
  id: number;
  rating: number;
  comment: string | null;
  isVerified: boolean;
  createdAt: string;      // ISO string (Date no es serializable)
  user: {
    name: string;
    image: string | null;
  };
};