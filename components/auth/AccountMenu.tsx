"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { userInitial } from "@/components/auth/useSessionUser";

interface AccountMenuProps {
  user: User | null | undefined;
  onLogin: () => void;
}

const itemClass =
  "block w-full rounded-2xl px-4 py-2.5 text-left text-sm text-[#53392B] transition-colors hover:bg-[#F5EEE9] hover:text-[#2C2018]";

// Botón de cuenta del Navbar (escritorio): "Ingresar" o el avatar con menú.
export default function AccountMenu({ user, onLogin }: AccountMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function signOut() {
    setOpen(false);
    await createClient().auth.signOut();
    router.refresh();
  }

  if (user === undefined) {
    return <span aria-hidden="true" className="block h-11 w-11 animate-pulse rounded-full bg-white/60" />;
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={onLogin}
        className="min-h-[44px] inline-flex items-center rounded-full border border-white/70 bg-white/65 px-4 text-sm font-medium text-[#4A3556] shadow-sm backdrop-blur-xl transition hover:text-[#2C2018]"
      >
        Ingresar
      </button>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Mi cuenta"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2C2018] font-serif text-lg text-white shadow-[0_10px_30px_rgba(44,32,24,0.16)] transition hover:bg-[#3B2A20]"
      >
        {userInitial(user)}
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="premium-shell absolute right-0 top-full mt-2 w-56 rounded-3xl bg-white/95 p-2 shadow-xl"
        >
          <p className="truncate px-4 pb-2 pt-1 text-xs text-[#8C6A56]">{user.email}</p>
          <Link role="menuitem" href="/cuenta" onClick={() => setOpen(false)} className={itemClass}>
            Mi cuenta
          </Link>
          <Link role="menuitem" href="/cuenta/perfil" onClick={() => setOpen(false)} className={itemClass}>
            Mi perfil
          </Link>
          <button role="menuitem" type="button" onClick={signOut} className={itemClass}>
            Salir
          </button>
        </div>
      ) : null}
    </div>
  );
}
