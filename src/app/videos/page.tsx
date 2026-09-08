import Link from "next/link";
import { VIDEO_PRICE_EUR } from "@/lib/brand";

const steps = [
  {
    title: "Marcas uma reunião",
    description: "Uma chamada rápida para perceber o teu imóvel e o que precisas.",
  },
  {
    title: "Partilhas as fotos",
    description: "Envias-nos as fotos do imóvel — quanto melhor a luz, melhor o resultado.",
  },
  {
    title: "A nossa equipa cria o vídeo",
    description: "Produzimos o vídeo walkthrough cinematográfico com o apoio de IA.",
  },
  {
    title: "Recebes o vídeo pronto",
    description: "Entregamos o vídeo pronto a publicar no teu anúncio de Airbnb ou site.",
  },
];

const beforeAfter = [
  { label: "Fotos soltas do anúncio" },
  { label: "Vídeo walkthrough cinematográfico" },
];

export default function VideosPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 pb-16 text-center">
        <p className="eyebrow mx-auto mb-6">Vídeos de IA para Alojamento</p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-ink max-w-2xl mx-auto leading-[1.1]">
          Transforma as fotos do teu alojamento num vídeo cinematográfico,
          sem filmar nada
        </h1>
        <p className="mt-6 text-lg text-body max-w-xl mx-auto leading-relaxed">
          Ideal para anfitriões de Airbnb, alojamento local e hotéis que
          querem destacar-se com um anúncio mais profissional. Marca uma
          reunião rápida e tratamos do resto.
        </p>
        <Link href="/videos/marcar-reuniao" className="btn-primary mt-9">
          Marcar reunião
        </Link>
      </section>

      {/* Como funciona */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
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
      </section>

      {/* Antes / depois */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
          <h2 className="text-3xl font-bold text-ink text-center mb-2">
            Antes / depois
          </h2>
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted mb-12">
            Exemplo — substituir por casos reais quando existirem
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {beforeAfter.map((item) => (
              <div
                key={item.label}
                className="aspect-video rounded-2xl bg-brand-50 border border-line flex items-center justify-center text-brand text-sm font-medium"
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preço + CTA final */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-24 text-center">
        <div className="card p-12">
          <h2 className="text-xl font-bold text-ink">Vídeo Walkthrough</h2>
          <p className="mt-3 text-5xl font-extrabold text-ink">
            desde {VIDEO_PRICE_EUR}€ <span className="text-lg font-normal text-muted">/ vídeo</span>
          </p>
          <p className="mt-5 text-sm text-body">
            Preço de referência de lançamento. Combinamos os detalhes e o
            valor final na reunião, consoante o imóvel.
          </p>
          <Link href="/videos/marcar-reuniao" className="btn-primary mt-8">
            Marcar reunião
          </Link>
        </div>
      </section>
    </>
  );
}
