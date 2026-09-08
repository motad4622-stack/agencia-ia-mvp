import Link from "next/link";
import { Logo } from "@/components/Logo";

export function Nav() {
  return (
    <header className="border-b border-line bg-white/85 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center shrink-0">
          <Logo compact />
        </Link>
        <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-body">
          <Link href="/videos" className="hover:text-brand transition-colors">
            Vídeos de Alojamento
          </Link>
          <Link href="/sites-ia" className="hover:text-brand transition-colors">
            Sites com IA
          </Link>
          <Link href="/admin" className="hover:text-brand transition-colors">
            Admin
          </Link>
        </nav>
        <Link href="/videos/marcar-reuniao" className="btn-primary px-5! py-2.5! text-sm">
          Marcar reunião
        </Link>
      </div>
    </header>
  );
}
