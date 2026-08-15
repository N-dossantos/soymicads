import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/lib/currency-context";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
});

// Mismo origen que usa lib/mercadopago.ts's getSiteOrigin: preferimos SITE_URL
// (fijo, configurado a mano) y caemos al dominio de Vercel por defecto.
const siteUrl = process.env.SITE_URL?.trim().replace(/\/+$/, "") || "https://soymicads.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Mica Ds — Diseño Humano ✨",
  description:
    "Acá no venís a sanar. Venís a vivir. Un espacio de acompañamiento basado en Diseño Humano y coaching vivencial para tomar decisiones que tengan sentido para vos.",
  keywords: ["diseño humano", "coaching", "autoconocimiento", "Argentina"],
  icons: {
    icon: "/images/logo.jpeg",
    shortcut: "/images/logo.jpeg",
    apple: "/images/logo.jpeg",
  },
  openGraph: {
    title: "Soymicads",
    description: "Acá no venís a sanar. Venís a vivir.",
    type: "website",
    locale: "es_AR",
    images: [{ url: "/images/logo.jpeg", width: 800, height: 800, alt: "Mica Ds — Diseño Humano" }],
  },
  twitter: {
    card: "summary",
    title: "Mica Ds — Diseño Humano",
    description: "Acá no venís a sanar. Venís a vivir.",
    images: ["/images/logo.jpeg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-[#2C2018] focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
        >
          Saltar al contenido principal
        </a>
        <CurrencyProvider>{children}</CurrencyProvider>
        <WhatsAppButton />
      </body>
    </html>
  );
}
