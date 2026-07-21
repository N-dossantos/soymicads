"use client";

import { useEffect, useState } from "react";
import CurrencyToggle from "@/components/ui/CurrencyToggle";

const NAV_LINKS = [
  { label: "Diseñar(me)", href: "#servicio" },
  { label: "Diseñar(nos)", href: "#servicioGrupos" },
  { label: "Encuentros", href: "#encuentro" },
  { label: "Charlitas", href: "#charlitas" },
  { label: "Preguntas frecuentes", href: "#preguntas" },
];


interface NavbarProps {
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
}

export default function Navbar({ menuOpen, onMenuOpenChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 h-1 rainbow-bar" />

      <nav
        className={`fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 transition-all duration-300 ${scrolled ? "" : ""}`}
      >
        <div className={`max-w-6xl mx-auto h-16 px-4 sm:px-5 rounded-full premium-shell ${scrolled ? "mt-2" : "mt-3"} flex items-center justify-between gap-2 min-[360px]:gap-4`}>
          <a href="/" className="group flex items-center gap-2 min-[360px]:gap-3">
            <img
              src="/images/logo.jpeg"
              alt="Mica Ds"
              className="inline-block h-12 w-12 rounded-full object-cover shadow-lg shadow-[rgba(196,132,106,0.22)]"
            />
            <span className="flex flex-col leading-none">
              <span className="rainbow-text font-serif text-[1.05rem] font-medium">Mica Ds</span>
              <span className="hidden min-[380px]:block text-[11px] uppercase tracking-[0.18em] text-[#8a6a84]">Diseño humano</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-2 rounded-full border border-white/70 bg-white/58 px-2 py-1 shadow-sm backdrop-blur-xl">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm text-[#4A3556] transition-all hover:bg-white hover:text-[#2C2018]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 min-[360px]:gap-3">
            <CurrencyToggle />
            <button
              className="md:hidden rounded-full border border-white/70 bg-white/60 p-2 text-[#4A3556] shadow-sm backdrop-blur-xl"
              onClick={() => onMenuOpenChange(!menuOpen)}
              aria-label="Menú"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                    <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
                    <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="absolute top-16 left-4 right-4 z-50 md:hidden mt-2">
            <div className="premium-shell rounded-3xl p-3 space-y-1 shadow-xl bg-white/95 backdrop-blur-xl">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block rounded-2xl px-4 py-3 text-sm text-[#6F5646] transition-colors hover:bg-white/80 hover:text-[#2C2018]"
                  onClick={() => onMenuOpenChange(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}