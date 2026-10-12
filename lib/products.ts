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
  priceEUR: number; // Precio de lista en EUR — es lo que se cobra con tarjeta (Stripe)
  // Precios específicos por método para poder ingresarlos manualmente
  priceMercadoARS?: number; // Mercado Pago (ARS)
  priceTransferARS?: number; // Transferencia bancaria (ARS)
  priceBizumEUR?: number; // Bizum (EUR) — precio con descuento sobre priceEUR
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
    priceARS: 37_000,
    priceEUR: 25.5,
    priceMercadoARS: 41_000,
    priceTransferARS: 37_000,
    priceBizumEUR: 25,
    mercadoLink: "https://mpago.la/2xZRfT4",
    calendlyLink: "https://cal.com/soymicads/disenar-me",
    paymentMethod: "mercadopago",
    category: "diseniarme",
  },
  {
    id: "designme_full",
    title: "Proceso completo — Diseñar(me)",
    description: "6 sesiones + reporte personalizado.",
    priceARS: 210_000,
    priceEUR: 127.5,
    priceMercadoARS: 230_000,
    priceTransferARS: 210_000,
    priceBizumEUR: 125,
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
    priceARS: 360_000,
    priceEUR: 214.2,
    priceMercadoARS: 390_000,
    priceTransferARS: 360_000,
    priceBizumEUR: 210,
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
    priceEUR: 51,
    priceMercadoARS: 80_000,
    priceTransferARS: 80_000,
    priceBizumEUR: 50,
    calendlyLink: "https://cal.com/soymicads/disenar-nos",
    paymentMethod: "mercadopago",
    category: "diseniarme",
  },

  // CHARLITAS
  {
    id: "charlitas_intro",
    title: "Charlita — Para conocernos",
    description: "Encuentro introductorio de 15 min.",
    priceARS: 0,
    priceEUR: 0,
    priceMercadoARS: 0,
    priceTransferARS: 0,
    priceBizumEUR: 0,
    calendlyLink: "https://cal.com/soymicads/encuentro-para-conocernos",
    paymentMethod: "mercadopago",
    category: "diseniarme",
  },
  {
    id: "charlitas_acompan",
    title: "Charlita — Acompañamiento desde mi mirada",
    description: "Sesión de 1 hora enfocada en presencia y lectura.",
    priceARS: 40_000,
    priceEUR: 25.5,
    priceMercadoARS: 44_000,
    priceTransferARS: 40_000,
    priceBizumEUR: 25,
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
  // Los precios con tarjeta llevan recargo y pueden tener céntimos (€25,50).
  if (Number.isInteger(amount)) return `€${amount}`;
  return `€${amount.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Descuento de Bizum sobre el precio de lista, redondeado (p. ej. 2 para
// €125 vs €127,50). Se deriva de los precios para que el texto nunca quede
// desfasado si cambian.
export function getBizumDiscountPercent(product: Product): number {
  if (!product.priceBizumEUR || !product.priceEUR) return 0;
  return Math.max(0, Math.round((1 - product.priceBizumEUR / product.priceEUR) * 100));
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
