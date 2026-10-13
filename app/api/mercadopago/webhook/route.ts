import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { Payment } from "mercadopago";
import { getMercadoPagoClient, productIdFromReference } from "@/lib/mercadopago";
import { handleSuccessfulPurchase } from "@/lib/fulfillment";

function isValidSignature(request: Request, dataId: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return false;

  const signatureHeader = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");
  if (!signatureHeader || !requestId) return false;

  const parts: Record<string, string> = {};
  for (const part of signatureHeader.split(",")) {
    const [key, value] = part.split("=");
    if (key && value) parts[key.trim()] = value.trim();
  }

  const ts = parts.ts;
  const receivedHash = parts.v1;
  if (!ts || !receivedHash) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const expectedHash = createHmac("sha256", secret).update(manifest).digest("hex");

  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const receivedBuffer = Buffer.from(receivedHash, "hex");
  if (expectedBuffer.length !== receivedBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  let dataId = url.searchParams.get("data.id") ?? url.searchParams.get("id") ?? undefined;
  let type = url.searchParams.get("type") ?? url.searchParams.get("topic") ?? undefined;

  if (!dataId) {
    const body = await request.json().catch(() => null);
    dataId = body?.data?.id ? String(body.data.id) : undefined;
    type = type ?? body?.type;
  }

  if (!dataId) {
    return NextResponse.json({ error: "Falta el id del pago." }, { status: 400 });
  }

  if (!isValidSignature(request, dataId)) {
    return NextResponse.json({ error: "Firma inválida." }, { status: 401 });
  }

  if (type && type !== "payment") {
    return NextResponse.json({ received: true });
  }

  try {
    const client = getMercadoPagoClient();
    const payment = await new Payment(client).get({ id: dataId });
    console.log("[mercadopago webhook]", {
      id: payment.id,
      status: payment.status,
      external_reference: payment.external_reference,
    });

    // MP también notifica pagos pendientes o rechazados; solo los aprobados
    // disparan la post-venta.
    if (payment.status === "approved") {
      const payerName = [payment.payer?.first_name, payment.payer?.last_name].filter(Boolean).join(" ");
      await handleSuccessfulPurchase({
        provider: "mercadopago",
        paymentId: String(payment.id ?? dataId),
        productId: productIdFromReference(payment.external_reference),
        amount: payment.transaction_amount,
        currency: payment.currency_id,
        customerEmail: payment.payer?.email,
        customerName: payerName || undefined,
        metadata: payment.metadata,
      });
    }
  } catch (err) {
    // Un 500 hace que MP reintente la notificación; los emails ya enviados no
    // se duplican porque llevan clave de idempotencia.
    console.error("[mercadopago webhook] failed to process payment", err);
    return NextResponse.json({ error: "No se pudo procesar el pago." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
