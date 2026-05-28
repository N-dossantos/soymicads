import Link from "next/link";
import { getProductById } from "@/lib/products";

const DEFAULT_CALENDLY_LINK = "https://cal.com/soymicads/disenar-me";

function getCalendlyLink(productId?: string) {
  if (!productId) return DEFAULT_CALENDLY_LINK;

  const product = getProductById(productId);
  return product?.calendlyLink ?? DEFAULT_CALENDLY_LINK;
}

export default function GraciasPage({
  searchParams,
}: {
  searchParams?: { product?: string };
}) {
  const productId = searchParams?.product;
  const calendlyLink = getCalendlyLink(productId);
  const product = productId ? getProductById(productId) : undefined;

  return (
    <main className="min-h-screen bg-[#FDFAF6] flex flex-col items-center justify-center px-4 text-center">
        <div className="h-1 rainbow-bar w-full fixed top-0 left-0" />

        <h1 className="font-serif text-4xl md:text-5xl text-[#2C2018] mb-4 leading-tight">
            ¡Bienvenido/a al proceso!
        </h1>

        <p className="text-[#7A6A5A] text-lg max-w-md mb-4 leading-relaxed">
            Tu pago fue procesado.
            <br />
            Si es tu primera sesión, completá los datos para calcular tu carta.
            <br />
        </p>

        <div className="w-full max-w-md flex flex-col gap-4">
            <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfqn1PNbhw0Cv3MrE-iEQzCY-w8yLGNR9DXwRyEnBbjziYrKA/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="relative mb-10 isolate w-full text-black px-8 py-4 rounded-full text-base font-medium shadow overflow-hidden before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(90deg,#f29d8e,#f6bd8b,#fce594,#a1d2c5,#b3d5ee,#ceafd2)] before:opacity-70 hover:before:opacity-50 before:transition-opacity"
            >
            Datos para calcular tu carta →
            </a>

            <p className="text-[#7A6A5A]  text-lg max-w-md leading-relaxed">
                Si ya lo hiciste, el siguiente paso es agendar tu sesión.
            </p>

            <a
            href={calendlyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative isolate w-full text-black px-8 py-4 rounded-full text-base font-medium shadow-md overflow-hidden before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(90deg,#f29d8e,#f6bd8b,#fce594,#a1d2c5,#b3d5ee,#ceafd2)] before:opacity-70 hover:before:opacity-50 before:transition-opacity"
            >
            {product ? `Agendar ${product.title} →` : "Agendar sesión →"}
            </a>
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
