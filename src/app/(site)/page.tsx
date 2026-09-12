import Link from "next/link";
import { GatedLink } from "@/components/auth/AuthDialog";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Faq } from "@/components/Faq";
import { SiteExample } from "@/components/SiteExample";
import { VideoExample } from "@/components/VideoExample";

const facts = [
  { value: "100% online", label: "Sem filmagens nem deslocações" },
  { value: "30 min", label: "Duração da reunião inicial" },
  { value: "24h úteis", label: "Resposta a cada pedido" },
];

const videoBenefits = [
  "Vídeo feito a partir das fotografias que já tens",
  "Sem filmagens, sem equipamento, sem deslocações",
  "Pronto para o anúncio, para o teu site e para as redes",
];

const siteBenefits = [
  "Site construído à medida do teu negócio",
  "Chatbot treinado com a tua informação",
  "Automações que tratam do trabalho repetitivo",
];

const videoExamples = [
  {
    src: "/videos/walkthrough-interior.mp4",
    poster: "/videos/walkthrough-interior.jpg",
    duration: "0:08",
    caption: "Sala comum",
  },
  {
    src: "/videos/walkthrough-exterior.mp4",
    poster: "/videos/walkthrough-exterior.jpg",
    duration: "0:08",
    caption: "Exterior ao anoitecer",
  },
  {
    src: "/videos/cozinha.mp4",
    poster: "/videos/cozinha.jpg",
    duration: "0:05",
    caption: "Cozinha e ilha",
  },
  {
    src: "/videos/jantar.mp4",
    poster: "/videos/jantar.jpg",
    duration: "0:05",
    caption: "Sala de jantar",
  },
  {
    src: "/videos/quarto.mp4",
    poster: "/videos/quarto.jpg",
    duration: "0:05",
    caption: "Quarto principal",
  },
  {
    src: "/videos/piscina.mp4",
    poster: "/videos/piscina.jpg",
    duration: "0:05",
    caption: "Piscina",
  },
];

const videoSteps = [
  { n: "01", title: "Envias as fotografias", text: "As mesmas que já usas no anúncio servem." },
  { n: "02", title: "Criamos o vídeo com IA", text: "Damos movimento e ritmo ao espaço." },
  { n: "03", title: "Recebes pronto a publicar", text: "No formato que precisas de usar." },
];

const siteSteps = [
  { n: "01", title: "Falamos sobre o negócio", text: "O que fazes, para quem, e o que te tira tempo." },
  { n: "02", title: "Criamos o site", text: "Estrutura, conteúdo e design pensados para converter." },
  { n: "03", title: "Integramos IA e automações", text: "Chatbot, emails e o que fizer sentido." },
  { n: "04", title: "Publicamos e melhoramos", text: "Acompanhamos depois de estar no ar." },
];


