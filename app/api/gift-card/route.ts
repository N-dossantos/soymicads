import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { Preference } from "mercadopago";
import { getProductById } from "@/lib/products";
import { getMercadoPagoClient, getSiteOrigin, supportsAutoReturn } from "@/lib/mercadopago";
import {
  EMPTY_GIFT_CARD_DETAILS,
  GIFT_FIELD_LIMITS,
  getGiftPrice,
  isGiftableProductId,
  validateGiftCardDetails,
  type GiftCardDetails,
} from "@/lib/gift-card";

function sanitize(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const details: GiftCardDetails = {
    ...EMPTY_GIFT_CARD_DETAILS,
    productId: sanitize(body?.productId, 64),
    buyerName: sanitize(body?.buyerName, GIFT_FIELD_LIMITS.buyerName),
    buyerEmail: sanitize(body?.buyerEmail, GIFT_FIELD_LIMITS.buyerEmail),
    buyerPhone: sanitize(body?.buyerPhone, GIFT_FIELD_LIMITS.buyerPhone),
    recipientName: sanitize(body?.recipientName, GIFT_FIELD_LIMITS.recipientName),
    deliveryMethod:
      body?.deliveryMethod === "self" || body?.deliveryMethod === "gift" ? body.deliveryMethod : "",
    recipientEmail: sanitize(body?.recipientEmail, GIFT_FIELD_LIMITS.recipientEmail),
    recipientPhone: sanitize(body?.recipientPhone, GIFT_FIELD_LIMITS.recipientPhone),
    deliveryDate: sanitize(body?.deliveryDate, GIFT_FIELD_LIMITS.deliveryDate),
    message: sanitize(body?.message, GIFT_FIELD_LIMITS.message),
  };

  const errors = validateGiftCardDetails(details);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Datos incompletos.", errors }, { status: 400 });
  }

  const product = isGiftableProductId(details.productId)
    ? getProductById(details.productId)
    : undefined;
  if (!product || product.paymentMethod !== "mercadopago") {
    return NextResponse.json({ error: "Producto inválido." }, { status: 400 });
  }

  const unitPrice = getGiftPrice(product, "ARS");
  const externalReference = `${product.id}-gift-${randomUUID()}`;
  const origin = getSiteOrigin(request);
  // "ref" es el external_reference completo: /pago-en-proceso/link lo exige
  // como match exacto para no exponer el estado de pagos ajenos.
  // "gift=1" viaja hasta /gracias para que el comprador no vea el CTA de
  // agendar su propia sesión (el regalo lo coordinamos por WhatsApp).
  const returnUrl = `${origin}/pago-en-proceso/link?product=${encodeURIComponent(product.id)}&ref=${encodeURIComponent(externalReference)}&gift=1`;

  try {
    const client = getMercadoPagoClient();
    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: product.id,
            title: `Tarjeta de regalo — ${product.title}`,
            description: `Regalo para ${details.recipientName}`,
            quantity: 1,
            unit_price: unitPrice,
            currency_id: "ARS",
          },
        ],
        payer: {
          name: details.buyerName,
          email: details.buyerEmail,
        },
        metadata: {
          kind: "gift_card",
          product_id: product.id,
          buyer_name: details.buyerName,
          buyer_email: details.buyerEmail,
          buyer_phone: details.buyerPhone,
          recipient_name: details.recipientName,
          delivery_method: details.deliveryMethod,
          recipient_email: details.recipientEmail,
          recipient_phone: details.recipientPhone,
          delivery_date: details.deliveryDate,
          gift_message: details.message,
        },
        external_reference: externalReference,
        back_urls: {
          success: returnUrl,
          pending: returnUrl,
          failure: returnUrl,
        },
        ...(supportsAutoReturn(origin) ? { auto_return: "approved" as const } : {}),
        notification_url: `${origin}/api/mercadopago/webhook`,
      },
    });

    if (!preference.init_point) {
      return NextResponse.json({ error: "No se pudo crear el pago del regalo." }, { status: 500 });
    }

    return NextResponse.json({ initPoint: preference.init_point });
  } catch (err) {
    console.error("[gift-card] create-preference failed", err);
    return NextResponse.json({ error: "No se pudo crear el pago del regalo." }, { status: 500 });
  }
}
