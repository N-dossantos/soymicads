import Link from "next/link";
import { Payment } from "mercadopago";
import { getProductById } from "@/lib/products";
import { getMercadoPagoClient } from "@/lib/mercadopago";
import { whatsappHref } from "@/lib/contact";

type VerificationState =
  | { kind: "no-payment" }
  | { kind: "approved" }
  | { kind: "pending" }
  | { kind: "rejected" }
  | { kind: "error" };

async function verifyPayment(paymentId: string, expectedReference: string): Promise<VerificationState> {
  try {
    const client = getMercadoPagoClient();
    const payment = await new Payment(client).get({ id: paymentId });

    // external_reference es un UUID random generado por nosotros al crear la
    // preferencia y viajó de vuelta como "ref" en la returnUrl: exigir una
    // coincidencia exacta (no solo el prefijo del producto) evita que alguien
    // consulte el estado del pago de otra persona adivinando payment_id.
    if (payment.external_reference !== expectedReference) {
      return { kind: "rejected" };
    }

    if (payment.status === "approved") {
      return { kind: "approved" };
    }
    if (payment.status === "pending" || payment.status === "in_process") {
      return { kind: "pending" };
    }
    return { kind: "rejected" };
  } catch (err) {
    // Un error de red/API no significa que el pago haya sido rechazado — lo
    // tratamos distinto para no decirle a alguien que ya pagó que su pago falló.
    console.error("[mercadopago] payment verification failed", err);
    return { kind: "error" };
  }
}

export default async function PagoEnProcesoLinkPage({
  searchParams,
}: {
  searchParams?: Promise<{
    product?: string;
    payment_id?: string;
    collection_id?: string;
    ref?: string;
    gift?: string;
  }>;
}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const productId = resolvedParams?.product;
  const product = productId ? getProductById(productId) : undefined;
  const paymentId = resolvedParams?.payment_id ?? resolvedParams?.collection_id;
  const ref = resolvedParams?.ref;
  const isGift = resolvedParams?.gift === "1";

  // Requerimos producto + ref (el external_reference que nosotros generamos
  // al crear la preferencia): sin eso no tenemos con qué validar que este
  // pago es el de esta persona, y no queremos exponer el estado de un
  // payment_id ajeno adivinado.
  const state: VerificationState =
    paymentId && product && ref ? await verifyPayment(paymentId, ref) : { kind: "no-payment" };

  const continueHref = productId
    ? `/gracias?product=${encodeURIComponent(productId)}${isGift ? "&gift=1" : ""}`
    : "/gracias";

  const copy: Record<VerificationState["kind"], { heading: string; body: string }> = {
    approved: {
      heading: isGift ? "¡Tu regalo está confirmado!" : "¡Pago aprobado!",
      body: isGift
        ? `Confirmamos el pago de tu regalo${product ? ` (${product.title})` : ""}. Ya nos pusimos en contacto para coordinar la entrega.`
        : `Confirmamos tu pago${product ? ` de ${product.title}` : ""}. Ya podés continuar para agendar tu sesión.`,
    },
    pending: {
      heading: "Estamos confirmando tu pago",
      body: "Tu pago está siendo procesado por Mercado Pago. Esto puede tardar unos minutos — te va a llegar un email de confirmación apenas se acredite.",
    },
    rejected: {
      heading: "El pago no se completó",
      body: "No pudimos confirmar tu pago. Podés intentar de nuevo o elegir otro medio de pago.",
    },
    error: {
      heading: "No pudimos verificar tu pago",
      body: "Tuvimos un problema para chequear el estado de tu pago. Si ya pagaste, no hace falta que hagas nada más — te vamos a avisar apenas lo confirmemos. Si preferís, escribinos por WhatsApp.",
    },
    "no-payment": {
      heading: "Esperando la confirmación del pago",
      body: product
        ? `Cuando termines de pagar ${product.title} con Mercado Pago vas a volver automáticamente a esta página con la confirmación. Si todavía no iniciaste el pago, podés hacerlo desde la sección de servicios.`
        : "Cuando termines de pagar con Mercado Pago vas a volver automáticamente a esta página con la confirmación. Si todavía no elegiste una propuesta, podés hacerlo desde la sección de servicios.",
    },
  };

  const { heading, body } = copy[state.kind];

  return (
    <main className="relative isolate min-h-screen flex flex-col items-center justify-center p-4 overflow-x-hidden">
      {/* Top rainbow bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 rainbow-bar" />

      {/* Decorative background glow blobs */}
      <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-[600px] max-w-lg">
        <div className="absolute left-8 top-16 h-48 w-48 rounded-full bg-[rgba(242,157,142,0.18)] blur-3xl animate-pulse" />
        <div className="absolute right-10 top-28 h-56 w-56 rounded-full bg-[rgba(179,213,238,0.18)] blur-3xl" />
      </div>

      <div className="premium-card relative w-full max-w-md overflow-hidden rounded-[2rem] p-6 sm:p-8 text-center shadow-[0_28px_80px_rgba(44,32,24,0.16)] bg-white/75 backdrop-blur-xl">
        {/* Rainbow Accent Line on top of Card */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#E8776A] via-[#fce594] to-[#6AAED4]" />

        <h1 className="font-serif text-3xl sm:text-4xl text-[#2C2018] mb-4 mt-2 leading-tight">
          {heading}
        </h1>

        <p className="text-[#4A3556] text-sm sm:text-base mb-6 leading-relaxed">{body}</p>

        <div className="flex flex-col gap-4">
          {state.kind === "approved" && (
            <Link
              href={continueHref}
              className="relative isolate w-full text-white px-6 py-3.5 rounded-full text-[15px] font-medium bg-[#2C2018] hover:bg-[#3B2A20] shadow-md transition duration-200"
            >
              Continuar →
            </Link>
          )}

          {state.kind === "rejected" && (
            <Link
              href={productId ? "/#servicio" : "/"}
              className="relative isolate w-full text-white px-6 py-3.5 rounded-full text-[15px] font-medium bg-[#2C2018] hover:bg-[#3B2A20] shadow-md transition duration-200"
            >
              Volver a intentar →
            </Link>
          )}

          {state.kind === "no-payment" && (
            <Link
              href="/#servicio"
              className="relative isolate w-full text-white px-6 py-3.5 rounded-full text-[15px] font-medium bg-[#2C2018] hover:bg-[#3B2A20] shadow-md transition duration-200"
            >
              Ver propuestas →
            </Link>
          )}

          {state.kind === "error" && (
            <a
              href={whatsappHref(
                "Hola Mica! Intenté verificar mi pago y la página no pudo confirmarlo. ¿Podrías chequear si se acreditó?"
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="relative isolate w-full text-white px-6 py-3.5 rounded-full text-[15px] font-medium bg-[#25D366] hover:brightness-105 shadow-md transition duration-200"
            >
              Escribinos por WhatsApp →
            </a>
          )}
        </div>

        <div className="mt-8 border-t border-[#D8C8B9]/30 pt-6">
          <Link
            href="/"
            className="text-sm font-medium text-[#8C6A56] hover:text-[#2C2018] transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
