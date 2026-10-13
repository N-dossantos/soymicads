import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/auth/redirect";

// Vuelta del login con Google: canjea el código (PKCE) por la sesión, que
// queda guardada en cookies, y sigue a `next`.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNextPath(url.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
    console.error("[auth/callback] exchangeCodeForSession failed", error.code ?? error.message);
  }

  const loginUrl = new URL("/ingresar", url.origin);
  loginUrl.searchParams.set("error", "google");
  loginUrl.searchParams.set("next", next);
  return NextResponse.redirect(loginUrl);
}
