import type { Metadata } from "next";
import Link from "next/link";
import AccountNav from "@/components/account/AccountNav";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "Mi cuenta — Mica Ds",
  robots: { index: false },
};

// Sin chequeo de sesión acá: el layout no se vuelve a renderizar al navegar
// entre páginas hermanas, así que cada página llama a requireUser().
export default function CuentaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate min-h-screen overflow-x-hidden">
      <div className="fixed top-0 left-0 right-0 z-50 h-1 rainbow-bar" />

      <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-[600px] max-w-3xl">
        <div className="absolute left-8 top-16 h-48 w-48 rounded-full bg-[rgba(242,157,142,0.16)] blur-3xl" />
        <div className="absolute right-10 top-28 h-56 w-56 rounded-full bg-[rgba(179,213,238,0.16)] blur-3xl" />
      </div>

      <header className="px-4 sm:px-6 pt-4">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-2 rounded-full px-3 sm:px-5 premium-shell">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <img src="/images/logo.jpeg" alt="Mica Ds" className="h-10 w-10 rounded-full object-cover" />
            <span className="hidden min-[400px]:inline rainbow-text font-serif text-[1.05rem] font-medium">Mica Ds</span>
          </Link>

          <div className="flex items-center gap-1">
            <AccountNav />
            <form action={signOut}>
              <button
                type="submit"
                className="min-h-[40px] rounded-full px-3 sm:px-4 text-sm text-[#6F5646] transition-colors hover:text-[#2C2018]"
              >
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
        {children}
      </main>
    </div>
  );
}
