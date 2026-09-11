"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Logo } from "@/components/Logo";
import { GatedLink } from "@/components/auth/AuthDialog";

const LINKS = [
  { href: "/#servicos", label: "Serviços" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#exemplos", label: "Exemplos" },
  { href: "/#faq", label: "FAQ" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const { data: sessao } = useSession();
  const primeiroNome = sessao?.user?.name?.trim().split(" ")[0];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label="NextIA Marketing — início">
          <Logo compact />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-body transition-colors hover:text-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {sessao?.user && (
            <span className="hidden items-center gap-2.5 text-sm text-muted lg:flex">
              {primeiroNome && (
                <span className="max-w-[10rem] truncate">
                  Olá, <span className="font-medium text-body">{primeiroNome}</span>
                </span>
              )}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="font-medium transition-colors hover:text-navy"
              >
                Sair
              </button>
            </span>
          )}
          <GatedLink
            href="/marcar-reuniao"
            className="hidden btn-primary px-5! py-2.5! text-sm! sm:inline-flex"
          >
            Marcar reunião
          </GatedLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line-strong text-navy md:hidden"
          >
            <span className="sr-only">Menu</span>
            <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
              {open ? (
                <path
                  d="M1 1l16 12M17 1L1 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M0 1h18M0 7h18M0 13h18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-white md:hidden">
          <nav className="container-page flex flex-col py-2">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-3.5 text-[15px] font-medium text-body last:border-0"
              >
                {link.label}
              </Link>
            ))}
            <GatedLink
              href="/marcar-reuniao"
              onClick={() => setOpen(false)}
              className="btn-primary my-4"
            >
              Marcar reunião
            </GatedLink>
            {sessao?.user && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="pb-4 text-left text-[15px] font-medium text-muted"
              >
                {primeiroNome ? `Sair da conta de ${primeiroNome}` : "Sair"}
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
