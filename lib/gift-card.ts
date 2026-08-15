// lib/gift-card.ts
// ──────────────────────────────────────────────────────────────────
// Reglas compartidas (cliente + servidor) de la Tarjeta de Regalo.
// Los precios y títulos SIEMPRE salen de lib/products.ts — acá solo
// definimos qué propuestas se pueden regalar y cómo se arma el aviso.
// ──────────────────────────────────────────────────────────────────

import { PRODUCTS, formatPrice, type Currency, type Product } from "@/lib/products";

// Qué propuestas se ofrecen como regalo. La charlita introductoria queda
// afuera a propósito porque es gratuita, y el proceso grupal porque se cobra
// por persona dentro de un equipo.
export const GIFT_CARD_PRODUCT_IDS = [
  "designme_single",
  "designme_full",
  "disenarnos_pareja_full",
  "charlitas_acompan",
] as const;

export type GiftCardProductId = (typeof GIFT_CARD_PRODUCT_IDS)[number];

export function isGiftableProductId(id: string): id is GiftCardProductId {
  return (GIFT_CARD_PRODUCT_IDS as readonly string[]).includes(id);
}

export function getGiftableProducts(): Product[] {
  return GIFT_CARD_PRODUCT_IDS.map((id) => PRODUCTS.find((p) => p.id === id)).filter(
    (p): p is Product => p !== undefined
  );
}

// Línea "VALE POR …" que va impresa en la tarjeta. No se deriva de
// products.ts porque ahí las descripciones son comerciales y acá necesitamos
// una frase corta que entre en una sola línea en mayúsculas.
const GIFT_REDEEM_LABELS: Record<GiftCardProductId, string> = {
  designme_single: "1 sesión de Diseño Humano",
  designme_full: "6 sesiones de Diseño Humano",
  disenarnos_pareja_full: "4 sesiones en pareja + 2 individuales",
  charlitas_acompan: "1 charlita de acompañamiento",
};

export function getGiftRedeemLabel(productId: string): string | null {
  return isGiftableProductId(productId) ? GIFT_REDEEM_LABELS[productId] : null;
}

// Precio del regalo según la moneda activa, respetando los precios por método
// de pago (Mercado Pago en ARS, Bizum en EUR).
export function getGiftPrice(product: Product, currency: Currency): number {
  return currency === "ARS"
    ? (product.priceMercadoARS ?? product.priceARS)
    : (product.priceBizumEUR ?? product.priceEUR);
}

export function formatGiftPrice(product: Product, currency: Currency): string {
  return formatPrice(getGiftPrice(product, currency), currency);
}

// Límites de los campos del formulario. Se aplican en el cliente (maxLength)
// y de nuevo en el servidor, que nunca confía en lo que llega.
export const GIFT_FIELD_LIMITS = {
  buyerName: 80,
  buyerEmail: 120,
  buyerPhone: 32,
  recipientName: 80,
  recipientEmail: 120,
  recipientPhone: 32,
  deliveryDate: 10,
  message: 280,
} as const;

// Cómo le llega el regalo a quien lo recibe: "self" = el comprador coordina
// la entrega por su cuenta, "gift" = nosotros se lo enviamos directamente.
export type GiftDeliveryMethod = "self" | "gift" | "";

export interface GiftCardDetails {
  productId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  recipientName: string;
  deliveryMethod: GiftDeliveryMethod;
  recipientEmail: string;
  recipientPhone: string;
  deliveryDate: string;
  message: string;
}

export const EMPTY_GIFT_CARD_DETAILS: GiftCardDetails = {
  productId: "",
  buyerName: "",
  buyerEmail: "",
  buyerPhone: "",
  recipientName: "",
  deliveryMethod: "",
  recipientEmail: "",
  recipientPhone: "",
  deliveryDate: "",
  message: "",
};

// Validación mínima y deliberadamente permisiva: alcanza para evitar errores de
// tipeo sin rechazar formatos internacionales de teléfono o nombres con acentos.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type GiftCardErrors = Partial<Record<keyof GiftCardDetails, string>>;

export function validateGiftCardDetails(details: GiftCardDetails): GiftCardErrors {
  const errors: GiftCardErrors = {};

  if (!isGiftableProductId(details.productId)) {
    errors.productId = "Elegí la propuesta que querés regalar.";
  }
  if (details.buyerName.trim().length < 2) {
    errors.buyerName = "Contanos tu nombre.";
  }
  if (!EMAIL_RE.test(details.buyerEmail.trim())) {
    errors.buyerEmail = "Revisá tu email, parece incompleto.";
  }
  if (details.buyerPhone.trim().length < 6) {
    errors.buyerPhone = "Dejanos un WhatsApp para coordinar.";
  }
  if (details.recipientName.trim().length < 2) {
    errors.recipientName = "¿Cómo se llama la persona que recibe el regalo?";
  }
  if (details.deliveryMethod !== "self" && details.deliveryMethod !== "gift") {
    errors.deliveryMethod = "Elegí cómo te gustaría hacer la entrega.";
  }
  if (details.deliveryMethod === "gift") {
    if (!EMAIL_RE.test(details.recipientEmail.trim())) {
      errors.recipientEmail = "Revisá el email de quien recibe, parece incompleto.";
    }
    if (details.recipientPhone.trim().length < 6) {
      errors.recipientPhone = "Dejanos un WhatsApp de quien recibe para coordinar la entrega.";
    }
    if (!details.deliveryDate.trim()) {
      errors.deliveryDate = "Elegí la fecha en la que te gustaría que le llegue.";
    }
  }
  if (details.message.length > GIFT_FIELD_LIMITS.message) {
    errors.message = `La dedicatoria no puede superar los ${GIFT_FIELD_LIMITS.message} caracteres.`;
  }

  return errors;
}

// Mensaje que se abre en WhatsApp para que a Mica le lleguen los datos del
// regalo aunque el pago todavía no se haya acreditado.
export function buildGiftWhatsAppMessage(
  details: GiftCardDetails,
  product: Product,
  priceLabel: string
): string {
  const lines = [
    `Hola Mica! Acabo de regalar la Gift Card de "${product.title}" para ${details.recipientName.trim()}.`,
    "",
    `De parte de: ${details.buyerName.trim()}`,
    `Email: ${details.buyerEmail.trim()}`,
    `WhatsApp: ${details.buyerPhone.trim()}`,
    `Propuesta: ${product.title} (${priceLabel})`,
    "",
    `Datos de quien recibe:`,
    `Nombre: ${details.recipientName.trim()}`,
    details.deliveryMethod === "gift"
      ? "Entrega: quiere que se lo enviemos nosotros de regalo."
      : "Entrega: la coordina ella/él directamente.",
  ];

  if (details.deliveryMethod === "gift") {
    lines.push(`Email: ${details.recipientEmail.trim()}`);

    const recipientPhone = details.recipientPhone.trim();
    if (recipientPhone) {
      lines.push(`WhatsApp: ${recipientPhone}`);
    }

    const deliveryDate = details.deliveryDate.trim();
    if (deliveryDate) {
      lines.push(`Fecha en la que le gustaría que le llegue: ${deliveryDate}`);
    }
  }

  const message = details.message.trim();
  if (message) {
    lines.push(`Dedicatoria: "${message}"`);
  }

  return lines.join("\n");
}
