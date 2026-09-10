import Link from "next/link";

export default function MarcarReuniaoSucessoPage() {
  return (
    <section className="bg-white py-24 sm:py-28">
      <div className="container-page max-w-lg! text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-50 text-green">
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </span>
        <h1 className="mt-7 text-3xl font-bold tracking-tight text-ink">Pedido enviado</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-body">
          Obrigado pelo interesse. Recebemos o teu pedido e entramos em
          contacto dentro de 24h úteis para marcar a reunião. Enviámos também
          um email de confirmação.
        </p>
        <Link href="/" className="btn-secondary mt-9">
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}
