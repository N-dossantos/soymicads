import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/lib/currency-context";

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

export const metadata: Metadata = {
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
        <CurrencyProvider>{children}</CurrencyProvider>
      </body>
    </html>
  );
}
