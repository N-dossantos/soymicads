"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Currency } from "@/lib/products";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  mounted: boolean;
}

const STORAGE_KEY = "moodbudita_currency";

function getInitialCurrency(): Currency {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "ARS" || stored === "EUR") return stored;
  }
  return "EUR";
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "EUR",
  setCurrency: () => {},
  mounted: false,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCurrency(getInitialCurrency());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, currency);
    }
  }, [currency, mounted]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, mounted }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
