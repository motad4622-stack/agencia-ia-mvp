/**
 * Envio dos emails automáticos, com registo de cada envio.
 *
 * Regras:
 * - um envio nunca rebenta com quem o chamou: a marcação, a conta ou o
 *   briefing já estão gravados quando isto corre, e continuam gravados
 *   se o email falhar;
 * - cada envio fica em EmailLog, com o erro se falhar, e pode ser
 *   reenviado do /admin (reenviarEmail);
 * - fora de produção, todos os emails vão para a caixa de testes do
 *   Resend (delivered@resend.dev), para os testes locais nunca
 *   escreverem a clientes nem ao administrador.
 */
import crypto from "crypto";
import { Resend } from "resend";
import type { Booking } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { diaEmLisboa, fimDe, lisboaParaUtc, somarDias, SERVICOS, type Servico } from "@/lib/agenda";
import { gerarIcs, linkGoogleCalendar } from "@/lib/ics";
import {
  SITE_URL,
  linkReuniao,
  tplBriefingAdmin,
  tplBriefingCliente,
  tplCancelamentoAdmin,
  tplContaAdmin,
  tplLembreteAdmin,
  tplLembreteCliente,
  tplMarcacaoAdmin,
  tplMarcacaoCliente,
  type DadosBriefing,
  type DadosMarcacao,
  type Email,
} from "@/lib/email-templates";

export type TipoEmail =
  | "booking_client"
  | "booking_admin"
  | "reminder_client"
  | "reminder_admin"
  | "cancel_admin"
  | "account_admin"
  | "briefing_client"
  | "briefing_admin";

const REMETENTE =
  process.env.EMAIL_FROM || "NextIA Marketing <reunioes@nextiamarketing.website>";

export const EMAIL_ADMIN = process.env.ADMIN_EMAIL || "nextvisionia1@gmail.com";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const emProducao = process.env.NODE_ENV === "production";
const DESTINO_TESTES = process.env.EMAIL_DEV_TO || "delivered@resend.dev";

type Anexo = { filename: string; content: Buffer; contentType: string };

type Pedido = {
  to: string;
  email: Email;
  replyTo?: string;
  anexos?: Anexo[];
};

/* ── Cancelamento pelo cliente ────────────────────────────────────── */

/** Link de cancelamento de uma marcação. Cria o código se ainda não existir. */
export async function linkCancelamento(b: Pick<Booking, "id" | "cancelToken">): Promise<string> {
  let token = b.cancelToken;
  if (!token) {
    token = crypto.randomBytes(24).toString("base64url");
    await prisma.booking.update({ where: { id: b.id }, data: { cancelToken: token } });
  }
  return `${SITE_URL}/marcacao/${token}`;
}

/* ── Construção de cada email a partir da base de dados ───────────── */

type MarcacaoComConta = Booking & { user: { createdAt: Date } | null };

function paraDados(b: MarcacaoComConta): DadosMarcacao {
  return {
    id: b.id,
    servico: b.service,
    inicio: b.startsAt,
    duracaoMin: b.durationMin,
    nome: b.clientName,
    email: b.clientEmail,
    telefone: b.clientPhone,
    assunto: b.subject,
    tipoAssunto: b.subjectType,
    mensagem: b.message,
    criadaEm: b.createdAt,
    contaCriadaEm: b.user?.createdAt ?? null,
  };
}

function evento(b: Booking) {
  const reuniao = linkReuniao();
  return {
    uid: `${b.id}@nextiamarketing.website`,
    inicio: b.startsAt,
    fim: fimDe(b.startsAt, b.durationMin),
    titulo: `Reunião NextIA Marketing — ${SERVICOS[b.service as Servico] ?? b.service}`,
    descricao: reuniao
      ? `Videochamada de ${b.durationMin} minutos.\nLink: ${reuniao}`
      : `Videochamada de ${b.durationMin} minutos. O link segue por email antes da reunião.`,
    local: reuniao ?? "Videochamada",
    url: reuniao ?? undefined,
  };
}

async function dadosMarcacao(id: string) {
  const b = await prisma.booking.findUnique({
    where: { id },
    include: { user: { select: { createdAt: true } } },
  });
  if (!b) return null;

  const ev = evento(b);
  const anexo: Anexo = {
    filename: "reuniao-nextia.ics",
    content: Buffer.from(gerarIcs(ev), "utf8"),
    contentType: "text/calendar; charset=utf-8; method=PUBLISH",
  };

  return { reg: b, dados: paraDados(b), anexo, linkCalendario: linkGoogleCalendar(ev) };
}

