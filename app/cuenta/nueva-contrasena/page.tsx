import { requireUser } from "@/lib/supabase/server";
import PasswordForm from "@/components/auth/PasswordForm";

// Destino de "Olvidé mi contraseña": se llega con la sesión de recuperación
// que abre el código o el link del email.
export default async function NuevaContrasenaPage() {
  await requireUser("/cuenta/nueva-contrasena");

  return (
    <>
      <p className="section-kicker">Mi cuenta</p>
      <h1 className="section-title mt-2 text-4xl sm:text-5xl">Elegí tu nueva contraseña</h1>
      <div className="premium-card mt-8 max-w-md rounded-[1.5rem] p-6 sm:p-8">
        <PasswordForm redirectTo="/cuenta" />
      </div>
    </>
  );
}
