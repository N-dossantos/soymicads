import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";
import { getSessionUser } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/auth/redirect";

export const metadata: Metadata = {
  title: "Crear cuenta — Mica Ds",
  robots: { index: false },
};

export default async function RegistroPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeNextPath((await searchParams).next);

  if (await getSessionUser()) redirect(next);

  return (
    <AuthShell title="Creá tu cuenta" subtitle="Para reservar tus sesiones y tener todo tu proceso a mano.">
      <RegisterForm next={next} />
    </AuthShell>
  );
}
