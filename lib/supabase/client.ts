import { createBrowserClient } from "@supabase/ssr";

// Las variables NEXT_PUBLIC_ se inlinean en el build. Mientras un entorno no
// tenga Supabase configurado (p. ej. previews viejas), la UI de cuentas se
// oculta en vez de romper la landing.
export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

// Cliente del navegador: usa la clave publicable y guarda la sesión en
// cookies, así el servidor (proxy, Server Components) ve la misma sesión.
// createBrowserClient ya devuelve una única instancia por pestaña.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
