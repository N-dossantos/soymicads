"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useCurrency } from "@/lib/currency-context";
import { getProductById, formatPrice } from "@/lib/products";
import { Portal } from "@/lib/portal";
import { useDialogA11y } from "@/lib/useDialogA11y";

interface PayButtonProps {
  productId: string;
  variant?: "primary" | "ghost";
  className?: string;
}
const rainbowPseudo = [
  "relative isolate overflow-hidden",
  "after:content-[''] after:absolute after:inset-0 after:rounded-full after:z-[-2]",
  "after:bg-[linear-gradient(90deg,#f29d8e,#f6bd8b,#fce594,#a1d2c5,#b3d5ee,#ceafd2)]",
  "before:content-[''] before:absolute before:inset-0 before:rounded-full before:z-[-1]",
  "before:transition-opacity before:duration-200",
].join(" ");


export default function PayButton({
  productId,
  variant = "primary",
  className = "",
}: PayButtonProps) {
  const { currency } = useCurrency();
  const [error, setError] = useState<string | null>(null);
  const [bizumCopied, setBizumCopied] = useState(false);
  const [bizumOpen, setBizumOpen] = useState(false);
  const bizumTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bizumDialogRef = useRef<HTMLDivElement>(null);
  const bizumTitleId = useId();

  const product = getProductById(productId);

  const closeBizum = () => setBizumOpen(false);
  useDialogA11y(bizumOpen, bizumDialogRef, closeBizum);

  useEffect(() => {
    if (bizumOpen || !bizumTimeoutRef.current) return;
    clearTimeout(bizumTimeoutRef.current);
    bizumTimeoutRef.current = null;
  }, [bizumOpen]);

  if (!product) return null;

  const price =
    currency === "ARS"
      ? formatPrice(product.priceMercadoARS ?? product.priceARS, "ARS")
      : formatPrice(product.priceBizumEUR ?? product.priceEUR, "EUR");

  const bizumPhone = process.env.NEXT_PUBLIC_BIZUM_PHONE ?? "664585365"; // Número de teléfono para pagos con Bizum (formato internacional)

  // EUR no usa Mercado Pago. Ese flujo se integrará más adelante.
  if (currency === "EUR") {
    async function copyBizumPhone() {
      try {
        await navigator.clipboard.writeText(bizumPhone);
        setBizumCopied(true);
        bizumTimeoutRef.current = setTimeout(() => setBizumCopied(false), 1800);
      } catch {
        setBizumCopied(false);
      }
    }

    return (
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setBizumOpen(true)}
          className={`${rainbowPseudo} min-h-[44px] flex items-center justify-center w-full py-3 rounded-full text-sm font-medium border border-[rgba(107,79,58,0.14)] text-[#2C2018] backdrop-blur-sm before:bg-white/55 before:opacity-90 hover:before:opacity-40 ${className}`}        >
          Pagar con Bizum {price}
        </button>

        {bizumOpen ? (
          <Portal>
            <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20 p-2 sm:p-4 backdrop-blur-sm">
              <div aria-hidden="true" onClick={closeBizum} className="absolute inset-0" />

              <div
                ref={bizumDialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={bizumTitleId}
                className="relative z-10 w-full max-w-sm max-h-[90dvh] overflow-y-auto rounded-2xl sm:rounded-[2rem] border border-[rgba(107,79,58,0.14)] bg-[#FFF9F4] p-4 sm:p-6 shadow-[0_28px_80px_rgba(44,32,24,0.28)] space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p id={bizumTitleId} className="text-xs uppercase tracking-[0.16em] text-[#8C6A56]">Pago con Bizum</p>
                    <p className="mt-1 text-sm text-[#7A6A5A]">Importe: {price}</p>
                  </div>
                  <button
                    type="button"
                    onClick={closeBizum}
                    className="shrink-0 min-h-[44px] inline-flex items-center justify-center rounded-full border border-[rgba(107,79,58,0.2)] px-4 py-1 text-xs font-medium text-[#53392B] hover:bg-white transition"
                  >
                    Cerrar
                  </button>
                </div>

                <div className="rounded-2xl border border-[rgba(107,79,58,0.14)] bg-white/80 px-4 py-4 text-center">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A56]">Número de Bizum</p>
                  <div className="mt-2 flex items-center justify-center gap-2 text-lg font-semibold text-[#2C2018]">
                    <span className="text-xl leading-none" aria-label="España">🇪🇸</span>
                    <span>664 585 365</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyBizumPhone}
                    className="mt-3 min-h-[44px] inline-flex items-center justify-center rounded-full border border-[rgba(107,79,58,0.2)] px-4 py-2 text-sm font-medium text-[#53392B] hover:bg-white transition"
                  >
                    {bizumCopied ? "Teléfono copiado" : "Copiar teléfono"}
                  </button>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-[#7A6A5A] text-center mb-2">Si ya realizaste el pago</p>
                  <a
                    href={`/pago-en-proceso/transferencia?product=${encodeURIComponent(productId)}`}
                    onClick={() => setBizumOpen(false)}
                    className="min-h-[44px] flex items-center justify-center w-full text-center rounded-full border border-[#C9B9A9] px-4 py-2 text-sm font-medium text-[#53392B] hover:bg-[#F5EEE9] transition"
                  >
                    Enviar comprobante / Continuar →
                  </a>
                </div>
              </div>
            </div>
          </Portal>
        ) : null}
      </div>
    );
  }

  // ARS: abrir link manual de Mercado Pago configurado por producto.
  function handleMercadoPagoLink() {
    if (!product) return;
    setError(null);

    if (!product.mercadoLink) {
      setError("No hay link de pago configurado para este servicio.");
      return;
    }

    window.open(product.mercadoLink, "_blank", "noopener,noreferrer");
    window.location.href = `/pago-en-proceso/link?product=${encodeURIComponent(product.id)}`;
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleMercadoPagoLink}
        className={`${rainbowPseudo} min-h-[44px] flex items-center justify-center w-full py-3 rounded-full text-sm font-medium border border-[rgba(107,79,58,0.14)] text-[#2C2018] backdrop-blur-sm before:bg-white/55 before:opacity-90 hover:before:opacity-40 ${className}`}
      >
        {`Abrir link de pago ${price}`}
      </button>

      {error && (
        <p role="alert" className="text-xs text-red-500 text-center">{error}</p>
      )}
      <p className="text-xs text-[#7A6A5A] text-center">
        Pago seguro · Link de pago de Mercado Pago
      </p>
    </div>
  );
}
