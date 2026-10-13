import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import { getSessionUser } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/auth/redirect";

export const metadata: Metadata = {
  title: "Ingresar — Mica Ds",
  robots: { index: false },
};

// Errores que llegan desde /auth/callback y /auth/confirm.
const ERRORS: Record<string, string> = {
  google: "No pudimos completar el ingreso con Google. Probá de nuevo.",
  link: "El link venció o ya se usó. Ingresá con tu contraseña o pedí un código nuevo.",
};

export default async function IngresarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNextPath(params.next);

  if (await getSessionUser()) redirect(next);

  return (
    <AuthShell title="Ingresá a tu cuenta" subtitle="Tus sesiones, tus compras y tu carta, en un solo lugar.">
      <LoginForm next={next} initialError={params.error ? (ERRORS[params.error] ?? null) : null} />
    </AuthShell>
  );
}
