/**
 * Módulo de emails automáticos.
 *
 * Com RESEND_API_KEY definido no .env, os emails são enviados a sério
 * via Resend. Sem chave (default do MVP), cada email é apenas escrito na
 * consola e registado em /logs/emails.log — o fluxo de ponta a ponta
 * continua a correr sem custos nem conta criada.
 */
import fs from "fs";
import path from "path";
import { Resend } from "resend";
import { BRAND_NAME } from "@/lib/brand";

const FROM_ADDRESS = process.env.EMAIL_FROM || `${BRAND_NAME} <onboarding@resend.dev>`;

const resendClient = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface SendArgs {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendArgs): Promise<void> {
  if (!resendClient) {
    try {
      const logDir = path.join(process.cwd(), "logs");
      fs.mkdirSync(logDir, { recursive: true });
      const entry = `\n[${new Date().toISOString()}] PARA: ${to} | ASSUNTO: ${subject}\n${html}\n${"-".repeat(70)}\n`;
      fs.appendFileSync(path.join(logDir, "emails.log"), entry);
    } catch {
      // storage local pode falhar em ambientes read-only (ex.: alguns PaaS) —
      // não deve impedir o fluxo do pedido, por isso ignoramos o erro aqui.
    }
    console.log(`📧 [EMAIL MOCK — sem RESEND_API_KEY] Para: ${to} | Assunto: "${subject}"`);
    return;
  }

  await resendClient.emails.send({ from: FROM_ADDRESS, to, subject, html });
}

function layout(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="pt">
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
      <tr>
        <td align="center">
          <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#0b2545;padding:24px 32px;">
                <span style="color:#ffffff;font-size:18px;font-weight:700;">${BRAND_NAME}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#1f2937;font-size:15px;line-height:1.6;">
                <h1 style="font-size:20px;margin:0 0 16px;color:#0b2545;">${title}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#f9fafb;color:#9ca3af;font-size:12px;">
                ${BRAND_NAME} — Vídeos de Alojamento &amp; Sites com IA<br />
                Este é um email automático, não precisas de responder.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// ── 1/2. Confirmação de pedido de reunião (serviço de vídeos) ───────────
// O vídeo em si já não é gerado automaticamente pelo site — a equipa marca
// uma reunião com o cliente e trata da produção manualmente.
export async function sendMeetingRequestConfirmationEmail(params: {
  to: string;
  clientName: string;
  propertyName: string;
}): Promise<void> {
  const html = layout(
    "Recebemos o teu pedido de reunião 🎬",
    `<p>Olá ${params.clientName},</p>
     <p>Obrigado por nos contares sobre <strong>${params.propertyName}</strong>. Recebemos o teu pedido para o serviço de Vídeos de IA para Alojamento.</p>
     <p>A nossa equipa vai entrar em contacto contigo <strong>dentro de 24h úteis</strong> para marcar uma reunião rápida e combinar os próximos passos (partilha de fotos, prazos e detalhes do vídeo).</p>
     <p style="margin-top:24px;">Obrigado pelo interesse!<br/>Equipa ${BRAND_NAME}</p>`
  );
  await sendEmail({ to: params.to, subject: "Recebemos o teu pedido de reunião 🎬", html });
}

// ── 3/4. Confirmação + agradecimento de briefing (serviço de sites com IA)
export async function sendWebsiteLeadConfirmationEmail(params: {
  to: string;
  clientName: string;
  companyName: string;
}): Promise<void> {
  const html = layout(
    "Recebemos o teu pedido de briefing ✅",
    `<p>Olá ${params.clientName},</p>
     <p>Obrigado por nos contares mais sobre a <strong>${params.companyName}</strong> — recebemos o teu pedido de briefing para o serviço de Sites com IA.</p>
     <p>Vamos analisar as tuas necessidades com calma e entramos em contacto contigo <strong>dentro de 24h úteis</strong> com os próximos passos.</p>
     <p style="margin-top:24px;">Obrigado pelo interesse na ${BRAND_NAME} — estamos entusiasmados por talvez trabalhar contigo!<br/>Equipa ${BRAND_NAME}</p>`
  );
  await sendEmail({ to: params.to, subject: "Recebemos o teu pedido — obrigado! ✅", html });
}
