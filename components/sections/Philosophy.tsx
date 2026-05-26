export default function Philosophy() {
  return (
    <section id="valores" className="rainbow-section relative overflow-hidden py-24 px-4 sm:px-6">
      <div className="absolute inset-x-0 top-0 h-px bg-white/40" />
      <div className="absolute left-10 top-8 h-60 w-60 rounded-full bg-white/25 blur-3xl" />
      <div className="absolute right-12 bottom-0 h-72 w-72 rounded-full bg-white/18 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/14 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        <div className="rainbow-surface relative overflow-hidden rounded-[2rem] px-6 py-16 text-center sm:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.46),_transparent_55%)]" />

          <div className="relative mx-auto max-w-3xl">
            <p className="section-kicker mb-4 text-white/90">valores</p>
            <blockquote className="font-serif text-[clamp(30px,4.5vw,54px)] leading-[1.16] font-light italic tracking-tight mb-5 text-[#2C2018]">
              Un espacio basado en Diseño Humano y experimentación real
            </blockquote>
            <p className="mx-auto max-w-2xl text-[15px] sm:text-[16px] leading-8 text-[#433446]">
              Te acompaño a recordar y crear una vida que tenga sentido para vos, para nadie mas. <br/> No te voy a decir qué hacer.<br/>
              Cada uno es único, por lo tanto los procesos, aprendizajes, y experimentación también. Podes ver que propuesta te resuena más para lo que necesites en este momento. 
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
