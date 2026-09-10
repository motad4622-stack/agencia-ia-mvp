import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Fraunces } from "next/font/google";
import { BookingForm, Concierge, DemoHeader } from "./DemoClient";

/* ────────────────────────────────────────────────────────────────
   Site-exemplo: "Casa do Pinhal", alojamento local.

   Construído por nós de raiz para mostrar o tipo de site e de
   integração de IA que fazemos. Não é um cliente e não é um
   alojamento real — a barra no topo diz isso a quem visita.
   As fotografias são as do mesmo anúncio que deu origem aos vídeos.
   ──────────────────────────────────────────────────────────────── */

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Casa do Pinhal — site-exemplo da NextIA Marketing",
  description:
    "Site de demonstração de um alojamento local com reserva direta e concierge com IA, construído pela NextIA Marketing.",
  robots: { index: false, follow: true },
};

const destaques = [
  {
    titulo: "Mata privada",
    texto: "Dois hectares de pinhal só da casa. O vizinho mais próximo fica a 400 metros.",
  },
  {
    titulo: "Piscina aquecida",
    texto: "A 28°C todo o ano, com deck ao sol até ao fim da tarde e chuveiro exterior.",
  },
  {
    titulo: "Espaço para o grupo",
    texto: "Doze hóspedes sem ninguém em cima de ninguém: sala dupla, jantar para 12 e sala de jogos.",
  },
];

const espacos = [
  {
    src: "/exemplos/casa/sala.jpg",
    alt: "Sala comum com pé-direito duplo e lareira",
    titulo: "Sala de pé-direito duplo",
    texto: "Lareira acesa, sofá para dez e vidro do chão ao teto para a mata.",
  },
  {
    src: "/exemplos/casa/cozinha.jpg",
    alt: "Cozinha aberta com ilha em mármore",
    titulo: "Cozinha aberta",
    texto: "Ilha de mármore, forno duplo e tudo o que é preciso para cozinhar para o grupo todo.",
  },
  {
    src: "/exemplos/casa/quarto.jpg",
    alt: "Quarto principal com cama de casal",
    titulo: "Seis quartos",
    texto: "Camas de casal, roupa de linho e blackout em todos. Quatro casas de banho.",
  },
  {
    src: "/exemplos/casa/jantar.jpg",
    alt: "Mesa de jantar comprida para doze pessoas",
    titulo: "Jantar para doze",
    texto: "Uma mesa só, para o grupo todo à mesma hora — é raro e faz diferença.",
  },
  {
    src: "/exemplos/casa/jogos.jpg",
    alt: "Sala de jogos com bilhar e matraquilhos",
    titulo: "Sala de jogos",
    texto: "Bilhar, matraquilhos e ecrã grande para as noites em que ninguém quer sair.",
  },
  {
    src: "/exemplos/casa/piscina.jpg",
    alt: "Piscina exterior com espreguiçadeiras",
    titulo: "Piscina e deck",
    texto: "Espreguiçadeiras, sombra ao meio-dia e campo desportivo mesmo ao lado.",
  },
];

const distancias = [
  ["Braga", "22 min de carro"],
  ["Praia de Ofir", "35 min"],
  ["Gerês (portas do parque)", "45 min"],
  ["Aeroporto do Porto", "50 min"],
  ["Mercearia e padaria", "6 min"],
  ["Restaurante na aldeia", "8 min a pé"],
];

const faq = [
  {
    q: "A reserva é feita aqui ou numa plataforma?",
    a: "Aqui. O pedido chega diretamente ao anfitrião, sem comissão de plataforma — por isso o preço é o mesmo ou melhor.",
  },
  {
    q: "Qual é a estadia mínima?",
    a: "Duas noites fora de época alta e três noites em julho e agosto.",
  },
  {
    q: "A casa tem aquecimento?",
    a: "Tem piso radiante em toda a casa e lareira a lenha na sala, com lenha incluída.",
  },
];

