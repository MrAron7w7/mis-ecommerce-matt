"use server";

import { saveImage, deleteImage, validateImage } from "@/lib/helpers/save-image-helper";
import { requireRole } from "@/lib/helpers/session";
import { generateSlug, generateUniqueSlug } from "@/lib/helpers/slug-helper";
import prisma from "@/lib/prisma";
import { CreateCategoryInput, createCategorySchema, DeleteCategoryInput, deleteCategorySchema, UpdateCategoryInput, updateCategorySchema } from "@/lib/schemas/seller/category.schema";

type ActionResult<T = null> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
  isActive: boolean;
  _count: { products: number };
  createdAt: string;
};

export async function createCategory(
  input: CreateCategoryInput,
): Promise<ActionResult<{ id: number }>> {
  try {
    await requireRole(["ADMIN"]);

    const parsed = createCategorySchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Datos inválidos",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { name,  imageBase64, isActive } = parsed.data;


    // Validar nombre duplicado
    const nameExists = await prisma.category.findUnique({ where: { name } });
    if (nameExists) {
      return {
        success: false,
        error: "El nombre ya existe",
        fieldErrors: { name: ["Este nombre ya está en uso"] },
      };
    }

    // Generar slug automáticamente
    const baseSlug = generateSlug(name);
    const slug = await generateUniqueSlug(baseSlug, async (slug) => {
      const exists = await prisma.category.findUnique({ where: { slug } });
      return !!exists;
    });
    
    // Procesar imagen si existe
    let imageUrl = null;
    if (imageBase64) {
      // Validar imagen
      const validation = await validateImage(imageBase64, 5);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || "Error en la imagen",
          fieldErrors: { imageBase64: [validation.error || "Imagen inválida"] },
        };
      }

      // Guardar imagen
      try {
        imageUrl = await saveImage(imageBase64, { 
          folder: 'categorias',
          prefix: 'cat_'
        });
      } catch  {
        return {
          success: false,
          error: "Error al guardar la imagen",
        };
      }
    }

    const category = await prisma.category.create({
      data: { name, slug, imageUrl, isActive },
    });

    return { success: true, data: { id: Number(category.id) } };
  } catch  {
    //console.error("[createCategory]", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function updateCategory(
  input: UpdateCategoryInput
): Promise<ActionResult<{ id: number }>> {
  try {
    await requireRole(["ADMIN"]);

    const parsed = updateCategorySchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: "Datos inválidos",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { id,  name, imageBase64, imageUrl, isActive } = parsed.data;

    const exists = await prisma.category.findUnique({ where: { id: BigInt(id) } });
    if (!exists) return { success: false, error: "Categoría no encontrada" };


        // Validar nombre duplicado (excluyendo la categoría actual)
    if (name && name !== exists.name) {
      const conflict = await prisma.category.findFirst({
        where: { name, NOT: { id: BigInt(id) } },
      });
      if (conflict) {
        return {
          success: false,
          error: "El nombre ya existe",
          fieldErrors: { name: ["Este nombre ya está en uso"] },
        };
      }
    }

    // Procesar nueva imagen si se proporciona
    let finalImageUrl = imageUrl;
    if (imageBase64) {
      // Validar imagen
      const validation = await validateImage(imageBase64, 5);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error || "Error en la imagen",
          fieldErrors: { imageBase64: [validation.error || "Imagen inválida"] },
        };
      }

      // Eliminar imagen anterior si existe
      if (exists.imageUrl) {
        await deleteImage(exists.imageUrl);
      }

      // Guardar nueva imagen
      try {
        finalImageUrl = await saveImage(imageBase64, { 
          folder: 'categorias',
          prefix: 'cat_'
        });
      } catch  {
        return {
          success: false,
          error: "Error al guardar la imagen",
        };
      }
    }

        // Si el nombre cambió, actualizar el slug también
    let finalSlug = undefined;
    if (name && name !== exists.name) {
      const baseSlug = generateSlug(name);
      finalSlug = await generateUniqueSlug(baseSlug, async (slug) => {
        const exists = await prisma.category.findFirst({
          where: { slug, NOT: { id: BigInt(id) } },
        });
        return !!exists;
      });
    }

    const category = await prisma.category.update({
      where: { id: BigInt(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(finalSlug !== undefined && { slug: finalSlug }),
        ...(finalImageUrl !== undefined && { imageUrl: finalImageUrl }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return { success: true, data: { id: Number(category.id) } };
  } catch  {
    //console.error("[updateCategory]", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function deleteCategory(
  input: DeleteCategoryInput
): Promise<ActionResult> {
  try {
    await requireRole(["ADMIN"]);

    const parsed = deleteCategorySchema.safeParse(input);
    if (!parsed.success) return { success: false, error: "ID inválido" };

    const exists = await prisma.category.findUnique({
      where: { id: BigInt(parsed.data.id) },
      include: { _count: { select: { products: true } } },
    });
    if (!exists) return { success: false, error: "Categoría no encontrada" };

    if (exists._count.products > 0) {
      return {
        success: false,
        error: `No puedes eliminar una categoría con ${exists._count.products} producto(s) asignado(s)`,
      };
    }

    // Eliminar la imagen asociada si existe
    if (exists.imageUrl) {
      await deleteImage(exists.imageUrl);
    }

    await prisma.category.delete({ where: { id: BigInt(parsed.data.id) } });

    return { success: true, data: null };
  } catch {
    //console.error("[deleteCategory]", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function getCategories(): Promise<ActionResult<CategoryRow[]>> {
  try {
    await requireRole(["ADMIN"]);

    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: categories.map((c) => ({
        id: Number(c.id),
        name: c.name,
        slug: c.slug,
        imageUrl: c.imageUrl ?? null,
        isActive: c.isActive,
        _count: c._count,
        createdAt: c.createdAt.toISOString(),
      })),
    };
  } catch   {
    //console.error("[getCategories]", error);
    return { success: false, error: `Error interno del servidor` };
  }
}