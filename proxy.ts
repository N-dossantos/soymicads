import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Rutas que requieren sesión. Es un chequeo optimista para redirigir rápido:
// cada página y Server Action vuelve a verificar la usuaria (y /admin, el rol).
const PROTECTED_PREFIXES = ["/cuenta", "/admin"];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function proxy(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    console.warn("[proxy] Supabase no está configurado; se omite la sesión.");
    return NextResponse.next();
  }

  const { response, userId } = await updateSession(request);

  if (!userId && isProtected(request.nextUrl.pathname)) {
    const loginUrl = new URL("/ingresar", request.url);
    loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    const redirect = NextResponse.redirect(loginUrl);
    // Si el refresco falló y limpió cookies, el redirect tiene que llevarlas.
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  return response;
}

// Solo las rutas que leen la sesión en el servidor. La landing queda fuera a
// propósito: sigue siendo estática y el Navbar lee la sesión desde el
// navegador, donde el cliente de Supabase refresca el token solo.
export const config = {
  matcher: [
    "/cuenta/:path*",
    "/admin/:path*",
    "/ingresar",
    "/registro",
    "/recuperar",
    "/auth/:path*",
  ],
};
