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
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-12 text-center">
        <p className="inline-block rounded-full bg-blue-50 text-brand text-xs font-semibold px-3 py-1 mb-6">
          Sites com IA para Empresas
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-brand max-w-2xl mx-auto">
          Construímos o teu site com inteligência artificial integrada
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
          Chatbots, automações, geração de conteúdo e mais — tudo à medida
          do teu negócio.
        </p>
        <Link
          href="/sites-ia/contacto"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-brand text-white font-semibold px-6 py-3 hover:bg-brand-light transition-colors"
        >
          Pedir um briefing gratuito
        </Link>
      </section>

      {/* Integrações */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold text-brand text-center mb-2">
          O que integramos
        </h2>
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-gray-400 mb-10">
          Exemplos — ajustamos consoante o teu negócio
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {integrations.map((item) => (
            <div key={item.title} className="rounded-xl border border-gray-200 p-6 flex gap-4">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="font-semibold text-brand">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-brand text-center mb-10">
            Como funciona
          </h2>
          <div className="grid sm:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.title} className="rounded-xl bg-white border border-gray-200 p-6">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-brand text-white text-sm font-bold mb-4">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-brand">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-brand">
          Vamos construir o teu site inteligente?
        </h2>
        <p className="mt-3 text-gray-600">
          Conta-nos o teu negócio — respondemos dentro de 24h úteis.
        </p>
        <Link
          href="/sites-ia/contacto"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-brand text-white font-semibold px-6 py-3 hover:bg-brand-light transition-colors"
        >
          Pedir um briefing gratuito
        </Link>
      </section>
    </>
  );
}
