import { requireUser } from "@/lib/supabase/server";
import ProfileForm from "@/components/account/ProfileForm";
import PasswordForm from "@/components/auth/PasswordForm";
import DeleteAccountForm from "@/components/account/DeleteAccountForm";

const cardClass = "premium-card rounded-[1.5rem] p-6 sm:p-8";

export default async function PerfilPage() {
  const { supabase, user } = await requireUser("/cuenta/perfil");
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, country, marketing_opt_in")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <>
      <p className="section-kicker">Mi cuenta</p>
      <h1 className="section-title mt-2 text-4xl sm:text-5xl">Tu perfil</h1>

      <div className="mt-8 space-y-6">
        <section aria-labelledby="perfil-datos" className={cardClass}>
          <h2 id="perfil-datos" className="mb-5 font-serif text-2xl text-[#2C2018]">
            Tus datos
          </h2>
          <ProfileForm
            email={user.email}
            profile={profile ?? { full_name: null, phone: null, country: null, marketing_opt_in: false }}
          />
        </section>

        <section aria-labelledby="perfil-contrasena" className={cardClass}>
          <h2 id="perfil-contrasena" className="font-serif text-2xl text-[#2C2018]">
            Contraseña
          </h2>
          <p className="mb-5 mt-1 text-sm leading-relaxed text-[#7A6A5A]">
            Si entraste con Google o con un código, podés crear una para ingresar también con tu email.
          </p>
          <PasswordForm />
        </section>

        <section aria-labelledby="perfil-borrar" className={`${cardClass} border-[#E9C9C1]`}>
          <h2 id="perfil-borrar" className="font-serif text-2xl text-[#2C2018]">
            Borrar mi cuenta
          </h2>
          <p className="mb-5 mt-1 text-sm leading-relaxed text-[#7A6A5A]">
            Se borran tu perfil y todos tus datos personales. No se puede deshacer.
          </p>
          <DeleteAccountForm />
        </section>
      </div>
    </>
  );
}
