import Link from "next/link";
import { Logo } from "@/components/Logo";
import { BRAND_NAME } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-2">
          <Logo withSubtitle />
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {BRAND_NAME}. Todos os direitos reservados.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-gray-500">
          <Link href="/videos" className="hover:text-brand">
            Vídeos de Alojamento
          </Link>
          <Link href="/sites-ia" className="hover:text-brand">
            Sites com IA
          </Link>
          <Link href="/admin" className="hover:text-brand">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
