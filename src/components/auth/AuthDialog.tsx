"use client";

import { SessionProvider, useSession } from "next-auth/react";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthForm } from "@/components/auth/AuthForm";

/* ────────────────────────────────────────────────────────────────
   Janela de conta.

   Carregar em "Marcar reunião" (ou "Pedir briefing") sem sessão abre
   esta modal em vez de navegar. Quem já tem sessão vai direto, sem ver
   nada disto. Quem chegar por link direto ao destino é encaminhado pela
   própria página para /entrar — a modal não é a única guarda.
   ──────────────────────────────────────────────────────────────── */

type Contexto = {
  abrir: (destino: string) => void;
  googleAtivo: boolean;
};

const AuthDialogContext = createContext<Contexto | null>(null);

export function useAuthDialog() {
  const ctx = useContext(AuthDialogContext);
  if (!ctx) throw new Error("useAuthDialog fora do AuthProvider");
  return ctx;
}

export function AuthProvider({
  googleAtivo,
  children,
}: {
  googleAtivo: boolean;
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <DialogHost googleAtivo={googleAtivo}>{children}</DialogHost>
    </SessionProvider>
  );
}

function DialogHost({
  googleAtivo,
  children,
}: {
  googleAtivo: boolean;
  children: React.ReactNode;
}) {
  const [destino, setDestino] = useState<string | null>(null);

  const abrir = useCallback((d: string) => setDestino(d), []);
  const valor = useMemo(() => ({ abrir, googleAtivo }), [abrir, googleAtivo]);

  useEffect(() => {
    if (!destino) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDestino(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [destino]);

  return (
    <AuthDialogContext.Provider value={valor}>
      {children}

      {destino && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-navy/45 p-4 backdrop-blur-[2px] sm:items-center sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDestino(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-conta"
            className="my-auto w-full max-w-[440px] rounded-xl border border-line bg-white p-7 shadow-[0_40px_90px_-30px_rgba(11,37,69,0.6)] sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="titulo-conta"
                  className="text-xl font-bold tracking-tight text-ink"
                >
                  Cria conta para continuar
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-body">
                  É rápido e serve para ligarmos o teu pedido a ti — assim não
                  tens de repetir nada na reunião.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDestino(null)}
                aria-label="Fechar"
                className="-mt-1 -mr-1 shrink-0 rounded-md p-1.5 text-muted transition-colors hover:bg-surface hover:text-ink"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-7">
              <AuthForm
                next={destino}
                googleAtivo={googleAtivo}
                autoFocus
                onSucesso={() => setDestino(null)}
              />
            </div>
          </div>
        </div>
      )}
    </AuthDialogContext.Provider>
  );
}

/**
 * Link para um destino que exige conta. Com sessão, navega. Sem sessão,
 * abre a modal em vez de deixar a pessoa bater na porta fechada.
 */
export function GatedLink({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const { abrir } = useAuthDialog();
  const { status } = useSession();

  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        onClick?.();
        if (status === "authenticated") return;
        e.preventDefault();
        abrir(href);
      }}
    >
      {children}
    </Link>
  );
}
