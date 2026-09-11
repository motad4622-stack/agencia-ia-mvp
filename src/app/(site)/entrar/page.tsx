import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, googleConfigurado } from "@/auth";
import { AuthForm } from "@/components/auth/AuthForm";
import { BRAND_NAME, GATED_PATHS } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Entrar — ${BRAND_NAME}`,
  robots: { index: false, follow: false },
};

/** Só aceitamos destinos internos, para o `next` não virar redirect aberto. */
function destinoSeguro(valor: string | undefined): string {
  if (!valor) return "/marcar-reuniao";
  const limpo = decodeURIComponent(valor);
  if (!limpo.startsWith("/") || limpo.startsWith("//")) {
    return "/marcar-reuniao";
  }
  return GATED_PATHS.some((p) => limpo.startsWith(p)) ? limpo : "/";
}

export default async function EntrarPage({ searchParams }: PageProps<"/entrar">) {
  const { next } = await searchParams;
  const destino = destinoSeguro(typeof next === "string" ? next : undefined);

  const sessao = await auth();
  if (sessao?.user) redirect(destino);

  return (
    <section className="bg-surface py-16 sm:py-24">
      <div className="container-page max-w-[460px]!">
        <div className="card p-7 sm:p-9">
          <p className="eyebrow">Conta</p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink">
            Entra para continuar
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-body">
            Precisas de conta para marcar uma reunião ou pedir um briefing.
          </p>

          <div className="mt-7">
            <AuthForm next={destino} googleAtivo={googleConfigurado} />
          </div>
        </div>
      </div>
    </section>
  );
}
