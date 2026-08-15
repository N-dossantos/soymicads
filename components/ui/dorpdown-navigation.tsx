"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

// Navegación con menús desplegables. Los tokens de shadcn del snippet original
// (bg-background, text-muted-foreground, …) están mapeados a la paleta
// cream/terracota del sitio, que vive en app/globals.css + tailwind.config.ts.

export type NavSubItem = {
  label: string;
  description?: string;
  href: string;
  icon: React.ElementType;
};

export type NavSubMenu = {
  title: string;
  items: NavSubItem[];
};

export type NavItem = {
  id: number;
  label: string;
  href?: string;
  subMenus?: NavSubMenu[];
};

type Props = {
  navItems: NavItem[];
  /** Hash de la sección visible (`#servicio`) para marcar el ítem activo. */
  activeHash?: string;
  /** Se dispara al hacer click en cualquier enlace del menú. */
  onNavigate?: (href: string) => void;
  className?: string;
};

const triggerClass =
  "relative isolate flex min-h-[40px] cursor-pointer items-center justify-center gap-1 rounded-full px-4 py-2 text-sm transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(196,132,106,0.6)]";

export function DropdownNavigation({
  navItems,
  activeHash,
  onNavigate,
  className = "",
}: Props) {
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const [isHover, setIsHover] = React.useState<number | null>(null);

  const isActive = (item: NavItem) =>
    Boolean(
      activeHash &&
        (item.href === activeHash ||
          item.subMenus?.some((sub) => sub.items.some((i) => i.href === activeHash)))
    );

  const closeMenu = () => {
    setOpenMenu(null);
    setIsHover(null);
  };

  const handleNavigate = (href: string) => {
    closeMenu();
    onNavigate?.(href);
  };

  return (
    <nav
      aria-label="Navegación principal"
      className={`relative ${className}`}
      onKeyDown={(e) => {
        if (e.key === "Escape") closeMenu();
      }}
    >
      <ul className="relative flex items-center gap-0.5 rounded-full border border-white/70 bg-white/58 px-1.5 py-1 shadow-sm backdrop-blur-xl">
        {navItems.map((navItem) => {
          const open = openMenu === navItem.label;
          const active = isActive(navItem);
          const highlighted = isHover === navItem.id || open;

          const pill = highlighted ? (
            <motion.span
              layoutId="nav-hover-bg"
              className="absolute inset-0 -z-10 bg-white shadow-sm"
              style={{ borderRadius: 99 }}
            />
          ) : active ? (
            <span className="absolute inset-0 -z-10 rounded-full bg-white/85 shadow-sm" />
          ) : null;

          const content = (
            <>
              <span>{navItem.label}</span>
              {navItem.subMenus ? (
                <ChevronDown
                  aria-hidden="true"
                  className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                />
              ) : null}
              {pill}
            </>
          );

          const tone = active || highlighted ? "text-[#2C2018]" : "text-[#4A3556]";

          return (
            <li
              key={navItem.id}
              className="relative"
              onMouseEnter={() => {
                setIsHover(navItem.id);
                if (navItem.subMenus) setOpenMenu(navItem.label);
              }}
              onMouseLeave={() => {
                setIsHover(null);
                setOpenMenu(null);
              }}
            >
              {navItem.subMenus ? (
                <button
                  type="button"
                  aria-expanded={open}
                  aria-haspopup="true"
                  onClick={() => setOpenMenu(open ? null : navItem.label)}
                  className={`${triggerClass} group ${tone}`}
                >
                  {content}
                </button>
              ) : (
                <a
                  href={navItem.href ?? "#"}
                  aria-current={active ? "true" : undefined}
                  onClick={() => handleNavigate(navItem.href ?? "#")}
                  onFocus={() => setIsHover(navItem.id)}
                  onBlur={() => setIsHover(null)}
                  className={`${triggerClass} ${tone}`}
                >
                  {content}
                </a>
              )}

              <AnimatePresence>
                {open && navItem.subMenus ? (
                  <div className="absolute left-1/2 top-full z-50 w-auto -translate-x-1/2 pt-3">
                    <motion.div
                      layoutId="nav-menu"
                      className="premium-shell !bg-white p-5 shadow-xl"
                      style={{ borderRadius: 28 }}
                    >
                      <div className="flex w-fit shrink-0 gap-7 overflow-hidden">
                        {navItem.subMenus.map((sub) => (
                          <motion.div layout key={sub.title} className="w-[240px]">
                            <h3 className="mb-3 text-[11px] uppercase tracking-[0.18em] text-[#8C6A56]">
                              {sub.title}
                            </h3>
                            <ul className="space-y-1.5">
                              {sub.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                  <li key={item.label}>
                                    <a
                                      href={item.href}
                                      onClick={() => handleNavigate(item.href)}
                                      aria-current={activeHash === item.href ? "true" : undefined}
                                      className="group flex items-start gap-3 rounded-2xl p-2 transition-colors duration-300 hover:bg-[#f8f8f8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(196,132,106,0.6)]"
                                    >
                                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[rgba(107,79,58,0.14)] bg-white text-[#7a5a72] transition-colors duration-300 group-hover:border-transparent group-hover:bg-[linear-gradient(135deg,#f29d8e,#f6bd8b,#fce594,#a1d2c5,#b3d5ee,#ceafd2)] group-hover:text-[#2C2018]">
                                        <Icon className="h-[18px] w-[18px] flex-none" />
                                      </span>
                                      <span className="leading-5">
                                        <span className="block text-sm font-medium text-[#2C2018]">
                                          {item.label}
                                        </span>
                                        {item.description ? (
                                          <span className="mt-0.5 block text-xs leading-relaxed text-[#7A6A5A] transition-colors duration-300 group-hover:text-[#4A3556]">
                                            {item.description}
                                          </span>
                                        ) : null}
                                      </span>
                                    </a>
                                  </li>
                                );
                              })}
                            </ul>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
