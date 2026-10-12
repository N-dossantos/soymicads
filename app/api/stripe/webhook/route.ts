import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Firma inválida." }, { status: 401 });
  }

  // La firma se calcula sobre el body crudo: hay que leerlo como texto, no
  // como JSON, o la verificación falla.
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = await getStripeClient().webhooks.constructEventAsync(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Firma inválida." }, { status: 401 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("[stripe webhook]", {
      id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      metadata: session.metadata,
    });
  }

  return NextResponse.json({ received: true });
}
