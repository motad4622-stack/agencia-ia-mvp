import Link from "next/link";
import { Logo } from "@/components/Logo";
import { BRAND_NAME } from "@/lib/brand";

const columns = [
  {
    title: "Serviços",
    links: [
      { href: "/videos", label: "Vídeos de alojamento" },
      { href: "/sites-ia", label: "Sites com IA" },
    ],
  },
  {
    title: "Site",
    links: [
      { href: "/#como-funciona", label: "Como funciona" },
      { href: "/#exemplos", label: "Exemplos" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Contacto",
    links: [
      { href: "/videos/marcar-reuniao", label: "Marcar reunião" },
      { href: "/sites-ia/contacto", label: "Pedir briefing" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-body">
              IA aplicada ao marketing, ao conteúdo e à presença digital de
              alojamentos e pequenas empresas.
            </p>
            <Link href="/videos/marcar-reuniao" className="btn-primary mt-6">
              Marcar reunião
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-[13px] font-semibold uppercase tracking-wide text-muted">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-[15px] text-body transition-colors hover:text-navy"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-2 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND_NAME}. Todos os direitos reservados.
          </p>
          <Link href="/admin" className="transition-colors hover:text-body">
            Área da equipa
          </Link>
        </div>
      </div>
    </footer>
  );
}
