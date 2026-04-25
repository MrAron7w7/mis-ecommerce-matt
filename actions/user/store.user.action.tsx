'use server';

import prisma from '@/lib/prisma';

export type Store = {
  id: string;
  name: string;
  sellerName: string;
  sellerLastName: string | null;
  email: string;
  image: string | null;
  productCount: number;
  totalSales?: number;
  rating?: number;
  since: string;
  description?: string;
  products: StoreProduct[];
};

export type StoreProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  stock: number;
};

// Obtener todas las tiendas (vendedores con productos activos)
export async function getStores(): Promise<Store[]> {
  const sellers = await prisma.user.findMany({
    where: {
      role: 'SELLER',
      products: {
        some: {
          isActive: true,
        },
      },
    },
    select: {
      id: true,
      name: true,
      lastName: true,
      email: true,
      image: true,
      createdAt: true,
      products: {
        where: {
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          imageUrl: true,
          stock: true,
        },
        take: 8, // Mostrar hasta 8 productos por tienda en la vista principal
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return sellers.map((seller) => ({
    id: seller.id,
    name: seller.name,
    sellerName: seller.name,
    sellerLastName: seller.lastName,
    email: seller.email,
    image: seller.image,
    productCount: seller.products.length,
    since: seller.createdAt.toISOString(),
    products: seller.products.map((product) => ({
      id: Number(product.id),
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      stock: product.stock,
    })),
  }));
}

// Obtener una tienda específica por ID de vendedor
export async function getStoreBySellerId(sellerId: string): Promise<Store | null> {
  const seller = await prisma.user.findFirst({
    where: {
      id: sellerId,
      role: 'SELLER',
    },
    select: {
      id: true,
      name: true,
      lastName: true,
      email: true,
      image: true,
      createdAt: true,
      products: {
        where: {
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          imageUrl: true,
          stock: true,
        },
      },
    },
  });

  if (!seller) return null;

  // Calcular ventas totales y rating (esto sería ideal con una tabla de órdenes)
  // Por ahora lo dejamos como opcional

  return {
    id: seller.id,
    name: seller.name,
    sellerName: seller.name,
    sellerLastName: seller.lastName,
    email: seller.email,
    image: seller.image,
    productCount: seller.products.length,
    since: seller.createdAt.toISOString(),
    products: seller.products.map((product) => ({
      id: Number(product.id),
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      stock: product.stock,
    })),
  };
}

// Obtener productos de una tienda
export async function getStoreProducts(sellerId: string, page: number = 1, pageSize: number = 12) {
  const skip = (page - 1) * pageSize;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        sellerId,
        isActive: true,
      },
      include: {
        category: {
          select: { name: true },
        },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({
      where: {
        sellerId,
        isActive: true,
      },
    }),
  ]);

  return {
    products: products.map((product) => ({
      id: Number(product.id),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      category: product.category.name,
      stock: product.stock,
    })),
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}
