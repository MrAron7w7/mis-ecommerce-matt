'use server';

import prisma from '@/lib/prisma';

export type Variant = {
  type: string;
  value: string;
};

// Tipos públicos (NO expones campos internos como isActive, sellerId, etc)
export type PublicProduct = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  variants: Variant[];
  sizes: string[];
  category: string;
  colors: string[]; // Esto viene de variants
  stock: number;
};

export async function getPublicProducts(): Promise<PublicProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      isActive: true, // Solo productos activos
      stock: { gt: 0 }, // Solo con stock
    },
    include: {
      category: {
        select: { name: true },
      },
      variants: {
        select: { type: true, value: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return products.map((product) => {
    const variants = product.variants.map((v) => ({ type: v.type, value: v.value }));

    return {
      id: Number(product.id),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      category: product.category.name,
      variants,
      colors: variants.filter((v) => v.type === 'color').map((v) => v.value),
      sizes: variants.filter((v) => v.type === 'size').map((v) => v.value),
      stock: product.stock,
    };
  });
}

export async function getPublicProductBySlug(slug: string): Promise<PublicProduct | null> {
  const product = await prisma.product.findFirst({
    where: {
      slug,
      isActive: true,
      //stock: { gt: 0 },
    },
    include: {
      category: {
        select: { name: true },
      },
      variants: {
        select: { type: true, value: true },
      },
    },
  });

  if (!product) return null;

  const variants = product.variants.map((v) => ({ type: v.type, value: v.value }));

  return {
    id: Number(product.id),
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    imageUrl: product.imageUrl,
    category: product.category.name,
    variants,
    colors: variants.filter((v) => v.type === 'color').map((v) => v.value),
    sizes: variants.filter((v) => v.type === 'size').map((v) => v.value),
    stock: product.stock,
  };
}

// Obtener categorías activas para el filtro
export async function getPublicCategories() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
      _count: {
        select: {
          products: {
            where: { isActive: true, stock: { gt: 0 } },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  return categories.map((cat) => ({
    id: Number(cat.id),
    name: cat.name,
    slug: cat.slug,
    imageUrl: cat.imageUrl,
    productCount: cat._count.products,
  }));
}
