'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { loginSchema, registerSchema, LoginInput, RegisterInput } from '@/lib/schemas/auth.schema';
import prisma from '@/lib/prisma';

type ActionResult = { success: true; error?: never } | { success?: never; error: string };

export async function loginAction(data: LoginInput): Promise<ActionResult> {
  const validated = loginSchema.safeParse(data);

  if (!validated.success) {
    return { error: validated.error.message };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: validated.data.email,
        password: validated.data.password,
      },
      headers: await headers(),
    });

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Credenciales incorrectas' };
  }
}

export async function registerAction(data: RegisterInput): Promise<ActionResult> {
  const validated = registerSchema.safeParse(data);

  if (!validated.success) {
    return { error: validated.error.message };
  }

  try {
    // 1. Verificar si ya existe un usuario con el mismo email
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.data.email },
    });

    if (existingUser) {
      return { error: 'Este correo electrónico ya está registrado' };
    }

    // 2. Verificar si ya existe el número de documento
    if (validated.data.documentNumber) {
      const existingDocument = await prisma.user.findUnique({
        where: { documentNumber: validated.data.documentNumber },
      });

      if (existingDocument) {
        return { error: 'Este número de documento ya está registrado' };
      }
    }

    // 3. Verificar si ya existe el celular
    if (validated.data.phone) {
      const existingPhone = await prisma.user.findFirst({
        where: { phone: validated.data.phone },
      });

      if (existingPhone) {
        return { error: 'Este número de celular ya está registrado' };
      }
    }

    // 4. Crear el usuario con todos los campos usando Better Auth
    // Nota: Better Auth por defecto solo maneja name, email y password
    // Necesitamos crear el usuario primero y luego actualizar con campos adicionales

    const signUpResult = await auth.api.signUpEmail({
      body: {
        name: `${validated.data.name} ${validated.data.lastName}`, // Combinamos nombre y apellido
        email: validated.data.email,
        password: validated.data.password,
      },
      headers: await headers(),
    });

    // 5. Actualizar el usuario con los campos adicionales
    if (signUpResult?.user?.id) {
      await prisma.user.update({
        where: { id: signUpResult.user.id },
        data: {
          name: validated.data.name,
          lastName: validated.data.lastName,
          // Solo guardar si tienen valor real
          documentNumber: validated.data.documentNumber || null,
          phone: validated.data.phone || null,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error en registro:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Error al registrar usuario' };
  }
}

export async function logoutAction(): Promise<ActionResult> {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return { error: 'Error al cerrar sesión' };
  }
}
