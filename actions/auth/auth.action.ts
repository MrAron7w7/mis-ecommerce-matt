"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  loginSchema,
  registerSchema,
  LoginInput,
  RegisterInput,
} from "@/lib/schemas/auth.schema";

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
    return { error: "Credenciales incorrectas" };
  }
}

export async function registerAction(data: RegisterInput): Promise<ActionResult> {
  const validated = registerSchema.safeParse(data);

  if (!validated.success) {
    return { error: validated.error.message };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name: validated.data.name,
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
    return { error: "El email ya está registrado" };
  }
}

export async function logoutAction(): Promise<ActionResult> {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error al cerrar sesión" };
  }
}