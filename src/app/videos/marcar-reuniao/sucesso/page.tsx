import Link from "next/link";

export default function MarcarReuniaoSucessoPage() {
  return (
    <section className="mx-auto max-w-xl px-4 sm:px-6 py-24 text-center">
      <span className="text-5xl">✅</span>
      <h1 className="mt-6 text-3xl font-bold text-brand">Pedido enviado!</h1>
      <p className="mt-4 text-gray-600">
        Obrigado pelo interesse na NextIA Marketing. Recebemos o teu pedido
        e vamos entrar em contacto dentro de 24h úteis para marcar a
        reunião. Enviámos também um email de confirmação.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-brand text-white font-semibold px-6 py-3 hover:bg-brand-light transition-colors"
      >
        Voltar ao início
      </Link>
    </section>
  );
}
