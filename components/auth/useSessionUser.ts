"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

// Usuaria logueada, leída en el navegador. `undefined` mientras no se sabe
// todavía (primer render y SSR): quien lo usa muestra un placeholder, igual
// que CurrencyToggle con `mounted`, para no romper la hidratación.
export function useSessionUser(): User | null | undefined {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    // INITIAL_SESSION llega enseguida con la sesión guardada; después avisa
    // de cada login, logout y refresco del token.
    const {
      data: { subscription },
    } = createClient().auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  return user;
}

export function userInitial(user: User): string {
  const name = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";
  return (name.trim() || user.email || "?").charAt(0).toUpperCase();
}
