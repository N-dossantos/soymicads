import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

// Cliente para Server Components, Server Actions y Route Handlers: actúa como
// la usuaria logueada (sus cookies), así que RLS aplica. Hay que crear uno por
// request; no se comparte entre requests.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Los Server Components no pueden escribir cookies. No pasa nada:
            // proxy.ts ya refrescó la sesión antes de renderizar.
          }
        },
      },
    }
  );
}

type ServerClient = Awaited<ReturnType<typeof createClient>>;

// Id y email de la usuaria verificados contra la firma del JWT, o null si no
// hay sesión. Es el chequeo de autorización real (el proxy solo redirige).
export async function getSessionUser(supabase?: ServerClient) {
  const client = supabase ?? (await createClient());
  const { data } = await client.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return null;
  return { id: claims.sub, email: typeof claims.email === "string" ? claims.email : "" };
}

// Para páginas y Server Actions de /cuenta: devuelve el cliente y la usuaria,
// o manda a /ingresar (volviendo a `next` después del login).
export async function requireUser(next: string) {
  const supabase = await createClient();
  const user = await getSessionUser(supabase);
  if (!user) redirect(`/ingresar?next=${encodeURIComponent(next)}`);
  return { supabase, user };
}
