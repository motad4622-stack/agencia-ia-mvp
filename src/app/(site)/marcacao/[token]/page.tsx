import type { Metadata } from "next";
import Link from "next/link";
import { after } from "next/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BRAND_NAME, WHATSAPP_DISPLAY } from "@/lib/brand";
import { SERVICOS, fimDe, formatarDia, formatarHora, type Servico } from "@/lib/agenda";
import { notificarCancelamento } from "@/lib/email";

/*
 * Cancelamento de uma marcação pelo link do email, sem ter de entrar na
 * conta — o código secreto do link é a autorização.
 *
 * Abrir o link só mostra a reunião; cancelar exige carregar no botão
 * (POST). Os filtros de email que abrem links sozinhos não cancelam nada.
 */

export const metadata: Metadata = {
  title: `A tua reunião — ${BRAND_NAME}`,
  robots: { index: false, follow: false },
};

const maiuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

async function cancelar(formData: FormData) {
  "use server";
  const token = String(formData.get("token") ?? "");
  const marcacao = await prisma.booking.findUnique({ where: { cancelToken: token } });
  if (!marcacao) redirect(`/marcacao/${encodeURIComponent(token)}`);

  // Só cancela se ainda estiver marcada e não tiver começado — e só uma vez,
  // mesmo que o botão seja carregado duas vezes.
  const { count } = await prisma.booking.updateMany({
    where: { id: marcacao.id, status: "marcada", startsAt: { gt: new Date() } },
    data: { status: "cancelada", slotKey: null, cancelledAt: new Date() },
  });
  if (count === 1) after(() => notificarCancelamento(marcacao.id));

  redirect(`/marcacao/${encodeURIComponent(token)}`);
}

export default async function MarcacaoPage({ params }: PageProps<"/marcacao/[token]">) {
  const { token } = await params;
  const m = await prisma.booking.findUnique({ where: { cancelToken: token } });

  if (!m) {
    return (
      <Moldura etiqueta="Link inválido" titulo="Não encontrámos esta reunião.">
        <p className="mt-4 text-[15px] leading-relaxed text-body">
          O link pode estar incompleto. Se precisas de ajuda, fala connosco por WhatsApp — {WHATSAPP_DISPLAY}.
        </p>
        <Acoes />
      </Moldura>
    );
  }

  const resumo = (
    <div className="mt-6 rounded-lg border border-line bg-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-blue">
        {SERVICOS[m.service as Servico] ?? m.service}
      </p>
      <p className="mt-2 text-[17px] font-semibold text-ink">{maiuscula(formatarDia(m.startsAt))}</p>
      <p className="mt-1 text-[15px] text-body">
        {formatarHora(m.startsAt)} – {formatarHora(fimDe(m.startsAt, m.durationMin))} · videochamada de{" "}
        {m.durationMin} minutos
      </p>
    </div>
  );

  if (m.status === "cancelada") {
    return (
      <Moldura etiqueta="Reunião cancelada" titulo="Está cancelada. Obrigado por avisares.">
        {resumo}
        <p className="mt-6 text-[15px] leading-relaxed text-body">
          O horário voltou a ficar livre. Quando quiseres, marca outra hora — ou fala connosco por WhatsApp,{" "}
          {WHATSAPP_DISPLAY}.
        </p>
        <Acoes principal={{ href: `/marcar-reuniao?servico=${m.service}`, texto: "Marcar outra hora" }} />
      </Moldura>
    );
  }

  if (m.status === "realizada" || m.startsAt <= new Date()) {
    return (
      <Moldura etiqueta="Reunião" titulo="Esta reunião já aconteceu.">
        {resumo}
        <p className="mt-6 text-[15px] leading-relaxed text-body">
          Se quiseres falar outra vez connosco, marca uma nova reunião.
        </p>
        <Acoes principal={{ href: `/marcar-reuniao?servico=${m.service}`, texto: "Marcar nova reunião" }} />
      </Moldura>
    );
  }

  return (
    <Moldura etiqueta="A tua reunião" titulo="Queres cancelar esta reunião?">
      {resumo}
      <p className="mt-6 text-[15px] leading-relaxed text-body">
        Ao cancelar, o horário fica livre para outra pessoa e avisamos a equipa. Se só precisas de outra
        hora, cancela e marca de novo.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <form action={cancelar}>
          <input type="hidden" name="token" value={token} />
          <button type="submit" className="btn-primary w-full sm:w-auto">
            Sim, cancelar a reunião
          </button>
        </form>
        <Link href="/" className="btn-secondary">
          Manter a reunião
        </Link>
      </div>
    </Moldura>
  );
}

function Moldura({ etiqueta, titulo, children }: { etiqueta: string; titulo: string; children: React.ReactNode }) {
  return (
    <section className="bg-surface py-14 sm:py-20">
      <div className="container-page">
        <div className="card max-w-2xl p-7 sm:p-10">
          <p className="eyebrow">{etiqueta}</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">{titulo}</h1>
          {children}
        </div>
      </div>
    </section>
  );
}

function Acoes({ principal }: { principal?: { href: string; texto: string } }) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      {principal && (
        <Link href={principal.href} className="btn-primary">
          {principal.texto}
        </Link>
      )}
      <Link href="/" className="btn-secondary">
        Voltar ao início
      </Link>
    </div>
  );
}
