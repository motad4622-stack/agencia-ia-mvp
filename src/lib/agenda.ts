/**
 * Agenda de marcações do site.
 *
 * Tudo o que decide "que horas aparecem livres" está aqui: horário de
 * trabalho, duração, antecedência, feriados e fuso. Mudar o horário é
 * mudar HORARIO abaixo — o resto do site acompanha.
 *
 * As horas guardam-se em UTC na base de dados e mostram-se sempre na
 * hora de Lisboa, com a mudança de hora de verão/inverno tratada.
 */

export const FUSO = "Europe/Lisbon";

export const AGENDA = {
  /** Duração de cada reunião. */
  duracaoMin: 30,
  /** De quanto em quanto tempo começa um horário. */
  passoMin: 30,
  /** Folga livre antes e depois de cada reunião já marcada. */
  folgaMin: 15,
  /** Ninguém marca para daqui a menos de isto. */
  antecedenciaHoras: 12,
  /** Até quantos dias à frente se pode marcar. */
  horizonteDias: 30,
};

/**
 * Horário de trabalho por dia da semana (0 = domingo … 6 = sábado).
 * Cada par é [início, fim] — o fim é a hora a que a última reunião acaba.
 */
const HORARIO: Record<number, [string, string][]> = {
  1: [["09:30", "12:30"], ["14:00", "18:00"]],
  2: [["09:30", "12:30"], ["14:00", "18:00"]],
  3: [["09:30", "12:30"], ["14:00", "18:00"]],
  4: [["09:30", "12:30"], ["14:00", "18:00"]],
  5: [["09:30", "12:30"], ["14:00", "18:00"]],
};

export const SERVICOS = {
  videos: "Vídeo de IA para alojamento",
  sites: "Site com IA",
} as const;

export type Servico = keyof typeof SERVICOS;

export const TIPOS_IMOVEL: Record<string, string> = {
  airbnb: "Airbnb",
  alojamento_local: "Alojamento local",
  hotel: "Hotel",
};

/* ── Fuso horário ─────────────────────────────────────────────────── */

const partesFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: FUSO,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** Diferença, em minutos, entre a hora de Lisboa e UTC num dado instante. */
function desvioMin(instante: Date): number {
  const p = Object.fromEntries(
    partesFmt.formatToParts(instante).map((x) => [x.type, x.value]),
  );
  const comoUtc = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    Number(p.hour),
    Number(p.minute),
    Number(p.second),
  );
  return Math.round((comoUtc - instante.getTime()) / 60000);
}

/** "2026-09-15" + "10:00" em Lisboa → instante em UTC. */
export function lisboaParaUtc(dia: string, hora: string): Date {
  const [a, m, d] = dia.split("-").map(Number);
  const [h, mi] = hora.split(":").map(Number);
  const palpite = Date.UTC(a, m - 1, d, h, mi);
  const desvio1 = desvioMin(new Date(palpite));
  let ts = palpite - desvio1 * 60000;
  const desvio2 = desvioMin(new Date(ts));
  if (desvio2 !== desvio1) ts = palpite - desvio2 * 60000;
  return new Date(ts);
}

/** Dia de calendário em Lisboa ("AAAA-MM-DD") de um instante. */
export function diaEmLisboa(instante: Date): string {
  const p = Object.fromEntries(
    partesFmt.formatToParts(instante).map((x) => [x.type, x.value]),
  );
  return `${p.year}-${p.month}-${p.day}`;
}

function somarDias(dia: string, n: number): string {
  const [a, m, d] = dia.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, d + n)).toISOString().slice(0, 10);
}

function diaDaSemana(dia: string): number {
  const [a, m, d] = dia.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, d)).getUTCDay();
}

/* ── Formatação para mostrar a pessoas ────────────────────────────── */

