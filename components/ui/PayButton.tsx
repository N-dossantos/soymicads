"use client";

import { useEffect, useState } from "react";
import { useCurrency } from "@/lib/currency-context";
import { getProductById, formatPrice } from "@/lib/products";

interface PayButtonProps {
  productId: string;
  variant?: "primary" | "ghost";
  className?: string;
}

export default function PayButton({
  productId,
  variant = "primary",
  className = "",
}: PayButtonProps) {
  const { currency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bizumCopied, setBizumCopied] = useState(false);
  const [bizumOpen, setBizumOpen] = useState(false);

  const product = getProductById(productId);
  if (!product) return null;

  const price =
    currency === "ARS"
      ? formatPrice(product.priceARS, "ARS")
      : formatPrice(product.priceEUR, "EUR");

  const bizumPhone = process.env.NEXT_PUBLIC_BIZUM_PHONE ?? "664585365"; // Número de teléfono para pagos con Bizum (formato internacional)
  const bizumPhoneText = "🇪🇸 664 585 365";

  useEffect(() => {
    if (!bizumOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setBizumOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [bizumOpen]);

  // EUR no usa Mercado Pago. Ese flujo se integrará más adelante.
  if (currency === "EUR") {
    async function copyBizumPhone() {
      try {
        await navigator.clipboard.writeText(bizumPhone);
        setBizumCopied(true);
        setTimeout(() => setBizumCopied(false), 1800);
      } catch {
        setBizumCopied(false);
      }
    }

    return (
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setBizumOpen(true)}
          className={`w-full py-3 rounded-full text-sm font-medium border border-[rgba(107,79,58,0.14)] bg-white/55 text-[#8C6A56] transition-all backdrop-blur-sm ${className}`}
        >
          Pagar con Bizum {price}
        </button>

        {bizumOpen ? (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
            <button
              type="button"
              aria-label="Cerrar ventana de Bizum"
              onClick={() => setBizumOpen(false)}
              className="absolute inset-0"
            />

            <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-[rgba(107,79,58,0.14)] bg-[#FFF9F4] p-6 shadow-[0_28px_80px_rgba(44,32,24,0.28)] space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#8C6A56]">Pago con Bizum</p>
                  <p className="mt-1 text-sm text-[#7A6A5A]">Importe: {price}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setBizumOpen(false)}
                  className="rounded-full border border-[rgba(107,79,58,0.2)] px-3 py-1 text-xs font-medium text-[#53392B] hover:bg-white transition"
                >
                  Cerrar
                </button>
              </div>

              <div className="rounded-2xl border border-[rgba(107,79,58,0.14)] bg-white/80 px-4 py-4 text-center">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#8C6A56]">Número de Bizum</p>
                <p className="mt-1 text-lg font-semibold text-[#2C2018]">{bizumPhoneText}</p>
                <button
                  type="button"
                  onClick={copyBizumPhone}
                  className="mt-3 rounded-full border border-[rgba(107,79,58,0.2)] px-4 py-2 text-sm font-medium text-[#53392B] hover:bg-white transition"
                >
                  {bizumCopied ? "Teléfono copiado" : "Copiar teléfono"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  // ARS: crear un link de pago de Mercado Pago y redirigir al checkout.
  async function handleMercadoPagoLink() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: product!.title,
          unit_price: product!.priceARS,
          quantity: 1,
          product_id: product!.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Error al procesar el pago");

      // Redirigir al link de pago de Mercado Pago.
      // Usar sandbox_init_point para pruebas, init_point para producción
      const url =
        process.env.NODE_ENV === "production"
          ? data.init_point
          : data.sandbox_init_point ?? data.init_point;

      window.location.href = url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const baseStyles = "w-full py-3 rounded-full text-sm font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed";
  const primaryStyles = "bg-[#2C2018] text-white shadow-[0_14px_36px_rgba(44,32,24,0.16)] hover:bg-[#3B2A20]";
  const ghostStyles = "border border-[rgba(107,79,58,0.16)] bg-white/60 text-[#2C2018] backdrop-blur-sm hover:border-[rgba(196,132,106,0.35)] hover:bg-white";

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleMercadoPagoLink}
        disabled={loading}
        className={`${baseStyles} ${variant === "primary" ? primaryStyles : ghostStyles} ${className}`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Procesando...
          </span>
        ) : (
          `Abrir link de pago ${price}`
        )}
      </button>

      {error && (
        <p className="text-xs text-red-500 text-center">{error}</p>
      )}
      <p className="text-xs text-[#7A6A5A] text-center">
        Pago seguro · Link de pago de Mercado Pago
      </p>
    </div>
  );
}
