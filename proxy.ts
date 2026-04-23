import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  const sessionToken = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  const authRoutes = ["/iniciar-sesion", "/registrarse"];

  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isProtectedRoute =
    pathname.startsWith("/seller") || pathname.startsWith("/admin");

  // 🔹 Si ya está logueado y quiere ir a login
  if (sessionToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 🔹 Si NO está logueado y quiere entrar a seller/admin
  if (!sessionToken && isProtectedRoute) {
    return NextResponse.redirect(
      new URL("/iniciar-sesion", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/iniciar-sesion",
    "/registrarse",
    "/seller/:path*",
    "/admin/:path*",
  ],
};