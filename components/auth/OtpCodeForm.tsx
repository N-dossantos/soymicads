"use client";

import { useEffect, useId, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/auth/errors";
import {
  errorClass,
  fieldClass,
  labelClass,
  linkClass,
  primaryButtonClass,
} from "@/components/auth/form-styles";

// Supabase no deja pedir otro email al mismo destinatario antes de 60 s.
const RESEND_COOLDOWN_SECONDS = 60;

interface OtpCodeFormProps {
  email: string;
  // "email": ingreso con código o confirmación del registro.
  // "recovery": código del email de "olvidé mi contraseña".
  type: "email" | "recovery";
  onVerified: () => void;
  // Vuelve a mandar el email; devuelve un mensaje de error o null.
  onResend: () => Promise<string | null>;
  submitLabel?: string;
}

// Paso "te mandamos un código de 6 dígitos": se tipea acá mismo, sin salir
// de la página. El mismo email trae un link que hace lo mismo.
export default function OtpCodeForm({
  email,
  type,
  onVerified,
  onResend,
  submitLabel = "Continuar",
}: OtpCodeFormProps) {
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const inputId = useId();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function verify(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const { error } = await createClient().auth.verifyOtp({ email, token: code, type });
    if (error) {
      setPending(false);
      setError(authErrorMessage(error));
      return;
    }
    onVerified();
  }

  async function resend() {
    setError(null);
    setCooldown(RESEND_COOLDOWN_SECONDS);
    const message = await onResend();
    if (message) setError(message);
  }

  return (
    <form onSubmit={verify} className="space-y-4">
      <div>
        <label htmlFor={inputId} className={labelClass}>
          Código de 6 dígitos
        </label>
        <input
          id={inputId}
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          required
          autoFocus
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          aria-invalid={Boolean(error)}
          className={`${fieldClass} text-center text-xl tracking-[0.5em]`}
          placeholder="••••••"
        />
        <p className="mt-1.5 text-xs text-[#7A6A5A]">
          Lo mandamos a <strong className="font-medium text-[#53392B]">{email}</strong>. Si no lo ves,
          revisá la carpeta de spam.
        </p>
      </div>

      {error ? (
        <p role="alert" className={errorClass}>
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={pending || code.length !== 6} className={primaryButtonClass}>
        {pending ? "Verificando…" : submitLabel}
      </button>

      <p className="text-center text-sm text-[#7A6A5A]">
        {cooldown > 0 ? (
          `Podés pedir otro código en ${cooldown} s`
        ) : (
          <button type="button" onClick={resend} className={linkClass}>
            Mandarme otro código
          </button>
        )}
      </p>
    </form>
  );
}
