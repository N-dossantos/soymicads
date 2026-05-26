import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Philosophy from "@/components/sections/Philosophy";
import Service from "../components/sections/Service";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      <Navbar />
      <Hero />
      <Philosophy />
      <Service />
      <FAQ />
      <Footer />
    </main>
  );
}
