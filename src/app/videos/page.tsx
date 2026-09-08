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
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-12 text-center">
        <p className="inline-block rounded-full bg-blue-50 text-brand text-xs font-semibold px-3 py-1 mb-6">
          Vídeos de IA para Alojamento
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-brand max-w-2xl mx-auto">
          Transforma as fotos do teu alojamento num vídeo cinematográfico,
          sem filmar nada
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto">
          Ideal para anfitriões de Airbnb, alojamento local e hotéis que
          querem destacar-se com um anúncio mais profissional. Marca uma
          reunião rápida e tratamos do resto.
        </p>
        <Link
          href="/videos/marcar-reuniao"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-brand text-white font-semibold px-6 py-3 hover:bg-brand-light transition-colors"
        >
          Marcar reunião
        </Link>
      </section>

      {/* Como funciona */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <h2 className="text-2xl font-bold text-brand text-center mb-10">
          Como funciona
        </h2>
        <div className="grid sm:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.title} className="rounded-xl border border-gray-200 p-6">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-brand text-white text-sm font-bold mb-4">
                {i + 1}
              </span>
              <h3 className="font-semibold text-brand">{step.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Antes / depois */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-bold text-brand text-center mb-2">
            Antes / depois
          </h2>
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-gray-400 mb-10">
            Exemplo — substituir por casos reais quando existirem
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {beforeAfter.map((item) => (
              <div
                key={item.label}
                className="aspect-video rounded-xl bg-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 text-sm font-medium"
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preço + CTA final */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center">
        <div className="rounded-2xl border border-gray-200 p-10">
          <h2 className="text-xl font-bold text-brand">Vídeo Walkthrough</h2>
          <p className="mt-2 text-4xl font-bold text-brand">
            desde {VIDEO_PRICE_EUR}€ <span className="text-base font-normal text-gray-500">/ vídeo</span>
          </p>
          <p className="mt-4 text-sm text-gray-600">
            Preço de referência de lançamento. Combinamos os detalhes e o
            valor final na reunião, consoante o imóvel.
          </p>
          <Link
            href="/videos/marcar-reuniao"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-brand text-white font-semibold px-6 py-3 hover:bg-brand-light transition-colors"
          >
            Marcar reunião
          </Link>
        </div>
      </section>
    </>
  );
}
