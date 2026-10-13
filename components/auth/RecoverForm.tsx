"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/auth/errors";
import OtpCodeForm from "@/components/auth/OtpCodeForm";
import { errorClass, fieldClass, labelClass, primaryButtonClass } from "@/components/auth/form-styles";

// "Olvidé mi contraseña": el email trae un código (y un link) que abren una
// sesión de recuperación; con esa sesión se elige la contraseña nueva.
export default function RecoverForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const inputId = useId();

  async function sendEmail(): Promise<string | null> {
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim());
    return error ? authErrorMessage(error) : null;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const message = await sendEmail();
    setPending(false);
    if (message) {
      setError(message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <OtpCodeForm
        email={email.trim()}
        type="recovery"
        onVerified={() => router.replace("/cuenta/nueva-contrasena")}
        onResend={sendEmail}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor={inputId} className={labelClass}>
          Email de tu cuenta
        </label>
        <input
          id={inputId}
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

      {error ? (
        <p role="alert" className={errorClass}>
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className={primaryButtonClass}>
        {pending ? "Enviando…" : "Mandarme el código"}
      </button>
    </form>
  );
}
