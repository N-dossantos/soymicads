import type { Metadata } from "next";
import "./globals.css";
import { CurrencyProvider } from "@/lib/currency-context";

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
    <html lang="es" suppressHydrationWarning>
      <body>
        <CurrencyProvider>{children}</CurrencyProvider>
      </body>
    </html>
  );
}
