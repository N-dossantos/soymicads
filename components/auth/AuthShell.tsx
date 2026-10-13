import Link from "next/link";

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

// Marco de las páginas de ingreso/registro: misma tarjeta que /gracias.
export default function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main
      id="main-content"
      className="relative isolate min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-x-hidden"
    >
      <div className="fixed top-0 left-0 right-0 z-50 h-1 rainbow-bar" />

      <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-[600px] max-w-lg">
        <div className="absolute left-8 top-16 h-48 w-48 rounded-full bg-[rgba(242,157,142,0.18)] blur-3xl animate-pulse" />
        <div className="absolute right-10 top-28 h-56 w-56 rounded-full bg-[rgba(179,213,238,0.18)] blur-3xl" />
      </div>

      <Link href="/" className="mb-6 flex items-center gap-3">
        <img src="/images/logo.jpeg" alt="" className="h-12 w-12 rounded-full object-cover shadow-lg shadow-[rgba(196,132,106,0.22)]" />
        <span className="rainbow-text font-serif text-xl font-medium">Mica Ds</span>
      </Link>

      <div className="premium-card relative w-full max-w-md overflow-hidden rounded-[2rem] p-6 sm:p-8 shadow-[0_28px_80px_rgba(44,32,24,0.16)] bg-white/75 backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#E8776A] via-[#fce594] to-[#6AAED4]" />

        <h1 className="mt-2 text-center font-serif text-3xl sm:text-4xl leading-tight text-[#2C2018]">{title}</h1>
        {subtitle ? (
          <p className="mt-2 text-center text-sm sm:text-base leading-relaxed text-[#4A3556]">{subtitle}</p>
        ) : null}

        <div className="mt-6">{children}</div>
      </div>

      <Link href="/" className="mt-6 text-sm font-medium text-[#8C6A56] hover:text-[#2C2018] transition-colors">
        Volver al inicio
      </Link>
    </main>
  );
}
