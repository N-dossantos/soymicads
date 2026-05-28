"use client";

export default function Hero() {
  return (
    <section className="relative pt-10 sm:pt-32 pb-20 px-4 sm:px-6">
      <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-[680px] max-w-6xl">
        <div className="absolute left-8 top-16 h-64 w-64 rounded-full rainbow-glow" />
        <div className="absolute right-10 top-28 h-72 w-72 rounded-full bg-[rgba(179,213,238,0.2)] blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-44 w-[32rem] -translate-x-1/2 rounded-full bg-[rgba(252,229,148,0.18)] blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="max-w-2xl">
          <p className="section-kicker mb-5 animate-fade-in">Diseño Humano</p>

          <h1 className="section-title text-[clamp(38px,6vw,60px)] leading-[0.98] font-medium mb-6 animate-fade-up">
            No venís a sanar. <br/>Venís a vivir siendo vos.
          </h1>

          <p className="poppins-regular text-[17px] sm:text-[18px] leading-[1.9] text-[#6a5875] max-w-xl mb-8 animate-fade-in">
            ¿Te sentís raro, apagado, estancado, perdido o con la sensación de que algo no encaja
            aunque "todo esté bien"?
            ¿Sentís que te esforzás por ser de una forma que en el fondo no es tuya? <br/><br/>
            No estás roto, ni fallado. Tal vez, solo necesites recordar cómo funciona tu energía 
            y tu forma única de SER.
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
          </div>
        </div>

        <div className="relative lg:pl-6">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-[linear-gradient(90deg,#f29d8e,#f6bd8b,#fce594,#a1d2c5,#b3d5ee,#ceafd2)] blur-2xl" />
          <div className="premium-card relative overflow-hidden rounded-[2rem] p-5 sm:p-6 ">
            <div className="mb-5 flex items-center justify-between ">
              <div>
                <p className="font-serif text-2xl text-[#2C2018] ">Propuestas</p>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                { label: "Individual", value: "Diseñar (me)", href: "#servicio" },
                { label: "Vincular", value: "Diseñar (nos)", href: "#servicioGrupos" },
                { label: "Otros", value: "Charlitas", href: "#charlitas" },
              ].map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="mt-5 rounded-2xl border border-[rgba(255,255,255,0.6)] bg-[linear-gradient(135deg,rgba(242,157,142,0.14),rgba(246,189,139,0.12),rgba(252,229,148,0.12),rgba(161,210,197,0.12),rgba(179,213,238,0.14),rgba(206,175,210,0.14))] p-4 transition duration-300 hover:-translate-y-0.5 hover:bg-white"
                  style={{ boxShadow: index === 0 ? "0 16px 40px rgba(242,157,142,0.12)" : "none" }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a6a84]">{item.label}</p>
                      <p className="mt-1 text-sm font-medium text-[#2C2018]">{item.value}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>


          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(107,79,58,0.18)] to-transparent" />
      </div>
    </section>
  );
}
