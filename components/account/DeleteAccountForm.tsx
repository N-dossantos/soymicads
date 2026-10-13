"use client";

import { useActionState, useId, useState } from "react";
import { deleteAccount, type DeleteAccountState } from "@/app/cuenta/actions";
import { DELETE_CONFIRMATION_WORD } from "@/lib/account";
import { errorClass, fieldClass, labelClass } from "@/components/auth/form-styles";

const INITIAL_STATE: DeleteAccountState = {};

export default function DeleteAccountForm() {
  const [state, formAction, pending] = useActionState(deleteAccount, INITIAL_STATE);
  const [confirmation, setConfirmation] = useState("");
  const inputId = useId();

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor={inputId} className={labelClass}>
          Escribí {DELETE_CONFIRMATION_WORD} para confirmar
        </label>
        <input
          id={inputId}
          name="confirmation"
          type="text"
          autoComplete="off"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          className={fieldClass}
        />
      </div>

      {state.error ? (
        <p role="alert" className={errorClass}>
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending || confirmation !== DELETE_CONFIRMATION_WORD}
        className="min-h-[44px] flex w-full items-center justify-center rounded-full border border-[#D08C7E] px-6 py-3 text-[15px] font-medium text-[#A2463A] transition duration-200 hover:bg-[#FBEDEA] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Borrando…" : "Borrar mi cuenta para siempre"}
      </button>
    </form>
  );
}
