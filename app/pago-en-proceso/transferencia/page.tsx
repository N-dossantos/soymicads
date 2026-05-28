import Link from "next/link";
import { getProductById, formatPrice } from "@/lib/products";

function buildMailto(productTitle?: string, amount?: string) {
  const subject = encodeURIComponent(`Comprobante de transferencia - ${productTitle ?? "Pago"}`);
  const bodyLines = [
    "Hola,",
    `Adjunto el comprobante de la transferencia para ${productTitle ?? "mi reserva"}.`,
    amount ? `Importe: ${amount}` : "",
    "Muchas gracias.",
  ].filter(Boolean);
  const body = encodeURIComponent(bodyLines.join("\n\n"));
  return `mailto:soymicads@gmail.com?subject=${subject}&body=${body}`;
}

export default function PagoEnProcesoTransferenciaPage({
  searchParams,
}: {
  searchParams?: { product?: string };
}) {
  const productId = searchParams?.product;
  const product = productId ? getProductById(productId) : undefined;
  const continueHref = productId ? `/gracias?product=${encodeURIComponent(productId)}` : "/gracias";

  let amount = "";
  if (product) {
    if (product.priceTransferARS) amount = formatPrice(product.priceTransferARS, "ARS");
    else if (product.priceTransferEUR) amount = formatPrice(product.priceTransferEUR, "EUR");
    else if (product.priceARS) amount = formatPrice(product.priceARS, "ARS");
    else if (product.priceEUR) amount = formatPrice(product.priceEUR, "EUR");
  }

  const mailto = buildMailto(product?.title, amount);

  return (
    <main className="min-h-screen bg-[#FDFAF6] flex flex-col items-center justify-center px-4 text-center">
      <div className="h-1 rainbow-bar w-full fixed top-0 left-0" />

      <h1 className="font-serif text-4xl md:text-5xl text-[#2C2018] mb-4 leading-tight">
        Transferencia registrada
      </h1>

      <p className="text-[#7A6A5A] text-lg max-w-md mb-8 leading-relaxed">
        Si ya realizaste la transferencia, podés compartir el comprobante por correo y continuar para completar la agenda de tu sesión.
      </p>

      <div className="w-full max-w-md flex flex-col gap-4">
        <a
          href={mailto}
          className="relative isolate w-full text-black px-8 py-4 rounded-full text-base font-medium shadow overflow-hidden before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(90deg,#f29d8e,#f6bd8b,#fce594,#a1d2c5,#b3d5ee,#ceafd2)] before:opacity-70 hover:before:opacity-50 before:transition-opacity"
        >
          Compartir comprobante por mail →
        </a>

        <Link
          href={continueHref}
          className="relative isolate w-full text-black px-8 py-4 rounded-full text-base font-medium shadow-md overflow-hidden before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(90deg,#f29d8e,#f6bd8b,#fce594,#a1d2c5,#b3d5ee,#ceafd2)] before:opacity-70 hover:before:opacity-50 before:transition-opacity"
        >
          Ya envié el comprobante, continuar →
        </Link>
      </div>

      <Link
        href="/"
        className="mt-8 text-sm text-[#7A6A5A] hover:text-terra transition-colors"
      >
        Volver al inicio
      </Link>
    </main>
  );
}