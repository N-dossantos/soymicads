import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import { handleSuccessfulPurchase } from "@/lib/fulfillment";

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

    if (session.payment_status === "paid") {
      try {
        await handleSuccessfulPurchase({
          provider: "stripe",
          paymentId: session.id,
          productId: session.metadata?.product_id,
          amount: session.amount_total !== null ? session.amount_total / 100 : undefined,
          currency: session.currency ?? undefined,
          customerEmail: session.customer_details?.email ?? undefined,
          customerName: session.customer_details?.name ?? undefined,
          metadata: session.metadata,
        });
      } catch (err) {
        // Un 500 hace que Stripe reintente el evento; los emails ya enviados
        // no se duplican porque llevan clave de idempotencia.
        console.error("[stripe webhook] fulfillment failed", err);
        return NextResponse.json({ error: "No se pudo procesar el pago." }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
