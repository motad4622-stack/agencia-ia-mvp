import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { BrowserFrame } from "@/components/Mockups";

const integrations = [
  {
    title: "Chatbot de apoio ao cliente",
    description:
      "Treinado com a informação do teu negócio, responde às perguntas de sempre a qualquer hora e encaminha o resto para ti.",
  },
  {
    title: "Automação de emails",
    description:
      "Confirmações, follow-ups e lembretes enviados sozinhos, com o teu tom e no momento certo.",
  },
  {
    title: "Geração de conteúdo",
    description:
      "Textos, descrições e imagens produzidos com IA para manteres o site vivo sem parar o teu dia.",
  },
  {
    title: "Recomendações personalizadas",
    description:
      "Sugestões de produtos ou serviços ajustadas a cada visitante, a partir do que ele procura.",
  },
];

const steps = [
  { n: "01", title: "Falamos sobre o negócio", text: "O que fazes, para quem, e o que te tira tempo." },
  { n: "02", title: "Enviamos uma proposta", text: "Âmbito, prazos e valor, por escrito e sem letra pequena." },
  { n: "03", title: "Construímos o site", text: "Design, conteúdo e as integrações de IA acordadas." },
  { n: "04", title: "Publicamos e melhoramos", text: "Ficamos disponíveis depois de estar no ar." },
];

export default function SitesIaPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-line bg-white">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div>
            <p className="eyebrow">Sites com IA para empresas</p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-[3rem]">
              Um site que trabalha, mesmo quando tu não estás.
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-body">
              Construímos o teu site com inteligência artificial integrada:
              chatbots que respondem, automações que poupam horas e conteúdo
              que se mantém atualizado.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/sites-ia/contacto" className="btn-primary">
                Pedir um briefing
              </Link>
              <Link href="/#exemplos" className="btn-secondary">
                Ver exemplos
              </Link>
            </div>
          </div>
          <BrowserFrame withChat />
        </div>
      </section>

      {/* Integrações */}
      <section className="bg-white py-20 sm:py-24">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="O que integramos"
              title="IA onde faz diferença, não onde dá nas vistas"
              description="Escolhemos as integrações a partir do que te ocupa mais tempo. Estas são as mais pedidas."
            />
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {integrations.map((item) => (
                <div key={item.title} className="card card-hover h-full p-7">
                  <h3 className="font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-body">{item.description}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Como funciona */}
      <section className="border-t border-line bg-surface py-20 sm:py-24">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="Como funciona"
              title="Do briefing ao site publicado"
              description="Sabes sempre em que ponto está o projeto e o que se segue."
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

          <div className="mt-14 text-center">
            <Link href="/sites-ia/contacto" className="btn-primary">
              Pedir um briefing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
