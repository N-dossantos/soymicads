import Link from "next/link";

export default function PagoEnProcesoPage() {
  return (
    <main className="min-h-screen bg-[#FDFAF6] flex flex-col items-center justify-center px-4 text-center">
      <div className="h-1 rainbow-bar w-full fixed top-0 left-0" />

      <h1 className="font-serif text-4xl md:text-5xl text-[#2C2018] mb-4 leading-tight">
        Elegí tu método de pago
      </h1>

      <p className="text-[#7A6A5A] text-lg max-w-md mb-8 leading-relaxed">
        Si venís desde Mercado Pago o Bizum, usá el flujo de pago por link. Si hiciste una transferencia, usá el flujo de transferencia.
      </p>

      <div className="w-full max-w-md flex flex-col gap-4">
        <Link
          href="/pago-en-proceso/link"
          className="relative isolate w-full text-black px-8 py-4 rounded-full text-base font-medium shadow overflow-hidden before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(90deg,#f29d8e,#f6bd8b,#fce594,#a1d2c5,#b3d5ee,#ceafd2)] before:opacity-70 hover:before:opacity-50 before:transition-opacity"
        >
          Pago por link →
        </Link>

        <Link
          href="/pago-en-proceso/transferencia"
          className="relative isolate w-full text-black px-8 py-4 rounded-full text-base font-medium shadow-md overflow-hidden before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(90deg,#f29d8e,#f6bd8b,#fce594,#a1d2c5,#b3d5ee,#ceafd2)] before:opacity-70 hover:before:opacity-50 before:transition-opacity"
        >
          Transferencia →
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
