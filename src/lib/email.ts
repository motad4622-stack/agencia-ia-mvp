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
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { fimDe, SERVICOS, type Servico } from "@/lib/agenda";
import { gerarIcs, linkGoogleCalendar } from "@/lib/ics";
import {
  linkReuniao,
  tplBriefingAdmin,
  tplBriefingCliente,
  tplContaAdmin,
  tplMarcacaoAdmin,
  tplMarcacaoCliente,
  type DadosBriefing,
  type DadosMarcacao,
  type Email,
} from "@/lib/email-templates";

export type TipoEmail =
  | "booking_client"
  | "booking_admin"
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

/* ── Construção de cada email a partir da base de dados ───────────── */

async function dadosMarcacao(id: string) {
  const b = await prisma.booking.findUnique({
    where: { id },
    include: { user: { select: { createdAt: true } } },
  });
  if (!b) return null;

  const dados: DadosMarcacao = {
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

  const reuniao = linkReuniao();
  const evento = {
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

  const anexo: Anexo = {
    filename: "reuniao-nextia.ics",
    content: Buffer.from(gerarIcs(evento), "utf8"),
    contentType: "text/calendar; charset=utf-8; method=PUBLISH",
  };

  return { dados, anexo, linkCalendario: linkGoogleCalendar(evento) };
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

/** Monta o email de um tipo para um registo. Usado no envio e no reenvio. */
async function construir(tipo: TipoEmail, refId: string): Promise<Pedido | null> {
  switch (tipo) {
    case "booking_client": {
      const m = await dadosMarcacao(refId);
      if (!m || !m.dados.email) return null;
      return {
        to: m.dados.email,
        email: tplMarcacaoCliente(m.dados, m.linkCalendario),
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

/** Conta criada (por palavra-passe ou Google): aviso ao administrador. */
export async function notificarConta(userId: string): Promise<void> {
  await enviar("account_admin", userId);
}

/** Pedido de briefing: aviso ao administrador e confirmação ao cliente. */
export async function notificarBriefing(leadId: string): Promise<void> {
  await Promise.all([enviar("briefing_admin", leadId), enviar("briefing_client", leadId)]);
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


