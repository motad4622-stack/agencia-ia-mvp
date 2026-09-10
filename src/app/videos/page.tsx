import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { VideoExample } from "@/components/VideoExample";
import { VIDEO_PRICE_EUR } from "@/lib/brand";

const steps = [
  {
    n: "01",
    title: "Marcas uma reunião",
    text: "Trinta minutos para percebermos o imóvel, o público e onde o vídeo vai ser usado.",
  },
  {
    n: "02",
    title: "Partilhas as fotografias",
    text: "As que já usas no anúncio servem. Quanto melhor a luz, melhor o resultado.",
  },
  {
    n: "03",
    title: "Criamos o vídeo",
    text: "A nossa equipa trata da produção com apoio de IA — sem filmagens nem deslocações.",
  },
  {
    n: "04",
    title: "Recebes pronto a publicar",
    text: "No formato que precisas, para o anúncio, o teu site ou as redes sociais.",
  },
];

const included = [
  "Vídeo walkthrough a partir das tuas fotografias",
  "Formato pensado para anúncio e para redes sociais",
  "Acompanhamento direto com a equipa, sem intermediários",
];

export default function VideosPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-white">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div>
            <p className="eyebrow">Vídeos de IA para alojamento</p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-[3rem]">
              Mostra o espaço antes de o cliente abrir o anúncio.
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-body">
              Transformamos as fotografias do teu Airbnb, alojamento local ou
              hotel num vídeo com movimento e ritmo — sem filmar nada, sem
              equipamento e sem marcar sessões fotográficas.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/videos/marcar-reuniao" className="btn-primary">
                Marcar reunião
              </Link>
              <Link href="/#exemplos" className="btn-secondary">
                Ver exemplos
              </Link>
            </div>
          </div>
          <VideoExample
            src="/videos/walkthrough-interior.mp4"
            poster="/videos/walkthrough-interior.jpg"
            duration="0:08"
          />
        </div>
      </section>

      {/* Como funciona */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Como funciona"
              title="Quatro passos, sem complicação"
              description="Do primeiro contacto ao vídeo pronto a publicar."
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <div key={step.n} className="card card-hover h-full p-6">
                  <p className="text-sm font-bold tabular-nums text-blue">{step.n}</p>
                  <h3 className="mt-3 font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-body">{step.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Preço + o que inclui */}
      <section className="border-t border-line bg-surface py-20 sm:py-24">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="Investimento"
                title={`A partir de ${VIDEO_PRICE_EUR}€ por vídeo`}
                description="É o ponto de partida para um imóvel. O valor final depende do número de imóveis, do detalhe e dos formatos que precisas — combinamos isso na reunião, sem surpresas."
              />
            </Reveal>
            <Reveal delay={80}>
              <div className="card p-7 sm:p-9">
                <p className="text-[13px] font-semibold uppercase tracking-wide text-muted">
                  O que está incluído
                </p>
                <ul className="mt-5 space-y-4">
                  {included.map((item) => (
                    <li key={item} className="flex gap-3 text-[15px] text-body">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        className="mt-0.5 shrink-0 text-green"
                        aria-hidden
                      >
                        <circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12" />
                        <path
                          d="M5.5 9.2l2.3 2.3 4.7-4.7"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/videos/marcar-reuniao" className="btn-primary mt-8 w-full">
                  Marcar reunião
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
