import { z } from "zod";


const base64ImageSchema = z.string().refine(
  (value) => {
    if (!value) return true;
    return value.startsWith('data:image/') && value.includes('base64,');
  },
  {
    message: "Debe ser una imagen válida en formato base64 (JPG, PNG, WEBP)",
  }
);

export const productVariantSchema = z.object({
  type: z.string().min(1, "El tipo es requerido"),
  value: z.string().min(1, "El valor es requerido"),
});

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(100, "Máximo 100 caracteres"),
  slug: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Solo minúsculas, números y guiones"
    ),
  description: z.string().max(1000, "Máximo 1000 caracteres").optional(),
  price: z
    .number()
    .positive("Debe ser mayor a 0")
    .multipleOf(0.01, "Máximo 2 decimales"),
  stock: z
    .number()
    .int("Debe ser entero")
    .min(0, "No puede ser negativo"),
  imageBase64: base64ImageSchema.optional(), // ✅ NUEVO: para subir imágenes
  imageUrl: z
    .string()
    .url("URL inválida")
    .optional()
    .or(z.literal("")), // Para URLs externas (opcional)
  categoryId: z
    .number()
    .int()
    .positive("La categoría es requerida"),
  supplierId: z
    .number()
    .int()
    .positive()
    .optional(), // opcional
  variants: z
    .array(productVariantSchema)
    .max(10, "Máximo 10 variantes")
    .optional()
    .default([]),
});

export const updateProductSchema = createProductSchema
  .partial()
  .extend({
    id: z.number().int().positive("ID inválido"),
  });

export const deleteProductSchema = z.object({
  id: z.number().int().positive("ID inválido"),
});

export const getProductSchema = z.object({
  id: z.number().int().positive("ID inválido"),
});

// Tipos inferidos
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type DeleteProductInput = z.infer<typeof deleteProductSchema>;
export type GetProductInput    = z.infer<typeof getProductSchema>;