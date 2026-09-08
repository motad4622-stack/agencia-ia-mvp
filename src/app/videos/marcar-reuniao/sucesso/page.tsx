import Link from "next/link";

export default function MarcarReuniaoSucessoPage() {
  return (
    <section className="mx-auto max-w-lg px-4 sm:px-6 py-28 text-center">
      <span className="icon-badge h-16 w-16 text-3xl mx-auto">✓</span>
      <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-ink">Pedido enviado!</h1>
      <p className="mt-5 text-body leading-relaxed">
        Obrigado pelo interesse na NextIA Marketing. Recebemos o teu pedido
        e vamos entrar em contacto dentro de 24h úteis para marcar a
        reunião. Enviámos também um email de confirmação.
      </p>
      <Link href="/" className="btn-primary mt-10">
        Voltar ao início
      </Link>
    </section>
  );
}
