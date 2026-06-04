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
  // Precios específicos por método para poder ingresarlos manualmente
  priceMercadoARS?: number; // Mercado Pago (ARS)
  priceTransferARS?: number; // Transferencia bancaria (ARS)
  priceBizumEUR?: number; // Bizum / pago en EUR
  priceTransferEUR?: number; // Transferencia en EUR
  mercadoLink?: string; // Link de pago de Mercado Pago proporcionado manualmente
  calendlyLink?: string; // Link de agenda para esta sesión
  paymentMethod: PaymentMethod;
  category: "diseniarme" | "membresia";
}

export const PRODUCTS: Product[] = [
  // DISEÑAR(ME)
  {
    id: "designme_single",
    title: "Sesión suelta — Diseñar(me)",
    description: "Sesión única para explorar y despejar dudas.",
    priceARS: 41_000,
    priceEUR: 25,
    priceMercadoARS: 41_000,
    priceTransferARS: 37_000,
    priceBizumEUR: 25,
    priceTransferEUR: 25,
    mercadoLink: "https://mpago.la/2xZRfT4",
    calendlyLink: "https://cal.com/soymicads/disenar-me",
    paymentMethod: "mercadopago",
    category: "diseniarme",
  },
  {
    id: "designme_full",
    title: "Proceso completo — Diseñar(me)",
    description: "6 sesiones + reporte personalizado.",
    priceARS: 230_000,
    priceEUR: 125,
    priceMercadoARS: 230_000,
    priceTransferARS: 210_000,
    priceBizumEUR: 125,
    priceTransferEUR: 125,
    mercadoLink: "https://mpago.la/1QHUbwd",
    calendlyLink: "https://cal.com/soymicads/disenar-me",
    paymentMethod: "mercadopago",
    category: "diseniarme",
  },

  // DISEÑAR(NOS) — PAREJA
  {
    id: "disenarnos_pareja_full",
    title: "Proceso completo — Diseñar(nos) Pareja",
    description: "4 sesiones en pareja + 2 individuales + pdf personalizado.",
    priceARS: 390_000,
    priceEUR: 210,
    priceMercadoARS: 390_000,
    priceTransferARS: 360_000,
    priceBizumEUR: 210,
    priceTransferEUR: 210,
    mercadoLink: "https://mpago.la/1a9RMSA",
    calendlyLink: "https://cal.com/soymicads/disenar-nos",
    paymentMethod: "mercadopago",
    category: "diseniarme",
  },

  // DISEÑAR(NOS) — GRUPO (por persona)
  {
    id: "disenarnos_group_full",
    title: "Proceso completo — Grupo (por persona)",
    description: "Proceso completo por persona en equipo.",
    priceARS: 80_000,
    priceEUR: 50,
    priceMercadoARS: 80_000,
    priceTransferARS: 80_000,
    priceBizumEUR: 50,
    priceTransferEUR: 50,
    calendlyLink: "https://cal.com/soymicads/disenar-nos",
    paymentMethod: "mercadopago",
    category: "diseniarme",
  },

  // CHARLITAS
  {
    id: "charlitas_intro",
    title: "Charlita — Para conocernos",
    description: "Encuentro introductorio de 30 min.",
    priceARS: 0,
    priceEUR: 0,
    priceMercadoARS: 0,
    priceTransferARS: 0,
    priceBizumEUR: 0,
    priceTransferEUR: 0,
    calendlyLink: "https://cal.com/soymicads/encuentro-para-conocernos",
    paymentMethod: "mercadopago",
    category: "diseniarme",
  },
  {
    id: "charlitas_acompan",
    title: "Charlita — Acompañamiento desde mi mirada",
    description: "Sesión de 1 hora enfocada en presencia y lectura.",
    priceARS: 44_000,
    priceEUR: 25,
    priceMercadoARS: 44_000,
    priceTransferARS: 40_000,
    priceBizumEUR: 25,
    priceTransferEUR: 25,
    mercadoLink: "https://mpago.la/25j453h",
    calendlyLink: "https://cal.com/soymicads/charlita",
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
