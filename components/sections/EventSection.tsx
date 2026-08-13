"use client";

interface EventSectionProps {
  formsUrl?: string;
}

export default function EventSection({
  formsUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfjAilIBieNLPt_-DIxN7J-FrEXir2gBpyXjdsobG3Nyy79Fg/viewform?usp=publish-editor",
}: EventSectionProps) {
  const rainbowPseudo = [
    "relative isolate overflow-hidden inline-flex items-center justify-center transition-all duration-300",
    "after:content-[''] after:absolute after:inset-0 after:rounded-full after:z-[-2]",
    "after:bg-[linear-gradient(90deg,#f29d8e,#f6bd8b,#fce594,#a1d2c5,#b3d5ee,#ceafd2)]",
    "before:content-[''] before:absolute before:inset-0 before:rounded-full before:z-[-1]",
    "before:transition-opacity before:duration-200",
  ].join(" ");

  return (
    <section id="encuentro" className="relative py-20 px-4 sm:px-6 overflow-hidden">
      {/* Background soft ambient glows */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(242,157,142,0.25)_0%,_rgba(206,175,210,0.2)_50%,_transparent_70%)] blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-6xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Card 1: Aprender a Diseñar(nos) - Realizado */}
          <div className="rainbow-surface relative overflow-hidden rounded-[2.5rem] p-8 sm:p-10 text-center border border-white/60 shadow-xl backdrop-blur-xl opacity-90 transition hover:opacity-100 hover:scale-[1.02] duration-300 order-2 lg:order-1">
            {/* Top subtle bar gradient */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#f29d8e] via-[#f6bd8b] via-[#fce594] via-[#a1d2c5] via-[#b3d5ee] to-[#ceafd2] opacity-60" />

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#7a5a72] bg-white/70 border border-white/80 shadow-sm mb-6">
              <span className="h-2 w-2 rounded-full bg-gray-400" />
              Edición Realizada
            </div>

            {/* Title */}
            <h2 className="section-title text-[clamp(28px,4vw,40px)] font-medium leading-tight mb-4 text-[#2C2018]">
              Aprender a Diseñar(nos)
            </h2>

            {/* Date & Time Badge */}
            <div className="mx-auto max-w-fit rounded-2xl bg-white/60 border border-[rgba(107,79,58,0.12)] px-4 py-2 shadow-sm mb-6 text-sm font-medium text-[#4A3556]">
              <div>
                <span className="text-[#7a5a72] font-semibold">📅 Sábado 25 de Julio de 2026</span>
              </div>
            </div>

            {/* Description */}
            <p className="mx-auto max-w-lg text-[15px] leading-relaxed text-[#4A3556] mb-8">
              Gracias a todos los que formaron parte de esta edición. 
              <br/><br/>¡Fue un encuentro hermoso!
            </p>

            {/* Call to action button */}
            <div>
              <div className="inline-block py-3 px-6 rounded-full text-sm font-medium text-[#4A3556] bg-white/40 border border-[#C9B9A9]/40 shadow-sm cursor-default">
                ✨ Finalizado
              </div>
            </div>
          </div>

          {/* Card 2: Aprender a Diseñar(nos) II - Próximamente */}
          <div className="rainbow-surface relative overflow-hidden rounded-[2.5rem] p-8 sm:p-10 text-center border border-white/60 shadow-2xl backdrop-blur-xl transform lg:scale-105 z-10 transition hover:scale-[1.07] duration-300 order-1 lg:order-2">
            {/* Top subtle bar gradient */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#f29d8e] via-[#f6bd8b] via-[#fce594] via-[#a1d2c5] via-[#b3d5ee] to-[#ceafd2]" />

            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#7a5a72] bg-white/70 border border-white/80 shadow-sm mb-6">
              <span className="h-2 w-2 rounded-full bg-[#E8776A] animate-pulse" />
              Fecha confirmada
            </div>

            {/* Title */}
            <h2 className="section-title text-[clamp(28px,4vw,44px)] font-medium leading-tight mb-4 text-[#2C2018]">
              Aprender a Diseñar(nos) II
            </h2>

            {/* Date & Time Badge */}
            <div className="mx-auto max-w-fit rounded-2xl bg-white/80 border border-[rgba(107,79,58,0.12)] px-5 py-3 shadow-sm mb-6 text-sm sm:text-base font-medium text-[#4A3556]">
              <div>
                <span className="text-[#E8776A] font-semibold">📅 Sábado 29 de agosto</span>
              </div>
              <div className="mt-1.5 text-xs sm:text-sm text-[#7a5a72] font-semibold flex items-center justify-center gap-1.5">
                <span>⏰ 16:00–18:00 hs Argentina</span>
              </div>
              <div className="mt-1 text-xs sm:text-sm text-[#7a5a72] font-semibold flex items-center justify-center gap-1.5">
                <span>🌍 21:00–23:00 hs España</span>
              </div>
            </div>

            {/* Description */}
            <p className="mx-auto max-w-lg text-[15px] sm:text-[16px] leading-relaxed text-[#4A3556] mb-8">
              ¡Ya está confirmada la próxima edición de <strong>Aprender a Diseñar(nos)</strong>! <br className="hidden sm:inline" />
              <span className="font-medium text-[#2C2018]">
                Te esperamos para una experiencia online en vivo y cercana, pensada para diseñar la relación con vos mismo y con tu entorno.
              </span>
            </p>

            {/* Call to action button */}
            <div>
              <a
                href={formsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${rainbowPseudo} py-3.5 px-7 rounded-full text-[15px] font-medium text-[#53392B] border border-[#C9B9A9] shadow-md hover:shadow-lg hover:scale-105 active:scale-100 before:bg-[#FFF9F4] before:opacity-90 hover:before:opacity-40`}
              >
                Anotarme en lista de espera →
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
