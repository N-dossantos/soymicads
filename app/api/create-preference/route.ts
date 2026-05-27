// app/api/create-preference/route.ts
// ──────────────────────────────────────────────────────────────────
// Backend endpoint que crea un link de pago en Mercado Pago.
// El frontend solo envía el product_id; el backend busca el precio
// real desde lib/products.ts para evitar manipulación del cliente.
// ──────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/products";

export async function POST(req: NextRequest) {
  try {
    const body: { product_id: string } = await req.json();
    const { product_id } = body;

    const product = getProductById(product_id);
    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: "MP_ACCESS_TOKEN no configurado. Agregalo a tu archivo .env.local" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        items: [
          {
            title: product.title,
            unit_price: product.priceARS,
            quantity: 1,
            currency_id: "ARS",
          },
        ],
        back_urls: {
          success: `${baseUrl}/gracias`,
          failure: `${baseUrl}/#precios`,
          pending: `${baseUrl}/gracias`,
        },
        auto_return: "approved",
        statement_descriptor: "Soymicads",
      }),
    });

    if (!mpResponse.ok) {
      const error = await mpResponse.json();
      throw new Error(error.message ?? "Error de Mercado Pago");
    }

    const preference = await mpResponse.json();

    return NextResponse.json({
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
