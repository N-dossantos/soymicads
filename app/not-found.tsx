import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 py-24 sm:px-6">
      <div className="absolute inset-x-0 top-0 h-1 rainbow-bar" />
      <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full rainbow-glow" />

      <div className="premium-card relative mx-auto max-w-lg rounded-[2rem] px-8 py-14 text-center sm:px-12">
        <p className="section-kicker mb-4">Error 404</p>
        <h1 className="section-title text-[clamp(28px,5vw,44px)] font-medium leading-tight mb-4">
          Esta página se perdió en el camino
        </h1>
        <p className="mx-auto mb-8 max-w-sm text-[15px] leading-7 text-[#4A3556]">
          Como a veces nos pasa a todos. Volvamos a un lugar conocido.
        </p>
        <Link
          href="/"
          className="premium-focus inline-flex items-center justify-center rounded-full border border-[#C9B9A9] bg-white/70 px-7 py-3.5 text-[15px] font-medium text-[#53392B] shadow-md backdrop-blur-sm transition hover:bg-white"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
