"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/auth/errors";
import GoogleButton from "@/components/auth/GoogleButton";
import OtpCodeForm from "@/components/auth/OtpCodeForm";
import {
  errorClass,
  fieldClass,
  labelClass,
  linkClass,
  primaryButtonClass,
} from "@/components/auth/form-styles";

const MIN_PASSWORD_LENGTH = 8;

export default function RegisterForm({ next }: { next: string }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [awaitingCode, setAwaitingCode] = useState(false);
  const formId = useId();

  function finish() {
    router.replace(next);
    router.refresh();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`La contraseña tiene que tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }

    setPending(true);
    setError(null);
    const { data, error } = await createClient().auth.signUp({
      email: email.trim(),
      password,
      // El trigger de alta copia full_name a profiles.
      options: { data: { full_name: fullName.trim() } },
    });
    setPending(false);

    if (error) {
      setError(authErrorMessage(error));
      return;
    }
    // Con la confirmación de email activada no hay sesión hasta verificar.
    // Si el email ya tenía cuenta, Supabase responde igual (para no revelar
    // qué emails están registrados) y el código simplemente no llega.
    if (data.session) {
      finish();
      return;
    }
    setAwaitingCode(true);
  }

  async function resendConfirmation(): Promise<string | null> {
    const { error } = await createClient().auth.resend({ type: "signup", email: email.trim() });
    return error ? authErrorMessage(error) : null;
  }

  if (awaitingCode) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-[#4A3556]">
          Te mandamos un email para confirmar tu cuenta. Ingresá el código o tocá el link del email.
        </p>
        <OtpCodeForm
          email={email.trim()}
          type="email"
          onVerified={finish}
          onResend={resendConfirmation}
          submitLabel="Confirmar mi cuenta"
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <GoogleButton next={next} onError={setError} />

      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-[#8C6A56]">
        <span className="h-px flex-1 bg-[#D8C8B9]/60" />o con tu email
        <span className="h-px flex-1 bg-[#D8C8B9]/60" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={`${formId}-name`} className={labelClass}>
            Nombre y apellido
          </label>
          <input
            id={`${formId}-name`}
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={120}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={fieldClass}
            placeholder="Cómo te llamás"
          />
        </div>

        <div>
          <label htmlFor={`${formId}-email`} className={labelClass}>
            Email
          </label>
          <input
            id={`${formId}-email`}
            type="email"
            autoComplete="email"
            required
            maxLength={120}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor={`${formId}-password`} className={labelClass}>
            Contraseña
          </label>
          <input
            id={`${formId}-password`}
            type="password"
            autoComplete="new-password"
            required
            minLength={MIN_PASSWORD_LENGTH}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-describedby={`${formId}-password-hint`}
            className={fieldClass}
          />
          <p id={`${formId}-password-hint`} className="mt-1.5 text-xs text-[#7A6A5A]">
            Al menos {MIN_PASSWORD_LENGTH} caracteres.
          </p>
        </div>

        {error ? (
          <p role="alert" className={errorClass}>
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Creando tu cuenta…" : "Crear cuenta"}
        </button>
      </form>

      <p className="text-center text-sm text-[#7A6A5A]">
        ¿Ya tenés cuenta?{" "}
        <Link href={`/ingresar?next=${encodeURIComponent(next)}`} className={linkClass}>
          Ingresá
        </Link>
      </p>
    </div>
  );
}
