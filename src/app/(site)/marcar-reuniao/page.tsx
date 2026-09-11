import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { BRAND_NAME } from "@/lib/brand";
import { AGENDA } from "@/lib/agenda";
import { Agenda } from "./Agenda";

export const metadata: Metadata = {
  title: `Marcar reunião — ${BRAND_NAME}`,
  description: "Escolhe o dia e a hora para uma reunião de 30 minutos por videochamada.",
};

export default async function MarcarReuniaoPage({ searchParams }: PageProps<"/marcar-reuniao">) {
  const { servico } = await searchParams;
  const inicial = servico === "sites" ? "sites" : servico === "videos" ? "videos" : null;

  const sessao = await auth();
  if (!sessao?.user) {
    const destino = inicial ? `/marcar-reuniao?servico=${inicial}` : "/marcar-reuniao";
    redirect("/entrar?next=" + encodeURIComponent(destino));
  }

  return (
    <section className="bg-surface py-14 sm:py-20">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="eyebrow">Marcar reunião</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Escolhe a hora que te dá jeito.
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-body">
            {AGENDA.duracaoMin} minutos por videochamada, sem compromisso.
            Recebes a confirmação por email logo a seguir.
          </p>
        </div>

        <Agenda
          servicoInicial={inicial}
          nomeInicial={sessao.user.name ?? ""}
          emailInicial={sessao.user.email ?? ""}
        />
      </div>
    </section>
  );
}
