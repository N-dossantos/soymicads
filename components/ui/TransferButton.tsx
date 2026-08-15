"use client";

import { useEffect, useId, useRef, useState } from "react";
import { getProductById, formatPrice } from "@/lib/products";
import { useCurrency } from "@/lib/currency-context";
import { Portal } from "@/lib/portal";
import { useDialogA11y } from "@/lib/useDialogA11y";


interface TransferButtonProps {
  productId: string;
  className?: string;
  // Corre antes de abrir el modal (p. ej. para validar un formulario externo,
  // como los datos del regalo). Si devuelve false, el modal no se abre.
  // No se llama al cerrar, así siempre se puede cerrar el modal.
  onBeforeOpen?: () => boolean;
  // Corre cuando se hace click en "Enviar comprobante / Continuar", después
  // de ver los datos bancarios (p. ej. para avisar por WhatsApp).
  onContinue?: () => void;
  // Deshabilita el botón (p. ej. mientras otro medio de pago del mismo form
  // tiene una petición en curso, para evitar acciones en conflicto).
  disabled?: boolean;
}

export default function TransferButton({
  productId,
  className = "",
  onBeforeOpen,
  onContinue,
  disabled = false,
}: TransferButtonProps) {
  const { currency } = useCurrency();
  const [copiedField, setCopiedField] = useState<"cbu" | "alias" | "iban" | "beneficiario" | "full" | null>(null);
  const [open, setOpen] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const closeDialog = () => setOpen(false);
  useDialogA11y(open, dialogRef, closeDialog);

  useEffect(() => {
    if (open || !copyTimeoutRef.current) return;
    clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = null;
  }, [open]);

  // El producto puede no estar elegido todavía (p. ej. en la gift card, antes
  // de seleccionar la propuesta): igual mostramos el botón, sin precio, y que
  // onBeforeOpen se encargue de bloquear la apertura con el error del form.
  const product = getProductById(productId);

  // Use explicit transfer price when available, otherwise fallback to generic price
  const displayPriceNumber = product
    ? (currency === "ARS" ? (product.priceTransferARS ?? product.priceARS) : (product.priceTransferEUR ?? product.priceEUR))
    : null;
  const displayPrice = displayPriceNumber != null ? formatPrice(displayPriceNumber, currency) : null;

  const bankDetailsARS = {
    holderName: "Dos Santos Micaela",
    bankName: "Banco Galicia",
    cbu: "0070179830004083672968",
    alias: "soymicaeladossantos",
  };

  const bankDetailsEUR = {
    holderName: "Dos Santos Micaela",
    bankName: "Banco BBVA",
    iban: "ES07 0182 4003 1802 0164 3124",
    bic: "BBVAESMM",
    beneficiario: "Micaela Maria Dos Santos",
  };

  const headerHolderName = currency === "ARS" ? bankDetailsARS.holderName : bankDetailsEUR.holderName;
  const headerBankName = currency === "ARS" ? bankDetailsARS.bankName : bankDetailsEUR.bankName;

  function copyToClipboard(label: string, value: string) {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        if (label === "CBU") setCopiedField("cbu");
        else if (label === "IBAN") setCopiedField("iban");
        else setCopiedField("beneficiario");
        copyTimeoutRef.current = setTimeout(() => setCopiedField(null), 1800);
      })
      .catch(() => {
        alert(`No se pudo copiar ${label}. Copialo manualmente: ${value}`);
      });
  }

  function copyBankDetails() {
    let details = "";
    if (currency === "ARS") {
      details = `Transferencia bancaria\nA nombre de: ${bankDetailsARS.holderName}\nBanco: ${bankDetailsARS.bankName}\nCBU: ${bankDetailsARS.cbu}\nAlias: ${bankDetailsARS.alias}\nImporte: ${displayPrice}`;
    } else {
      // EUR
      details = `Transferencia bancaria\nA nombre de: ${bankDetailsEUR.holderName}\nBanco: ${bankDetailsEUR.bankName}\nIBAN: ${bankDetailsEUR.iban}\nBIC: ${bankDetailsEUR.bic}\nBeneficiario: ${bankDetailsEUR.beneficiario}\nImporte: ${displayPrice}`;
    }
    navigator.clipboard
      .writeText(details)
      .then(() => {
        setCopiedField("full");
        setOpen(true);
        copyTimeoutRef.current = setTimeout(() => setCopiedField(null), 1800);
      })
      .catch(() => {
        alert("No se pudo copiar los datos. Por favor copiá manualmente:\n" + details);
      });
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (open) {
            setOpen(false);
            return;
          }
          if (onBeforeOpen && !onBeforeOpen()) return;
          setOpen(true);
        }}
        className="min-h-[44px] flex items-center justify-center w-full py-2.5 rounded-full text-sm font-medium border border-[#C9B9A9]/60 text-[#53392B] bg-white/40 hover:bg-[#F5EEE9]/60 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Transferencia{displayPrice ? ` — ${displayPrice}` : ""}
      </button>

      {open ? (
        <Portal>
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20 p-2 sm:p-4 backdrop-blur-sm">
            <div aria-hidden="true" onClick={closeDialog} className="absolute inset-0" />

            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative z-10 w-full max-w-md sm:max-w-lg max-h-[90dvh] overflow-y-auto rounded-2xl sm:rounded-[2rem] border border-[#D8C8B9] bg-[#FFF9F4] p-4 sm:p-6 shadow-[0_28px_80px_rgba(44,32,24,0.28)] space-y-4 sm:space-y-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p id={titleId} className="text-xs uppercase tracking-[0.18em] text-[#8C6A56] mb-1">Datos bancarios</p>
                  <p className="text-sm font-medium text-[#2C2018] truncate">{headerHolderName}</p>
                  <p className="text-xs text-[#7A6A5A]">{headerBankName}</p>
                </div>

                <button
                  type="button"
                  onClick={closeDialog}
                  className="shrink-0 min-h-[44px] inline-flex items-center justify-center rounded-full border border-[#C9B9A9] px-4 py-1 text-xs font-medium text-[#53392B] hover:bg-white transition"
                >
                  Cerrar
                </button>
              </div>

              <div className="space-y-3 rounded-2xl border border-[#E7DBD1] bg-white p-4">
                {currency === "ARS" ? (
                  <>
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A56]">CBU</p>
                      <p className="mt-1 text-sm font-medium text-[#2C2018] break-all select-all">{bankDetailsARS.cbu}</p>
                      <button
                        type="button"
                        onClick={() => copyToClipboard("CBU", bankDetailsARS.cbu)}
                        className="mt-2 min-h-[44px] inline-flex items-center justify-center rounded-full border border-[#C9B9A9] px-4 py-2 text-sm font-medium text-[#53392B] hover:bg-[#F5EEE9] transition"
                      >
                        {copiedField === "cbu" ? "¡Copiado!" : "Copiar CBU"}
                      </button>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A56]">Alias</p>
                      <p className="mt-1 text-sm font-medium text-[#2C2018] break-all select-all">{bankDetailsARS.alias}</p>
                      <button
                        type="button"
                        onClick={() => copyToClipboard("alias", bankDetailsARS.alias)}
                        className="mt-2 min-h-[44px] inline-flex items-center justify-center rounded-full border border-[#C9B9A9] px-4 py-2 text-sm font-medium text-[#53392B] hover:bg-[#F5EEE9] transition"
                      >
                        {copiedField === "alias" ? "¡Copiado!" : "Copiar alias"}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A56]">IBAN</p>
                      <p className="mt-1 text-sm font-medium text-[#2C2018] break-all select-all">{bankDetailsEUR.iban}</p>
                      <button
                        type="button"
                        onClick={() => copyToClipboard("IBAN", bankDetailsEUR.iban)}
                        className="mt-2 min-h-[44px] inline-flex items-center justify-center rounded-full border border-[#C9B9A9] px-4 py-2 text-sm font-medium text-[#53392B] hover:bg-[#F5EEE9] transition"
                      >
                        {copiedField === "iban" ? "¡Copiado!" : "Copiar IBAN"}
                      </button>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A56]">BIC</p>
                      <p className="mt-1 text-sm font-medium text-[#2C2018] break-all select-all">{bankDetailsEUR.bic}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A56]">Beneficiario</p>
                      <p className="mt-1 text-sm font-medium text-[#2C2018] break-all select-all">{bankDetailsEUR.beneficiario}</p>
                      <button
                        type="button"
                        onClick={() => copyToClipboard("beneficiario", bankDetailsEUR.beneficiario)}
                        className="mt-2 min-h-[44px] inline-flex items-center justify-center rounded-full border border-[#C9B9A9] px-4 py-2 text-sm font-medium text-[#53392B] hover:bg-[#F5EEE9] transition"
                      >
                        {copiedField === "beneficiario" ? "¡Copiado!" : "Copiar beneficiario"}
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="rounded-2xl bg-[#F8F1EB] p-4 space-y-2">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A56]">Importe a transferir</p>
                <p className="text-lg font-semibold text-[#2C2018]">{displayPrice}</p>
              </div>

                <button
                  type="button"
                  onClick={copyBankDetails}
                  className="min-h-[44px] flex items-center justify-center w-full rounded-full bg-[#2C2018] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3B2A20] transition"
                >
                  {copiedField === "full" ? "¡Datos copiados!" : "Copiar datos completos y monto"}
                </button>

                <div className="mt-4">
                  <p className="text-sm text-[#7A6A5A] text-center mb-2">Si ya realizaste el pago</p>
                  <a
                    href={`/pago-en-proceso/transferencia?product=${encodeURIComponent(productId)}`}
                    onClick={() => {
                      setOpen(false);
                      onContinue?.();
                    }}
                    className="min-h-[44px] flex items-center justify-center w-full text-center rounded-full border border-[#C9B9A9] px-4 py-2 text-sm font-medium text-[#53392B] hover:bg-[#F5EEE9] transition"
                  >
                    Enviar comprobante / Continuar →
                  </a>
                </div>
            </div>
          </div>
        </Portal>
      ) : (
        <p className="text-xs text-[#7A6A5A] text-center">Abrí la tarjeta para ver tus datos bancarios y copiar lo necesario.</p>
      )}
    </div>
  );
}
