import { z } from "zod";

const base64ImageSchema = z.string().refine(
  (value) => {
    if (!value) return true; // Opcional
    return value.startsWith('data:image/') && value.includes('base64,');
  },
  {
    message: "Debe ser una imagen válida en formato base64 (JPG, PNG, WEBP)",
  }
);

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(60, "Máximo 60 caracteres"),
  imageBase64: base64ImageSchema.optional(), // Nueva campo para la imagen base64
  imageUrl: z.string().optional(), // Mantenemos para compatibilidad
  isActive: z.boolean().default(true),

});

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.number().int().positive(),
});

export const deleteCategorySchema = z.object({
  id: z.number().int().positive(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type DeleteCategoryInput = z.infer<typeof deleteCategorySchema>;