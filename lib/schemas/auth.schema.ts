import { z } from "zod";

// Tipos de documento disponibles (coincide con el enum de Prisma)
export const documentTypes = ['DNI', 'RUC', 'CE', 'PASAPORTE'] as const;
export type DocumentType = typeof documentTypes[number];

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z.string().email('Correo electrónico inválido'),
    documentType: z.enum(
      documentTypes,
      `El tipo de documento debe ser uno de: ${documentTypes.join(', ')}`
    ),
    documentNumber: z
      .string()
      .min(6, 'El número de documento debe tener al menos 6 caracteres')
      .max(12, 'El número de documento no puede tener más de 12 caracteres'),
    phone: z
      .string()
      .min(8, 'El número de celular debe tener al menos 8 dígitos')
      .max(15, 'El número de celular no puede tener más de 15 dígitos')
      .regex(/^[0-9+\-\s]+$/, 'Formato de celular inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;