"use client";

import { useActionState, useId } from "react";
import { updateProfile, type ProfileFormState } from "@/app/cuenta/actions";
import {
  errorClass,
  fieldClass,
  labelClass,
  noticeClass,
  primaryButtonClass,
} from "@/components/auth/form-styles";

interface ProfileFormProps {
  email: string;
  profile: {
    full_name: string | null;
    phone: string | null;
    country: string | null;
    marketing_opt_in: boolean;
  };
}

const INITIAL_STATE: ProfileFormState = { status: "idle" };

export default function ProfileForm({ email, profile }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, INITIAL_STATE);
  const formId = useId();
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <p className={labelClass}>Email</p>
        <p className="min-h-[44px] flex items-center rounded-2xl bg-[#F8F1EB] px-4 text-[15px] text-[#53392B] break-all">
          {email}
        </p>
      </div>

      <div>
        <label htmlFor={`${formId}-name`} className={labelClass}>
          Nombre y apellido
        </label>
        <input
          id={`${formId}-name`}
          name="full_name"
          type="text"
          autoComplete="name"
          required
          maxLength={120}
          defaultValue={profile.full_name ?? ""}
          aria-invalid={Boolean(errors.full_name)}
          aria-describedby={errors.full_name ? `${formId}-name-error` : undefined}
          className={fieldClass}
        />
        {errors.full_name ? (
          <p id={`${formId}-name-error`} role="alert" className="mt-1.5 text-xs text-[#C0574A]">
            {errors.full_name}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-phone`} className={labelClass}>
            WhatsApp
          </label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            defaultValue={profile.phone ?? ""}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${formId}-phone-error` : undefined}
            className={fieldClass}
            placeholder="+54 9 11 …"
          />
          {errors.phone ? (
            <p id={`${formId}-phone-error`} role="alert" className="mt-1.5 text-xs text-[#C0574A]">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${formId}-country`} className={labelClass}>
            País donde vivís
          </label>
          <input
            id={`${formId}-country`}
            name="country"
            type="text"
            autoComplete="country-name"
            maxLength={60}
            defaultValue={profile.country ?? ""}
            className={fieldClass}
            placeholder="Argentina, España…"
          />
        </div>
      </div>

      <label className="flex items-start gap-3 text-sm text-[#53392B]">
        <input
          name="marketing_opt_in"
          type="checkbox"
          defaultChecked={profile.marketing_opt_in}
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-[#C9B9A9] accent-[#2C2018]"
        />
        Quiero recibir por email novedades de talleres y encuentros.
      </label>

      {state.message ? (
        <p role="alert" className={errorClass}>
          {state.message}
        </p>
      ) : null}
      {state.status === "saved" ? (
        <p role="status" className={noticeClass}>
          Listo, guardamos tus datos.
        </p>
      ) : null}

      <button type="submit" disabled={pending} className={primaryButtonClass}>
        {pending ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
