"use client";

import PayButton from "@/components/ui/PayButton";
import TransferButton from "@/components/ui/TransferButton";
import { useCurrency } from "@/lib/currency-context";
import { formatPrice, getProductById } from "@/lib/products";

export default function Service() {
  const { currency } = useCurrency();

  const sections = [
    {
      id: "disenarme",
      title: "Diseñar(me) — Individual",
      items: [
        {
          id: "designme_full",
          title: "Proceso completo",
          subtitle: "6 sesiones — 60 min c/u",
          desc: (
            <>
              Un programa estructurado de 6 sesiones que incluye un reporte personalizado con tu carta y acompañamiento entre encuentros. <br/> Tiene 2 meses de vigencia desde el momento del pago.
            </>
          ), 
          modal: "Online",
        },
        {
          id: "designme_single",
          title: "Sesión suelta",
          subtitle: "1 sesión — 60 min",
          desc: (
            <>
              Mismos temas que el <span className="font-bold">Proceso completo</span>, pero haciéndolo a tu ritmo. También puede ser un encuentro puntual para explorar, aclarar dudas o recibir orientación práctica.
            </>
          ),          
          modal: "Online",
        },
        
      ],
      details: {
        sessions: [
          "1. Tipo energético, estrategia y autoridad",
          "2. Los 9 centros energéticos (definidos y sin definir)",
          "3. Continuación de los 9 centros energéticos",
          "4. Líneas y perfil",
          "5. Circuitos y canales",
          "6. Integración de todo",
        ],
        outcomes: [
          "Comprender tu tipo de energía y cómo utilizarlo a tu favor",
          "Detectar cuándo tu energía fluye o se bloquea y cómo responder",
          "Mejorar la comunicación con el mundo y con los demás",
          "Aprender a escuchar las señales de tu cuerpo",
          "Tomar decisiones con más claridad y menos ruido mental",
          "Aceptar y aprovechar tu singularidad",
          "Contar con una base práctica para crear una vida más alineada",
        ],
        prices: {
          single: { ars: "$40.000 ARS", eur: "25€" },
          full: { ars: "$210.000 ARS", eur: "125€" },
        },
      },
    },
    {
      id: "disenarnos",
      title: "Diseñar(nos) — Vincular",
      items: [
        {
          id: "disenarnos_pareja_full",
          title: "Proceso para pareja",
          subtitle: "4 sesiones juntos + 2 individuales",
          desc: `Un programa combinado para explorar la dinámica compartida, acordar prácticas y profundizar individualmente. Incluye PDF con ambas cartas.`,
          modal: "online - 60 min c/u",
        },
        {
          id: "disenarnos_group_full",
          title: "Proceso para equipos de trabajo o grupos de amigos",
          subtitle: "4 sesiones",
          desc: "Programa orientado a equipos: roles, comunicación y toma de decisiones coherente con cada diseño.",
          modal: "Duración adaptada al tamaño del grupo",
        },
      ],
      details: {
        pareja: {
          sessionsSummary: [
            "4 sesiones en pareja:",
            "1. Tipo energético, estrategia y autoridad",
            "2. Los 9 centros energéticos (definidos y sin definir)",
            "3. Líneas y Perfil",
            "4. Integración de todo",
            "+ 2 sesiones individuales para cada persona",
          ],
          outcomes: [
            "Comprender la energía de cada uno y cómo acompañarse",
            "Detectar cuándo la energía conjunta fluye o se bloquea y cómo actuar",
            "Mejorar la comunicación y los acuerdos prácticos",
            "Aprender a escuchar las señales del cuerpo en pareja",
            "Tomar decisiones más claras como equipo",
          ],
          prices: { single: { ars: "$70.000 ARS", eur: "40€" }, full: { ars: "$360.000 ARS", eur: "210€" } },
        },
        group: {
          note: "Para grupos de más de 3 personas",
          outcomes: [
            "Reconocer las dinámicas energéticas del grupo",
            "Distribuir roles y potenciar tareas según el diseño",
            "Detectar cuándo la energía colectiva funciona y cuándo no",
            "Mejorar la comunicación interna",
            "Tomar decisiones con más claridad",
          ],
          pricesPerPerson: { single: { ars: "$25.000 ARS", eur: "15€" }, full: { ars: "$80.000 ARS", eur: "50€" } },
        },
      },
    },
    {
      id: "charlitas",
      title: "Charlitas — Otras opciones",
      items: [
        {
          id: "charlitas_intro",
          title: "Para conocernos — Sesión corta",
          subtitle: "30 min",
          desc: `Encuentro breve para resolver dudas, conocernos y decidir si iniciar un proceso.`,
          modal: "online",
        },
        {
          id: "charlitas_acompan",
          title: "Acompañamiento desde mi mirada",
          subtitle: "60 min",
          desc: `Sesión centrada en escucha y presencia: lecturas, energías y temas puntuales (tirada de oráculos, ciclicidad, sexualidad, negocios).`,
          modal: "online",
        },
      ],
      details: {
        intro: { price: { ars: "$10.000 ARS", eur: "5€" } },
        acompan: { price: { ars: "$40.000 ARS", eur: "25€" } },
      },
    },
  ];

    return (
      <section id="servicio" className="relative py-24 px-4 sm:px-6">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(242,157,142,0.5)] to-transparent" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="section-title text-[clamp(30px,4vw,52px)] font-medium mb-4">Servicios</h2>
          </div>

          <div className="space-y-12">
            {sections.map((sec) => (
              <div key={sec.id} id={sec.id === "disenarnos" ? "servicioGrupos" : undefined} className="relative">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="section-title text-2xl sm:text-3xl font-medium">{sec.id === "disenarme" ? "Diseñar(me)" : sec.title}</p>
                  </div>
                </div>

                {sec.id === "disenarme" && (
                  <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-2xl border border-[rgba(255,255,255,0.55)] bg-white/75 p-4">
                      <p className="text-sm font-medium text-[#2C2018] mb-3">Temas</p>
                      <ul className="grid gap-2 text-[13px] text-[#6a5875]">
                        {sec.details?.sessions?.map((s, i) => {
                          const m = String(s).match(/^(\d+)\.\s*(.*)$/);
                          const num = m ? m[1] : null;
                          const rest = m ? m[2] : s;
                          return (
                            <li key={i} className="flex gap-2">
                              {num ? (
                                <span className="font-semibold text-[#E8776A] mr-2">{num}.</span>
                              ) : null}
                              <span className="leading-6">{rest}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-[rgba(255,255,255,0.55)] bg-white/75 p-4">
                      <p className="text-sm font-medium text-[#2C2018] mb-3">¿Qué te llevás?</p>
                      <ul className="grid gap-2 text-[13px] text-[#6a5875]">
                        {sec.details?.outcomes?.slice(0, 6).map((o, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#E8776A]" />
                            <span className="leading-6">{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {sec.items.map((it, idx) => {
                    const product = getProductById(it.id);
                    const rainbow = ["#E8776A", "#E8A86A", "#D4C46A", "#7AC46A", "#6AAED4", "#9B7AC4"];
                    const accent = rainbow[idx % rainbow.length];

                    let sessionsList = sec.details?.sessions ?? null;
                    let outcomesList = sec.details?.outcomes ?? null;
                    if (sec.id === "disenarnos") {
                      if (it.id.includes("pareja")) {
                        sessionsList = sec.details?.pareja?.sessionsSummary ?? null;
                        outcomesList = sec.details?.pareja?.outcomes ?? null;
                      } else if (it.id.includes("group")) {
                        sessionsList = [
                          "1. Tipo energético, estrategia y autoridad",
                          "2. Los 9 centros energéticos (definidos y sin definir)",
                          "3. Líneas y Perfil",
                          "4. Integración de todo",
                        ];
                        outcomesList = sec.details?.group?.outcomes ?? null;
                      }
                    }

                    return (
                      <div key={idx} className="premium-card group relative overflow-hidden rounded-[1.75rem] p-6 sm:p-7 transition duration-300 hover:-translate-y-1">
                        <div className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${accent}, rgba(255,255,255,0.95))` }} />
                        <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl" style={{ background: accent }} />

                        <div className="flex items-start gap-4">
                          <div className="h-14 w-2.5 rounded-full shadow-[0_0_0_8px_rgba(255,255,255,0.35)]" style={{ background: accent }} />
                          <div className="flex-1">
                            <p className="section-kicker mb-1">{it.modal}</p>
                            <h4 className="text-xl sm:text-2xl font-semibold text-[#2C2018] mb-2 leading-tight">{it.title}</h4>
                            <p className="text-sm sm:text-[15px] text-[#6a5875] leading-7 max-w-xl">{it.subtitle}</p>
                          </div>
                          <div className="rounded-2xl border border-[rgba(255,255,255,0.55)] bg-white/72 px-4 py-3 text-right shadow-sm backdrop-blur-md">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a6a84]">Precio</p>
                            <p className="mt-1 text-[20px] font-serif text-[#2C2018]">
                              {product
                                ? currency === "ARS"
                                  ? formatPrice(product.priceARS, "ARS")
                                  : formatPrice(product.priceEUR, "EUR")
                                : "—"}
                            </p>
                            <p className="text-xs text-[#6a5875]">{currency === "ARS" ? "ARS" : "EUR"}</p>
                          </div>
                        </div>

                        <p className="mt-4 text-[14px] sm:text-[15px] leading-7 text-[#6a5875]">{it.desc}</p>

                        {sec.id !== "disenarme" && (it.subtitle.toLowerCase().includes("6 sesiones") || it.title.toLowerCase().includes("proceso")) ? (
                          <div className="mt-5 rounded-2xl border border-[rgba(255,255,255,0.55)] bg-[linear-gradient(135deg,rgba(242,157,142,0.1),rgba(246,189,139,0.1),rgba(252,229,148,0.08),rgba(161,210,197,0.08),rgba(179,213,238,0.1),rgba(206,175,210,0.1))] p-4">
                            <p className="text-sm font-medium text-[#2C2018] mb-3">Incluye</p>
                            <ul className="grid gap-2 text-[13px] text-[#6a5875] sm:grid-cols-1">
                              {sessionsList?.map((s, i) => {
                                const m = String(s).match(/^(\d+)\.\s*(.*)$/);
                                const num = m ? m[1] : null;
                                const rest = m ? m[2] : s;
                                return (
                                  <li key={i} className="flex gap-2">
                                    {num ? (
                                      <span className="font-semibold mr-2" style={{ color: accent }}>{num}.</span>
                                    ) : null}
                                    <span className="leading-6">{rest}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ) : null}

                        {sec.id !== "disenarme" && outcomesList ? (
                          <div className="mt-5 rounded-2xl border border-[rgba(255,255,255,0.55)] bg-white/75 p-4 backdrop-blur-md">
                            <p className="text-sm font-medium text-[#2C2018] mb-3">¿Qué te llevás?</p>
                            <ul className="grid grid-cols-1 gap-2 text-[13px] text-[#6a5875] sm:grid-cols-2">
                              {outcomesList.slice(0, 6).map((o, i) => (
                                <li key={i} className="flex gap-2">
                                  <span className="mt-2 h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                                  <span className="leading-6">{o}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        <div className="mt-6 grid gap-3 sm:grid-cols-1">
                          {product ? (
                            <>
                              <div className="w-full">
                                <PayButton productId={product.id} variant="primary" />
                              </div>
                              <div className="w-full">
                                <TransferButton productId={product.id} />
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-[#6a5875]">Precio y enlaces próximamente</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
}
