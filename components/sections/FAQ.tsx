"use client";

import { useId, useState } from "react";

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
  const baseId = useId();

  return (
    <section id="preguntas" className="relative py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h2 className="section-title text-[clamp(28px,3.5vw,44px)] font-medium leading-tight">Preguntas frecuentes</h2>
        </div>

        <div className="premium-card divide-y divide-[rgba(255,255,255,0.5)] overflow-hidden rounded-[1.75rem]">
          {FAQS.map((faq, i) => {
            const isOpen = openIndices.includes(i);
            const questionId = `${baseId}-question-${i}`;
            const answerId = `${baseId}-answer-${i}`;

            return (
              <div key={i} className="px-5 py-5 sm:px-6">
                <button
                  id={questionId}
                  onClick={() =>
                    setOpenIndices((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))
                  }
                  className="w-full flex justify-between items-start gap-4 text-left group premium-focus"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                >
                  <span className="text-[15px] sm:text-[16px] font-medium text-[#2C2018] group-hover:text-[#7a5a72] transition-colors leading-snug">
                    {faq.q}
                  </span>
                  <span
                    className={`text-[#7a5a72] text-xl leading-none flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  >
                    ›
                  </span>
                </button>

                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-[14px] sm:text-[15px] text-[#4A3556] leading-[1.85]">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
