"use client";

interface EventSectionProps {
  formsUrl?: string;
}

export default function EventSection({
  formsUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfjAilIBieNLPt_-DIxN7J-FrEXir2gBpyXjdsobG3Nyy79Fg/viewform?usp=publish-editor",
}: EventSectionProps) {
  return (
    <section id="encuentro" className="relative py-20 px-4 sm:px-6 overflow-hidden">
      {/* Background soft ambient glows */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(242,157,142,0.25)_0%,_rgba(206,175,210,0.2)_50%,_transparent_70%)] blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-3xl relative">
        <div className="rainbow-surface relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12 text-center border border-white/60 shadow-xl backdrop-blur-xl transition duration-300">
          {/* Top subtle bar gradient */}
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#f29d8e] via-[#f6bd8b] via-[#fce594] via-[#a1d2c5] via-[#b3d5ee] to-[#ceafd2]" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#7a5a72] bg-white/70 border border-white/80 shadow-sm mb-6">
            Encuentros Gratuitos Online
          </div>

          {/* Title */}
          <h2 className="section-title text-[clamp(28px,4vw,42px)] font-medium leading-tight mb-4 text-[#2C2018]">
            Aprender a Diseñar(nos)
          </h2>

          {/* Intro */}
          <p className="mx-auto max-w-xl text-[15px] sm:text-[16px] leading-relaxed text-[#4A3556] mb-8">
            Espacios online y en vivo para explorar el Diseño Humano, conectar y diseñar la relación con vos mismo y con tu entorno.
          </p>

          {/* Past Editions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-xl mx-auto text-left">
            {/* 1° Edition */}
            <div className="rounded-2xl bg-white/60 border border-[rgba(107,79,58,0.12)] p-4 shadow-sm text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#7a5a72] mb-1">
                1° Edición
              </div>
              <div className="text-sm font-semibold text-[#2C2018]">
                📅 Sábado 25 de Julio
              </div>
              <div className="mt-1 text-xs text-[#7a5a72]">
                Realizada con éxito
              </div>
            </div>

            {/* 2° Edition */}
            <div className="rounded-2xl bg-white/60 border border-[rgba(107,79,58,0.12)] p-4 shadow-sm text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#7a5a72] mb-1">
                2° Edición
              </div>
              <div className="text-sm font-semibold text-[#2C2018]">
                📅 Sábado 29 de Agosto
              </div>
              <div className="mt-1 text-xs text-[#7a5a72]">
                Realizada con éxito
              </div>
            </div>
          </div>

          {/* Thank you & Stay tuned message */}
          <div className="mx-auto max-w-xl rounded-2xl bg-white/70 border border-white/90 p-5 shadow-sm mb-6">
            <p className="text-sm sm:text-[15px] leading-relaxed text-[#4A3556]">
              ¡Muchas gracias a todos los que formaron parte de estos encuentros!
            </p>
          </div>

          {/* Status pill */}
          <div>
            <div className="inline-block py-3 px-6 rounded-full text-sm font-medium text-[#4A3556] bg-white/50 border border-[#C9B9A9]/40 shadow-sm cursor-default">
              ✨ ¡Pronto anunciaremos nuevas fechas! ✨
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
