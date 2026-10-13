"use client";

import { useId, useRef } from "react";
import { Portal } from "@/lib/portal";
import { useDialogA11y } from "@/lib/useDialogA11y";
import LoginForm from "@/components/auth/LoginForm";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  // Ruta a la que vuelve el login con Google (que sí sale de la página).
  next: string;
}

// Login sin salir de la página (Navbar, y más adelante /gracias y talleres).
export default function LoginModal({ open, onClose, next }: LoginModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogA11y(open, dialogRef, onClose);

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20 p-2 sm:p-4 backdrop-blur-sm">
        <div aria-hidden="true" onClick={onClose} className="absolute inset-0" />

        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative z-10 w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl sm:rounded-[2rem] border border-[#D8C8B9] bg-[#FFF9F4] p-5 sm:p-7 shadow-[0_28px_80px_rgba(44,32,24,0.28)]"
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <h2 id={titleId} className="font-serif text-3xl leading-tight text-[#2C2018]">
              Ingresá a tu cuenta
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 min-h-[44px] inline-flex items-center justify-center rounded-full border border-[#C9B9A9] px-4 py-1 text-xs font-medium text-[#53392B] hover:bg-white transition"
            >
              Cerrar
            </button>
          </div>

          <LoginForm next={next} onSuccess={onClose} />
        </div>
      </div>
    </Portal>
  );
}
