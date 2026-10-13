import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Refresca la sesión de Supabase (si el access token venció, usa el refresh
// token y reescribe las cookies) y devuelve la respuesta que hay que mandar
// junto con el id de la usuaria, o null si no hay sesión.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          // Las cookies nuevas van al request (para que las vea el render de
          // esta misma navegación) y a la respuesta (para el navegador).
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          // Cache-Control: no-store, para que ningún CDN sirva la sesión de
          // una usuaria a otra.
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    }
  );

  // No meter código entre createServerClient y getClaims: es lo que dispara
  // el refresco del token.
  const { data } = await supabase.auth.getClaims();

  return { response, userId: data?.claims?.sub ?? null };
}
