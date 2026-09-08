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
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-40 h-[560px] opacity-[0.16] blur-3xl"
          style={{
            background:
              "radial-gradient(60% 60% at 30% 30%, var(--color-accent-blue), transparent 70%), radial-gradient(50% 50% at 75% 20%, var(--color-accent-green), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-20 text-center">
          <p className="eyebrow mx-auto mb-7">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
            NextIA Marketing
          </p>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-ink max-w-3xl mx-auto leading-[1.08]">
            Usamos IA para dar vida às tuas fotos de alojamento e ao teu
            próximo site inteligente
          </h1>
          <p className="mt-7 text-lg text-body max-w-2xl mx-auto leading-relaxed">
            Dois serviços, uma só equipa: vídeos cinematográficos gerados por
            IA para o teu anúncio, e sites com inteligência artificial
            integrada para o teu negócio crescer.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/videos" className="btn-primary">
              Quero um vídeo do meu alojamento
            </Link>
            <Link href="/sites-ia" className="btn-secondary">
              Quero um site com IA
            </Link>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-24">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="card p-9 flex flex-col hover:shadow-[0_20px_40px_-24px_rgba(15,32,56,0.18)] hover:-translate-y-1 transition-all duration-300">
            <span className="icon-badge text-xl mb-6">🎬</span>
            <h2 className="text-xl font-bold text-ink">
              Vídeos de IA para Alojamento
            </h2>
            <p className="mt-3 text-body leading-relaxed flex-1">
              Marca uma reunião rápida, envia as fotos do teu Airbnb,
              alojamento local ou hotel, e recebe um vídeo walkthrough
              cinematográfico gerado por IA, pronto a publicar no teu
              anúncio.
            </p>
            <Link
              href="/videos"
              className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-brand group"
            >
              Ver como funciona
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="card p-9 flex flex-col hover:shadow-[0_20px_40px_-24px_rgba(15,32,56,0.18)] hover:-translate-y-1 transition-all duration-300">
            <span className="icon-badge text-xl mb-6">🤖</span>
            <h2 className="text-xl font-bold text-ink">
              Sites com IA para Empresas
            </h2>
            <p className="mt-3 text-body leading-relaxed flex-1">
              Desenvolvemos o teu site com inteligência artificial
              integrada — chatbots, automações, geração de conteúdo e mais
              — à medida do teu negócio.
            </p>
            <Link
              href="/sites-ia"
              className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-brand group"
            >
              Ver como funciona
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Prova social */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-24">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted mb-3">
            Exemplo — testemunhos placeholder para o MVP
          </p>
          <h2 className="text-center text-3xl font-bold text-ink mb-14">
            O que dizem os nossos clientes
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.author} className="card p-7">
                <span className="text-3xl text-accent-blue/30 font-serif leading-none">
                  “
                </span>
                <p className="-mt-2 text-ink text-[15px] leading-relaxed">{t.quote}</p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="icon-badge h-9 w-9 text-xs">
                    {t.author.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.author}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
