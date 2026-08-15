import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { Preference } from "mercadopago";
import { getProductById } from "@/lib/products";
import { getMercadoPagoClient, getSiteOrigin, supportsAutoReturn } from "@/lib/mercadopago";

export async function POST(request: Request) {
  let productId: unknown;
  try {
    const body = await request.json();
    productId = body?.productId;
  } catch {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const product = typeof productId === "string" ? getProductById(productId) : undefined;
  if (!product || product.paymentMethod !== "mercadopago") {
    return NextResponse.json({ error: "Producto inválido." }, { status: 400 });
  }

  const unitPrice = product.priceMercadoARS ?? product.priceARS;
  if (!unitPrice || unitPrice <= 0) {
    return NextResponse.json({ error: "Este producto no tiene un pago asociado." }, { status: 400 });
  }
  const externalReference = `${product.id}-${randomUUID()}`;
  const origin = getSiteOrigin(request);
  const returnUrl = `${origin}/pago-en-proceso/link?product=${encodeURIComponent(product.id)}&ref=${encodeURIComponent(externalReference)}`;

  try {
    const client = getMercadoPagoClient();
    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: product.id,
            title: product.title,
            quantity: 1,
            unit_price: unitPrice,
            currency_id: "ARS",
          },
        ],
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
      return NextResponse.json({ error: "No se pudo crear la preferencia de pago." }, { status: 500 });
    }

    return NextResponse.json({ initPoint: preference.init_point });
  } catch (err) {
    console.error("[mercadopago] create-preference failed", err);
    return NextResponse.json({ error: "No se pudo crear la preferencia de pago." }, { status: 500 });
  }
}
