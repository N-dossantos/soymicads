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

type Mode = "password" | "code";

interface LoginFormProps {
  // A dónde ir después de ingresar (ruta interna, ya validada).
  next: string;
  // En el modal: en vez de navegar a `next`, cerrar y refrescar la página.
  onSuccess?: () => void;
  initialError?: string | null;
}

export default function LoginForm({ next, onSuccess, initialError = null }: LoginFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const formId = useId();

  function finish() {
    if (onSuccess) {
      onSuccess();
      router.refresh();
      return;
    }
    router.replace(next);
    router.refresh();
  }

  function switchMode(nextMode: Mode) {
    setMode(nextMode);
    setCodeSent(false);
    setError(null);
  }

  // Con código no hace falta registrarse antes: si el email es nuevo, se crea
  // la cuenta al verificarlo (la contraseña se puede crear después).
  async function sendCode(): Promise<string | null> {
    const { error } = await createClient().auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });
    return error ? authErrorMessage(error) : null;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);

    if (mode === "password") {
      const { error } = await createClient().auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setPending(false);
        setError(authErrorMessage(error));
        return;
      }
      finish();
      return;
    }

    const message = await sendCode();
    setPending(false);
    if (message) {
      setError(message);
      return;
    }
    setCodeSent(true);
  }

  if (mode === "code" && codeSent) {
    return (
      <div className="space-y-4">
        <OtpCodeForm email={email.trim()} type="email" onVerified={finish} onResend={sendCode} submitLabel="Ingresar" />
        <p className="text-center text-sm">
          <button type="button" onClick={() => setCodeSent(false)} className={linkClass}>
            Usar otro email
          </button>
        </p>
      </div>
    );
  }

  const registerHref = `/registro?next=${encodeURIComponent(next)}`;

  return (
    <div className="space-y-5">
      <GoogleButton next={next} onError={setError} />

      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-[#8C6A56]">
        <span className="h-px flex-1 bg-[#D8C8B9]/60" />o con tu email
        <span className="h-px flex-1 bg-[#D8C8B9]/60" />
      </div>

      <div role="group" aria-label="Forma de ingresar" className="grid grid-cols-2 gap-1 rounded-full bg-[#F5EEE9] p-1">
        {(
          [
            ["password", "Con contraseña"],
            ["code", "Con un código"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => switchMode(value)}
            className={`min-h-[40px] rounded-full text-sm font-medium transition ${
              mode === value ? "bg-white text-[#2C2018] shadow-sm" : "text-[#7A6A5A] hover:text-[#2C2018]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        {mode === "password" ? (
          <div>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <label htmlFor={`${formId}-password`} className="block text-sm font-medium text-[#53392B]">
                Contraseña
              </label>
              <Link href="/recuperar" className={`text-xs ${linkClass}`}>
                ¿La olvidaste?
              </Link>
            </div>
            <input
              id={`${formId}-password`}
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldClass}
            />
          </div>
        ) : (
          <p className="text-sm text-[#7A6A5A]">
            Te mandamos un código de 6 dígitos por email. Si todavía no tenés cuenta, se crea sola.
          </p>
        )}

        {error ? (
          <p role="alert" className={errorClass}>
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Un momento…" : mode === "password" ? "Ingresar" : "Mandarme el código"}
        </button>
      </form>

      <p className="text-center text-sm text-[#7A6A5A]">
        ¿No tenés cuenta?{" "}
        <Link href={registerHref} className={linkClass}>
          Creá una
        </Link>
      </p>
    </div>
  );
}
