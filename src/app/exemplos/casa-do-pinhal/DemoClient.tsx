"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ────────────────────────────────────────────────────────────────
   Peças interativas do site-exemplo "Casa do Pinhal".

   É um site de demonstração: não há reservas reais nem back-office
   ligado. O formulário e o concierge respondem de forma guionada,
   para mostrar o comportamento que um site real teria.
   ──────────────────────────────────────────────────────────────── */

/** Cabeçalho que começa transparente sobre o vídeo e ganha fundo ao rolar. */
export function DemoHeader() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#casa", label: "A casa" },
    { href: "#espacos", label: "Espaços" },
    { href: "#zona", label: "Localização" },
    { href: "#reservar", label: "Reservar" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Barra que identifica isto como demonstração */}
      <div className="bg-[#0b2545] px-5 py-2 text-center text-[13px] leading-snug text-white/85">
        Site-exemplo criado pela{" "}
        <Link href="/" className="font-semibold text-white underline underline-offset-2">
          NextIA Marketing
        </Link>{" "}
        — o alojamento é fictício, o site é a sério.
      </div>

      <div
        className={`transition-colors duration-300 ${
          solid
            ? "border-b border-[#e6ded1] bg-[#faf7f1]/95 backdrop-blur"
            : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-[68px] w-full max-w-[1180px] items-center justify-between px-5 sm:px-8">
        <a
          href="#topo"
          className={`font-[family-name:var(--font-fraunces)] text-[19px] font-semibold tracking-[0.14em] uppercase transition-colors ${
            solid ? "text-[#16281f]" : "text-white"
          }`}
        >
          Casa do Pinhal
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.slice(0, 3).map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-[14px] transition-colors ${
                solid
                  ? "text-[#4d5a52] hover:text-[#16281f]"
                  : "text-white/85 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#reservar"
            className={`rounded-full px-5 py-2.5 text-[14px] font-semibold transition-colors ${
              solid
                ? "bg-[#16281f] text-white hover:bg-[#22392d]"
                : "bg-white text-[#16281f] hover:bg-white/90"
            }`}
          >
            Reservar
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Abrir menu"
          className={`md:hidden ${solid ? "text-[#16281f]" : "text-white"}`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
        </div>

        {open && (
          <div className="border-t border-[#e6ded1] bg-[#faf7f1] md:hidden">
            <div className="mx-auto flex max-w-[1180px] flex-col px-5 py-3 sm:px-8">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-[#efe8dc] py-3 text-[15px] text-[#3c4a42] last:border-0"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

/** Pedido de reserva — mostra o que aconteceria num site a sério. */
export function BookingForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-2xl border border-[#cfe0d3] bg-[#f1f7f2] p-8">
        <p className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-[#16281f]">
          Pedido registado.
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-[#4d5a52]">
          Num site a sério, este pedido seguia por email para o anfitrião e para
          o hóspede, ficava guardado no back-office e o concierge continuava a
          conversa. Aqui ficamos por esta mensagem — é uma demonstração.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 text-[14px] font-semibold text-[#16281f] underline underline-offset-4"
        >
          Voltar ao formulário
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="rounded-2xl border border-[#e6ded1] bg-white p-7 shadow-[0_18px_50px_-35px_rgba(22,40,31,0.5)] sm:p-8"
    >
      <p className="text-[13px] font-semibold tracking-[0.12em] text-[#8a6a3b] uppercase">
        Reserva direta
      </p>
      <p className="mt-2 text-[15px] leading-relaxed text-[#4d5a52]">
        Sem intermediários e sem comissão de plataforma.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-[13px] font-medium text-[#3c4a42]">Chegada</span>
          <input
            type="date"
            required
            className="mt-1.5 w-full rounded-lg border border-[#ded4c4] bg-[#fdfbf7] px-3.5 py-2.5 text-[15px] text-[#16281f] outline-none focus:border-[#8a6a3b]"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-medium text-[#3c4a42]">Saída</span>
          <input
            type="date"
            required
            className="mt-1.5 w-full rounded-lg border border-[#ded4c4] bg-[#fdfbf7] px-3.5 py-2.5 text-[15px] text-[#16281f] outline-none focus:border-[#8a6a3b]"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-[13px] font-medium text-[#3c4a42]">Hóspedes</span>
        <select
          defaultValue="4"
          className="mt-1.5 w-full rounded-lg border border-[#ded4c4] bg-[#fdfbf7] px-3.5 py-2.5 text-[15px] text-[#16281f] outline-none focus:border-[#8a6a3b]"
        >
          {[2, 4, 6, 8, 10, 12].map((n) => (
            <option key={n} value={n}>
              {n} hóspedes
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="text-[13px] font-medium text-[#3c4a42]">
          Alguma coisa que devamos saber?
        </span>
        <textarea
          rows={3}
          placeholder="Vamos com um bebé, precisamos de berço."
          className="mt-1.5 w-full resize-none rounded-lg border border-[#ded4c4] bg-[#fdfbf7] px-3.5 py-2.5 text-[15px] text-[#16281f] outline-none placeholder:text-[#a79c8b] focus:border-[#8a6a3b]"
        />
      </label>

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-[#16281f] px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#22392d]"
      >
        Pedir disponibilidade
      </button>
      <p className="mt-3 text-center text-[13px] text-[#7d8a82]">
        Resposta em menos de 2 horas. Sem pagamento nesta fase.
      </p>
    </form>
  );
}

/* ── Concierge ──────────────────────────────────────────────────── */

type Message = { from: "bot" | "user"; text: string };

const SCRIPT: { q: string; a: string }[] = [
  {
    q: "Há disponibilidade em agosto?",
    a: "Em agosto ainda tenho a semana de 9 a 16 e de 23 a 30. Quer que segure uma delas enquanto decide?",
  },
  {
    q: "Aceitam animais?",
    a: "Sim, até dois animais de pequeno porte. Há um suplemento de 30€ pela estadia para limpeza reforçada.",
  },
  {
    q: "A que horas é o check-in?",
    a: "Check-in a partir das 16h e check-out até às 11h. Se chegar mais cedo, deixamos as malas guardadas.",
  },
  {
    q: "Quanto custa por noite?",
    a: "Entre 240€ e 390€ por noite, conforme a época e o número de hóspedes. Mínimo de duas noites.",
  },
  {
    q: "A piscina é aquecida?",
    a: "É, e está a 28°C todo o ano. O deck fica ao sol até ao fim da tarde.",
  },
];

export function Concierge() {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [asked, setAsked] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "Boa tarde! Sou o assistente da Casa do Pinhal. Posso responder a perguntas sobre a casa, preços e datas.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  function ask(item: { q: string; a: string }) {
    setMessages((m) => [...m, { from: "user", text: item.q }]);
    setAsked((a) => [...a, item.q]);
    setTyping(true);
    const t = setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: "bot", text: item.a }]);
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 900);
    timers.current.push(t);
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  const remaining = SCRIPT.filter((s) => !asked.includes(s.q));

  return (
    <>
      {open && (
        <div className="fixed right-4 bottom-24 z-50 flex max-h-[70vh] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#e6ded1] bg-white shadow-[0_30px_70px_-30px_rgba(22,40,31,0.55)]">
          <div className="flex items-center gap-3 bg-[#16281f] px-4 py-3.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#8a6a3b] text-[13px] font-bold text-white">
              CP
            </span>
            <span className="flex-1">
              <span className="block text-[14px] font-semibold text-white">
                Concierge
              </span>
              <span className="block text-[12px] text-white/60">
                Responde em segundos
              </span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar conversa"
              className="text-white/70 hover:text-white"
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

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#faf7f1] px-4 py-4">
            {messages.map((m, i) => (
              <p
                key={i}
                className={
                  m.from === "bot"
                    ? "max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-[14px] leading-relaxed text-[#3c4a42] shadow-[0_2px_10px_-6px_rgba(22,40,31,0.4)]"
                    : "ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#16281f] px-3.5 py-2.5 text-[14px] leading-relaxed text-white"
                }
              >
                {m.text}
              </p>
            ))}
            {typing && (
              <p className="w-16 rounded-2xl rounded-tl-sm bg-white px-3.5 py-3 shadow-[0_2px_10px_-6px_rgba(22,40,31,0.4)]">
                <span className="flex gap-1" aria-label="a escrever">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b3bdb6]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b3bdb6]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#b3bdb6]" />
                </span>
              </p>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-[#e6ded1] bg-white px-3 py-3">
            {remaining.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {remaining.slice(0, 3).map((s) => (
                  <button
                    key={s.q}
                    type="button"
                    onClick={() => ask(s)}
                    className="rounded-full border border-[#ded4c4] px-3 py-1.5 text-[13px] text-[#4d5a52] transition-colors hover:border-[#8a6a3b] hover:text-[#16281f]"
                  >
                    {s.q}
                  </button>
                ))}
              </div>
            ) : (
              <p className="px-1 py-1 text-center text-[13px] text-[#7d8a82]">
                Num site real, a conversa continuava com as perguntas do hóspede.
              </p>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar concierge" : "Falar com o concierge"}
        className="fixed right-4 bottom-5 z-50 flex items-center gap-2.5 rounded-full bg-[#8a6a3b] py-3.5 pr-5 pl-4 text-white shadow-[0_16px_40px_-16px_rgba(138,106,59,0.9)] transition-transform hover:-translate-y-0.5"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.2 9.2 0 0 1-2.9-.5L4 21l1.6-4a8.2 8.2 0 0 1-1.1-4.1 8.4 8.4 0 0 1 9-8.4 8.4 8.4 0 0 1 7.5 7z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[14px] font-semibold">Concierge</span>
      </button>
    </>
  );
}
