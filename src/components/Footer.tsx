import Link from "next/link";
import { Logo } from "@/components/Logo";
import { BRAND_NAME } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8">
        <div className="flex flex-col items-center sm:items-start gap-3">
          <Logo />
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {BRAND_NAME}. Todos os direitos reservados.
          </p>
        </div>
        <div className="flex gap-8 text-sm font-medium text-body">
          <Link href="/videos" className="hover:text-brand transition-colors">
            Vídeos de Alojamento
          </Link>
          <Link href="/sites-ia" className="hover:text-brand transition-colors">
            Sites com IA
          </Link>
          <Link href="/admin" className="hover:text-brand transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
