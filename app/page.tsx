"use client";

import { useState } from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Philosophy from "@/components/sections/Philosophy";
import EventSection from "@/components/sections/EventSection";
import Service from "@/components/sections/Service";
import PodcastSection from "@/components/sections/PodcastSection";
import GiftCardSection from "@/components/sections/GiftCardSection";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";
import EventPopup from "@/components/ui/EventPopup";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main id="main-content" className="relative isolate min-h-screen overflow-x-hidden">
      <Navbar menuOpen={menuOpen} onMenuOpenChange={setMenuOpen} />
      <Hero menuOpen={menuOpen} />
      <EventSection />
      <Philosophy />
      <Service />
      <GiftCardSection />
      <PodcastSection />
      <FAQ />
      <Footer />
      <EventPopup />
    </main>
  );
}

