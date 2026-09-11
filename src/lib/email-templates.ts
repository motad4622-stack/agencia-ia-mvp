/**
 * Templates dos emails automáticos da NextIA Marketing.
 *
 * Tudo sai da identidade do site (src/app/globals.css): as mesmas cores,
 * os mesmos raios (botões 8px, cartões 16px), as etiquetas em maiúsculas
 * a azul e o logótipo oficial. Nada aqui é uma marca nova.
 *
 * Regras de email, não de web:
 * - tabelas e estilos inline, porque o Gmail e o Outlook ignoram quase
 *   todo o resto;
 * - imagens servidas do próprio domínio, por URL absoluto;
 * - tudo o que vem de quem preencheu o formulário passa por esc().
 */

import { WHATSAPP_DISPLAY, BRAND_NAME } from "@/lib/brand";
import { SERVICOS, TIPOS_IMOVEL, formatarDia, formatarHora, fimDe, type Servico } from "@/lib/agenda";

export const SITE_URL = (process.env.SITE_URL || "https://nextiamarketing.website").replace(/\/$/, "");

const C = {
  navy: "#0b2545",
  blue: "#2f7fe0",
  blue50: "#eef4fd",
  green: "#1fa860",
  ink: "#0f2038",
  body: "#4b5769",
  muted: "#7d8899",
  line: "#e3e8ef",
  lineStrong: "#cfd7e3",
  surface: "#f6f8fb",
  white: "#ffffff",
};

const FONT =
  "'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const img = (nome: string) => `${SITE_URL}/email/${nome}.png`;

/* ── Utilitários ──────────────────────────────────────────────────── */

