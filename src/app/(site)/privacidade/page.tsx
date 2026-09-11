import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_NAME, WHATSAPP_DISPLAY } from "@/lib/brand";

/*
 * Política de privacidade — texto-base.
 *
 * Cobre o que o site faz hoje: contas de utilizador, pedidos de reunião e
 * pedidos de briefing. Falta a identificação fiscal (denominação legal,
 * NIF e morada) e um email de contacto próprio — assim que existirem,
 * entram na constante RESPONSAVEL aqui abaixo.
 */

export const metadata: Metadata = {
  title: `Política de privacidade — ${BRAND_NAME}`,
  description:
    "Que dados recolhemos, para que servem, durante quanto tempo ficam guardados e como podes pedir para os apagar.",
};

const ATUALIZADO_EM = "11 de setembro de 2026";

const seccoes = [
  {
    titulo: "Quem trata os teus dados",
    conteudo: [
      `Os dados recolhidos neste site são tratados pela ${BRAND_NAME}, responsável pelo tratamento. Podes falar connosco pelo WhatsApp ${WHATSAPP_DISPLAY} ou pelos formulários do site.`,
    ],
  },
  {
    titulo: "Que dados recolhemos",
    conteudo: [
      "Quando crias conta: nome, email e uma palavra-passe guardada em forma cifrada (nunca vemos a palavra-passe original). Se entrares com o Google, recebemos o nome, o email e a fotografia de perfil associados a essa conta.",
      "Quando pedes uma reunião ou um briefing: nome, email, telefone (se o deres), dados do imóvel ou da empresa e o que escreveres na mensagem.",
      "Contamos visitas com as estatísticas da Vercel, que não usam cookies nem guardam quem és: só sabemos quantas pessoas visitaram cada página e de onde vieram, em números agregados.",
      "Não usamos cookies de publicidade. O único cookie que colocamos é o que mantém a tua sessão iniciada.",
    ],
  },
  {
    titulo: "Para que servem",
    conteudo: [
      "Para te responder, preparar a reunião e prestar o serviço que pediste. É esse o fundamento legal: a execução de um contrato ou de diligências pré-contratuais a teu pedido.",
      "Não vendemos, alugamos nem partilhamos os teus dados para fins de marketing de terceiros.",
    ],
  },
  {
    titulo: "Com quem são partilhados",
    conteudo: [
      "Só com quem é preciso para o site funcionar: a Vercel (alojamento), a Neon (base de dados), a Resend (envio de emails) e a Google (se escolheres entrar com o Google). Cada um trata os dados apenas por nossa instrução.",
    ],
  },
  {
    titulo: "Durante quanto tempo",
    conteudo: [
      "Pedidos de reunião e de briefing: até três anos após o último contacto, para termos histórico de quem já falou connosco.",
      "Contas de utilizador: enquanto a conta existir. Se pedires para a apagar, apagamos.",
    ],
  },
  {
    titulo: "Os teus direitos",
    conteudo: [
      "Podes pedir-nos acesso aos teus dados, correção, apagamento, limitação do tratamento ou portabilidade, e podes opor-te ao tratamento. Basta pedires pelos contactos acima e respondemos no prazo legal de um mês.",
      "Se achares que tratámos mal os teus dados, podes apresentar reclamação à Comissão Nacional de Proteção de Dados (cnpd.pt).",
    ],
  },
  {
    titulo: "Segurança",
    conteudo: [
      "O site corre inteiramente sobre HTTPS, as palavras-passe são guardadas com hash e o acesso à área de gestão é restrito. Nenhum sistema é infalível — se houver uma falha que te afete, avisamos-te.",
    ],
  },
];

export default function PrivacidadePage() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-page max-w-3xl!">
        <p className="eyebrow">Documentos</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Política de privacidade
        </h1>
        <p className="mt-4 text-[15px] text-muted">
          Última atualização: {ATUALIZADO_EM}
        </p>

        <div className="mt-12 space-y-10">
          {seccoes.map((s) => (
            <div key={s.titulo}>
              <h2 className="text-lg font-bold tracking-tight text-ink">
                {s.titulo}
              </h2>
              {s.conteudo.map((p) => (
                <p
                  key={p.slice(0, 40)}
                  className="mt-3 text-[16px] leading-relaxed text-body"
                >
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>

        <p className="mt-14 border-t border-line pt-8 text-[15px] text-body">
          Também podes ler os{" "}
          <Link href="/termos" className="font-semibold text-blue hover:text-navy">
            termos de utilização
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
