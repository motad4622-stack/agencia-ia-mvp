import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Nav() {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/videos" className="hover:text-brand">
            Vídeos de Alojamento
          </Link>
          <Link href="/sites-ia" className="hover:text-brand">
            Sites com IA
          </Link>
          <Link href="/admin" className="hover:text-brand">
            Admin
          </Link>
        </nav>
        <Link
          href="/videos/marcar-reuniao"
          className="rounded-full bg-brand text-white text-sm font-semibold px-4 py-2 hover:bg-brand-light transition-colors"
        >
          Marcar reunião
        </Link>
      </div>
    </header>
  );
}