export function esc(valor: string | null | undefined): string {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Texto livre com quebras de linha preservadas. */
const paragrafos = (v: string) => esc(v).replace(/\r?\n/g, "<br>");

const primeiroNome = (nome: string) => nome.trim().split(/\s+/)[0] || nome;

function dataCurta(d: Date): string {
  return new Intl.DateTimeFormat("pt-PT", {
    timeZone: "Europe/Lisbon",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

function dataHora(d: Date): string {
  return `${dataCurta(d)} às ${formatarHora(d)}`;
}

const maiuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ── Blocos ───────────────────────────────────────────────────────── */

function eyebrow(texto: string, cor = C.blue): string {
  return `<p style="margin:0;font-family:${FONT};font-size:12px;line-height:18px;font-weight:600;letter-spacing:1.7px;text-transform:uppercase;color:${cor};">${texto}</p>`;
}

function heroi(o: { icone: string; etiqueta: string; titulo: string; texto: string; corEtiqueta?: string }): string {
  return `
  <tr><td class="px" style="padding:36px 40px 8px 40px;">
    <img src="${img(o.icone)}" width="56" height="56" alt="" style="display:block;width:56px;height:56px;border:0;margin:0 0 20px 0;">
    ${eyebrow(o.etiqueta, o.corEtiqueta)}
    <h1 style="margin:8px 0 0 0;font-family:${FONT};font-size:28px;line-height:34px;font-weight:700;letter-spacing:-0.4px;color:${C.ink};">${o.titulo}</h1>
    <p style="margin:12px 0 0 0;font-family:${FONT};font-size:16px;line-height:26px;color:${C.body};">${o.texto}</p>
  </td></tr>`;
}

type LinhaResumo = { icone: string; principal: string; secundario?: string };

/** Cartão de destaque com dia, hora e formato — o que se lê primeiro. */
function cartaoResumo(servico: string, linhas: LinhaResumo[]): string {
  const itens = linhas
    .map(
      (l, i) => `
      <tr>
        <td width="36" valign="top" style="padding:${i === 0 ? "0" : "14px"} 0 0 0;width:36px;">
          <img src="${img(l.icone)}" width="24" height="24" alt="" style="display:block;width:24px;height:24px;border:0;">
        </td>
        <td valign="top" style="padding:${i === 0 ? "0" : "14px"} 0 0 0;font-family:${FONT};">
          <p style="margin:0;font-size:16px;line-height:24px;font-weight:600;color:${C.ink};">${l.principal}</p>
          ${l.secundario ? `<p style="margin:2px 0 0 0;font-size:14px;line-height:20px;color:${C.body};">${l.secundario}</p>` : ""}
        </td>
      </tr>`,
    )
    .join("");

  return `
  <tr><td class="px" style="padding:24px 40px 0 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;background:${C.surface};border:1px solid ${C.line};border-radius:12px;">
      <tr><td style="padding:22px 24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px 0;"><tr>
          <td style="background:${C.blue50};border-radius:6px;padding:5px 10px;font-family:${FONT};font-size:12px;line-height:16px;font-weight:600;color:${C.blue};">${servico}</td>
        </tr></table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itens}</table>
      </td></tr>
    </table>
  </td></tr>`;
}

type Botao = { href: string; texto: string };

function botoes(primario?: Botao, secundario?: Botao): string {
  if (!primario && !secundario) return "";
  const b = (x: Botao, principal: boolean) => `
    <td class="stack btn" style="padding:0 12px 12px 0;">
      <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;"><tr>
        <td align="center" bgcolor="${principal ? C.navy : C.white}" style="border-radius:8px;${principal ? "" : `border:1px solid ${C.lineStrong};`}">
          <a href="${x.href}" target="_blank" style="display:inline-block;padding:13px 24px;font-family:${FONT};font-size:15px;line-height:20px;font-weight:600;color:${principal ? C.white : C.ink};text-decoration:none;border-radius:8px;">${x.texto}</a>
        </td>
      </tr></table>
    </td>`;
  return `
  <tr><td class="px" style="padding:24px 40px 12px 40px;">
    <table role="presentation" class="btns" cellpadding="0" cellspacing="0"><tr>
      ${primario ? b(primario, true) : ""}${secundario ? b(secundario, false) : ""}
    </tr></table>
  </td></tr>`;
}

/** Secção de pares etiqueta / valor, separados por linhas finas. */
function seccao(titulo: string, linhas: [string, string | null | undefined][]): string {
  const visiveis = linhas.filter(([, v]) => v && String(v).trim() !== "");
  if (visiveis.length === 0) return "";
  const rows = visiveis
    .map(
      ([rotulo, valor], i) => `
      <tr>
        <td class="stack" valign="top" width="34%" style="width:34%;padding:12px 16px 12px 0;${i ? `border-top:1px solid ${C.line};` : ""}font-family:${FONT};font-size:12px;line-height:20px;font-weight:600;letter-spacing:0.6px;text-transform:uppercase;color:${C.muted};">${rotulo}</td>
        <td class="stack valor" valign="top" style="padding:12px 0;${i ? `border-top:1px solid ${C.line};` : ""}font-family:${FONT};font-size:15px;line-height:22px;color:${C.ink};">${valor}</td>
      </tr>`,
    )
    .join("");
  return `
  <tr><td class="px" style="padding:28px 40px 0 40px;">
    ${eyebrow(titulo)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;border-top:1px solid ${C.line};border-bottom:1px solid ${C.line};">${rows}</table>
  </td></tr>`;
}

function nota(html: string): string {
  return `
  <tr><td class="px" style="padding:28px 40px 0 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border:1px solid ${C.line};border-left:3px solid ${C.blue};border-radius:8px;">
      <tr><td style="padding:16px 18px;font-family:${FONT};font-size:14px;line-height:22px;color:${C.body};">${html}</td></tr>
    </table>
  </td></tr>`;
}

function assinatura(texto: string): string {
  return `
  <tr><td class="px" style="padding:28px 40px 36px 40px;font-family:${FONT};font-size:15px;line-height:24px;color:${C.body};">${texto}</td></tr>`;
}

const link = (href: string, texto: string) =>
  `<a href="${href}" style="color:${C.blue};text-decoration:none;font-weight:600;">${texto}</a>`;

/* ── Moldura ──────────────────────────────────────────────────────── */

function layout(o: { titulo: string; preheader: string; corpo: string; motivo: string }): string {
  const ano = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="pt" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(o.titulo)}</title>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700&display=swap" rel="stylesheet">
<!--[if mso]><style>table,td,p,a,h1{font-family:Arial,sans-serif!important;}</style><![endif]-->
<style>
  body{margin:0!important;padding:0!important;width:100%!important;}
  a{color:${C.blue};}
  @media only screen and (max-width:640px){
    .contentor{width:100%!important;}
    .px{padding-left:22px!important;padding-right:22px!important;}
    .stack{display:block!important;width:100%!important;box-sizing:border-box;}
    .stack.valor{padding-top:0!important;border-top:0!important;}
    .btns{width:100%!important;}
    .btn{padding-right:0!important;}
    .btn table,.btn tbody,.btn tr,.btn td,.btn a{display:block!important;width:100%!important;box-sizing:border-box;text-align:center;}
    h1{font-size:24px!important;line-height:30px!important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.surface};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(o.preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.surface}" style="background:${C.surface};">
<tr><td align="center" style="padding:32px 12px 40px 12px;">

  <table role="presentation" class="contentor" width="640" cellpadding="0" cellspacing="0" style="width:640px;max-width:640px;">

    <tr><td style="background:${C.white};border:1px solid ${C.line};border-radius:16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td class="px" style="padding:22px 40px;border-bottom:1px solid ${C.line};">
          <a href="${SITE_URL}" target="_blank"><img src="${img("logo")}" width="174" height="61" alt="${BRAND_NAME}" style="display:block;width:174px;height:61px;border:0;margin-left:-12px;"></a>
        </td></tr>
        ${o.corpo}
      </table>
    </td></tr>

    <tr><td class="px" align="center" style="padding:28px 40px 0 40px;font-family:${FONT};font-size:13px;line-height:21px;color:${C.muted};">
      <img src="${img("logo")}" width="116" height="41" alt="${BRAND_NAME}" style="display:block;width:116px;height:41px;border:0;margin:0 auto 10px auto;">
      <p style="margin:0 0 4px 0;font-weight:600;color:${C.body};">${BRAND_NAME}</p>
      <p style="margin:0;">Vídeos de alojamento e sites com IA</p>
      <p style="margin:10px 0 0 0;">${link(SITE_URL, "nextiamarketing.website")} &nbsp;·&nbsp; WhatsApp ${WHATSAPP_DISPLAY}</p>
      <p style="margin:14px 0 0 0;">© ${ano} ${BRAND_NAME}. Todos os direitos reservados.</p>
      <p style="margin:6px 0 0 0;">${o.motivo}</p>
    </td></tr>

  </table>

</td></tr>
</table>
</body>
</html>`;
}

/* ── Dados ────────────────────────────────────────────────────────── */

export type DadosMarcacao = {
  id: string;
  servico: string;
  inicio: Date;
  duracaoMin: number;
  nome: string;
  email: string;
  telefone: string | null;
  assunto: string;
  tipoAssunto: string;
  mensagem: string | null;
  criadaEm: Date;
  contaCriadaEm?: Date | null;
};

export type Email = { assunto: string; html: string; texto: string };

const nomeServico = (s: string) => SERVICOS[s as Servico] ?? s;
const sobreServico = (s: string) => (s === "sites" ? "um site com IA" : s === "videos" ? "um vídeo de IA para alojamento" : nomeServico(s));
const rotuloAssunto = (s: string) => (s === "sites" ? "Empresa" : "Alojamento");
const rotuloTipo = (s: string) => (s === "sites" ? "Tipo de negócio" : "Tipo de alojamento");
const valorTipo = (s: string, t: string) => (s === "sites" ? t : TIPOS_IMOVEL[t] ?? t);

const ORCAMENTOS: Record<string, string> = {
  "<1000": "Menos de 1000€",
  "1000-5000": "1000€ – 5000€",
  "5000+": "Mais de 5000€",
};

/** Link fixo da videochamada, se existir (MEETING_URL). */
export function linkReuniao(): string | null {
  const u = process.env.MEETING_URL?.trim();
  return u ? u : null;
}

function resumoMarcacao(m: DadosMarcacao): string {
  const fim = fimDe(m.inicio, m.duracaoMin);
  return cartaoResumo(esc(nomeServico(m.servico)), [
    { icone: "calendario", principal: maiuscula(formatarDia(m.inicio)) },
    {
      icone: "relogio",
      principal: `${formatarHora(m.inicio)} – ${formatarHora(fim)}`,
      secundario: "Hora de Portugal continental",
    },
    {
      icone: "video",
      principal: `Videochamada · ${m.duracaoMin} minutos`,
      secundario: linkReuniao() ? "O link está no botão abaixo" : "O link segue por email antes da reunião",
    },
  ]);
}

/* ── 1. Marcação confirmada → cliente ─────────────────────────────── */

export function tplMarcacaoCliente(m: DadosMarcacao, linkCalendario: string): Email {
  const reuniao = linkReuniao();
  const quando = `${formatarDia(m.inicio)} às ${formatarHora(m.inicio)}`;

  const corpo =
    heroi({
      icone: "destaque-confirmado",
      etiqueta: "Marcação confirmada",
      corEtiqueta: C.green,
      titulo: "A tua reunião está marcada",
      texto: `Olá ${esc(primeiroNome(m.nome))}, obrigado por marcares connosco. Guardámos este horário para ti.`,
    }) +
    resumoMarcacao(m) +
    botoes(
      reuniao ? { href: reuniao, texto: "Entrar na videochamada" } : { href: linkCalendario, texto: "Adicionar ao calendário" },
      reuniao ? { href: linkCalendario, texto: "Adicionar ao calendário" } : undefined,
    ) +
    `<tr><td class="px" style="padding:0 40px;font-family:${FONT};font-size:13px;line-height:20px;color:${C.muted};">Segue também em anexo um convite (.ics) que abre no Outlook e no Apple Calendar.</td></tr>` +
    seccao("Detalhes da marcação", [
      ["Serviço", esc(nomeServico(m.servico))],
      [rotuloAssunto(m.servico), esc(m.assunto)],
      [rotuloTipo(m.servico), esc(valorTipo(m.servico, m.tipoAssunto))],
      ["A tua mensagem", m.mensagem ? paragrafos(m.mensagem) : null],
    ]) +
    seccao("Os teus dados", [
      ["Nome", esc(m.nome)],
      ["Email", esc(m.email)],
      ["Telefone", m.telefone ? esc(m.telefone) : null],
    ]) +
    nota(
      `<strong style="color:${C.ink};">Precisas de mudar alguma coisa?</strong><br>Responde a este email ou fala connosco por WhatsApp — ${WHATSAPP_DISPLAY}.`,
    ) +
    assinatura(`Até breve,<br><strong style="color:${C.ink};">Equipa ${BRAND_NAME}</strong>`);

  const texto = [
    `Marcação confirmada`,
    ``,
    `Olá ${primeiroNome(m.nome)}, a tua reunião está marcada.`,
    ``,
    `Quando: ${quando} (${m.duracaoMin} minutos)`,
    `Formato: videochamada${reuniao ? ` — ${reuniao}` : " — o link segue por email antes da reunião"}`,
    `Serviço: ${nomeServico(m.servico)}`,
    `${rotuloAssunto(m.servico)}: ${m.assunto}`,
    `${rotuloTipo(m.servico)}: ${valorTipo(m.servico, m.tipoAssunto)}`,
    ...(m.mensagem ? [`A tua mensagem: ${m.mensagem}`] : []),
    ``,
    `Adicionar ao calendário: ${linkCalendario}`,
    ``,
    `Precisas de mudar alguma coisa? Responde a este email ou fala connosco por WhatsApp — ${WHATSAPP_DISPLAY}.`,
    ``,
    `Equipa ${BRAND_NAME} — ${SITE_URL}`,
  ].join("\n");

  return {
    assunto: `Marcação confirmada — ${quando}`,
    html: layout({
      titulo: "Marcação confirmada",
      preheader: `${maiuscula(quando)} · ${nomeServico(m.servico)} · videochamada de ${m.duracaoMin} minutos.`,
      corpo,
      motivo: "Recebeste este email porque marcaste uma reunião em nextiamarketing.website.",
    }),
    texto,
  };
}

/* ── 2. Nova marcação → administrador ─────────────────────────────── */

export function tplMarcacaoAdmin(m: DadosMarcacao): Email {
  const reuniao = linkReuniao();
  const quando = `${formatarDia(m.inicio)} às ${formatarHora(m.inicio)}`;
  const email = esc(m.email);

  const corpo =
    heroi({
      icone: "destaque-marcacao",
      etiqueta: "Nova marcação",
      titulo: "Nova marcação recebida",
      texto: `<strong style="color:${C.ink};">${esc(m.nome)}</strong> marcou uma reunião sobre ${esc(sobreServico(m.servico))}.`,
    }) +
    resumoMarcacao(m) +
    botoes(
      { href: `${SITE_URL}/admin/dashboard`, texto: "Ver no back-office" },
      { href: `mailto:${encodeURIComponent(m.email)}`, texto: `Responder a ${esc(primeiroNome(m.nome))}` },
    ) +
    seccao("Cliente", [
      ["Nome", esc(m.nome)],
      ["Email", link(`mailto:${encodeURIComponent(m.email)}`, email)],
      ["Telefone", m.telefone ? link(`tel:${m.telefone.replace(/[^\d+]/g, "")}`, esc(m.telefone)) : null],
      ["Conta criada", m.contaCriadaEm ? dataHora(m.contaCriadaEm) : null],
    ]) +
    seccao("Marcação", [
      ["Serviço", esc(nomeServico(m.servico))],
      [rotuloAssunto(m.servico), esc(m.assunto)],
      [rotuloTipo(m.servico), esc(valorTipo(m.servico, m.tipoAssunto))],
      ["Mensagem", m.mensagem ? paragrafos(m.mensagem) : null],
      ["Marcada em", dataHora(m.criadaEm)],
    ]) +
    (reuniao
      ? ""
      : nota(
          `<strong style="color:${C.ink};">Falta o link da videochamada.</strong><br>O cliente foi informado de que o recebe por email antes da reunião.`,
        )) +
    `<tr><td style="padding:0 0 36px 0;"></td></tr>`;

  const texto = [
    `Nova marcação recebida`,
    ``,
    `${m.nome} marcou uma reunião.`,
    ``,
    `Quando: ${quando} (${m.duracaoMin} minutos)`,
    `Serviço: ${nomeServico(m.servico)}`,
    `${rotuloAssunto(m.servico)}: ${m.assunto}`,
    `${rotuloTipo(m.servico)}: ${valorTipo(m.servico, m.tipoAssunto)}`,
    ...(m.mensagem ? [`Mensagem: ${m.mensagem}`] : []),
    ``,
    `Nome: ${m.nome}`,
    `Email: ${m.email}`,
    ...(m.telefone ? [`Telefone: ${m.telefone}`] : []),
    ``,
    ...(reuniao ? [] : [`Falta enviar o link da videochamada ao cliente.`, ``]),
    `Back-office: ${SITE_URL}/admin/dashboard`,
  ].join("\n");

  return {
    assunto: `Nova marcação: ${m.nome} · ${dataCurta(m.inicio).slice(0, 5)} às ${formatarHora(m.inicio)}`,
    html: layout({
      titulo: "Nova marcação recebida",
      preheader: `${m.nome} · ${nomeServico(m.servico)} · ${quando}.`,
      corpo,
      motivo: "Notificação automática do site nextiamarketing.website.",
    }),
    texto,
  };
}

/* ── 3. Conta criada → administrador ──────────────────────────────── */

export function tplContaAdmin(o: {
  nome: string | null;
  email: string;
  metodo: "password" | "google";
  criadaEm: Date;
  total: number;
}): Email {
  const nome = o.nome?.trim() || o.email;
  const metodo = o.metodo === "google" ? "Google" : "Email e palavra-passe";

  const corpo =
    heroi({
      icone: "destaque-conta",
      etiqueta: "Nova conta",
      titulo: "Nova conta criada",
      texto: `<strong style="color:${C.ink};">${esc(nome)}</strong> criou conta no site. Ainda não marcou nada — quando marcar, recebes outro aviso.`,
    }) +
    seccao("Conta", [
      ["Nome", o.nome ? esc(o.nome) : null],
      ["Email", link(`mailto:${encodeURIComponent(o.email)}`, esc(o.email))],
      ["Entrou com", metodo],
      ["Criada em", dataHora(o.criadaEm)],
      ["Total de contas", String(o.total)],
    ]) +
    botoes({ href: `${SITE_URL}/admin/dashboard`, texto: "Ver no back-office" }) +
    `<tr><td style="padding:0 0 24px 0;"></td></tr>`;

  const texto = [
    `Nova conta criada`,
    ``,
    `Nome: ${o.nome ?? "—"}`,
    `Email: ${o.email}`,
    `Entrou com: ${metodo}`,
    `Criada em: ${dataHora(o.criadaEm)}`,
    `Total de contas: ${o.total}`,
    ``,
    `Back-office: ${SITE_URL}/admin/dashboard`,
  ].join("\n");

  return {
    assunto: `Nova conta: ${nome}`,
    html: layout({
      titulo: "Nova conta criada",
      preheader: `${nome} criou conta · ${metodo}.`,
      corpo,
      motivo: "Notificação automática do site nextiamarketing.website.",
    }),
    texto,
  };
}

/* ── 4 e 5. Pedido de briefing ────────────────────────────────────── */

export type DadosBriefing = {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  empresa: string;
  tipoNegocio: string;
  necessidades: string;
  orcamento: string | null;
  mensagem: string | null;
  criadoEm: Date;
};

const orcamento = (v: string | null) => (v ? ORCAMENTOS[v] ?? v : "Ainda não sabe");

export function tplBriefingAdmin(b: DadosBriefing): Email {
  const corpo =
    heroi({
      icone: "destaque-briefing",
      etiqueta: "Novo pedido de briefing",
      titulo: "Novo pedido de briefing",
      texto: `<strong style="color:${C.ink};">${esc(b.nome)}</strong> pediu um briefing para um site com IA para a ${esc(b.empresa)}.`,
    }) +
    botoes(
      { href: `${SITE_URL}/admin/dashboard`, texto: "Ver no back-office" },
      { href: `mailto:${encodeURIComponent(b.email)}`, texto: `Responder a ${esc(primeiroNome(b.nome))}` },
    ) +
    seccao("Empresa", [
      ["Empresa", esc(b.empresa)],
      ["Tipo de negócio", esc(b.tipoNegocio)],
      ["O que quer integrar", paragrafos(b.necessidades)],
      ["Orçamento", esc(orcamento(b.orcamento))],
      ["Mensagem", b.mensagem ? paragrafos(b.mensagem) : null],
    ]) +
    seccao("Contacto", [
      ["Nome", esc(b.nome)],
      ["Email", link(`mailto:${encodeURIComponent(b.email)}`, esc(b.email))],
      ["Telefone", b.telefone ? link(`tel:${b.telefone.replace(/[^\d+]/g, "")}`, esc(b.telefone)) : null],
      ["Enviado em", dataHora(b.criadoEm)],
    ]) +
    `<tr><td style="padding:0 0 36px 0;"></td></tr>`;

  const texto = [
    `Novo pedido de briefing`,
    ``,
    `Empresa: ${b.empresa} (${b.tipoNegocio})`,
    `O que quer integrar: ${b.necessidades}`,
    `Orçamento: ${orcamento(b.orcamento)}`,
    ...(b.mensagem ? [`Mensagem: ${b.mensagem}`] : []),
    ``,
    `Nome: ${b.nome}`,
    `Email: ${b.email}`,
    ...(b.telefone ? [`Telefone: ${b.telefone}`] : []),
    ``,
    `Back-office: ${SITE_URL}/admin/dashboard`,
  ].join("\n");

  return {
    assunto: `Novo pedido de briefing: ${b.empresa}`,
    html: layout({
      titulo: "Novo pedido de briefing",
      preheader: `${b.nome} · ${b.empresa} · ${orcamento(b.orcamento)}.`,
      corpo,
      motivo: "Notificação automática do site nextiamarketing.website.",
    }),
    texto,
  };
}

export function tplBriefingCliente(b: DadosBriefing): Email {
  const corpo =
    heroi({
      icone: "destaque-confirmado",
      etiqueta: "Pedido recebido",
      corEtiqueta: C.green,
      titulo: "Recebemos o teu pedido de briefing",
      texto: `Olá ${esc(primeiroNome(b.nome))}, obrigado por nos contares sobre a ${esc(b.empresa)}. Vamos analisar o que precisas e respondemos-te em até 24 horas úteis.`,
    }) +
    seccao("O que nos enviaste", [
      ["Empresa", esc(b.empresa)],
      ["Tipo de negócio", esc(b.tipoNegocio)],
      ["O que queres integrar", paragrafos(b.necessidades)],
      ["Orçamento", esc(orcamento(b.orcamento))],
      ["Mensagem", b.mensagem ? paragrafos(b.mensagem) : null],
    ]) +
    nota(
      `<strong style="color:${C.ink};">Queres adiantar conversa?</strong><br>Podes ${link(`${SITE_URL}/marcar-reuniao?servico=sites`, "marcar já uma reunião de 30 minutos")} ou responder a este email.`,
    ) +
    assinatura(`Até breve,<br><strong style="color:${C.ink};">Equipa ${BRAND_NAME}</strong>`);

  const texto = [
    `Recebemos o teu pedido de briefing`,
    ``,
    `Olá ${primeiroNome(b.nome)}, obrigado por nos contares sobre a ${b.empresa}.`,
    `Vamos analisar o que precisas e respondemos-te em até 24 horas úteis.`,
    ``,
    `Queres adiantar conversa? Marca uma reunião: ${SITE_URL}/marcar-reuniao?servico=sites`,
    ``,
    `Equipa ${BRAND_NAME} — ${SITE_URL}`,
  ].join("\n");

  return {
    assunto: "Recebemos o teu pedido de briefing",
    html: layout({
      titulo: "Recebemos o teu pedido de briefing",
      preheader: `Respondemos-te em até 24 horas úteis sobre o site da ${b.empresa}.`,
      corpo,
      motivo: "Recebeste este email porque pediste um briefing em nextiamarketing.website.",
    }),
    texto,
  };
}