export function formatarDia(instante: Date): string {
  return new Intl.DateTimeFormat("pt-PT", {
    timeZone: FUSO,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(instante);
}

export function formatarHora(instante: Date): string {
  return new Intl.DateTimeFormat("pt-PT", {
    timeZone: FUSO,
    hour: "2-digit",
    minute: "2-digit",
  }).format(instante);
}

/* ── Feriados nacionais ───────────────────────────────────────────── */

/** Domingo de Páscoa (algoritmo gregoriano anónimo). */
function pascoa(ano: number): string {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

/** Feriados obrigatórios do Código do Trabalho (art. 234.º). */
function feriados(ano: number): Set<string> {
  const p = pascoa(ano);
  const fixos = ["01-01", "04-25", "05-01", "06-10", "08-15", "10-05", "11-01", "12-01", "12-08", "12-25"];
  return new Set([
    ...fixos.map((md) => `${ano}-${md}`),
    somarDias(p, -2), // Sexta-feira Santa
    somarDias(p, 60), // Corpo de Deus
  ]);
}

/* ── Disponibilidade ──────────────────────────────────────────────── */

type Intervalo = { startsAt: Date; endsAt: Date };

export type DiaDisponivel = { dia: string; horas: string[] };

function sobrepoe(a0: number, a1: number, b0: number, b1: number) {
  return a0 < b1 && b0 < a1;
}

/**
 * Horas livres para os próximos dias.
 *
 * `ocupadas` são as marcações ativas; `bloqueios` os períodos fechados no
 * /admin. Devolve só dias úteis com pelo menos uma hora livre.
 */
export function horasLivres(
  ocupadas: Intervalo[],
  bloqueios: Intervalo[],
  agora = new Date(),
): DiaDisponivel[] {
  const dur = AGENDA.duracaoMin * 60000;
  const folga = AGENDA.folgaMin * 60000;
  const minimo = agora.getTime() + AGENDA.antecedenciaHoras * 3600000;
  const hoje = diaEmLisboa(agora);
  const resultado: DiaDisponivel[] = [];
  const cacheFeriados = new Map<number, Set<string>>();

  for (let n = 0; n <= AGENDA.horizonteDias; n++) {
    const dia = somarDias(hoje, n);
    const janelas = HORARIO[diaDaSemana(dia)];
    if (!janelas) continue;

    const ano = Number(dia.slice(0, 4));
    if (!cacheFeriados.has(ano)) cacheFeriados.set(ano, feriados(ano));
    if (cacheFeriados.get(ano)!.has(dia)) continue;

    const horas: string[] = [];
    for (const [ini, fim] of janelas) {
      const limite = lisboaParaUtc(dia, fim).getTime();
      for (
        let t = lisboaParaUtc(dia, ini).getTime();
        t + dur <= limite;
        t += AGENDA.passoMin * 60000
      ) {
        if (t < minimo) continue;
        const colide =
          ocupadas.some((o) =>
            sobrepoe(t, t + dur, o.startsAt.getTime() - folga, o.endsAt.getTime() + folga),
          ) ||
          bloqueios.some((b) =>
            sobrepoe(t, t + dur, b.startsAt.getTime(), b.endsAt.getTime()),
          );
        if (!colide) horas.push(new Date(t).toISOString());
      }
    }
    if (horas.length > 0) resultado.push({ dia, horas });
  }

  return resultado;
}

/** Confirma, no servidor, que um início pedido é mesmo uma hora livre. */
export function horaEstaLivre(
  inicio: Date,
  ocupadas: Intervalo[],
  bloqueios: Intervalo[],
  agora = new Date(),
): boolean {
  const iso = inicio.toISOString();
  return horasLivres(ocupadas, bloqueios, agora).some((d) => d.horas.includes(iso));
}

/** Fim de uma marcação, a partir do início e da duração. */
export function fimDe(inicio: Date, duracaoMin = AGENDA.duracaoMin): Date {
  return new Date(inicio.getTime() + duracaoMin * 60000);
}
