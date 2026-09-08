import Link from "next/link";

const testimonials = [
  {
    quote:
      "O vídeo ficou incrível — as reservas aumentaram assim que o publiquei no anúncio.",
    author: "Marta S.",
    role: "Anfitriã Airbnb, Lisboa",
  },
  {
    quote:
      "Finalmente um site com um chatbot que responde mesmo às perguntas dos clientes. Equipa super atenta.",
    author: "Ricardo P.",
    role: "Fundador, clínica de estética",
  },
  {
    quote:
      "Marcámos uma chamada de 15 minutos e em poucos dias tinha um vídeo profissional pronto a publicar.",
    author: "Inês C.",
    role: "Gestora de Alojamento Local, Porto",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 pb-16 text-center">
        <p className="inline-block rounded-full bg-blue-50 text-brand text-xs font-semibold px-3 py-1 mb-6">
          NextIA Marketing
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-brand max-w-3xl mx-auto">
          Usamos IA para dar vida às tuas fotos de alojamento e para
          construir o teu próximo site inteligente
        </h1>
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Dois serviços, uma só equipa: vídeos cinematográficos gerados por
          IA para o teu anúncio, e sites com inteligência artificial
          integrada para o teu negócio crescer.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/videos"
            className="rounded-full bg-brand text-white font-semibold px-6 py-3 hover:bg-brand-light transition-colors"
          >
            Quero um vídeo do meu alojamento
          </Link>
          <Link
            href="/sites-ia"
            className="rounded-full border border-gray-300 text-brand font-semibold px-6 py-3 hover:border-brand transition-colors"
          >
            Quero um site com IA
          </Link>
        </div>
      </section>

      {/* Serviços */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20">
        <div className="grid sm:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-gray-200 p-8 flex flex-col hover:shadow-lg transition-shadow">
            <span className="text-3xl mb-4">🎬</span>
            <h2 className="text-xl font-bold text-brand">
              Vídeos de IA para Alojamento
            </h2>
            <p className="mt-3 text-gray-600 flex-1">
              Marca uma reunião rápida, envia as fotos do teu Airbnb,
              alojamento local ou hotel, e recebe um vídeo walkthrough
              cinematográfico gerado por IA, pronto a publicar no teu
              anúncio.
            </p>
            <Link
              href="/videos"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brand text-white font-semibold px-5 py-2.5 hover:bg-brand-light transition-colors"
            >
              Ver como funciona →
            </Link>
          </div>

          <div className="rounded-2xl border border-gray-200 p-8 flex flex-col hover:shadow-lg transition-shadow">
            <span className="text-3xl mb-4">🤖</span>
            <h2 className="text-xl font-bold text-brand">
              Sites com IA para Empresas
            </h2>
            <p className="mt-3 text-gray-600 flex-1">
              Desenvolvemos o teu site com inteligência artificial
              integrada — chatbots, automações, geração de conteúdo e mais
              — à medida do teu negócio.
            </p>
            <Link
              href="/sites-ia"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-brand text-white font-semibold px-5 py-2.5 hover:bg-brand-light transition-colors"
            >
              Ver como funciona →
            </Link>
          </div>
        </div>
      </section>

      {/* Prova social */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
            Exemplo — testemunhos placeholder para o MVP
          </p>
          <h2 className="text-center text-2xl font-bold text-brand mb-10">
            O que dizem os nossos clientes
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.author}
                className="rounded-xl bg-white border border-gray-200 p-6"
              >
                <p className="text-gray-700 text-sm">“{t.quote}”</p>
                <p className="mt-4 text-sm font-semibold text-brand">
                  {t.author}
                </p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
