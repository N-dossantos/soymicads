import "server-only";
import { createClient } from "@supabase/supabase-js";

// Cliente con la clave secreta: se saltea RLS. Solo para el servidor
// (webhooks, cron, acciones de admin, borrar cuentas). `server-only` hace
// fallar el build si algún componente cliente lo importa.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY.");
  }

  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