export default function HomePage() {
  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="border-b border-line bg-white">
        <div className="container-page grid items-center gap-14 py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 text-[13px] font-medium text-body">
              <span className="h-1.5 w-1.5 rounded-full bg-green" />
              Agência de IA aplicada a alojamento e negócios
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-[3.25rem]">
              Damos vida às tuas fotos de alojamento — e ao teu próximo site.
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-body">
              Transformamos as fotografias do teu alojamento num vídeo que
              mostra o espaço antes de o cliente abrir o anúncio. E construímos
              sites com IA integrada para empresas que querem menos trabalho
              repetitivo e mais clientes a chegar.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/videos" className="btn-primary">
                Quero um vídeo de IA
              </Link>
              <Link href="/sites-ia" className="btn-secondary">
                Quero um site com IA
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted">
              Começamos sempre por uma reunião de 30 minutos, sem compromisso.
            </p>
          </div>

          {/* Composição visual dos dois serviços */}
          <div className="relative lg:pl-6">
            <VideoExample
              src="/videos/walkthrough-interior.mp4"
              poster="/videos/walkthrough-interior.jpg"
              duration="0:08"
              className="w-[92%]"
            />
            <SiteExample
              src="/exemplos/casa-do-pinhal.jpg"
              alt="Site de alojamento local com o concierge de IA aberto"
              domain="casadopinhal.exemplo"
              sizes="(min-width: 1024px) 420px, 66vw"
              priority
              className="relative z-10 -mt-12 ml-auto w-[72%] rounded-xl ring-6 ring-white sm:-mt-16"
            />
          </div>
        </div>
      </section>

      {/* ── Factos ──────────────────────────────────────────────────── */}
      <section className="border-b border-line bg-surface">
        <div className="container-page grid gap-8 py-10 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="text-center sm:text-left">
              <p className="text-3xl font-bold tracking-tight text-navy">{fact.value}</p>
              <p className="mt-1 text-sm text-body">{fact.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Serviços ────────────────────────────────────────────────── */}
      <section id="servicos" className="bg-white py-20 sm:py-28">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Serviços"
              title="Dois serviços. Uma equipa."
              description="Trabalhamos com quem aluga espaços e com quem precisa de uma presença digital que trabalhe sozinha. Em ambos os casos, a IA é a ferramenta — o resultado é o que interessa."
            />
          </Reveal>

          {/* Serviço 1 */}
          <Reveal className="mt-14">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="eyebrow">01 — Alojamento</p>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Vídeos de IA para Alojamento
                </h3>
                <p className="mt-4 text-[17px] leading-relaxed text-body">
                  Transformamos as fotografias do teu alojamento em vídeos
                  cinematográficos preparados para anúncios, redes sociais e
                  reservas.
                </p>
                <ul className="mt-6 space-y-3">
                  {videoBenefits.map((benefit) => (
                    <li key={benefit} className="flex gap-3 text-[15px] text-body">
                      <Check />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/videos"
                  className="group mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-navy"
                >
                  Ver o serviço de vídeos
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
              <VideoExample
                src="/videos/walkthrough-exterior.mp4"
                poster="/videos/walkthrough-exterior.jpg"
                duration="0:08"
              />
            </div>
          </Reveal>

          {/* Serviço 2 */}
          <Reveal className="mt-20 sm:mt-28">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <SiteExample
                src="/exemplos/washandclean.jpg"
                alt="Página inicial do site da Wash & Clean"
                domain="washandclean.github.io"
                href="https://washandclean.github.io/"
                sizes="(min-width: 1024px) 540px, 92vw"
                className="lg:order-2"
              />
              <div className="lg:order-1">
                <p className="eyebrow">02 — Empresas</p>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Sites com IA para Empresas
                </h3>
                <p className="mt-4 text-[17px] leading-relaxed text-body">
                  Criamos websites modernos com IA integrada, automações,
                  chatbots e ferramentas adaptadas ao teu negócio.
                </p>
                <ul className="mt-6 space-y-3">
                  {siteBenefits.map((benefit) => (
                    <li key={benefit} className="flex gap-3 text-[15px] text-body">
                      <Check />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sites-ia"
                  className="group mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-navy"
                >
                  Ver o serviço de sites
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Como funciona ───────────────────────────────────────────── */}
      <section id="como-funciona" className="border-y border-line bg-surface py-20 sm:py-28">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Como funciona"
              title="Do primeiro contacto ao resultado"
              description="Dois percursos diferentes, ambos com o mesmo princípio: sabes sempre em que ponto está o trabalho."
            />
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <div className="card h-full p-7 sm:p-9">
                <h3 className="text-lg font-bold text-ink">Vídeos de alojamento</h3>
                <ol className="mt-7 space-y-7">
                  {videoSteps.map((step) => (
                    <Step key={step.n} {...step} />
                  ))}
                </ol>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="card h-full p-7 sm:p-9">
                <h3 className="text-lg font-bold text-ink">Sites com IA</h3>
                <ol className="mt-7 space-y-7">
                  {siteSteps.map((step) => (
                    <Step key={step.n} {...step} />
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Exemplos ────────────────────────────────────────────────── */}
      <section id="exemplos" className="bg-white py-20 sm:py-28">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Exemplos"
              title="Feito para ser visto."
              description="Trabalho a sério, não maquetes: seis vídeos gerados a partir das fotografias de um anúncio de alojamento — a casa toda, sem uma única filmagem — e dois sites que podes abrir e experimentar."
            />
          </Reveal>

          <Reveal delay={80}>
            <p className="mt-14 text-[13px] font-semibold tracking-wide text-muted uppercase">
              Vídeos · a partir de fotografias
            </p>
            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {videoExamples.map((v) => (
                <VideoExample key={v.src} src={v.src} poster={v.poster} duration={v.duration} caption={v.caption} />
              ))}
            </div>
            <p className="mt-6 text-[13px] text-muted">
              Todos feitos a partir das fotografias do mesmo anúncio, sem filmagens nem deslocações.
            </p>

            <div className="mt-16 border-t border-line pt-12">
              <p className="text-[13px] font-semibold tracking-wide text-muted uppercase">
                Sites · abre e experimenta
              </p>
              <div className="mt-6 grid gap-10 md:grid-cols-2">
                <SiteExample
                  src="/exemplos/washandclean.jpg"
                  alt="Página inicial do site da Wash & Clean"
                  domain="washandclean.github.io"
                  href="https://washandclean.github.io/"
                  title="Wash & Clean — limpeza automóvel ao domicílio"
                  description="Site de serviço local: marcação direta, antes-e-depois, zonas cobertas e contacto por WhatsApp sempre à mão."
                />
                <SiteExample
                  src="/exemplos/casa-do-pinhal.jpg"
                  alt="Site de alojamento local com o concierge de IA aberto"
                  domain="casadopinhal.exemplo"
                  href="/exemplos/casa-do-pinhal"
                  linkLabel="Abrir o site-exemplo"
                  title="Casa do Pinhal — alojamento local com concierge de IA"
                  description="Construído por nós de raiz, com reserva direta e um assistente que responde a preços, datas e regras da casa. O alojamento é fictício; o site funciona."
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-navy py-20 sm:py-24">
        <div className="container-page">
          <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-[2.5rem] sm:leading-[1.15]">
                Já tens o negócio.
                <br />
                Agora falta dar-lhe uma presença à altura.
              </h2>
              <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-white/70">
                Marca uma reunião de 30 minutos. Ouvimos o que precisas,
                dizemos-te o que dá para fazer e quanto custa. Sem compromisso.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <GatedLink href="/marcar-reuniao" className="btn-on-navy">
                Marcar uma reunião
              </GatedLink>
              <Link href="#servicos" className="btn-ghost-on-navy">
                Ver os serviços
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section id="faq" className="bg-white py-20 sm:py-28">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="FAQ"
              title="Perguntas frequentes"
              description="Se ficar alguma por responder, pergunta-nos diretamente na reunião."
              align="center"
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="mx-auto mt-12 max-w-3xl">
              <Faq />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <li className="flex gap-5">
      <span className="w-8 shrink-0 pt-0.5 text-sm font-bold tabular-nums text-blue">{n}</span>
      <span>
        <span className="block font-semibold text-ink">{title}</span>
        <span className="mt-1 block text-[15px] leading-relaxed text-body">{text}</span>
      </span>
    </li>
  );
}

function Check() {
  return (
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
  );
}
