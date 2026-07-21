"use client";

interface EventSectionProps {
  formsUrl?: string;
}

export default function EventSection({
  formsUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfZnABlaQzVpqgqJZ9hRfBAxYzCOL8V7JdqCqqLEUgrr0anlA/viewform?usp=header",
}: EventSectionProps) {
  const rainbowPseudo = [
    "relative isolate overflow-hidden inline-flex items-center justify-center transition-all duration-300",
    "after:content-[''] after:absolute after:inset-0 after:rounded-full after:z-[-2]",
    "after:bg-[linear-gradient(90deg,#f29d8e,#f6bd8b,#fce594,#a1d2c5,#b3d5ee,#ceafd2)]",
    "before:content-[''] before:absolute before:inset-0 before:rounded-full before:z-[-1]",
    "before:transition-opacity before:duration-200",
  ].join(" ");

  return (
    <section id="taller" className="relative py-20 px-4 sm:px-6 overflow-hidden">
      {/* Background soft ambient glows */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(242,157,142,0.25)_0%,_rgba(206,175,210,0.2)_50%,_transparent_70%)] blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-4xl relative">
        <div className="rainbow-surface relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12 text-center border border-white/60 shadow-2xl backdrop-blur-xl">
          {/* Top subtle bar gradient */}
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#f29d8e] via-[#f6bd8b] via-[#fce594] via-[#a1d2c5] via-[#b3d5ee] to-[#ceafd2]" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#8a6a84] bg-white/70 border border-white/80 shadow-sm mb-6">
            <span className="h-2 w-2 rounded-full bg-[#E8776A] animate-pulse" />
            Próximo Taller
          </div>

          {/* Title */}
          <h2 className="section-title text-[clamp(32px,5vw,56px)] font-medium leading-tight mb-4 text-[#2C2018]">
            Aprender a Diseñar(nos)
          </h2>

          {/* Date & Time Badge */}
          <div className="mx-auto max-w-fit rounded-2xl bg-white/80 border border-[rgba(107,79,58,0.12)] px-5 py-3 shadow-sm mb-6 text-sm sm:text-base font-medium text-[#4A3556]">
            <span className="text-[#E8776A] font-semibold">📅 Sábado 25 de Julio</span> — 10:00 hs (Argentina) / 15:00 hs (España)
          </div>

          {/* Description */}
          <p className="mx-auto max-w-2xl text-[15px] sm:text-[17px] leading-relaxed text-[#4A3556] mb-8">
            Inscríbete y completa los datos de tu carta natal. <br className="hidden sm:inline" />
            <span className="font-medium text-[#2C2018]">
              (Inscripciones abiertas: si te anotás hasta el 23, te hago tu carta personalizada y te la envío).
            </span>
          </p>

          {/* Call to action button */}
          <div>
            <a
              href={formsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${rainbowPseudo} py-4 px-8 rounded-full text-base font-medium text-[#53392B] border border-[#C9B9A9] shadow-md hover:shadow-lg hover:scale-105 active:scale-100 before:bg-[#FFF9F4] before:opacity-90 hover:before:opacity-40`}
            >
              Inscribirme al taller →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
