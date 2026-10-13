import Link from "next/link";
import { requireUser } from "@/lib/supabase/server";

export default async function CuentaPage() {
  const { supabase, user } = await requireUser("/cuenta");
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  const firstName = profile?.full_name?.split(" ")[0];
  const profileIncomplete = !profile?.full_name || !profile?.phone;

  return (
    <>
      <p className="section-kicker">Mi cuenta</p>
      <h1 className="section-title mt-2 text-4xl sm:text-5xl">Hola{firstName ? `, ${firstName}` : ""}</h1>
      <p className="mt-3 max-w-xl leading-relaxed text-[#4A3556]">
        Este es tu espacio. Desde acá vas a poder ver tus compras, completar los datos de tu carta y reservar
        tus sesiones.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/cuenta/perfil" className="premium-card premium-focus block rounded-[1.5rem] p-6">
          <h2 className="font-serif text-2xl text-[#2C2018]">Tu perfil</h2>
          <p className="mt-1 text-sm leading-relaxed text-[#7A6A5A]">
            {profileIncomplete
              ? "Sumá tu teléfono para que Mica pueda escribirte si hace falta."
              : "Tus datos de contacto y tu contraseña."}
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-[#8C6A56]">
            {profileIncomplete ? "Completar perfil →" : "Ver perfil →"}
          </span>
        </Link>

        <Link href="/#servicio" className="premium-card premium-focus block rounded-[1.5rem] p-6">
          <h2 className="font-serif text-2xl text-[#2C2018]">Propuestas</h2>
          <p className="mt-1 text-sm leading-relaxed text-[#7A6A5A]">
            Sesiones de Diseño Humano, procesos y charlitas.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-[#8C6A56]">Ver propuestas →</span>
        </Link>
      </div>
    </>
  );
}
