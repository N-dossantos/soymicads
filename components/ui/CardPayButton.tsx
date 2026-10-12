"use client";

import { useState } from "react";
import { formatPrice, getCardPriceEUR, getProductById } from "@/lib/products";

interface CardPayButtonProps {
  productId: string;
  className?: string;
}

const rainbowPseudo = [
  "relative isolate overflow-hidden",
  "after:content-[''] after:absolute after:inset-0 after:rounded-full after:z-[-2]",
  "after:bg-[linear-gradient(90deg,#f29d8e,#f6bd8b,#fce594,#a1d2c5,#b3d5ee,#ceafd2)]",
  "before:content-[''] before:absolute before:inset-0 before:rounded-full before:z-[-1]",
  "before:transition-opacity before:duration-200",
].join(" ");

// Pago con tarjeta (crédito o débito) en EUR: crea una Checkout Session de
// Stripe y redirige a su página de pago.
export default function CardPayButton({ productId, className = "" }: CardPayButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const product = getProductById(productId);
  if (!product) return null;

  const price = formatPrice(getCardPriceEUR(product), "EUR");

  async function handleCardCheckout() {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.url) {
        setError(data?.error ?? "No se pudo iniciar el pago. Intentá de nuevo.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("No se pudo iniciar el pago. Intentá de nuevo.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleCardCheckout}
        disabled={loading}
        className={`${rainbowPseudo} min-h-[44px] flex items-center justify-center w-full py-3 rounded-full text-sm font-medium border border-[rgba(107,79,58,0.14)] text-[#2C2018] backdrop-blur-sm before:bg-white/55 before:opacity-90 hover:before:opacity-40 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? "Redirigiendo al pago…" : `Pagar con tarjeta ${price}`}
      </button>

      {error && (
        <p role="alert" className="text-xs text-red-500 text-center">{error}</p>
      )}
      <p className="text-xs text-[#7A6A5A] text-center">
        Crédito o débito · Pago seguro con Stripe
      </p>
    </div>
  );
}
