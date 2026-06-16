"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "¿Necesito saber sobre Diseño Humano antes?",
    a: "Para nada. El proceso arranca desde cero. Solo necesitás tu fecha, hora y lugar de nacimiento para generar tu carta.",
  },
  {
    q: "¿Las sesiones son presenciales o virtuales?",
    a: "Son virtuales por videollamada. Podés estar en cualquier parte del mundo. En caso de querer presencial, consultar disponibilidad por WhatsApp o Gmail.",
  },
  {
    q: "¿Cada cuánto se hacen las sesiones?",
    a: "Eso lo elegís vos. El único límite es que el proceso completo de 6 sesiones tiene 2 meses de vigencia desde el momento del pago.",
  },
  {
    q: "¿Puedo hacer una sesión suelta antes de decidirme por el proceso completo?",
    a: "Sí, totalmente. La sesión suelta es una buena manera de conocer el espacio y ver si lo que hago conecta con lo que estás buscando.",
  },
];

export default function FAQ() {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  return (
    <section id="preguntas" className="relative py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h2 className="section-title text-[clamp(28px,3.5vw,44px)] font-medium leading-tight">Preguntas frecuentes</h2>
        </div>

        <div className="premium-card divide-y divide-[rgba(255,255,255,0.5)] overflow-hidden rounded-[1.75rem]">
          {FAQS.map((faq, i) => (
            <div key={i} className="px-5 py-5 sm:px-6">
              <button
                onClick={() =>
                  setOpenIndices((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))
                }
                className="w-full flex justify-between items-start gap-4 text-left group premium-focus"
                aria-expanded={openIndices.includes(i)}
              >
                <span className="text-[15px] sm:text-[16px] font-medium text-[#2C2018] group-hover:text-[#8a6a84] transition-colors leading-snug">
                  {faq.q}
                </span>
                <span
                  className={`text-[#8a6a84] text-xl leading-none flex-shrink-0 transition-transform duration-200 ${
                    openIndices.includes(i) ? "rotate-90" : ""
                  }`}
                >
                  ›
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndices.includes(i) ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-[14px] sm:text-[15px] text-[#4A3556] leading-[1.85]">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
