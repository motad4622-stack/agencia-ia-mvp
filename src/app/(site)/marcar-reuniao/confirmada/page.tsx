import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BRAND_NAME } from "@/lib/brand";
import { SERVICOS, fimDe, formatarDia, formatarHora, type Servico } from "@/lib/agenda";
import { linkGoogleCalendar } from "@/lib/ics";
import { linkReuniao } from "@/lib/email-templates";

/*
 * Confirmação de uma marcação. Tem endereço próprio para sobreviver a um
 * refresh e para as estatísticas contarem cada marcação como uma visita
 * a /marcar-reuniao/confirmada.
 */

export const metadata: Metadata = {
  title: `Reunião marcada — ${BRAND_NAME}`,
  robots: { index: false, follow: false },
};

const maiuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default async function ConfirmadaPage({ searchParams }: PageProps<"/marcar-reuniao/confirmada">) {
  const { id } = await searchParams;
  const sessao = await auth();
  if (!sessao?.user?.id) redirect("/entrar?next=" + encodeURIComponent("/marcar-reuniao"));

  // Só quem marcou vê a sua marcação.
  const marcacao =
    typeof id === "string"
      ? await prisma.booking.findFirst({ where: { id, userId: sessao.user.id } })
      : null;
  if (!marcacao) redirect("/marcar-reuniao");

  const reuniao = linkReuniao();
  const calendario = linkGoogleCalendar({
    inicio: marcacao.startsAt,
    fim: fimDe(marcacao.startsAt, marcacao.durationMin),
    titulo: `Reunião NextIA Marketing — ${SERVICOS[marcacao.service as Servico] ?? marcacao.service}`,
    descricao: reuniao
      ? `Videochamada de ${marcacao.durationMin} minutos. Link: ${reuniao}`
      : `Videochamada de ${marcacao.durationMin} minutos. O link segue por email antes da reunião.`,
    local: reuniao ?? "Videochamada",
  });

  return (
    <section className="bg-surface py-14 sm:py-20">
      <div className="container-page">
        <div className="card max-w-2xl p-7 sm:p-10">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-green-50 text-green">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className="eyebrow mt-6 text-green!">Marcação confirmada</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            A tua reunião está marcada.
          </h1>

          <div className="mt-6 rounded-lg border border-line bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue">
              {SERVICOS[marcacao.service as Servico] ?? marcacao.service}
            </p>
            <p className="mt-2 text-[17px] font-semibold text-ink">{maiuscula(formatarDia(marcacao.startsAt))}</p>
            <p className="mt-1 text-[15px] text-body">
              {formatarHora(marcacao.startsAt)} – {formatarHora(fimDe(marcacao.startsAt, marcacao.durationMin))} ·
              videochamada de {marcacao.durationMin} minutos
            </p>
          </div>

          <p className="mt-6 text-[15px] leading-relaxed text-body">
            Enviámos a confirmação para <strong className="text-ink">{marcacao.clientEmail}</strong>, com
            um convite para o teu calendário e um link para cancelares, se precisares. Na véspera
            mandamos-te um lembrete. Se não vires o email em alguns minutos, espreita o spam.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={calendario} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Adicionar ao Google Calendar
            </a>
            <Link href="/" className="btn-secondary">
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
