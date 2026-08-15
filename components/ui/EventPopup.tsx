"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useDialogA11y } from "@/lib/useDialogA11y";

interface EventPopupProps {
  formsUrl?: string;
  targetSectionId?: string;
  // Popup start date: August 21, 2026 (UTC-3)
  startDate?: string;
  // Event deadline: August 29, 2026 at 16:00 hs Argentina (UTC-3)
  deadlineDate?: string;
}

export default function EventPopup({
  formsUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfjAilIBieNLPt_-DIxN7J-FrEXir2gBpyXjdsobG3Nyy79Fg/viewform?usp=publish-editor",
  targetSectionId = "encuentro",
  startDate = "2026-08-25T00:00:00-03:00",
  deadlineDate = "2026-08-29T16:00:00-03:00",
}: EventPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isActiveClass, setIsActiveClass] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    // 1. Check if user already closed popup during current session
    const isClosedInSession = sessionStorage.getItem("eventPopupClosed") === "true";
    if (isClosedInSession) {
      return;
    }

    // 2. Check date range: from August 21 until the time of the event (Aug 29, 16:00 hs)
    const now = new Date();
    const start = new Date(startDate);
    const deadline = new Date(deadlineDate);

    // If current time is before start date, do not show popup
    if (!isNaN(start.getTime()) && now < start) {
      return;
    }

    // If current time is past deadline date, do not show popup
    if (!isNaN(deadline.getTime()) && now > deadline) {
      return;
    }

    // 3. Smooth entrance with ~800ms delay after DOM mount
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Small tick for CSS transition to trigger opacity and visibility
      requestAnimationFrame(() => {
        setIsActiveClass(true);
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [startDate, deadlineDate]);

  const handleClose = () => {
    sessionStorage.setItem("eventPopupClosed", "true");
    setIsActiveClass(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300); // match CSS fade-out transition duration
  };

  useDialogA11y(isVisible, dialogRef, handleClose);

  const handleViewDetails = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handleClose();

    const targetElem = document.getElementById(targetSectionId);
    if (targetElem) {
      targetElem.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = `#${targetSectionId}`;
    }
  };

  if (!isVisible) return null;

  return (
    <div
      aria-live="polite"
      className={`event-popup-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300 ${isActiveClass ? "active opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`event-popup-card relative w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-[#fdf7f2]/95 backdrop-blur-2xl border border-white/80 shadow-2xl transition-all duration-300 transform ${isActiveClass ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Cerrar cartel promocional"
          className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-[#4A3556] shadow-sm transition hover:bg-white hover:scale-110 active:scale-95 border border-white/80"
        >
          <span className="text-xl font-medium leading-none">&times;</span>
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#7a5a72] bg-white/80 border border-white/90 shadow-sm mb-3">
          <span>✨ ¡Próximo encuentro gratuito!</span>
        </div>

        {/* Title */}
        <h3 id={titleId} className="section-title text-2xl sm:text-3xl font-semibold text-[#2C2018] mb-2 leading-tight">
          Aprender a Diseñar(nos) II
        </h3>

        {/* Date / Time summary */}
        <div className="mb-4">
          <p className="text-xs sm:text-sm font-medium text-[#E8776A] flex items-center gap-1.5 font-semibold">
            <span>📅 Sáb 29 Ago — 16:00 hs (ARG) / 21:00 hs (ESP)</span>
          </p>
          <p className="text-xs font-semibold text-[#7a5a72] mt-1 flex items-center gap-1">
            <span>🎁 Evento 100% Gratuito | 💻 Online en vivo por Zoom</span>
          </p>
        </div>

        {/* Description preview */}
        <p className="text-xs sm:text-sm text-[#4A3556] leading-relaxed mb-6">
          Inscríbete y completa los datos de tu bodygraph. Si te anotás a tiempo, ¡te armo y envío tu carta personalizada!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={`#${targetSectionId}`}
            onClick={handleViewDetails}
            className="min-h-[44px] flex items-center justify-center w-full sm:w-1/2 py-3 px-4 rounded-full text-center text-xs sm:text-sm font-medium text-[#4A3556] bg-white/80 hover:bg-white border border-[#C9B9A9]/50 shadow-sm transition hover:shadow duration-200"
          >
            Ver detalles
          </a>

          <a
            href={formsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative isolate overflow-hidden min-h-[44px] flex items-center justify-center w-full sm:w-1/2 py-3 px-4 rounded-full text-center text-xs sm:text-sm font-medium text-[#53392B] border border-[#C9B9A9] shadow-sm hover:shadow-md transition hover:scale-[1.02] active:scale-100 after:content-[''] after:absolute after:inset-0 after:rounded-full after:z-[-2] after:bg-[linear-gradient(90deg,#f29d8e,#f6bd8b,#fce594,#a1d2c5,#b3d5ee,#ceafd2)] before:content-[''] before:absolute before:inset-0 before:rounded-full before:z-[-1] before:bg-[#FFF9F4] before:opacity-90 hover:before:opacity-30 duration-200"
          >
            Inscribirme ahora →
          </a>
        </div>
      </div>
    </div>
  );
}
