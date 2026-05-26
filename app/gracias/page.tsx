import Link from "next/link";

export default function GraciasPage() {
  return (
    <main className="min-h-screen bg-[#FDFAF6] flex flex-col items-center justify-center px-4 text-center">
      <div className="h-1 rainbow-bar w-full fixed top-0 left-0" />

      <p className="text-sm tracking-widest text-terra uppercase mb-4">
        Pago confirmado ✓
      </p>

      <h1 className="font-serif text-4xl md:text-5xl text-[#2C2018] mb-4 leading-tight">
        ¡Bienvenida al proceso!
      </h1>

      <p className="text-[#7A6A5A] text-lg max-w-md mb-10 leading-relaxed">
        Tu pago fue procesado. El siguiente paso es agendar tu primera sesión.
        Hacé clic abajo para elegir el horario que mejor te quede.
      </p>

      {/* Reemplazá este href con tu link real de Calendly */}
      <a
        href="https://cal.com/soymicads/disenar-me"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-terra text-white px-8 py-4 rounded-full text-base font-medium hover:bg-terra-dark transition-colors"
      >
        Agendar mi primera sesión →
      </a>

      <Link
        href="/"
        className="mt-8 text-sm text-[#7A6A5A] hover:text-terra transition-colors"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
