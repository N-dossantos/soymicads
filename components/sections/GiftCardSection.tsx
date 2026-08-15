"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useCurrency } from "@/lib/currency-context";
import { Portal } from "@/lib/portal";
import { useDialogA11y } from "@/lib/useDialogA11y";
import { WHATSAPP_PHONE, whatsappHref } from "@/lib/contact";
import TransferButton from "@/components/ui/TransferButton";
import {
  EMPTY_GIFT_CARD_DETAILS,
  GIFT_FIELD_LIMITS,
  buildGiftWhatsAppMessage,
  formatGiftPrice,
  getGiftRedeemLabel,
  getGiftableProducts,
  validateGiftCardDetails,
  type GiftCardDetails,
  type GiftCardErrors,
} from "@/lib/gift-card";

const rainbowPseudo = [
  "relative isolate overflow-hidden inline-flex items-center justify-center transition-all duration-300",
  "after:content-[''] after:absolute after:inset-0 after:rounded-full after:z-[-2]",
  "after:bg-[linear-gradient(90deg,#f29d8e,#f6bd8b,#fce594,#a1d2c5,#b3d5ee,#ceafd2)]",
  "before:content-[''] before:absolute before:inset-0 before:rounded-full before:z-[-1]",
  "before:transition-opacity before:duration-200",
].join(" ");

const fieldClass =
  "w-full min-h-[44px] rounded-2xl border border-[rgba(107,79,58,0.16)] bg-white/80 px-4 py-3 text-[15px] text-[#2C2018] placeholder:text-[#A8968A] shadow-sm outline-none transition focus:border-[rgba(196,132,106,0.55)] focus:ring-2 focus:ring-[rgba(196,132,106,0.25)] aria-[invalid=true]:border-[#D08C7E] aria-[invalid=true]:ring-[rgba(208,140,126,0.2)]";

const labelClass = "block text-sm font-medium text-[#53392B] mb-1.5";


// Renglón "PARA: ____" del voucher: el rótulo va arriba y el valor se apoya
// sobre el renglón subrayado debajo, como un espacio para completar a mano.
function GiftCardLine({
  label,
  value,
  placeholder,
}: {
  label: string;
  value: string;
  placeholder: string;
}) {
  return (
    <div>
      <p className="text-[clamp(9px,1.4vw,12px)] uppercase tracking-[0.2em] text-[#111]">{label}</p>
      <p
        className={`mt-1.5 truncate border-b border-[#111] pb-1.5 text-[clamp(13px,2.4vw,19px)] uppercase leading-tight tracking-[0.16em] ${
          value ? "text-[#111]" : "text-[#BDB4C2]"
        }`}
      >
        {value || placeholder}
      </p>
    </div>
  );
}

