import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import RecoverForm from "@/components/auth/RecoverForm";
import { linkClass } from "@/components/auth/form-styles";

export const metadata: Metadata = {
  title: "Recuperar contraseña — Mica Ds",
  robots: { index: false },
};

export default function RecuperarPage() {
  return (
    <AuthShell
      title="Recuperá tu contraseña"
      subtitle="Te mandamos un código por email para que elijas una nueva."
    >
      <RecoverForm />
      <p className="mt-5 text-center text-sm text-[#7A6A5A]">
        ¿Te acordaste?{" "}
        <Link href="/ingresar" className={linkClass}>
          Volver a ingresar
        </Link>
      </p>
    </AuthShell>
  );
}
