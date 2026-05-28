import Link from "next/link";
import { getProductById } from "@/lib/products";

export default function PagoEnProcesoLinkPage({
  searchParams,
}: {
  searchParams?: { product?: string };
}) {
  const productId = searchParams?.product;
  const product = productId ? getProductById(productId) : undefined;
  const continueHref = productId ? `/gracias?product=${encodeURIComponent(productId)}` : "/gracias";

  return (
    <main className="min-h-screen bg-[#FDFAF6] flex flex-col items-center justify-center px-4 text-center">
      <div className="h-1 rainbow-bar w-full fixed top-0 left-0" />

      <h1 className="font-serif text-4xl md:text-5xl text-[#2C2018] mb-4 leading-tight">
        El pago está en curso...
      </h1>

      <p className="text-[#7A6A5A] text-lg max-w-md mb-8 leading-relaxed">
        {product
          ? `Ya abriste el link de pago para ${product.title}. Cuando termines, volvé a esta pestaña y seguí para completar la agenda de tu sesión.`
          : "Cuando termines el pago, volvé a esta pestaña y tocá el botón de abajo para seguir con la agenda de tu sesión."}
      </p>

      <Link
        href={continueHref}
        className="relative isolate text-black px-8 py-4 rounded-full text-base font-medium shadow overflow-hidden before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(90deg,#f29d8e,#f6bd8b,#fce594,#a1d2c5,#b3d5ee,#ceafd2)] before:opacity-70 hover:before:opacity-50 before:transition-opacity"
      >
        Ya pagué, continuar →
      </Link>

      <Link
        href="/"
        className="mt-8 text-sm text-[#7A6A5A] hover:text-terra transition-colors"
      >
        Volver al inicio
      </Link>
    </main>
  );
}