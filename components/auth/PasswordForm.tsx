"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/auth/errors";
import {
  errorClass,
  fieldClass,
  labelClass,
  noticeClass,
  primaryButtonClass,
} from "@/components/auth/form-styles";

const MIN_PASSWORD_LENGTH = 8;

interface PasswordFormProps {
  submitLabel?: string;
  // A dónde ir después de guardar. Si no se pasa, se muestra un aviso de
  // éxito y el formulario se limpia.
  redirectTo?: string;
}

// Crear o cambiar la contraseña de la sesión actual. Sirve tanto para quien
// entró con Google o con código y quiere sumar una, como para la
// recuperación (que llega acá con una sesión de recovery).
export default function PasswordForm({ submitLabel = "Guardar contraseña", redirectTo }: PasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const formId = useId();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaved(false);
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`La contraseña tiene que tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (password !== confirmation) {
      setError("Las dos contraseñas no coinciden.");
      return;
    }

    setPending(true);
    setError(null);
    const { error } = await createClient().auth.updateUser({ password });
    setPending(false);
    if (error) {
      setError(authErrorMessage(error));
      return;
    }

    if (redirectTo) {
      router.replace(redirectTo);
      return;
    }
    setPassword("");
    setConfirmation("");
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor={`${formId}-password`} className={labelClass}>
          Contraseña nueva
        </label>
        <input
          id={`${formId}-password`}
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-describedby={`${formId}-hint`}
          className={fieldClass}
        />
        <p id={`${formId}-hint`} className="mt-1.5 text-xs text-[#7A6A5A]">
          Al menos {MIN_PASSWORD_LENGTH} caracteres.
        </p>
      </div>

      <div>
        <label htmlFor={`${formId}-confirmation`} className={labelClass}>
          Repetila
        </label>
        <input
          id={`${formId}-confirmation`}
          type="password"
          autoComplete="new-password"
          required
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          className={fieldClass}
        />
      </div>

      {error ? (
        <p role="alert" className={errorClass}>
          {error}
        </p>
      ) : null}
      {saved ? (
        <p role="status" className={noticeClass}>
          Listo, tu contraseña quedó guardada.
        </p>
      ) : null}

      <button type="submit" disabled={pending} className={primaryButtonClass}>
        {pending ? "Guardando…" : submitLabel}
      </button>
    </form>
  );
}
