import { NextResponse } from "next/server";
import { getProductById } from "@/lib/products";
import { getSiteOrigin } from "@/lib/mercadopago";
import { createCardCheckoutSession } from "@/lib/stripe";

export async function POST(request: Request) {
  let productId: unknown;
  try {
    const body = await request.json();
    productId = body?.productId;
  } catch {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const product = typeof productId === "string" ? getProductById(productId) : undefined;
  if (!product || !product.priceEUR) {
    return NextResponse.json({ error: "Producto inválido." }, { status: 400 });
  }

  try {
    const url = await createCardCheckoutSession({
      product,
      origin: getSiteOrigin(request),
      title: product.title,
      description: product.description,
    });

    if (!url) {
      return NextResponse.json({ error: "No se pudo iniciar el pago con tarjeta." }, { status: 500 });
    }

    return NextResponse.json({ url });
  } catch (err) {
    console.error("[stripe] checkout session failed", err);
    return NextResponse.json({ error: "No se pudo iniciar el pago con tarjeta." }, { status: 500 });
  }
}
