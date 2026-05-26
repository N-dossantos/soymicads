// lib/products.ts
// ──────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH para todos los servicios y precios.
// Para agregar un nuevo servicio, solo añadí un objeto a este array.
// ──────────────────────────────────────────────────────────────────

export type Currency = "ARS" | "EUR";
export type PaymentMethod = "mercadopago" | "stripe" | "paypal";

export interface Product {
  id: string;
  title: string;
  description: string;
  priceARS: number;
  priceEUR: number;
  paymentMethod: PaymentMethod;
  category: "diseniarme" | "membresia";
}

export const PRODUCTS: Product[] = [
  // DISEÑAR(ME)
  {
    id: "designme_single",
    title: "Sesión suelta — Diseñar(me)",
    description: "Sesión única para explorar y despejar dudas.",
    priceARS: 40_000,
    priceEUR: 25,
    paymentMethod: "mercadopago",
    category: "diseniarme",
  },
  {
    id: "designme_full",
    title: "Proceso completo — Diseñar(me)",
    description: "6 sesiones + reporte personalizado.",
    priceARS: 210_000,
    priceEUR: 125,
    paymentMethod: "mercadopago",
    category: "diseniarme",
  },

  // DISEÑAR(NOS) — PAREJA
  {
    id: "disenarnos_pareja_single",
    title: "Sesión suelta — Diseñar(nos) Pareja",
    description: "Sesión para parejas: explorar dinámica entre dos diseños.",
    priceARS: 70_000,
    priceEUR: 40,
    paymentMethod: "mercadopago",
    category: "diseniarme",
  },
  {
    id: "disenarnos_pareja_full",
    title: "Proceso completo — Diseñar(nos) Pareja",
    description: "4 sesiones en pareja + 2 individuales + pdf personalizado.",
    priceARS: 360_000,
    priceEUR: 210,
    paymentMethod: "mercadopago",
    category: "diseniarme",
  },

  // DISEÑAR(NOS) — GRUPO (por persona)
  {
    id: "disenarnos_group_single",
    title: "Sesión suelta — Grupo (por persona)",
    description: "Sesión para grupos (por persona).",
    priceARS: 25_000,
    priceEUR: 15,
    paymentMethod: "mercadopago",
    category: "diseniarme",
  },
  {
    id: "disenarnos_group_full",
    title: "Proceso completo — Grupo (por persona)",
    description: "Proceso completo por persona en equipo.",
    priceARS: 80_000,
    priceEUR: 50,
    paymentMethod: "mercadopago",
    category: "diseniarme",
  },

  // CHARLITAS
  {
    id: "charlitas_intro",
    title: "Charlita — Para conocernos",
    description: "Encuentro introductorio de 30 min.",
    priceARS: 10_000,
    priceEUR: 5,
    paymentMethod: "mercadopago",
    category: "diseniarme",
  },
  {
    id: "charlitas_acompan",
    title: "Charlita — Acompañamiento desde mi mirada",
    description: "Sesión de 1 hora enfocada en presencia y lectura.",
    priceARS: 40_000,
    priceEUR: 25,
    paymentMethod: "mercadopago",
    category: "diseniarme",
  },
];

export function formatPrice(amount: number, currency: Currency): string {
  if (currency === "ARS") {
    return `$${amount.toLocaleString("es-AR")}`;
  }
  return `€${amount}`;
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
