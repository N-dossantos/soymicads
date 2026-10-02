"use client";

interface EventSectionProps {
  formsUrl?: string;
}

export default function EventSection({
  formsUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeTqXxxToZobg4P1BE1atDH9LWyevtd7YAncRicecbPfwO14A/viewform",
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

          {/* Próxima Edición (Destacada) */}
          <div className="relative mx-auto max-w-lg rounded-3xl bg-white/85 border border-[rgba(206,175,210,0.6)] p-6 sm:p-8 shadow-lg backdrop-blur-md mb-10 overflow-hidden">
            {/* Soft ambient inner glows */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,_rgba(242,157,142,0.35)_0%,_transparent_70%)] blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[radial-gradient(circle,_rgba(179,213,238,0.35)_0%,_transparent_70%)] blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#7a5a72] bg-[#fce594]/50 border border-[#fce594]/80 shadow-xs mb-3">
                ✨ Próxima Edición ✨
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#2C2018] mb-2">
                3° Edición
              </h3>

              <div className="inline-flex items-center justify-center gap-2 rounded-full bg-white/80 border border-[#C9B9A9]/40 px-4 py-1.5 text-sm sm:text-[15px] font-semibold text-[#2C2018] mb-3 shadow-xs">
                <span>📅</span>
                <span>Fecha a confirmar</span>
              </div>

              <p className="text-xs sm:text-sm text-[#4A3556] leading-relaxed max-w-md mx-auto mb-6">
                Completá el formulario para anotarte y enterarte de la fecha antes que nadie.
              </p>

              <div>
                <a
                  href={formsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative isolate overflow-hidden inline-flex items-center justify-center py-3.5 px-8 rounded-full text-sm sm:text-base font-medium text-[#53392B] border border-[#C9B9A9] shadow-md hover:shadow-lg hover:scale-105 active:scale-100 transition-all duration-300 after:content-[''] after:absolute after:inset-0 after:rounded-full after:z-[-2] after:bg-[linear-gradient(90deg,#f29d8e,#f6bd8b,#fce594,#a1d2c5,#b3d5ee,#ceafd2)] before:content-[''] before:absolute before:inset-0 before:rounded-full before:z-[-1] before:bg-[#FFF9F4] before:opacity-90 hover:before:opacity-30 duration-200"
                >
                  Anotarme →
                </a>
              </div>
            </div>
          </div>

          {/* Past Editions */}
          <div className="pt-6 border-t border-[rgba(107,79,58,0.12)]">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#7a5a72] mb-4">
              Ediciones anteriores
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-6">
              {/* 1° Edition */}
              <div className="rounded-2xl bg-white/60 border border-[rgba(107,79,58,0.12)] p-4 shadow-xs text-center">
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
              <div className="rounded-2xl bg-white/60 border border-[rgba(107,79,58,0.12)] p-4 shadow-xs text-center">
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

            {/* Thank you message */}
            <div className="mx-auto max-w-xl rounded-2xl bg-white/70 border border-white/90 p-4 shadow-xs">
              <p className="text-xs sm:text-sm leading-relaxed text-[#4A3556]">
                ¡Muchas gracias a todos los que formaron parte de estos encuentros!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
