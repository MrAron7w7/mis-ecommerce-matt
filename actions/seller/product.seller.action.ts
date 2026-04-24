"use server";

import { requireRole } from "@/lib/helpers/session";
import prisma from "@/lib/prisma";
import { CreateProductInput, createProductSchema, DeleteProductInput, deleteProductSchema, GetProductInput, getProductSchema, UpdateProductInput, updateProductSchema } from "@/lib/schemas/seller/product.schema";
import { deleteImage, saveImage, validateImage } from "@/lib/helpers/save-image-helper";


// ─────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────
type ActionResult<T = null> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

type ProductRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  stock: number;
  isActive: boolean;
  imageUrl: string | null;
  categoryId: number;
  supplierId: number | null;
  category: { name: string };
  variants: Array<{ id: number; type: string; value: string }>;
};

// ─────────────────────────────────────────
// Helper: verificar ownership
// ─────────────────────────────────────────
async function assertOwnership(
  productId: bigint,
  userId: string,
  role: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { sellerId: true },
  });

  if (!product) return { ok: false, error: "Producto no encontrado" };

  if (role !== "ADMIN" && product.sellerId !== userId) {
    return { ok: false, error: "No tienes permiso sobre este producto" };
  }

  return { ok: true };
}

// ─────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────
export async function createProduct(
  input: CreateProductInput
): Promise<ActionResult<{ id: number }>> {
  try {
    const session = await requireRole(["SELLER"]);

    const parsed = createProductSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Datos inválidos",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { variants, categoryId, supplierId, imageBase64, ...rest } = parsed.data;

    // 🔥 PROCESAR IMAGEN 🔥
    let imageUrl = null;
    if (imageBase64) {
      const validation = await validateImage(imageBase64, 10);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || "Error en la imagen",
          fieldErrors: { imageBase64: [validation.error || "Imagen inválida"] },
        };
      }

      try {
        imageUrl = await saveImage(imageBase64, { 
          folder: 'productos',
          prefix: 'prod_'
        });
      } catch {
        return {
          success: false,
          error: "Error al guardar la imagen",
        };
      }
    }

    // Validaciones existentes...
    const slugExists = await prisma.product.findUnique({ where: { slug: rest.slug } });
    if (slugExists) {
      return {
        success: false,
        error: "El slug ya está en uso",
        fieldErrors: { slug: ["Este slug ya está registrado"] },
      };
    }

    const nameExists = await prisma.product.findUnique({ where: { name: rest.name } });
    if (nameExists) {
      return {
        success: false,
        error: "El nombre ya está en uso",
        fieldErrors: { name: ["Este nombre ya está registrado"] },
      };
    }

    // 🔥 CREAR CON IMAGEN 🔥
    const product = await prisma.product.create({
      data: {
        ...rest,
        imageUrl, // ← AÑADIR ESTO
        categoryId: BigInt(categoryId),
        supplierId: supplierId ? BigInt(supplierId) : null,
        sellerId: session.user.id,
        variants: { create: variants ?? [] },
      },
    });

    return { success: true, data: { id: Number(product.id) } };
  } catch (error) {
    console.error("[createProduct]", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

// ─────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────
export async function updateProduct(
  input: UpdateProductInput
): Promise<ActionResult<{ id: number }>> {
  try {
    const session = await requireRole(["SELLER"]);

    const parsed = updateProductSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Datos inválidos",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { id, variants, categoryId, supplierId, imageBase64, ...rest } = parsed.data;

    const ownership = await assertOwnership(
      BigInt(id),
      session.user.id,
      session.user.role as string
    );
    if (!ownership.ok) {
      return { success: false, error: ownership.error };
    }

    // Validar slug
    if (rest.slug) {
      const slugConflict = await prisma.product.findFirst({
        where: { slug: rest.slug, NOT: { id: BigInt(id) } },
      });
      if (slugConflict) {
        return {
          success: false,
          error: "El slug ya está en uso",
          fieldErrors: { slug: ["Este slug ya está registrado"] },
        };
      }
    }

    // Validar nombre
    if (rest.name) {
      const nameConflict = await prisma.product.findFirst({
        where: { name: rest.name, NOT: { id: BigInt(id) } },
      });
      if (nameConflict) {
        return {
          success: false,
          error: "El nombre ya está en uso",
          fieldErrors: { name: ["Este nombre ya está registrado"] },
        };
      }
    }

    // 🔥 PROCESAR IMAGEN (si se subió una nueva)
    let finalImageUrl = undefined;
    if (imageBase64 !== undefined) {
      if (imageBase64) {
        const validation = await validateImage(imageBase64, 10);
        if (!validation.isValid) {
          return {
            success: false,
            error: validation.error || "Error en la imagen",
            fieldErrors: { imageBase64: [validation.error || "Imagen inválida"] },
          };
        }

        try {
          // Obtener producto actual para eliminar imagen anterior
          const currentProduct = await prisma.product.findUnique({
            where: { id: BigInt(id) },
            select: { imageUrl: true },
          });
          
          if (currentProduct?.imageUrl) {
            await deleteImage(currentProduct.imageUrl);
          }

          finalImageUrl = await saveImage(imageBase64, { 
            folder: 'productos',
            prefix: 'prod_'
          });
        } catch {
          return {
            success: false,
            error: "Error al guardar la imagen",
          };
        }
      } else {
        // Si imageBase64 es null o vacío, eliminar imagen existente
        const currentProduct = await prisma.product.findUnique({
          where: { id: BigInt(id) },
          select: { imageUrl: true },
        });
        
        if (currentProduct?.imageUrl) {
          await deleteImage(currentProduct.imageUrl);
        }
        finalImageUrl = null;
      }
    }

    const product = await prisma.product.update({
      where: { id: BigInt(id) },
      data: {
        ...rest,
        ...(finalImageUrl !== undefined && { imageUrl: finalImageUrl }),
        ...(categoryId !== undefined && { categoryId: BigInt(categoryId) }),
        ...(supplierId !== undefined && {
          supplierId: supplierId ? BigInt(supplierId) : null,
        }),
        ...(variants && variants.length > 0 && {
          variants: {
            deleteMany: {},
            create: variants,
          },
        }),
      },
    });

    return { success: true, data: { id: Number(product.id) } };
  } catch (error) {
    console.error("[updateProduct]", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

// ─────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────
export async function deleteProduct(
  input: DeleteProductInput
): Promise<ActionResult> {
  try {
    const session = await requireRole(["SELLER"]);

    const parsed = deleteProductSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "ID inválido" };
    }

    const ownership = await assertOwnership(
      BigInt(parsed.data.id),
      session.user.id,
      session.user.role as string
    );
    if (!ownership.ok) {
      return { success: false, error: ownership.error };
    }

    // 🔥 Obtener producto para eliminar su imagen
    const product = await prisma.product.findUnique({
      where: { id: BigInt(parsed.data.id) },
      select: { imageUrl: true },
    });

    if (product?.imageUrl) {
      await deleteImage(product.imageUrl);
    }

    await prisma.product.delete({
      where: { id: BigInt(parsed.data.id) },
    });

    return { success: true, data: null };
  } catch (error) {
    console.error("[deleteProduct]", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

// ─────────────────────────────────────────
// GET ONE
// ─────────────────────────────────────────
export async function getSellerProduct(
  input: GetProductInput
): Promise<ActionResult<ProductRow>> {
  try {
    const session = await requireRole(["SELLER"]);

    const parsed = getProductSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "ID inválido" };
    }

    const product = await prisma.product.findUnique({
      where: { id: BigInt(parsed.data.id) },
      include: {
        category: { select: { name: true } },
        variants: { select: { id: true, type: true, value: true } },
      },
    });

    if (!product) {
      return { success: false, error: "Producto no encontrado" };
    }

    if (
      session.user.role !== "ADMIN" &&
      product.sellerId !== session.user.id
    ) {
      return { success: false, error: "No tienes permiso sobre este producto" };
    }

    return {
      success: true,
      data: {
        id:          Number(product.id),
        name:        product.name,
        slug:        product.slug,
        description: product.description,
        price:       product.price.toString(),
        stock:       product.stock,
        isActive:    product.isActive,
        imageUrl:    product.imageUrl,
        categoryId:  Number(product.categoryId),
        supplierId:  product.supplierId ? Number(product.supplierId) : null,
        category:    product.category,
        variants:    product.variants.map((v) => ({
          ...v,
          id: Number(v.id),
        })),
      },
    };
  } catch (error) {
    console.error("[getSellerProduct]", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

// ─────────────────────────────────────────
// GET ALL
// ─────────────────────────────────────────
export async function getSellerProducts(): Promise<ActionResult<ProductRow[]>> {
  try {
    const session = await requireRole(["SELLER"]);

    // Admin ve todos, seller solo los suyos
    const where =
      session.user.role === "ADMIN"
        ? {}
        : { sellerId: session.user.id };

    const products = await prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true } },
        variants: { select: { id: true, type: true, value: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: products.map((p) => ({
        id:          Number(p.id),
        name:        p.name,
        slug:        p.slug,
        description: p.description,
        price:       p.price.toString(),
        stock:       p.stock,
        isActive:    p.isActive,
        imageUrl:    p.imageUrl,
        categoryId:  Number(p.categoryId),
        supplierId:  p.supplierId ? Number(p.supplierId) : null,
        category:    p.category,
        variants:    p.variants.map((v) => ({ ...v, id: Number(v.id) })),
      })),
    };
  } catch (error) {
    console.error("[getSellerProducts]", error);
    return { success: false, error: "Error interno del servidor" };
  }
}