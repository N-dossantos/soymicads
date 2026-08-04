"use client";

const SPOTIFY_SHOW_URL = "https://open.spotify.com/show/6n8bF0CMxdoe8JdlgWRtYw?si=cf673720db2e4bb4";
const SPOTIFY_SHOW_ID = "6n8bF0CMxdoe8JdlgWRtYw";
const YOUTUBE_SHOW_URL = "https://www.youtube.com/@soymicads";

export default function PodcastSection() {
  const rainbowPseudo = [
    "relative isolate overflow-hidden inline-flex items-center justify-center transition-all duration-300",
    "after:content-[''] after:absolute after:inset-0 after:rounded-full after:z-[-2]",
    "after:bg-[linear-gradient(90deg,#f29d8e,#f6bd8b,#fce594,#a1d2c5,#b3d5ee,#ceafd2)]",
    "before:content-[''] before:absolute before:inset-0 before:rounded-full before:z-[-1]",
    "before:transition-opacity before:duration-200",
  ].join(" ");

  return (
    <section id="podcast" className="relative py-20 px-4 sm:px-6 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(161,210,197,0.25)_0%,_rgba(179,213,238,0.2)_50%,_transparent_70%)] blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-4xl relative">
        <div className="rainbow-surface relative overflow-hidden rounded-[2.5rem] p-8 sm:p-10 text-center border border-white/60 shadow-xl backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#f29d8e] via-[#f6bd8b] via-[#fce594] via-[#a1d2c5] via-[#b3d5ee] to-[#ceafd2]" />

          <p className="section-kicker mb-3">Podcast</p>

          <h2 className="section-title text-[clamp(20px,4vw,44px)] font-medium leading-tight mb-4">
            Escuchame como si fuese tu amiga <br/> mandandote audios
          </h2>

          <p className="mx-auto max-w-lg text-[15px] sm:text-[16px] leading-relaxed text-[#4A3556] mb-8">
            "Mood Budita" es mi nuevo espacio para poder expresarme, ser 100% yo, contarles mi vida, mis procesos y aprendizajes. <br/> Literalmente compartirles mi nuevo mood y forma de ver las cosas. <br/> Y así espero poder inspirarlos a ustedes también.
          </p>

          <div className="mx-auto max-w-xl overflow-hidden rounded-2xl shadow-md mb-8">
            <iframe
              src={`https://open.spotify.com/embed/show/${SPOTIFY_SHOW_ID}?utm_source=generator`}
              width="100%"
              height="152"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="block"
              title="Podcast de Mica Ds en Spotify"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={SPOTIFY_SHOW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${rainbowPseudo} py-3.5 px-7 rounded-full text-[15px] font-medium text-[#53392B] border border-[#C9B9A9] shadow-md hover:shadow-lg hover:scale-105 active:scale-100 before:bg-[#FFF9F4] before:opacity-90 hover:before:opacity-40`}
            >
              Escuchar en Spotify →
            </a>
            <a
              href={YOUTUBE_SHOW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${rainbowPseudo} py-3.5 px-7 rounded-full text-[15px] font-medium text-[#53392B] border border-[#C9B9A9] shadow-md hover:shadow-lg hover:scale-105 active:scale-100 before:bg-[#FFF9F4] before:opacity-90 hover:before:opacity-40`}
            >
              Escuchar en YouTube →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
