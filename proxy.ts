import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Rutas que solo pueden ver usuarios NO autenticados
  const authRoutes = ["/iniciar-sesion", "/registrarse"];

  // Rutas que solo pueden ver usuarios autenticados
  const protectedRoutes = ["/dashboard", "/profile", "/orders"];

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Si ya tiene sesión e intenta ir a /login o /register → redirige al inicio
  if (sessionCookie && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Si no tiene sesión e intenta ir a ruta protegida → redirige al login
  if (!sessionCookie && isProtectedRoute) {
    return NextResponse.redirect(new URL("/iniciar-sesion", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/iniciar-sesion",
    "/registrarse",
    "/dashboard/:path*",
    "/profile/:path*",
    "/orders/:path*",
  ],
};