async function dadosBriefing(id: string): Promise<DadosBriefing | null> {
  const l = await prisma.websiteLead.findUnique({ where: { id } });
  if (!l) return null;
  return {
    id: l.id,
    nome: l.clientName,
    email: l.clientEmail,
    telefone: l.clientPhone,
    empresa: l.companyName,
    tipoNegocio: l.businessType,
    necessidades: l.needs,
    orcamento: l.budgetRange,
    mensagem: l.message,
    criadoEm: l.createdAt,
  };
}

/** Início e fim (UTC) de um dia de calendário em Lisboa. */
function limitesDoDia(dia: string) {
  return { inicio: lisboaParaUtc(dia, "00:00"), fim: lisboaParaUtc(somarDias(dia, 1), "00:00") };
}

/** Monta o email de um tipo para um registo. Usado no envio e no reenvio. */
async function construir(tipo: TipoEmail, refId: string): Promise<Pedido | null> {
  switch (tipo) {
    case "booking_client": {
      const m = await dadosMarcacao(refId);
      if (!m || !m.dados.email) return null;
      return {
        to: m.dados.email,
        email: tplMarcacaoCliente(m.dados, m.linkCalendario, await linkCancelamento(m.reg)),
        replyTo: EMAIL_ADMIN,
        anexos: [m.anexo],
      };
    }
    case "booking_admin": {
      const m = await dadosMarcacao(refId);
      if (!m) return null;
      return {
        to: EMAIL_ADMIN,
        email: tplMarcacaoAdmin(m.dados),
        replyTo: m.dados.email || undefined,
        anexos: [m.anexo],
      };
    }
    case "reminder_client": {
      const m = await dadosMarcacao(refId);
      if (!m || !m.dados.email || m.reg.status !== "marcada") return null;
      return {
        to: m.dados.email,
        email: tplLembreteCliente(m.dados, m.linkCalendario, await linkCancelamento(m.reg)),
        replyTo: EMAIL_ADMIN,
        anexos: [m.anexo],
      };
    }
    case "reminder_admin": {
      // refId é o dia ("AAAA-MM-DD") e não uma marcação.
      const { inicio, fim } = limitesDoDia(refId);
      const lista = await prisma.booking.findMany({
        where: { status: "marcada", startsAt: { gte: inicio, lt: fim } },
        orderBy: { startsAt: "asc" },
        include: { user: { select: { createdAt: true } } },
      });
      if (lista.length === 0) return null;
      return { to: EMAIL_ADMIN, email: tplLembreteAdmin(inicio, lista.map(paraDados)) };
    }
    case "cancel_admin": {
      const m = await dadosMarcacao(refId);
      if (!m) return null;
      return { to: EMAIL_ADMIN, email: tplCancelamentoAdmin(m.dados), replyTo: m.dados.email || undefined };
    }
    case "account_admin": {
      const u = await prisma.user.findUnique({ where: { id: refId } });
      if (!u) return null;
      const metodo = u.passwordHash ? "password" : "google";
      const total = await prisma.user.count();
      return {
        to: EMAIL_ADMIN,
        email: tplContaAdmin({ nome: u.name, email: u.email, metodo, criadaEm: u.createdAt, total }),
        replyTo: u.email,
      };
    }
    case "briefing_client": {
      const b = await dadosBriefing(refId);
      if (!b || !b.email) return null;
      return { to: b.email, email: tplBriefingCliente(b), replyTo: EMAIL_ADMIN };
    }
    case "briefing_admin": {
      const b = await dadosBriefing(refId);
      if (!b) return null;
      return { to: EMAIL_ADMIN, email: tplBriefingAdmin(b), replyTo: b.email || undefined };
    }
  }
}

/* ── Envio ─────────────────────────────────────────────────────────── */

async function entregar(p: Pedido): Promise<{ ok: true; id: string | null } | { ok: false; erro: string }> {
  if (!resend) return { ok: false, erro: "RESEND_API_KEY não está definida." };

  const destino = emProducao ? p.to : DESTINO_TESTES;
  try {
    const { data, error } = await resend.emails.send({
      from: REMETENTE,
      to: destino,
      subject: emProducao ? p.email.assunto : `[teste → ${p.to}] ${p.email.assunto}`,
      html: p.email.html,
      text: p.email.texto,
      replyTo: p.replyTo,
      attachments: p.anexos,
    });
    if (error) return { ok: false, erro: `${error.name}: ${error.message}` };
    return { ok: true, id: data?.id ?? null };
  } catch (e) {
    return { ok: false, erro: e instanceof Error ? e.message : String(e) };
  }
}

