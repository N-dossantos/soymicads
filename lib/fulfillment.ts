// lib/fulfillment.ts
// ──────────────────────────────────────────────────────────────────
// Post-venta unificado: los webhooks de Mercado Pago y Stripe llaman a
// handleSuccessfulPurchase cuando un pago queda aprobado, y desde acá se
// avisa a Mica y se le confirma a quien compró.
//
// Los emails salen por la API de Resend. Variables de entorno:
//   RESEND_API_KEY — sin ella no se envía nada, solo se loguea la venta.
//   EMAIL_FROM     — remitente con dominio verificado en Resend, por
//                    ejemplo "Mica Ds <hola@soymicads.com>". Sin ella se usa
//                    onboarding@resend.dev, que solo puede escribirle al
//                    email dueño de la cuenta, así que la confirmación a la
//                    clienta se omite.
//   OWNER_EMAIL    — a dónde llegan los avisos de venta (default:
//                    CONTACT_EMAIL).
// ──────────────────────────────────────────────────────────────────

import { CONTACT_EMAIL, whatsappHref } from "@/lib/contact";
import { formatPrice, getProductById, type Currency } from "@/lib/products";
import { parseGiftCardDetails, type GiftCardDetails } from "@/lib/gift-card";

export interface Purchase {
  provider: "mercadopago" | "stripe";
  // Id del pago en el proveedor (payment.id en MP, session.id en Stripe).
  // Se usa como clave de idempotencia: los webhooks se reintentan y no
  // queremos mandar el mismo email dos veces.
  paymentId: string;
  productId?: string;
  amount?: number;
  currency?: string;
  customerEmail?: string;
  customerName?: string;
  // Metadata cruda del pago; si es una gift card trae los datos del regalo.
  metadata?: Record<string, unknown> | null;
}

const DEFAULT_FROM = "Mica Ds <onboarding@resend.dev>";

// Los datos del regalo viajan como metadata snake_case (ver /api/gift-card y
// /api/stripe/gift-card). Los pasamos por parseGiftCardDetails para volver a
// recortarlos: vienen de un formulario público.
export function giftFromMetadata(metadata: Record<string, unknown> | null | undefined): GiftCardDetails | null {
  if (metadata?.kind !== "gift_card") return null;
  return parseGiftCardDetails({
    productId: metadata.product_id,
    buyerName: metadata.buyer_name,
    buyerEmail: metadata.buyer_email,
    buyerPhone: metadata.buyer_phone,
    recipientName: metadata.recipient_name,
    deliveryMethod: metadata.delivery_method,
    recipientEmail: metadata.recipient_email,
    recipientPhone: metadata.recipient_phone,
    deliveryDate: metadata.delivery_date,
    message: metadata.gift_message,
  });
}

export async function handleSuccessfulPurchase(purchase: Purchase): Promise<void> {
  const product = purchase.productId ? getProductById(purchase.productId) : undefined;
  const gift = giftFromMetadata(purchase.metadata);
  const customerEmail = gift?.buyerEmail || purchase.customerEmail;
  const title = product?.title ?? purchase.productId ?? "Producto desconocido";

  const currency = purchase.currency?.toUpperCase();
  const priceLabel =
    purchase.amount !== undefined && (currency === "ARS" || currency === "EUR")
      ? formatPrice(purchase.amount, currency as Currency)
      : purchase.amount !== undefined
        ? `${purchase.amount} ${currency ?? ""}`.trim()
        : "—";

  console.log("[fulfillment] compra aprobada", {
    provider: purchase.provider,
    paymentId: purchase.paymentId,
    productId: purchase.productId,
    gift: Boolean(gift),
  });

  const keyBase = `${purchase.provider}-${purchase.paymentId}`;
  const ownerEmail = process.env.OWNER_EMAIL?.trim() || CONTACT_EMAIL;

  await sendEmail({
    to: ownerEmail,
    subject: `${gift ? "🎁 Nueva gift card" : "Nueva venta"}: ${title} (${priceLabel})`,
    html: ownerEmailHtml({ purchase, title, priceLabel, customerEmail, gift }),
    idempotencyKey: `${keyBase}-owner`,
  });

  // Sin dominio propio verificado, Resend no deja escribirle a terceros.
  if (!customerEmail || !process.env.EMAIL_FROM?.trim()) return;

  await sendEmail({
    to: customerEmail,
    subject: gift ? "¡Gracias por tu regalo!" : `¡Gracias! Recibimos tu pago de ${title}`,
    html: gift
      ? giftCustomerEmailHtml({ gift, title })
      : customerEmailHtml({
          name: purchase.customerName,
          title,
          calendlyLink: product?.calendlyLink,
        }),
    replyTo: ownerEmail,
    idempotencyKey: `${keyBase}-customer`,
  });
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  idempotencyKey: string;
  replyTo?: string;
}

