"use client";

import { useCurrency } from "@/lib/currency-context";

export default function CurrencyToggle() {
  const { currency, setCurrency, mounted } = useCurrency();

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 rounded-full border border-white/70 bg-white/65 p-1 shadow-sm backdrop-blur-xl h-[34px] w-[96px] opacity-60" />
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/70 bg-white/65 p-1 shadow-sm backdrop-blur-xl">
      <button
        type="button"
        onClick={() => setCurrency("ARS")}
        className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
          currency === "ARS"
            ? "bg-[#2C2018] text-white shadow-[0_10px_30px_rgba(44,32,24,0.16)]"
            : "text-[#7A6A5A] hover:text-[#2C2018]"
        }`}
      >
        ARS
      </button>
      <button
        type="button"
        onClick={() => setCurrency("EUR")}
        className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
          currency === "EUR"
            ? "bg-[#2C2018] text-white shadow-[0_10px_30px_rgba(44,32,24,0.16)]"
            : "text-[#7A6A5A] hover:text-[#2C2018]"
        }`}
      >
        EUR
      </button>
    </div>
  );
}
