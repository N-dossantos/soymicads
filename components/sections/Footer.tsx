export default function Footer() {
  return (
    <footer className="relative mt-8 overflow-hidden border-t border-[rgba(255,255,255,0.4)] bg-[linear-gradient(180deg,rgba(252,245,244,0.8),rgba(246,238,250,0.88))] px-4 pt-10 sm:px-6 pb-10">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-white/75 px-6 py-12 text-center shadow-[0_12px_40px_rgba(44,32,24,0.08)] sm:px-10 backdrop-blur-xl">
        <div className="absolute left-6 top-6 h-28 w-28 rounded-full bg-[rgba(242,157,142,0.14)] blur-3xl" />
        <div className="absolute right-6 bottom-0 h-32 w-32 rounded-full bg-[rgba(179,213,238,0.12)] blur-3xl" />
        <div className="absolute left-7 top-0 h-1 right-7 rainbow-bar" />

        <div className="relative mx-auto max-w-3xl">
          <p className="font-serif text-3xl font-medium mb-2 rainbow-text">
            Micaela Maria Dos Santos
          </p>

          <p className="mx-auto mb-6 max-w-2xl text-[14px] sm:text-[15px] leading-7 text-[#4A3556]">
            Diseño Humano · Autoconocimiento
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["WhatsApp",
              "Instagram",
              "soymicads@gmail.com",
            ].map((label, index) => (
              <a
                key={label}
                href={
                  index === 0
                    ? "https://api.whatsapp.com/send?text=Hola!%20Quiero%20saber%20más%20sobre%20tus%20propuestas.%20Podés%20ayudarme?&phone=5491150294100"
                    : index === 1
                    ? "https://instagram.com/soymicads"
                    : "mailto:soymicads@gmail.com"
                }
                target={index === 0 || index === 1 ? "_blank" : undefined}
                rel={index === 0 || index === 1 ? "noopener noreferrer" : undefined}
                className="rounded-full border border-[rgba(255,255,255,0.55)] bg-[linear-gradient(90deg,rgba(242,157,142,0.16),rgba(246,189,139,0.16),rgba(252,229,148,0.16),rgba(161,210,197,0.16),rgba(179,213,238,0.16),rgba(206,175,210,0.16))] px-4 py-2 text-sm text-[#3f352d] transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                {label}
              </a>
            ))}
          </div>

          <p className="text-[11px] tracking-[0.16em] text-[#8a6a84] uppercase">
            © {new Date().getFullYear()} Soymicads · Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}