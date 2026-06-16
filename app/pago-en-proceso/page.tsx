import Link from "next/link";

export default function PagoEnProcesoPage() {
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
          Elegí tu método de pago
        </h1>

        <p className="text-[#4A3556] text-sm sm:text-base mb-6 leading-relaxed">
          Si venís desde Mercado Pago o Bizum, usá el flujo de pago por link. Si hiciste una transferencia, usá el flujo de transferencia.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/pago-en-proceso/link"
            className="relative isolate w-full text-white px-6 py-3.5 rounded-full text-[15px] font-medium bg-[#2C2018] hover:bg-[#3B2A20] shadow-md transition duration-200"
          >
            Pago por link →
          </Link>

          <Link
            href="/pago-en-proceso/transferencia"
            className="relative isolate w-full text-[#2C2018] px-6 py-3.5 rounded-full text-[15px] font-medium border border-[#C9B9A9] backdrop-blur-sm overflow-hidden before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(90deg,rgba(242,157,142,0.2),rgba(246,189,139,0.2),rgba(252,229,148,0.2),rgba(161,210,197,0.2),rgba(179,213,238,0.2),rgba(206,175,210,0.2))] hover:before:opacity-60 transition duration-200"
          >
            Transferencia →
          </Link>
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