/** Envia um email e regista o resultado. Nunca lança. */
async function enviar(tipo: TipoEmail, refId: string): Promise<boolean> {
  try {
    const pedido = await construir(tipo, refId);
    if (!pedido) return false; // p.ex. cliente sem email: não há nada a enviar

    const r = await entregar(pedido);
    await prisma.emailLog.create({
      data: {
        kind: tipo,
        refId,
        to: pedido.to,
        subject: pedido.email.assunto,
        status: r.ok ? "enviado" : "falhou",
        providerId: r.ok ? r.id : null,
        error: r.ok ? null : r.erro.slice(0, 1000),
      },
    });
    if (!r.ok) console.error(`[email] ${tipo} ${refId} falhou:`, r.erro);
    return r.ok;
  } catch (e) {
    console.error(`[email] ${tipo} ${refId} rebentou:`, e);
    return false;
  }
}

/* ── O que o resto do site chama ──────────────────────────────────── */

/** Marcação criada: confirmação ao cliente e aviso ao administrador. */
export async function notificarMarcacao(bookingId: string): Promise<void> {
  await Promise.all([enviar("booking_client", bookingId), enviar("booking_admin", bookingId)]);
}

/** O cliente cancelou pelo link do email: aviso ao administrador. */
export async function notificarCancelamento(bookingId: string): Promise<void> {
  await enviar("cancel_admin", bookingId);
}

/** Conta criada (por palavra-passe ou Google): aviso ao administrador. */
export async function notificarConta(userId: string): Promise<void> {
  await enviar("account_admin", userId);
}

/** Pedido de briefing: aviso ao administrador e confirmação ao cliente. */
export async function notificarBriefing(leadId: string): Promise<void> {
  await Promise.all([enviar("briefing_admin", leadId), enviar("briefing_client", leadId)]);
}

/**
 * Lembretes da véspera: um email a cada cliente com reunião amanhã e um
 * resumo do dia para o administrador. Corre uma vez por dia (Vercel Cron).
 * É seguro correr mais do que uma vez: cada lembrete só sai uma vez.
 */
export async function enviarLembretes(agora = new Date()) {
  const amanha = somarDias(diaEmLisboa(agora), 1);
  const { inicio, fim } = limitesDoDia(amanha);
  const marcacoes = await prisma.booking.findMany({
    where: { status: "marcada", startsAt: { gte: inicio, lt: fim } },
    orderBy: { startsAt: "asc" },
  });

  let clientes = 0;
  for (const b of marcacoes) {
    if (b.reminderSentAt) continue;
    if (await enviar("reminder_client", b.id)) {
      await prisma.booking.update({ where: { id: b.id }, data: { reminderSentAt: new Date() } });
      clientes++;
    }
  }

  let resumoAdmin = false;
  if (marcacoes.length > 0) {
    const jaEnviado = await prisma.emailLog.findFirst({
      where: { kind: "reminder_admin", refId: amanha, status: "enviado" },
    });
    resumoAdmin = jaEnviado ? true : await enviar("reminder_admin", amanha);
  }

  return { dia: amanha, marcacoes: marcacoes.length, lembretesEnviados: clientes, resumoAdmin };
}

/** Reenvia um email registado (normalmente um que falhou). */
export async function reenviarEmail(logId: string): Promise<{ ok: boolean; erro?: string }> {
  const log = await prisma.emailLog.findUnique({ where: { id: logId } });
  if (!log) return { ok: false, erro: "Registo não encontrado." };

  const pedido = await construir(log.kind as TipoEmail, log.refId);
  if (!pedido) return { ok: false, erro: "O registo de origem já não existe." };

  const r = await entregar(pedido);
  await prisma.emailLog.update({
    where: { id: logId },
    data: {
      status: r.ok ? "enviado" : "falhou",
      providerId: r.ok ? r.id : log.providerId,
      error: r.ok ? null : r.erro.slice(0, 1000),
      attempts: { increment: 1 },
      to: pedido.to,
      subject: pedido.email.assunto,
    },
  });
  return r.ok ? { ok: true } : { ok: false, erro: r.erro };
}
