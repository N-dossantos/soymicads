"use client";

import { useState } from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Philosophy from "@/components/sections/Philosophy";
import Service from "@/components/sections/Service";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="relative isolate min-h-screen overflow-x-hidden">
      <Navbar menuOpen={menuOpen} onMenuOpenChange={setMenuOpen} />
      <Hero menuOpen={menuOpen} />
      <Philosophy />
      <Service />
      <FAQ />
      <Footer />
    </main>
  );
}
