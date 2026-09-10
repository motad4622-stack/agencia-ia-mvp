"use client";

import { useEffect, useRef, useState } from "react";
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/lib/brand";

/* ────────────────────────────────────────────────────────────────
   Botão de WhatsApp com mensagens pré-definidas.

   Do nosso lado não há campo de texto livre: a pessoa escolhe uma das
   opções abaixo e o WhatsApp abre com essa mensagem escrita. O que ela
   faz depois, já dentro do WhatsApp, é do telemóvel dela — nenhum link
   consegue impedir que apague o texto antes de enviar.
   ──────────────────────────────────────────────────────────────── */

const OPCOES = [
  {
    label: "Quero um vídeo para o meu alojamento",
    mensagem:
      "Olá! Vi o site da NextIA Marketing e quero um vídeo para o meu alojamento.",
  },
  {
    label: "Quero um site com IA para a minha empresa",
    mensagem:
      "Olá! Vi o site da NextIA Marketing e quero um site com IA para a minha empresa.",
  },
  {
    label: "Quero saber preços",
    mensagem:
      "Olá! Vi o site da NextIA Marketing e queria saber os preços dos vossos serviços.",
  },
  {
    label: "Tenho outra questão",
    mensagem: "Olá! Vi o site da NextIA Marketing e tenho uma questão.",
  },
];

function linkWhatsApp(mensagem: string, origem: string) {
  const texto = `${mensagem} [${origem}]`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
}

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const painelRef = useRef<HTMLDivElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        botaoRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      const alvo = e.target as Node;
      if (
        !painelRef.current?.contains(alvo) &&
        !botaoRef.current?.contains(alvo)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  function abrir(mensagem: string) {
    const origem =
      typeof window !== "undefined" ? `site${window.location.pathname}` : "site";
    window.open(linkWhatsApp(mensagem, origem), "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open && (
        <div
          ref={painelRef}
          role="dialog"
          aria-label="Falar connosco por WhatsApp"
          className="w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-line bg-white shadow-[0_24px_60px_-24px_rgba(15,32,56,0.55)]"
        >
          <div className="flex items-center gap-3 border-b border-line bg-surface px-4 py-3.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#25D366] text-white">
              <IconeWhatsApp size={19} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-ink">
                Falar por WhatsApp
              </span>
              <span className="block text-[12px] text-muted">
                {WHATSAPP_DISPLAY}
              </span>
            </span>
          </div>

          <div className="p-2">
            <p className="px-2 pt-1.5 pb-2 text-[12px] text-muted">
              Escolhe o que precisas — a mensagem vai já escrita.
            </p>
            {OPCOES.map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => abrir(o.mensagem)}
                className="block w-full rounded-md px-3 py-2.5 text-left text-[14px] leading-snug text-body transition-colors hover:bg-surface hover:text-ink"
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        ref={botaoRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Fechar opções de WhatsApp" : "Falar por WhatsApp"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_34px_-12px_rgba(37,211,102,0.85)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <IconeWhatsApp size={28} />
        )}
      </button>
    </div>
  );
}

function IconeWhatsApp({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden
    >
      <path d="M16.03 4.5c-6.35 0-11.5 5.15-11.5 11.5 0 2.03.53 4 1.55 5.74L4.5 27.5l5.93-1.55a11.45 11.45 0 0 0 5.6 1.43h.01c6.34 0 11.49-5.15 11.49-11.5S22.37 4.5 16.03 4.5Zm0 21a9.5 9.5 0 0 1-4.84-1.33l-.35-.2-3.52.92.94-3.43-.23-.36a9.5 9.5 0 1 1 8 4.4Zm5.22-7.12c-.29-.14-1.7-.84-1.96-.93-.26-.1-.45-.14-.64.14-.19.29-.74.93-.9 1.12-.17.19-.34.21-.62.07-.29-.14-1.21-.45-2.3-1.42-.85-.76-1.42-1.69-1.59-1.98-.17-.29-.02-.44.13-.58.13-.13.29-.34.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.55-.88-2.12-.23-.55-.46-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38s1.02 2.76 1.17 2.95c.14.19 2.02 3.08 4.89 4.32.68.29 1.21.47 1.63.6.68.22 1.31.19 1.8.12.55-.08 1.7-.69 1.94-1.37.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.33Z" />
    </svg>
  );
}
