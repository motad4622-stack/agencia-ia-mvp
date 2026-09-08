import Link from "next/link";

const integrations = [
  { icon: "💬", title: "Chatbot de apoio ao cliente", description: "Responde a perguntas frequentes 24/7, direto no teu site." },
  { icon: "✉️", title: "Automação de emails", description: "Sequências automáticas de boas-vindas, follow-up e retenção." },
  { icon: "📝", title: "Geração automática de conteúdo", description: "Textos, descrições de produto e imagens gerados por IA." },
  { icon: "🎯", title: "Motores de recomendação", description: "Sugestões personalizadas de produtos ou serviços para cada visitante." },
];

const steps = [
  { title: "Briefing", description: "Preenches um formulário a contar-nos o teu negócio e o que precisas." },
  { title: "Proposta", description: "Analisamos o pedido e enviamos uma proposta à medida." },
  { title: "Desenvolvimento", description: "Construímos o site com as integrações de IA acordadas." },
  { title: "Lançamento", description: "Publicamos o site e ficamos disponíveis para o que precisares." },
];

export default function SitesIaPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 pb-16 text-center">
        <p className="eyebrow mx-auto mb-6">Sites com IA para Empresas</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-ink max-w-2xl mx-auto leading-[1.1]">
          Construímos o teu site com inteligência artificial integrada
        </h1>
        <p className="mt-6 text-lg text-body max-w-xl mx-auto leading-relaxed">
          Chatbots, automações, geração de conteúdo e mais — tudo à medida
          do teu negócio.
        </p>
        <Link href="/sites-ia/contacto" className="btn-primary mt-9">
          Pedir um briefing gratuito
        </Link>
      </section>

      {/* Integrações */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-bold text-ink text-center mb-2">
          O que integramos
        </h2>
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted mb-14">
          Exemplos — ajustamos consoante o teu negócio
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {integrations.map((item) => (
            <div key={item.title} className="card p-7 flex gap-5">
              <span className="icon-badge text-lg">{item.icon}</span>
              <div>
                <h3 className="font-semibold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-sm text-body leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
          <h2 className="text-3xl font-bold text-ink text-center mb-14">
            Como funciona
          </h2>
          <div className="grid sm:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.title} className="card p-7">
                <span className="icon-badge text-base mb-5">{i + 1}</span>
                <h3 className="font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm text-body leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center">
        <h2 className="text-3xl font-bold text-ink">
          Vamos construir o teu site inteligente?
        </h2>
        <p className="mt-4 text-body">
          Conta-nos o teu negócio — respondemos dentro de 24h úteis.
        </p>
        <Link href="/sites-ia/contacto" className="btn-primary mt-8">
          Pedir um briefing gratuito
        </Link>
      </section>
    </>
  );
}
