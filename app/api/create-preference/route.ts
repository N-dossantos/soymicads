// app/api/create-preference/route.ts
// ──────────────────────────────────────────────────────────────────
// Backend endpoint que crea un link de pago en Mercado Pago.
// Necesitás configurar MP_ACCESS_TOKEN en tus variables de entorno.
// ──────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

interface PreferenceBody {
  title: string;
  unit_price: number;
  quantity: number;
  product_id: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: PreferenceBody = await req.json();
    const { title, unit_price, quantity = 1 } = body;

    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: "MP_ACCESS_TOKEN no configurado. Agregalo a tu archivo .env.local" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    // Crear la preferencia para obtener el link de pago de Mercado Pago.
    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        items: [
          {
            title,
            unit_price: Number(unit_price),
            quantity: Number(quantity),
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
      init_point: preference.init_point, // URL de producción
      sandbox_init_point: preference.sandbox_init_point, // URL de prueba
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
