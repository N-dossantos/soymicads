"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/cuenta", label: "Inicio" },
  { href: "/cuenta/perfil", label: "Perfil" },
];

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Mi cuenta" className="flex items-center gap-1">
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`min-h-[40px] inline-flex items-center rounded-full px-3 sm:px-4 text-sm transition-colors ${
              active ? "bg-white/90 text-[#2C2018] shadow-sm" : "text-[#6F5646] hover:text-[#2C2018]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
