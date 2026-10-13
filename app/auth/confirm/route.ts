import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/auth/redirect";

const ALLOWED_TYPES: EmailOtpType[] = ["email", "signup", "magiclink", "recovery", "email_change", "invite"];

// Links de los emails de Auth (plantillas en supabase/templates): confirmar
// cuenta, ingresar, recuperar contraseña y cambiar email. Verifica el
// token_hash del lado del servidor, así funciona aunque el link se abra en
// otro navegador que el que pidió el email.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  if (tokenHash && type && ALLOWED_TYPES.includes(type)) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      const next = type === "recovery" ? "/cuenta/nueva-contrasena" : safeNextPath(url.searchParams.get("next"));
      return NextResponse.redirect(new URL(next, url.origin));
    }
    console.error("[auth/confirm] verifyOtp failed", error.code ?? error.message);
  }

  const loginUrl = new URL("/ingresar", url.origin);
  loginUrl.searchParams.set("error", "link");
  return NextResponse.redirect(loginUrl);
}
