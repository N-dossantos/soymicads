"use client";

import { useEffect, useState } from "react";

interface EventPopupProps {
  formsUrl?: string;
  targetSectionId?: string;
  // Default deadline: July 15 at 10:00 hs Argentina (UTC-3)
  deadlineDate?: string;
}

export default function EventPopup({
  formsUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfZnABlaQzVpqgqJZ9hRfBAxYzCOL8V7JdqCqqLEUgrr0anlA/viewform?usp=header",
  targetSectionId = "taller",
  deadlineDate = "2026-07-26T10:00:00-03:00",
}: EventPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isActiveClass, setIsActiveClass] = useState(false);

  useEffect(() => {
    // 1. Check if user already closed popup during current session
    const isClosedInSession = sessionStorage.getItem("eventPopupClosed") === "true";
    if (isClosedInSession) {
      return;
    }

    // 2. Check if current time is past the event deadline date
    const now = new Date();
    const deadline = new Date(deadlineDate);

    // If deadline date is valid and already passed, do not show popup
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
  }, [deadlineDate]);

  const handleClose = () => {
    sessionStorage.setItem("eventPopupClosed", "true");
    setIsActiveClass(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300); // match CSS fade-out transition duration
  };

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
        className={`event-popup-card relative w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-[#fdf7f2]/95 backdrop-blur-2xl border border-white/80 shadow-2xl transition-all duration-300 transform ${isActiveClass ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Cerrar cartel promocional"
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-[#4A3556] shadow-sm transition hover:bg-white hover:scale-110 active:scale-95 border border-white/80"
        >
          <span className="text-xl font-medium leading-none">&times;</span>
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#8a6a84] bg-white/80 border border-white/90 shadow-sm mb-3">
          <span>✨ ¡Próximo Taller En Vivo!</span>
        </div>

        {/* Title */}
        <h3 className="section-title text-2xl sm:text-3xl font-semibold text-[#2C2018] mb-2 leading-tight">
          Aprender a Diseñar(nos)
        </h3>

        {/* Date / Time summary */}
        <p className="text-xs sm:text-sm font-medium text-[#E8776A] mb-4 flex items-center gap-1.5">
          <span>📅 Sáb 25 Jul — 10:00 hs (ARG) / 15:00 hs (ESP)</span>
        </p>

        {/* Description preview */}
        <p className="text-xs sm:text-sm text-[#4A3556] leading-relaxed mb-6">
          Inscríbete y completa los datos de tu carta natal. Si te anotás a tiempo, ¡te armo y envío tu carta personalizada!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={`#${targetSectionId}`}
            onClick={handleViewDetails}
            className="w-full sm:w-1/2 py-3 px-4 rounded-full text-center text-xs sm:text-sm font-medium text-[#4A3556] bg-white/80 hover:bg-white border border-[#C9B9A9]/50 shadow-sm transition hover:shadow duration-200"
          >
            Ver detalles
          </a>

          <a
            href={formsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative isolate overflow-hidden w-full sm:w-1/2 py-3 px-4 rounded-full text-center text-xs sm:text-sm font-medium text-[#53392B] border border-[#C9B9A9] shadow-sm hover:shadow-md transition hover:scale-[1.02] active:scale-100 after:content-[''] after:absolute after:inset-0 after:rounded-full after:z-[-2] after:bg-[linear-gradient(90deg,#f29d8e,#f6bd8b,#fce594,#a1d2c5,#b3d5ee,#ceafd2)] before:content-[''] before:absolute before:inset-0 before:rounded-full before:z-[-1] before:bg-[#FFF9F4] before:opacity-90 hover:before:opacity-30 duration-200"
          >
            Inscribirme ahora →
          </a>
        </div>
      </div>
    </div>
  );
}
