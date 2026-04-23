import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type Role = "USER" | "SELLER" | "ADMIN";

export async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("No autenticado");
  return session;
}

export async function requireRole(roles: Role[]) {
  const session = await getSession();

  if (!session) {
    throw new Error("No autenticado");
  }

  const userRole = session.user.role as Role | undefined;

  if (!userRole || !roles.includes(userRole)) {
    redirect("/");
  }

  return session;
}