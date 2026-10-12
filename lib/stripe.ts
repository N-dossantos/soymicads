import Stripe from "stripe";
import type { Product } from "@/lib/products";

export function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY no está configurado.");
  }
  return new Stripe(secretKey);
}

interface CardCheckoutOptions {
  product: Product;
  origin: string;
  title: string;
  description?: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
  gift?: boolean;
}

// Crea una Checkout Session de Stripe (página de pago alojada por Stripe) en
// EUR, solo con tarjeta — Apple Pay / Google Pay entran como "card". Al pagar
// vuelve a /pago-en-proceso/link con el session_id para verificar el estado.
export async function createCardCheckoutSession({
  product,
  origin,
  title,
  description,
  customerEmail,
  metadata = {},
  gift = false,
}: CardCheckoutOptions): Promise<string | null> {
  // Con tarjeta se cobra el precio de lista; Bizum es el que tiene descuento.
  const unitAmount = Math.round(product.priceEUR * 100);
  if (unitAmount <= 0) {
    throw new Error(`El producto ${product.id} no tiene precio con tarjeta.`);
  }

  // {CHECKOUT_SESSION_ID} lo reemplaza Stripe al redirigir; va sin encodear.
  const successUrl = `${origin}/pago-en-proceso/link?product=${encodeURIComponent(product.id)}${gift ? "&gift=1" : ""}&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${origin}/${gift ? "#regalar" : "#servicio"}`;

  const session = await getStripeClient().checkout.sessions.create({
    mode: "payment",
    allowed_payment_method_types: ["card"],
    locale: "es",
    submit_type: "pay",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: unitAmount,
          product_data: {
            name: title,
            ...(description ? { description } : {}),
          },
        },
      },
    ],
    ...(customerEmail ? { customer_email: customerEmail } : {}),
    metadata: { product_id: product.id, ...metadata },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session.url;
}
