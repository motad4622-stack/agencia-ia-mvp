"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/* ────────────────────────────────────────────────────────────────
   Agenda de marcação.

   As horas chegam em UTC de /api/marcacoes/disponibilidade e mostram-se
   sempre na hora de Lisboa. O servidor volta a confirmar tudo quando se
   carrega em "Confirmar" — o que está aqui é só a montra.
   ──────────────────────────────────────────────────────────────── */

type Servico = "videos" | "sites";
type Dia = { dia: string; horas: string[] };

const SERVICOS: { id: Servico; titulo: string; texto: string }[] = [
  { id: "videos", titulo: "Vídeo de IA para alojamento", texto: "Para Airbnb, alojamento local ou hotel." },
  { id: "sites", titulo: "Site com IA", texto: "Para empresas que querem um site que trabalhe por elas." },
];

const TIPOS_IMOVEL: [string, string][] = [
  ["airbnb", "Airbnb"],
  ["alojamento_local", "Alojamento local"],
  ["hotel", "Hotel"],
];

const FUSO = "Europe/Lisbon";
const fmtHora = new Intl.DateTimeFormat("pt-PT", { timeZone: FUSO, hour: "2-digit", minute: "2-digit" });
const fmtHoraNum = new Intl.DateTimeFormat("en-GB", { timeZone: FUSO, hour: "2-digit", hourCycle: "h23" });
const fmtDiaLongo = new Intl.DateTimeFormat("pt-PT", { timeZone: FUSO, weekday: "long", day: "numeric", month: "long" });
const fmtMesAno = new Intl.DateTimeFormat("pt-PT", { timeZone: "UTC", month: "long", year: "numeric" });
const fmtMesCurto = new Intl.DateTimeFormat("pt-PT", { timeZone: "UTC", month: "short" });

const DIAS_SEMANA = ["seg", "ter", "qua", "qui", "sex"];

function meioDiaUtc(dia: string): Date {
  const [a, m, d] = dia.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, d, 12));
}

function somarDias(dia: string, n: number): string {
  const t = meioDiaUtc(dia);
  t.setUTCDate(t.getUTCDate() + n);
  return t.toISOString().slice(0, 10);
}

const maiuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function Agenda({
  servicoInicial,
  nomeInicial,
  emailInicial,
}: {
  servicoInicial: Servico | null;
  nomeInicial: string;
  emailInicial: string;
}) {
  const router = useRouter();

  const [servico, setServico] = useState<Servico | null>(servicoInicial);
  const [dias, setDias] = useState<Dia[]>([]);
  const [estado, setEstado] = useState<"a-carregar" | "pronto" | "erro">("a-carregar");
  const [versao, setVersao] = useState(0);
  const [diaEscolhido, setDiaEscolhido] = useState<string | null>(null);
  const [hora, setHora] = useState<string | null>(null);

  const [nome, setNome] = useState(nomeInicial);
  const [email, setEmail] = useState(emailInicial);
  const [telefone, setTelefone] = useState("");
  const [assunto, setAssunto] = useState("");
  const [tipo, setTipo] = useState("airbnb");
  const [tipoNegocio, setTipoNegocio] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [erro, setErro] = useState<string | null>(null);
  const [aEnviar, setAEnviar] = useState(false);

  useEffect(() => {
    let ativo = true;
    fetch("/api/marcacoes/disponibilidade", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: { dias: Dia[] }) => {
        if (!ativo) return;
        setDias(d.dias);
        setEstado("pronto");
        setDiaEscolhido((atual) =>
          atual && d.dias.some((x) => x.dia === atual) ? atual : (d.dias[0]?.dia ?? null),
        );
      })
      .catch(() => ativo && setEstado("erro"));
    return () => {
      ativo = false;
    };
  }, [versao]);

  function recarregar() {
    setEstado("a-carregar");
    setVersao((v) => v + 1);
  }

  const semanas = useMemo(() => {
    if (dias.length === 0) return [];
    const primeiro = dias[0].dia;
    const recua = (meioDiaUtc(primeiro).getUTCDay() + 6) % 7; // até segunda
    const ultimo = dias[dias.length - 1].dia;
    const linhas: string[][] = [];
    for (let seg = somarDias(primeiro, -recua); seg <= ultimo; seg = somarDias(seg, 7)) {
      linhas.push([0, 1, 2, 3, 4].map((i) => somarDias(seg, i)));
    }
    return linhas;
  }, [dias]);

  const livres = useMemo(() => new Set(dias.map((d) => d.dia)), [dias]);

  const horasDoDia = useMemo(() => {
    const d = dias.find((x) => x.dia === diaEscolhido);
    const manha: string[] = [];
    const tarde: string[] = [];
    for (const h of d?.horas ?? []) {
      (Number(fmtHoraNum.format(new Date(h))) < 13 ? manha : tarde).push(h);
    }
    return { manha, tarde };
  }, [dias, diaEscolhido]);

  const tituloMeses = useMemo(() => {
    if (dias.length === 0) return "";
    const a = fmtMesAno.format(meioDiaUtc(dias[0].dia));
    const b = fmtMesAno.format(meioDiaUtc(dias[dias.length - 1].dia));
    return maiuscula(a === b ? a : `${a.replace(/ de \d{4}$/, "")} — ${b}`);
  }, [dias]);

  const tipoFinal = servico === "sites" ? tipoNegocio.trim() : tipo;
  const completo =
    Boolean(servico && hora) &&
    nome.trim().length >= 2 &&
    /\S+@\S+\.\S+/.test(email) &&
    assunto.trim().length >= 2 &&
    tipoFinal.length >= 2;

  async function confirmar(e: React.FormEvent) {
    e.preventDefault();
    if (!completo || aEnviar) return;
    setErro(null);
    setAEnviar(true);

    try {
      const r = await fetch("/api/marcacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          servico,
          inicio: hora,
          nome,
          email,
          telefone: telefone || undefined,
          assunto,
          tipoAssunto: tipoFinal,
          mensagem: mensagem || undefined,
        }),
      });
      const dados = await r.json().catch(() => ({}));

      if (r.status === 401) {
        router.push("/entrar?next=" + encodeURIComponent("/marcar-reuniao"));
        return;
      }
      if (!r.ok) {
        setErro(dados.error ?? "Não foi possível marcar. Tenta outra vez.");
        if (dados.codigo === "hora_ocupada") {
          setHora(null);
          recarregar();
        }
        return;
      }

      router.push(`/marcar-reuniao/confirmada?id=${encodeURIComponent(dados.id)}`);
      return;
    } catch {
      setErro("Sem ligação ao servidor. Verifica a internet e tenta outra vez.");
    } finally {
      setAEnviar(false);
    }
  }

  /* ── Formulário ─────────────────────────────────────────────────── */

  const escolhida = hora ? new Date(hora) : null;

  return (
    <form onSubmit={confirmar} className="mt-10 grid items-start gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
      <div className="space-y-6">
        {/* 1. Serviço */}
        <fieldset className="card p-6 sm:p-8">
          <legend className="sr-only">Sobre o quê</legend>
          <Passo n={1} titulo="Sobre o quê?" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {SERVICOS.map((s) => {
              const ativo = servico === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={ativo}
                  onClick={() => setServico(s.id)}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    ativo ? "border-navy bg-blue-50 ring-1 ring-navy" : "border-line-strong bg-white hover:border-navy"
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-ink">{s.titulo}</span>
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                        ativo ? "border-navy bg-navy" : "border-line-strong"
                      }`}
                      aria-hidden
                    >
                      {ativo && <span className="h-2 w-2 rounded-full bg-white" />}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm text-body">{s.texto}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* 2. Dia e hora */}
        <div className="card p-6 sm:p-8">
          <Passo n={2} titulo="Dia e hora" />

          {estado === "a-carregar" && (
            <div className="mt-6 grid grid-cols-5 gap-2" aria-label="A carregar horários">
              {Array.from({ length: 15 }).map((_, i) => (
                <span key={i} className="h-14 animate-pulse rounded-md bg-surface" />
              ))}
            </div>
          )}

          {estado === "erro" && (
            <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-[15px] text-red-800">
              Não conseguimos carregar os horários.{" "}
              <button type="button" onClick={recarregar} className="font-semibold underline underline-offset-2">
                Tentar outra vez
              </button>
            </div>
          )}

          {estado === "pronto" && dias.length === 0 && (
            <p className="mt-6 rounded-md border border-line bg-surface p-4 text-[15px] text-body">
              Não há horários livres nos próximos dias. Fala connosco pelo WhatsApp e arranjamos uma hora.
            </p>
          )}

          {estado === "pronto" && dias.length > 0 && (
            <>
              <p className="mt-5 text-sm font-semibold text-ink">{tituloMeses}</p>
              <div className="mt-3 grid grid-cols-5 gap-2 text-center">
                {DIAS_SEMANA.map((d) => (
                  <span key={d} className="pb-1 text-xs font-semibold uppercase tracking-wide text-muted">
                    {d}
                  </span>
                ))}
                {semanas.flat().map((dia) => {
                  const disponivel = livres.has(dia);
                  const ativo = dia === diaEscolhido;
                  const num = Number(dia.slice(8));
                  return (
                    <button
                      key={dia}
                      type="button"
                      disabled={!disponivel}
                      onClick={() => {
                        setDiaEscolhido(dia);
                        setHora(null);
                      }}
                      aria-pressed={ativo}
                      aria-label={maiuscula(fmtDiaLongo.format(meioDiaUtc(dia)))}
                      className={`flex h-14 flex-col items-center justify-center rounded-md border text-[15px] transition-colors ${
                        ativo
                          ? "border-navy bg-navy font-semibold text-white"
                          : disponivel
                            ? "border-line-strong bg-white font-medium text-ink hover:border-navy"
                            : "cursor-not-allowed border-transparent bg-surface text-line-strong"
                      }`}
                    >
                      {num}
                      {(num === 1 || dia === semanas[0][0]) && (
                        <span className={`text-[10px] uppercase ${ativo ? "text-white/75" : "text-muted"}`}>
                          {fmtMesCurto.format(meioDiaUtc(dia)).replace(".", "")}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {diaEscolhido && (
                <div className="mt-7 border-t border-line pt-6">
                  <p className="font-semibold text-ink">{maiuscula(fmtDiaLongo.format(meioDiaUtc(diaEscolhido)))}</p>
                  {(["manha", "tarde"] as const).map((periodo) =>
                    horasDoDia[periodo].length > 0 ? (
                      <div key={periodo} className="mt-4">
                        <p className="field-label">{periodo === "manha" ? "Manhã" : "Tarde"}</p>
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {horasDoDia[periodo].map((h) => {
                            const ativo = h === hora;
                            return (
                              <button
                                key={h}
                                type="button"
                                onClick={() => setHora(h)}
                                aria-pressed={ativo}
                                className={`rounded-md border py-2.5 text-[15px] tabular-nums transition-colors ${
                                  ativo
                                    ? "border-navy bg-navy font-semibold text-white"
                                    : "border-line-strong bg-white text-ink hover:border-navy"
                                }`}
                              >
                                {fmtHora.format(new Date(h))}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null,
                  )}
                  <p className="mt-4 text-[13px] text-muted">Horas de Portugal continental.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* 3. Dados */}
        <div className="card p-6 sm:p-8">
          <Passo n={3} titulo="Os teus dados" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Campo rotulo={servico === "sites" ? "Nome da empresa" : "Nome do alojamento"}>
              <input
                className="input"
                required
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                placeholder={servico === "sites" ? "A tua empresa" : "Casa do Rio"}
                maxLength={120}
              />
            </Campo>
            {servico === "sites" ? (
              <Campo rotulo="Tipo de negócio">
                <input
                  className="input"
                  required
                  value={tipoNegocio}
                  onChange={(e) => setTipoNegocio(e.target.value)}
                  placeholder="Clínica, restaurante, imobiliária…"
                  maxLength={80}
                />
              </Campo>
            ) : (
              <Campo rotulo="Tipo de alojamento">
                <select className="input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  {TIPOS_IMOVEL.map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </Campo>
            )}
            <Campo rotulo="Nome">
              <input className="input" required autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} maxLength={80} />
            </Campo>
            <Campo rotulo="Email">
              <input className="input" required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Campo>
            <Campo rotulo="Telefone (opcional)">
              <input className="input" type="tel" autoComplete="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} maxLength={30} />
            </Campo>
            <div className="sm:col-span-2">
              <Campo rotulo="Alguma coisa que devamos saber? (opcional)">
                <textarea
                  className="input min-h-24 resize-y"
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  maxLength={2000}
                  placeholder={
                    servico === "sites"
                      ? "O que o site tem de fazer, prazos, sites de que gostas…"
                      : "Quantos quartos, onde está anunciado, para quando precisas…"
                  }
                />
              </Campo>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <aside className="card p-6 sm:p-7 lg:sticky lg:top-24">
        <p className="eyebrow">Resumo</p>
        <dl className="mt-4 divide-y divide-line border-y border-line text-[15px]">
          <Linha rotulo="Serviço" valor={SERVICOS.find((s) => s.id === servico)?.titulo} />
          <Linha rotulo="Dia" valor={escolhida ? maiuscula(fmtDiaLongo.format(escolhida)) : null} />
          <Linha rotulo="Hora" valor={escolhida ? fmtHora.format(escolhida) : null} />
          <Linha rotulo="Duração" valor="30 minutos" />
          <Linha rotulo="Formato" valor="Videochamada" />
        </dl>

        {erro && (
          <p role="alert" className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-800">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={!completo || aEnviar}
          className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {aEnviar ? "A marcar…" : "Confirmar marcação"}
        </button>
        <p className="mt-3 text-center text-[13px] text-muted">
          {completo ? "Recebes a confirmação por email." : "Escolhe o serviço, a hora e preenche os teus dados."}
        </p>
      </aside>
    </form>
  );
}

function Passo({ n, titulo }: { n: number; titulo: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-navy text-[13px] font-bold text-white">{n}</span>
      <h2 className="text-lg font-bold tracking-tight text-ink">{titulo}</h2>
    </div>
  );
}

function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="field-label">{rotulo}</span>
      {children}
    </label>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor?: string | null }) {
  return (
    <div className="flex justify-between gap-4 py-3">
      <dt className="text-muted">{rotulo}</dt>
      <dd className={`text-right font-medium ${valor ? "text-ink" : "text-line-strong"}`}>{valor || "—"}</dd>
    </div>
  );
}