export default function GiftCardSection() {
  const { currency, mounted } = useCurrency();
  const products = useMemo(() => getGiftableProducts(), []);

  const [details, setDetails] = useState<GiftCardDetails>(EMPTY_GIFT_CARD_DETAILS);
  const [errors, setErrors] = useState<GiftCardErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bizumOpen, setBizumOpen] = useState(false);
  const [bizumCopied, setBizumCopied] = useState(false);

  const bizumDialogRef = useRef<HTMLDivElement>(null);
  const bizumTitleId = useId();
  const formId = useId();

  const closeBizum = () => setBizumOpen(false);
  useDialogA11y(bizumOpen, bizumDialogRef, closeBizum);

  const selectedProduct = products.find((p) => p.id === details.productId);
  const bizumPhone = process.env.NEXT_PUBLIC_BIZUM_PHONE ?? "664585365";

  // El precio depende de la moneda persistida en localStorage, así que hasta
  // que el provider monte mostramos un placeholder para no romper la hidratación.
  const priceLabel = (productId: string): string | null => {
    if (!mounted) return null;
    const product = products.find((p) => p.id === productId);
    return product ? formatGiftPrice(product, currency) : null;
  };

  const selectedPriceLabel = selectedProduct ? priceLabel(selectedProduct.id) : null;

  function update<K extends keyof GiftCardDetails>(key: K, value: GiftCardDetails[K]) {
    setDetails((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
    setSubmitError(null);
  }

  function fieldId(name: keyof GiftCardDetails) {
    return `${formId}-${name}`;
  }

  function errorId(name: keyof GiftCardDetails) {
    return `${formId}-${name}-error`;
  }

  function validateOrShowErrors(): boolean {
    const nextErrors = validateGiftCardDetails(details);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) return true;

    const firstKey = Object.keys(nextErrors)[0] as keyof GiftCardDetails;
    document.getElementById(fieldId(firstKey))?.focus();
    return false;
  }

  function giftMessage(): string {
    if (!selectedProduct) return "";
    return buildGiftWhatsAppMessage(details, selectedProduct, selectedPriceLabel ?? "");
  }

  // ARS → Checkout Pro de Mercado Pago, con los datos del regalo viajando como
  // metadata de la preferencia. Además abrimos WhatsApp para que a Mica le
  // llegue el aviso aunque el pago se acredite más tarde.
  async function handleMercadoPago() {
    if (!validateOrShowErrors()) return;

    // El window.open tiene que salir del gesto del usuario, así que abrimos la
    // pestaña ya mismo y recién le damos destino cuando la preferencia existe.
    const giftTab = window.open("", "_blank");
    setSubmitError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/gift-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.initPoint) {
        giftTab?.close();
        setSubmitError(data?.error ?? "No se pudo iniciar el pago. Intentá de nuevo.");
        setLoading(false);
        return;
      }

      if (giftTab) {
        giftTab.location.href = whatsappHref(giftMessage());
      }
      window.location.href = data.initPoint;
    } catch {
      giftTab?.close();
      setSubmitError("No se pudo iniciar el pago. Intentá de nuevo.");
      setLoading(false);
    }
  }

  // EUR → no hay checkout automático: mostramos el número de Bizum y el aviso
  // por WhatsApp queda como acción principal dentro del modal.
  function handleBizum() {
    if (!validateOrShowErrors()) return;
    setBizumOpen(true);
  }

  async function copyBizumPhone() {
    try {
      await navigator.clipboard.writeText(bizumPhone);
      setBizumCopied(true);
      setTimeout(() => setBizumCopied(false), 1800);
    } catch {
      setBizumCopied(false);
    }
  }

  const recipientName = details.recipientName.trim();
  const buyerName = details.buyerName.trim();
  const dedication = details.message.trim();
  const redeemLabel = getGiftRedeemLabel(details.productId);

  // Antes de abrir el modal de transferencia: solo validamos el form.
  function handleTransferOpen(): boolean {
    return validateOrShowErrors();
  }

  // Al confirmar "Enviar comprobante / Continuar" (ya vio los datos
  // bancarios): recién ahí avisamos por WhatsApp, ya que la transferencia no
  // tiene forma automática de notificarnos como Mercado Pago/Bizum.
  function handleTransferContinue() {
    window.open(whatsappHref(giftMessage()), "_blank", "noopener,noreferrer");
  }

  return (
    <section id="regalar" className="relative py-20 px-4 sm:px-6 overflow-hidden">
      <div className="absolute left-1/2 top-24 -translate-x-1/2 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(246,192,207,0.28)_0%,_rgba(252,229,148,0.2)_50%,_transparent_70%)] blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-6xl relative">
        <div className="text-center mb-10 sm:mb-12">
          <p className="section-kicker mb-3">Tarjeta de regalo</p>
          <h2 className="section-title text-[clamp(20px,4vw,44px)] font-medium leading-tight mb-4">
            REGALÁ EXPERIENCIAS
          </h2>
          <p className="mx-auto max-w-xl text-[15px] sm:text-[16px] leading-relaxed text-[#4A3556]">
            Elegi la propuesta, dejanos tus datos y los de la persona agasajada. Cuando el pago se acredita, 
            coordinamos con vos la entrega y esa persona agenda su sesión cuando se sienta lista
            Si querés armas algo más personalizado, mandame wpp y lo vemos! <br/>
            (Tiene una validez de 6 meses desde que se entrega el regalo)
          </p>
        </div>

        {/* Las dos cards viven dentro del mismo form: la de arriba junta los
            datos y la de abajo (preview + pago) dispara el submit. */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currency === "ARS") {
              void handleMercadoPago();
            } else {
              handleBizum();
            }
          }}
          noValidate
          className="space-y-6 sm:space-y-8"
        >
          {/* ── 1. Datos del regalo ─────────────────────────────────────── */}
          <div className="premium-card rounded-[2rem] p-5 sm:p-8 lg:p-10">
            <fieldset>
              <legend className={labelClass}>¿Qué querés regalar?</legend>
              <div
                className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4"
                role="radiogroup"
                aria-describedby={errors.productId ? errorId("productId") : undefined}
              >
                {products.map((product, index) => {
                  const selected = details.productId === product.id;
                  const label = priceLabel(product.id);
                  return (
                    <label
                      key={product.id}
                      className={`relative flex cursor-pointer flex-col rounded-2xl border p-4 transition-all duration-200 ${
                        selected
                          ? "border-[rgba(196,132,106,0.55)] bg-white shadow-[0_14px_38px_rgba(44,32,24,0.1)]"
                          : "border-[rgba(107,79,58,0.14)] bg-white/60 hover:bg-white/85"
                      } has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[rgba(196,132,106,0.6)]`}
                    >
                      <input
                        type="radio"
                        name="gift-product"
                        value={product.id}
                        id={index === 0 ? fieldId("productId") : undefined}
                        checked={selected}
                        onChange={() => update("productId", product.id)}
                        className="sr-only"
                      />
                      <span className="text-[14px] font-medium leading-snug text-[#2C2018]">
                        {product.title}
                      </span>
                      <span className="mt-1 text-[12px] leading-relaxed text-[#7A6A5A]">
                        {product.description}
                      </span>
                      <span className="mt-auto pt-3">
                        {label ? (
                          <span className="font-serif text-lg text-[#53392B]">{label}</span>
                        ) : (
                          <span className="block h-5 w-16 animate-pulse rounded-full bg-[rgba(107,79,58,0.12)]" />
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.productId ? (
                <p id={errorId("productId")} role="alert" className="mt-2 text-xs text-[#C0574A]">
                  {errors.productId}
                </p>
              ) : null}
            </fieldset>

            <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-10">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A56]">Quien regala</p>

                <div>
                  <label htmlFor={fieldId("buyerName")} className={labelClass}>
                    Tu nombre y apellido
                  </label>
                  <input
                    id={fieldId("buyerName")}
                    type="text"
                    autoComplete="name"
                    maxLength={GIFT_FIELD_LIMITS.buyerName}
                    value={details.buyerName}
                    onChange={(e) => update("buyerName", e.target.value)}
                    aria-invalid={Boolean(errors.buyerName)}
                    aria-describedby={errors.buyerName ? errorId("buyerName") : undefined}
                    className={fieldClass}
                    placeholder="Cómo te llamás"
                  />
                  {errors.buyerName ? (
                    <p id={errorId("buyerName")} role="alert" className="mt-1.5 text-xs text-[#C0574A]">
                      {errors.buyerName}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor={fieldId("buyerEmail")} className={labelClass}>
                      Tu email
                    </label>
                    <input
                      id={fieldId("buyerEmail")}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      maxLength={GIFT_FIELD_LIMITS.buyerEmail}
                      value={details.buyerEmail}
                      onChange={(e) => update("buyerEmail", e.target.value)}
                      aria-invalid={Boolean(errors.buyerEmail)}
                      aria-describedby={errors.buyerEmail ? errorId("buyerEmail") : undefined}
                      className={fieldClass}
                      placeholder="tunombre@mail.com"
                    />
                    {errors.buyerEmail ? (
                      <p id={errorId("buyerEmail")} role="alert" className="mt-1.5 text-xs text-[#C0574A]">
                        {errors.buyerEmail}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor={fieldId("buyerPhone")} className={labelClass}>
                      Tu WhatsApp
                    </label>
                    <input
                      id={fieldId("buyerPhone")}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      maxLength={GIFT_FIELD_LIMITS.buyerPhone}
                      value={details.buyerPhone}
                      onChange={(e) => update("buyerPhone", e.target.value)}
                      aria-invalid={Boolean(errors.buyerPhone)}
                      aria-describedby={errors.buyerPhone ? errorId("buyerPhone") : undefined}
                      className={fieldClass}
                      placeholder="+54 9 11 …"
                    />
                    {errors.buyerPhone ? (
                      <p id={errorId("buyerPhone")} role="alert" className="mt-1.5 text-xs text-[#C0574A]">
                        {errors.buyerPhone}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="space-y-4 lg:border-l lg:border-[rgba(107,79,58,0.12)] lg:pl-10">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A56]">Quien recibe</p>

                <div>
                  <label htmlFor={fieldId("recipientName")} className={labelClass}>
                    Nombre de la persona agasajada
                  </label>
                  <input
                    id={fieldId("recipientName")}
                    type="text"
                    maxLength={GIFT_FIELD_LIMITS.recipientName}
                    value={details.recipientName}
                    onChange={(e) => update("recipientName", e.target.value)}
                    aria-invalid={Boolean(errors.recipientName)}
                    aria-describedby={errors.recipientName ? errorId("recipientName") : undefined}
                    className={fieldClass}
                    placeholder="Para quién es el regalo"
                  />
                  {errors.recipientName ? (
                    <p id={errorId("recipientName")} role="alert" className="mt-1.5 text-xs text-[#C0574A]">
                      {errors.recipientName}
                    </p>
                  ) : null}
                </div>

                <fieldset>
                  <legend className={labelClass}>¿Cómo te gustaría hacer la entrega?</legend>
                  <div
                    className="grid gap-2.5 sm:grid-cols-2"
                    role="radiogroup"
                    aria-describedby={errors.deliveryMethod ? errorId("deliveryMethod") : undefined}
                  >
                    {(
                      [
                        {
                          value: "self",
                          label: "Prefiero coordinarlo yo",
                          hint: "Vos te encargás de hacérselo llegar; coordinamos entre nosotras los detalles.",
                        },
                        {
                          value: "gift",
                          label: "Quiero que se lo envíen de regalo",
                          hint: "Nosotras coordinamos la entrega directamente con quien recibe.",
                        },
                      ] as const
                    ).map((option, index) => {
                      const selected = details.deliveryMethod === option.value;
                      return (
                        <label
                          key={option.value}
                          className={`relative flex cursor-pointer flex-col rounded-2xl border p-4 transition-all duration-200 ${
                            selected
                              ? "border-[rgba(196,132,106,0.55)] bg-white shadow-[0_14px_38px_rgba(44,32,24,0.1)]"
                              : "border-[rgba(107,79,58,0.14)] bg-white/60 hover:bg-white/85"
                          } has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[rgba(196,132,106,0.6)]`}
                        >
                          <input
                            type="radio"
                            name="gift-delivery-method"
                            value={option.value}
                            id={index === 0 ? fieldId("deliveryMethod") : undefined}
                            checked={selected}
                            onChange={() => update("deliveryMethod", option.value)}
                            className="sr-only"
                          />
                          <span className="text-[14px] font-medium leading-snug text-[#2C2018]">
                            {option.label}
                          </span>
                          <span className="mt-1 text-[12px] leading-relaxed text-[#7A6A5A]">
                            {option.hint}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.deliveryMethod ? (
                    <p id={errorId("deliveryMethod")} role="alert" className="mt-2 text-xs text-[#C0574A]">
                      {errors.deliveryMethod}
                    </p>
                  ) : null}
                </fieldset>

                {details.deliveryMethod === "gift" ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor={fieldId("recipientEmail")} className={labelClass}>
                          Su email
                        </label>
                        <input
                          id={fieldId("recipientEmail")}
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          maxLength={GIFT_FIELD_LIMITS.recipientEmail}
                          value={details.recipientEmail}
                          onChange={(e) => update("recipientEmail", e.target.value)}
                          aria-invalid={Boolean(errors.recipientEmail)}
                          aria-describedby={errors.recipientEmail ? errorId("recipientEmail") : undefined}
                          className={fieldClass}
                          placeholder="sunombre@mail.com"
                        />
                        {errors.recipientEmail ? (
                          <p id={errorId("recipientEmail")} role="alert" className="mt-1.5 text-xs text-[#C0574A]">
                            {errors.recipientEmail}
                          </p>
                        ) : null}
                      </div>

                      <div>
                        <label htmlFor={fieldId("recipientPhone")} className={labelClass}>
                          Su WhatsApp
                        </label>
                        <input
                          id={fieldId("recipientPhone")}
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          maxLength={GIFT_FIELD_LIMITS.recipientPhone}
                          value={details.recipientPhone}
                          onChange={(e) => update("recipientPhone", e.target.value)}
                          aria-invalid={Boolean(errors.recipientPhone)}
                          aria-describedby={errors.recipientPhone ? errorId("recipientPhone") : undefined}
                          className={fieldClass}
                          placeholder="+54 9 11 …"
                        />
                        {errors.recipientPhone ? (
                          <p id={errorId("recipientPhone")} role="alert" className="mt-1.5 text-xs text-[#C0574A]">
                            {errors.recipientPhone}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div>
                      <label htmlFor={fieldId("deliveryDate")} className={labelClass}>
                        Fecha en la que te gustaría que le llegue
                      </label>
                      <input
                        id={fieldId("deliveryDate")}
                        type="date"
                        value={details.deliveryDate}
                        onChange={(e) => update("deliveryDate", e.target.value)}
                        aria-invalid={Boolean(errors.deliveryDate)}
                        aria-describedby={errors.deliveryDate ? errorId("deliveryDate") : undefined}
                        className={fieldClass}
                      />
                      {errors.deliveryDate ? (
                        <p id={errorId("deliveryDate")} role="alert" className="mt-1.5 text-xs text-[#C0574A]">
                          {errors.deliveryDate}
                        </p>
                      ) : null}
                    </div>
                  </>
                ) : null}

                <div>
                  <label htmlFor={fieldId("message")} className={labelClass}>
                    Dedicatoria <span className="font-normal text-[#8C6A56]">(opcional)</span>
                  </label>
                  <textarea
                    id={fieldId("message")}
                    rows={3}
                    maxLength={GIFT_FIELD_LIMITS.message}
                    value={details.message}
                    onChange={(e) => update("message", e.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? errorId("message") : undefined}
                    className={`${fieldClass} resize-none`}
                    placeholder="Unas palabras para acompañar el regalo…"
                  />
                  <div className="mt-1.5 flex items-start justify-between gap-3">
                    {errors.message ? (
                      <p id={errorId("message")} role="alert" className="text-xs text-[#C0574A]">
                        {errors.message}
                      </p>
                    ) : (
                      <span />
                    )}
                    <span className="shrink-0 text-xs text-[#8C6A56]">
                      {details.message.length}/{GIFT_FIELD_LIMITS.message}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2. Vista previa en vivo del voucher + pago ──────────────── */}
          <div className="premium-card rounded-[2rem] p-5 sm:p-8 lg:p-10">
            <p className="mb-5 text-center text-xs uppercase tracking-[0.16em] text-[#8C6A56]">
              Así se va a ver tu tarjeta
            </p>

            {/* Réplica del arte impreso: aura de prisma + voucher blanco, centrada sola arriba. */}
            <div className="mx-auto max-w-xl">
              <div className="giftcard-aura overflow-hidden rounded-[1.5rem] p-4 pb-3 sm:p-7 sm:pb-5 shadow-[0_24px_64px_rgba(44,32,24,0.18)]">
                <div className="relative bg-white px-5 py-7 sm:px-9 sm:py-9 shadow-[0_10px_40px_rgba(40,34,70,0.14)]">

                  <p className="text-center font-serif text-[clamp(32px,6.4vw,58px)] font-normal leading-[1.05] text-[#111]">
                    Gift Card
                  </p>

                  <div className="mt-7 flex items-start gap-4 sm:mt-10 sm:gap-8">
                    <div className={`space-y-5 sm:space-y-6 ${dedication ? "w-1/2" : "w-full"}`}>
                      <GiftCardLine label="Para:" value={recipientName} placeholder="Su nombre" />
                      <GiftCardLine label="De:" value={buyerName} placeholder="Tu nombre" />
                    </div>

                    {dedication ? (
                      <div className="flex min-w-0 flex-1 items-center">
                        <p className="font-serif text-[13px] italic leading-relaxed text-[#3A3040] sm:text-[15px]">
                          “{dedication}”
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-6 text-left text-[clamp(9px,1.5vw,13px)] uppercase leading-[1.7] tracking-[0.14em] text-[#111] sm:mt-8">
                    <p>
                      Vale por:{" "}
                      <span className={selectedProduct ? "" : "text-[#BDB4C2]"}>
                        {redeemLabel ?? "la propuesta que elijas"}
                      </span>
                    </p>
                    <p className="mt-3">(Tenés 6 meses para usarlo)</p>
                    <p>Contacto: +{WHATSAPP_PHONE}</p>
                  </div>
                </div>

                <p className="mt-4 text-center font-serif text-[clamp(17px,3vw,24px)] leading-none text-white sm:mt-5">
                  <span className="font-semibold">soymicads</span>
                  <span aria-hidden="true" className="ml-1 align-super text-[0.5em]">
                    ✦
                  </span>
                </p>
              </div>
            </div>

            {/* Tres botones de pago, con Mercado Pago/Bizum al centro. */}
            <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-3 sm:items-start">
              <TransferButton
                productId={details.productId}
                onBeforeOpen={handleTransferOpen}
                onContinue={handleTransferContinue}
                disabled={loading}
              />

              <div className="space-y-3">
                {!mounted ? (
                  <span className="block h-[44px] w-full animate-pulse rounded-full bg-[rgba(107,79,58,0.1)]" />
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className={`${rainbowPseudo} min-h-[44px] w-full rounded-full py-2.5 text-sm font-medium text-[#2C2018] border border-[rgba(107,79,58,0.14)] shadow-md backdrop-blur-sm before:bg-white/55 before:opacity-90 hover:before:opacity-40 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {loading
                      ? "Redirigiendo a Mercado Pago…"
                      : currency === "ARS"
                        ? `Regalar con Mercado Pago${selectedPriceLabel ? ` ${selectedPriceLabel}` : ""}`
                        : `Regalar con Bizum${selectedPriceLabel ? ` ${selectedPriceLabel}` : ""}`}
                  </button>
                )}

                {submitError ? (
                  <p role="alert" className="text-center text-xs text-[#C0574A]">
                    {submitError}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  if (!validateOrShowErrors()) return;
                  window.open(whatsappHref(giftMessage()), "_blank", "noopener,noreferrer");
                }}
                className="min-h-[44px] w-full rounded-full border border-[#C9B9A9] px-4 py-2.5 text-sm font-medium text-[#53392B] transition hover:bg-[#F5EEE9] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Coordinarlo por WhatsApp →
              </button>
            </div>
          </div>
        </form>
      </div>

      {bizumOpen ? (
        <Portal>
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20 p-2 sm:p-4 backdrop-blur-sm">
            <div aria-hidden="true" onClick={closeBizum} className="absolute inset-0" />

            <div
              ref={bizumDialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={bizumTitleId}
              className="relative z-10 w-full max-w-sm max-h-[90dvh] space-y-4 overflow-y-auto rounded-2xl border border-[rgba(107,79,58,0.14)] bg-[#FFF9F4] p-4 shadow-[0_28px_80px_rgba(44,32,24,0.28)] sm:rounded-[2rem] sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p id={bizumTitleId} className="text-xs uppercase tracking-[0.16em] text-[#8C6A56]">
                    Regalo con Bizum
                  </p>
                  <p className="mt-1 text-sm text-[#7A6A5A]">
                    Importe: {selectedPriceLabel ?? "—"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeBizum}
                  className="min-h-[44px] shrink-0 inline-flex items-center justify-center rounded-full border border-[rgba(107,79,58,0.2)] px-4 py-1 text-xs font-medium text-[#53392B] transition hover:bg-white"
                >
                  Cerrar
                </button>
              </div>

              <div className="rounded-2xl border border-[rgba(107,79,58,0.14)] bg-white/80 px-4 py-4 text-center">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A56]">Número de Bizum</p>
                <div className="mt-2 flex items-center justify-center gap-2 text-lg font-semibold text-[#2C2018]">
                  <span className="text-xl leading-none" aria-label="España">
                    🇪🇸
                  </span>
                  <span>{bizumPhone}</span>
                </div>
                <button
                  type="button"
                  onClick={copyBizumPhone}
                  className="mt-3 min-h-[44px] inline-flex items-center justify-center rounded-full border border-[rgba(107,79,58,0.2)] px-4 py-2 text-sm font-medium text-[#53392B] transition hover:bg-white"
                >
                  {bizumCopied ? "Teléfono copiado" : "Copiar teléfono"}
                </button>
              </div>

              <div className="rounded-2xl border border-[rgba(107,79,58,0.14)] bg-white/60 px-4 py-3 text-left">
                <p className="text-xs uppercase tracking-[0.16em] text-[#8C6A56]">El regalo</p>
                <p className="mt-1 text-sm text-[#2C2018]">
                  {selectedProduct?.title} para {recipientName}
                </p>
              </div>

              <a
                href={whatsappHref(giftMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[48px] flex w-full items-center justify-center rounded-full bg-[#25D366] px-4 py-3 text-sm font-medium text-white shadow-[0_14px_34px_rgba(37,211,102,0.35)] transition hover:brightness-105"
              >
                Enviarle los datos a Mica por WhatsApp
              </a>

              <a
                href={`/pago-en-proceso/transferencia?product=${encodeURIComponent(details.productId)}`}
                onClick={closeBizum}
                className="min-h-[44px] flex w-full items-center justify-center rounded-full border border-[#C9B9A9] px-4 py-2 text-center text-sm font-medium text-[#53392B] transition hover:bg-[#F5EEE9]"
              >
                Ya pagué · Enviar comprobante →
              </a>
            </div>
          </div>
        </Portal>
      ) : null}
    </section>
  );
}