export default function CasaDoPinhalPage() {
  return (
    <div
      id="topo"
      className={`${fraunces.variable} min-h-screen bg-[#faf7f1] text-[#3c4a42]`}
    >
      <DemoHeader />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative isolate flex min-h-[92vh] items-end overflow-hidden">
        <video
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          src="/videos/walkthrough-exterior.mp4"
          poster="/videos/walkthrough-exterior.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0b1712]/90 via-[#0b1712]/45 to-[#0b1712]/55" />

        <div className="mx-auto w-full max-w-[1180px] px-5 pt-32 pb-14 sm:px-8 sm:pb-20">
          <p className="text-[12px] font-semibold tracking-[0.22em] text-white/70 uppercase">
            Alojamento local · Entre Braga e o Gerês
          </p>
          <h1 className="mt-5 max-w-3xl font-[family-name:var(--font-fraunces)] text-4xl leading-[1.05] font-semibold text-white sm:text-6xl">
            Uma casa inteira, no meio do pinhal.
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/80">
            Seis quartos, piscina aquecida e mata privada, a vinte minutos de
            Braga. Feita para grupos que querem estar juntos sem estar em cima
            uns dos outros.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#reservar"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-[#16281f] transition-colors hover:bg-white/90"
            >
              Ver disponibilidade
            </a>
            <a
              href="#casa"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              Ver a casa
            </a>
          </div>

          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/20 pt-7">
            {[
              ["12", "hóspedes"],
              ["6", "quartos"],
              ["4", "casas de banho"],
              ["2 ha", "de mata privada"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-white">
                  {n}
                </dt>
                <dd className="text-[13px] tracking-wide text-white/60">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Destaques ───────────────────────────────────────────── */}
      <section className="border-b border-[#eae2d5] bg-[#faf7f1] py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 sm:px-8 md:grid-cols-3">
          {destaques.map((d) => (
            <div key={d.titulo}>
              <span className="block h-px w-10 bg-[#8a6a3b]" />
              <h2 className="mt-5 font-[family-name:var(--font-fraunces)] text-xl font-semibold text-[#16281f]">
                {d.titulo}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#4d5a52]">
                {d.texto}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── A casa ──────────────────────────────────────────────── */}
      <section id="casa" className="scroll-mt-28 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-[12px] font-semibold tracking-[0.22em] text-[#8a6a3b] uppercase">
              A casa
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl leading-tight font-semibold text-[#16281f] sm:text-[2.6rem]">
              Construída para grupos, pensada para o silêncio.
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-[#4d5a52]">
              São 420 m² distribuídos por dois pisos, com zonas comuns
              generosas e quartos afastados uns dos outros. A casa fica no
              centro do terreno — não se vê ninguém de dentro.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {espacos.map((e) => (
              <figure key={e.titulo}>
                <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-[#eae2d5]">
                  <Image
                    src={e.src}
                    alt={e.alt}
                    fill
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-4">
                  <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-semibold text-[#16281f]">
                    {e.titulo}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-[#4d5a52]">
                    {e.texto}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Faixa de atmosfera ──────────────────────────────────── */}
      <section
        id="espacos"
        className="relative scroll-mt-28 overflow-hidden bg-[#16281f]"
      >
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[320px] lg:min-h-[520px]">
            <Image
              src="/exemplos/casa/deck.jpg"
              alt="Deck exterior ao pôr do sol sobre o pinhal"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex items-center px-5 py-16 sm:px-10 lg:px-16 lg:py-20">
            <div className="max-w-lg">
              <p className="text-[12px] font-semibold tracking-[0.22em] text-[#c9a877] uppercase">
                Lá fora
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl leading-tight font-semibold text-white sm:text-[2.4rem]">
                O melhor da casa não está dentro dela.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-white/70">
                O deck vira-se a poente e apanha o pôr do sol inteiro. Mais
                abaixo há a piscina, a fogueira de pedra e um campo onde cabe
                um jogo a sério — tudo dentro do terreno.
              </p>
              <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {[
                  "Piscina aquecida a 28°C",
                  "Fogueira de pedra com lenha",
                  "Campo de padel e basquete",
                  "Grelhador e mesa de exterior",
                  "Chuveiro exterior",
                  "Estacionamento para 6 carros",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-[15px] text-white/80"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#c9a877]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Localização ─────────────────────────────────────────── */}
      <section id="zona" className="scroll-mt-28 bg-[#faf7f1] py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-[12px] font-semibold tracking-[0.22em] text-[#8a6a3b] uppercase">
              Onde fica
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl leading-tight font-semibold text-[#16281f] sm:text-[2.4rem]">
              Longe do barulho, perto de tudo.
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-[#4d5a52]">
              A casa está no fim de um caminho privado, mas continua a vinte
              minutos de uma cidade com tudo e a menos de uma hora da praia e
              da serra.
            </p>
            <dl className="mt-8 divide-y divide-[#eae2d5] border-y border-[#eae2d5]">
              {distancias.map(([local, tempo]) => (
                <div key={local} className="flex justify-between gap-6 py-3.5">
                  <dt className="text-[15px] text-[#3c4a42]">{local}</dt>
                  <dd className="text-[15px] font-medium text-[#16281f]">
                    {tempo}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative aspect-16/10 overflow-hidden rounded-2xl bg-[#eae2d5]">
            <Image
              src="/exemplos/casa/aerea.jpg"
              alt="Vista aérea da propriedade com piscina e campo desportivo"
              fill
              sizes="(min-width: 1024px) 620px, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── Reservar ────────────────────────────────────────────── */}
      <section id="reservar" className="scroll-mt-28 bg-white py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1180px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <p className="text-[12px] font-semibold tracking-[0.22em] text-[#8a6a3b] uppercase">
              Reservar
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-fraunces)] text-3xl leading-tight font-semibold text-[#16281f] sm:text-[2.4rem]">
              Diga-nos as datas. Respondemos hoje.
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-[#4d5a52]">
              Preferimos tratar disto diretamente: percebemos quem vem, o que
              precisa e se a casa é mesmo a ideal para o grupo. Se houver
              dúvidas antes disso, o concierge no canto responde na hora.
            </p>

            <div className="mt-10 space-y-6">
              {faq.map((f) => (
                <div key={f.q}>
                  <h3 className="text-[15px] font-semibold text-[#16281f]">
                    {f.q}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-[#4d5a52]">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <BookingForm />
        </div>
      </section>

      {/* ── Rodapé ──────────────────────────────────────────────── */}
      <footer className="bg-[#16281f] py-14">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <p className="font-[family-name:var(--font-fraunces)] text-[19px] font-semibold tracking-[0.14em] text-white uppercase">
                Casa do Pinhal
              </p>
              <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-white/60">
                Alojamento local para grupos, entre Braga e o Gerês. Reserva
                direta, sem intermediários.
              </p>
            </div>
            <div className="text-[14px] text-white/60">
              <p>reservas@casadopinhal.exemplo</p>
              <p className="mt-1">+351 000 000 000</p>
            </div>
          </div>

          <div className="mt-10 border-t border-white/15 pt-6 text-[13px] text-white/45">
            Este site é uma demonstração da{" "}
            <Link href="/" className="text-white/80 underline underline-offset-2">
              NextIA Marketing
            </Link>
            . O alojamento, os contactos e os preços são fictícios.
          </div>
        </div>
      </footer>

      <Concierge />
    </div>
  );
}
