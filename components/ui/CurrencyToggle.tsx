"use client";

import { useCurrency } from "@/lib/currency-context";

export default function CurrencyToggle() {
  const { currency, setCurrency, mounted } = useCurrency();

  const isArs = mounted ? currency === "ARS" : false;
  const isEur = mounted ? currency === "EUR" : true;

  return (
    <div
      role="group"
      aria-label="Seleccionar moneda"
      className="flex items-center gap-2 rounded-full border border-white/70 bg-white/65 p-1 shadow-sm backdrop-blur-xl"
    >
      <button
        type="button"
        onClick={() => setCurrency("ARS")}
        aria-pressed={isArs}
        className={`min-h-[44px] inline-flex items-center justify-center text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
          isArs
            ? "bg-[#2C2018] text-white shadow-[0_10px_30px_rgba(44,32,24,0.16)]"
            : "text-[#7A6A5A] hover:text-[#2C2018]"
        }`}
      >
        ARS
      </button>
      <button
        type="button"
        onClick={() => setCurrency("EUR")}
        aria-pressed={isEur}
        className={`min-h-[44px] inline-flex items-center justify-center text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
          isEur
            ? "bg-[#2C2018] text-white shadow-[0_10px_30px_rgba(44,32,24,0.16)]"
            : "text-[#7A6A5A] hover:text-[#2C2018]"
        }`}
      >
        EUR
      </button>
    </div>
  );
}