async function sendEmail({ to, subject, html, idempotencyKey, replyTo }: EmailOptions): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.log("[fulfillment] RESEND_API_KEY no configurado, email omitido:", subject);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // Resend descarta los envíos repetidos con la misma clave durante 24 h,
      // que cubre de sobra la ventana de reintentos de ambos webhooks.
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM?.trim() || DEFAULT_FROM,
      to: [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend respondió ${response.status}: ${await response.text()}`);
  }
}

// ── Plantillas ───────────────────────────────────────────────────

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function layout(body: string): string {
  return `<div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#2C2018;max-width:520px;margin:0 auto;padding:24px">${body}<p style="margin-top:32px;color:#8C6A56;font-size:13px">Mica Ds · Diseño Humano</p></div>`;
}

function rows(entries: Array<[string, string | undefined]>): string {
  return entries
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#8C6A56;vertical-align:top">${escapeHtml(label)}</td><td style="padding:4px 0">${escapeHtml(value!)}</td></tr>`
    )
    .join("");
}

function ownerEmailHtml({
  purchase,
  title,
  priceLabel,
  customerEmail,
  gift,
}: {
  purchase: Purchase;
  title: string;
  priceLabel: string;
  customerEmail?: string;
  gift: GiftCardDetails | null;
}): string {
  const paymentRows = rows([
    ["Propuesta", title],
    ["Monto", priceLabel],
    ["Medio", purchase.provider === "mercadopago" ? "Mercado Pago" : "Stripe (tarjeta)"],
    ["Id del pago", purchase.paymentId],
    ["Nombre", gift?.buyerName || purchase.customerName],
    ["Email", customerEmail],
    ["WhatsApp", gift?.buyerPhone],
  ]);

  const giftRows = gift
    ? rows([
        ["Para", gift.recipientName],
        [
          "Entrega",
          gift.deliveryMethod === "gift"
            ? "Quiere que se lo enviemos nosotros"
            : "La coordina quien compró",
        ],
        ["Email de quien recibe", gift.recipientEmail],
        ["WhatsApp de quien recibe", gift.recipientPhone],
        ["Fecha de entrega", gift.deliveryDate],
        ["Dedicatoria", gift.message],
      ])
    : "";

  return layout(
    `<h2 style="font-weight:600;margin:0 0 16px">${gift ? "Se vendió una gift card" : "Entró un pago"}</h2>` +
      `<table style="border-collapse:collapse">${paymentRows}</table>` +
      (gift ? `<h3 style="font-weight:600;margin:24px 0 8px">Datos del regalo</h3><table style="border-collapse:collapse">${giftRows}</table>` : "")
  );
}

function customerEmailHtml({
  name,
  title,
  calendlyLink,
}: {
  name?: string;
  title: string;
  calendlyLink?: string;
}): string {
  const greeting = name ? `¡Hola ${escapeHtml(name.split(" ")[0])}!` : "¡Hola!";
  const cta = calendlyLink
    ? `<p>El próximo paso es elegir día y horario para tu sesión:</p><p><a href="${escapeHtml(calendlyLink)}" style="display:inline-block;background:#E8776A;color:#fff;text-decoration:none;padding:12px 24px;border-radius:999px">Agendar mi sesión</a></p>`
    : `<p>En breve nos ponemos en contacto para coordinar los próximos pasos.</p>`;

  return layout(
    `<p>${greeting}</p>` +
      `<p>Recibimos tu pago de <strong>${escapeHtml(title)}</strong>. Gracias por la confianza.</p>` +
      cta +
      `<p>Si tenés alguna duda, respondé este email o <a href="${escapeHtml(whatsappHref("Hola Mica! Tengo una consulta sobre mi compra."))}" style="color:#8C6A56">escribinos por WhatsApp</a>.</p>`
  );
}

function giftCustomerEmailHtml({ gift, title }: { gift: GiftCardDetails; title: string }): string {
  return layout(
    `<p>¡Hola ${escapeHtml(gift.buyerName.split(" ")[0])}!</p>` +
      `<p>Recibimos el pago de tu regalo de <strong>${escapeHtml(title)}</strong> para ${escapeHtml(gift.recipientName)}. Gracias por elegir regalar este espacio.</p>` +
      `<p>Nos vamos a poner en contacto por WhatsApp para coordinar la entrega según lo que elegiste.</p>` +
      `<p>Si tenés alguna duda, respondé este email o <a href="${escapeHtml(whatsappHref("Hola Mica! Tengo una consulta sobre el regalo que acabo de comprar."))}" style="color:#8C6A56">escribinos por WhatsApp</a>.</p>`
  );
}
