"use client";

import React, { useEffect, useState } from "react";
import { getProductById, formatPrice } from "@/lib/products";
import { useCurrency } from "@/lib/currency-context";

interface TransferButtonProps {
  productId: string;
  discountPercent?: number; // 0.05 = 5% off
  className?: string;
}

export default function TransferButton({ productId, discountPercent = 0.05, className = "" }: TransferButtonProps) {
  const { currency } = useCurrency();
  const [copiedField, setCopiedField] = useState<"cbu" | "alias" | "full" | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const product = getProductById(productId);
  if (!product) return null;

  const baseAmount = currency === "ARS" ? product.priceARS : product.priceEUR;
  const discounted = Math.round(baseAmount * (1 - discountPercent));

  const displayDiscount = currency === "ARS" ? formatPrice(discounted, "ARS") : formatPrice(discounted, "EUR");

  const bankDetails = {
    holderName: "Dos Santos Micaela",
    bankName: "Banco Galicia",
    cbu: "0000000000000000000000",
    alias: "tu.alias.bancario",
  };

  function copyToClipboard(label: string, value: string) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopiedField(label === "CBU" ? "cbu" : "alias");
        setTimeout(() => setCopiedField(null), 1800);
      })
      .catch(() => {
        alert(`No se pudo copiar ${label}. Copialo manualmente: ${value}`);
      });
  }

  function copyBankDetails() {
    const details = `Transferencia bancaria\nA nombre de: ${bankDetails.holderName}\nBanco: ${bankDetails.bankName}\nCBU: ${bankDetails.cbu}\nAlias: ${bankDetails.alias}\nImporte: ${displayDiscount}`;
    navigator.clipboard
      .writeText(details)
      .then(() => {
        setCopiedField("full");
        setOpen(true);
        setTimeout(() => setCopiedField(null), 1800);
      })
      .catch(() => {
        alert("No se pudo copiar los datos. Por favor copiá manualmente:\n" + details);
      });
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full py-2 rounded-full text-sm font-medium border border-[#C9B9A9] text-[#53392B] hover:bg-[#F5EEE9] transition"
      >
        Transferencia — {displayDiscount} (ahorrás {Math.round(discountPercent * 100)}%)
      </button>
      {open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Cerrar tarjeta de transferencia"
            onClick={() => setOpen(false)}
            className="absolute inset-0"
          />

          <div className="relative z-10 w-full max-w-[42rem] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-[2rem] border border-[#D8C8B9] bg-[#FFF9F4] p-6 shadow-[0_28px_80px_rgba(44,32,24,0.28)] space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#8C6A56] mb-1">Datos bancarios</p>
                <p className="text-sm font-medium text-[#2C2018]">{bankDetails.holderName}</p>
                <p className="text-xs text-[#7A6A5A]">{bankDetails.bankName}</p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-[#C9B9A9] px-3 py-1 text-xs font-medium text-[#53392B] hover:bg-white transition"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-3 rounded-2xl border border-[#E7DBD1] bg-white p-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#8C6A56]">CBU</p>
                <p className="text-sm font-medium text-[#2C2018] break-all">{bankDetails.cbu}</p>
                <button
                  type="button"
                  onClick={() => copyToClipboard("CBU", bankDetails.cbu)}
                  className="mt-2 rounded-full border border-[#C9B9A9] px-4 py-2 text-sm font-medium text-[#53392B] hover:bg-[#F5EEE9] transition"
                >
                  {copiedField === "cbu" ? "¡Copiado!" : "Copiar CBU"}
                </button>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#8C6A56]">Alias</p>
                <p className="text-sm font-medium text-[#2C2018] break-all">{bankDetails.alias}</p>
                <button
                  type="button"
                  onClick={() => copyToClipboard("alias", bankDetails.alias)}
                  className="mt-2 rounded-full border border-[#C9B9A9] px-4 py-2 text-sm font-medium text-[#53392B] hover:bg-[#F5EEE9] transition"
                >
                  {copiedField === "alias" ? "¡Copiado!" : "Copiar alias"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-[#F8F1EB] p-4 space-y-2">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#8C6A56]">Importe a transferir</p>
              <p className="text-lg font-semibold text-[#2C2018]">{displayDiscount}</p>
              <p className="text-xs text-[#7A6A5A]">Transferencia manual con descuento.</p>
            </div>

            <button
              type="button"
              onClick={copyBankDetails}
              className="w-full rounded-full bg-[#2C2018] px-4 py-2 text-sm font-medium text-white hover:bg-[#3B2A20] transition"
            >
              Copiar datos completos y monto
            </button>

            {copiedField === "full" ? (
              <p className="text-xs text-[#2F7A4B] text-center font-medium">Datos completos copiados</p>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="text-xs text-[#7A6A5A] text-center">Abrí la tarjeta para ver tus datos bancarios y copiar lo necesario.</p>
      )}
    </div>
  );
}
