"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  ChevronDown,
  Compass,
  Handshake,
  Layers,
  Sparkles,
  UsersRound,
} from "lucide-react";
import CurrencyToggle from "@/components/ui/CurrencyToggle";
import { DropdownNavigation, type NavItem } from "@/components/ui/dorpdown-navigation";

const NAV_ITEMS: NavItem[] = [
  { id: 1, label: "Encuentros gratuitos", href: "#encuentro" },
  {
    id: 2,
    label: "Servicios",
    subMenus: [
      {
        title: "Charlitas",
        items: [
          {
            label: "Exploración",
            description: "Encuentro breve para charlar y decidir si iniciar un proceso",
            href: "#charlitas_intro",
            icon: Sparkles,
          },
          {
            label: "Acompañamiento desde mi mirada",
            description: "Una sesión centrada en la escucha y la presencia",
            href: "#charlitas_acompan",
            icon: Handshake,
          },
        ],
      },
      {
        title: "Diseñar(me)",
        items: [
          {
            label: "Sesión suelta",
            description: "Un encuentro puntual de diseño humano",
            href: "#designme_single",
            icon: Compass,
          },
          {
            label: "Proceso completo",
            description: "Un programa estructurado de 6 sesiones",
            href: "#designme_full",
            icon: Layers,
          },
        ],
      },
      {
        title: "Diseñar(nos)",
        items: [
          {
            label: "Proceso para pareja",
            description: "Para explorar la dinámica compartida",
            href: "#disenarnos_pareja_full",
            icon: UsersRound,
          },
          {
            label: "Proceso para grupos",
            description: "Para equipos de trabajo o grupos de amigos",
            href: "#disenarnos_group_full",
            icon: Briefcase,
          },
        ],
      },
    ],
  },
  { id: 3, label: "Gift Card", href: "#regalar" },
  { id: 4, label: "Podcast", href: "#podcast" },
  { id: 5, label: "Preguntas frecuentes", href: "#preguntas" },
];

// Todos los anchors del menú (nivel 1 + submenús) para el observer del scroll.
const NAV_HASHES = NAV_ITEMS.flatMap((item) => [
  ...(item.href ? [item.href] : []),
  ...(item.subMenus?.flatMap((sub) => sub.items.map((i) => i.href)) ?? []),
]);

interface NavbarProps {
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
}

export default function Navbar({ menuOpen, onMenuOpenChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_HASHES.map((hash) => document.getElementById(hash.slice(1))).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveHash(`#${visible[0].target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const closeMobileMenu = () => {
    onMenuOpenChange(false);
    setOpenSection(null);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 transition-all duration-300">
      <div
        className={`max-w-6xl mx-auto h-16 px-4 sm:px-5 rounded-full premium-shell ${
          scrolled ? "mt-2" : "mt-3"
        } flex items-center justify-between gap-2 min-[360px]:gap-4`}
      >
        <a href="/" className="group flex items-center gap-2 min-[360px]:gap-3">
          <img
            src="/images/logo.jpeg"
            alt="Mica Ds"
            className="inline-block h-12 w-12 rounded-full object-cover shadow-lg shadow-[rgba(196,132,106,0.22)]"
          />
          <span className="flex flex-col leading-none">
            <span className="rainbow-text font-serif text-[1.05rem] font-medium">Mica Ds</span>
            <span className="hidden min-[380px]:block text-xs uppercase tracking-[0.18em] text-[#7a5a72]">
              Diseño humano
            </span>
          </span>
        </a>

        <DropdownNavigation
          navItems={NAV_ITEMS}
          activeHash={activeHash}
          className="hidden lg:block"
        />

        <div className="flex items-center gap-2 min-[360px]:gap-3">
          <CurrencyToggle />
          <button
            className="lg:hidden flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/60 text-[#4A3556] shadow-sm backdrop-blur-xl"
            onClick={() => onMenuOpenChange(!menuOpen)}
            aria-label="Menú"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
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

      {/* Mobile menu — mismo árbol de NAV_ITEMS, en acordeón */}
      {menuOpen && (
        <div id="mobile-menu" className="absolute top-16 left-4 right-4 z-50 lg:hidden mt-2">
          <div className="premium-shell max-h-[calc(100dvh-6.5rem)] space-y-1 overflow-y-auto rounded-3xl bg-white/95 p-3 shadow-xl backdrop-blur-xl">
            {NAV_ITEMS.map((item) => {
              if (!item.subMenus) {
                const active = activeHash === item.href;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    aria-current={active ? "true" : undefined}
                    className={`block rounded-2xl px-4 py-3 text-sm transition-colors hover:bg-white/80 hover:text-[#2C2018] ${
                      active ? "bg-white/80 text-[#2C2018]" : "text-[#6F5646]"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </a>
                );
              }

              const expanded = openSection === item.label;
              const active = item.subMenus.some((sub) =>
                sub.items.some((i) => i.href === activeHash)
              );

              return (
                <div key={item.id}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setOpenSection(expanded ? null : item.label)}
                    className={`flex min-h-[44px] w-full items-center justify-between rounded-2xl px-4 py-3 text-sm transition-colors hover:bg-white/80 hover:text-[#2C2018] ${
                      active || expanded ? "bg-white/80 text-[#2C2018]" : "text-[#6F5646]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 transition-transform duration-300 ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expanded && (
                    <div className="space-y-3 px-1 pb-2 pt-2">
                      {item.subMenus.map((sub) => (
                        <div key={sub.title}>
                          <p className="px-3 pb-1 text-[11px] uppercase tracking-[0.18em] text-[#8C6A56]">
                            {sub.title}
                          </p>
                          <ul className="space-y-1">
                            {sub.items.map((subItem) => (
                              <li key={subItem.label}>
                                <a
                                  href={subItem.href}
                                  aria-current={activeHash === subItem.href ? "true" : undefined}
                                  onClick={closeMobileMenu}
                                  className="block rounded-2xl px-3 py-2.5 text-sm font-medium text-[#2C2018] transition-colors hover:bg-[#F5EEE9]"
                                >
                                  {subItem.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
