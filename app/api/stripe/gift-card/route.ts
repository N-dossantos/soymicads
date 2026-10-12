import { NextResponse } from "next/server";
import { getProductById } from "@/lib/products";
import { getSiteOrigin } from "@/lib/mercadopago";
import { createCardCheckoutSession } from "@/lib/stripe";
import { isGiftableProductId, parseGiftCardDetails, validateGiftCardDetails } from "@/lib/gift-card";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const details = parseGiftCardDetails(body);

  const errors = validateGiftCardDetails(details);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Datos incompletos.", errors }, { status: 400 });
  }

  const product = isGiftableProductId(details.productId)
    ? getProductById(details.productId)
    : undefined;
  if (!product) {
    return NextResponse.json({ error: "Producto inválido." }, { status: 400 });
  }

  try {
    // Los datos del regalo viajan como metadata de la sesión, así quedan
    // visibles en el dashboard de Stripe junto al pago.
    const url = await createCardCheckoutSession({
      product,
      origin: getSiteOrigin(request),
      title: `Tarjeta de regalo — ${product.title}`,
      description: `Regalo para ${details.recipientName}`,
      customerEmail: details.buyerEmail,
      gift: true,
      metadata: {
        kind: "gift_card",
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
    });

    if (!url) {
      return NextResponse.json({ error: "No se pudo crear el pago del regalo." }, { status: 500 });
    }

    return NextResponse.json({ url });
  } catch (err) {
    console.error("[stripe] gift-card checkout session failed", err);
    return NextResponse.json({ error: "No se pudo crear el pago del regalo." }, { status: 500 });
  }
}
