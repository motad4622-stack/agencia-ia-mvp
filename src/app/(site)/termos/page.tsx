import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_NAME, VIDEO_PRICE_EUR } from "@/lib/brand";

/*
 * Termos de utilização — texto-base, a validar antes de se assumir como
 * documento contratual. Falta a identificação fiscal da empresa.
 */

export const metadata: Metadata = {
  title: `Termos de utilização — ${BRAND_NAME}`,
  description:
    "As regras de utilização do site, das contas e dos pedidos de reunião.",
};

const ATUALIZADO_EM = "10 de setembro de 2026";

const seccoes = [
  {
    titulo: "O que este site é",
    conteudo: [
      `Este site apresenta os serviços da ${BRAND_NAME} e permite marcar uma reunião ou pedir um briefing. Não é uma loja: não há pagamentos no site nem serviços prestados automaticamente.`,
    ],
  },
  {
    titulo: "Contas",
    conteudo: [
      "Para marcar uma reunião ou pedir um briefing é preciso criar conta ou entrar com o Google. Os dados que indicares têm de ser verdadeiros e a conta é pessoal — és responsável por manter a palavra-passe em segurança.",
      "Podemos suspender contas usadas para enviar spam, tentar aceder a áreas restritas ou perturbar o funcionamento do site.",
    ],
  },
  {
    titulo: "Marcações",
    conteudo: [
      "Marcar uma reunião não é contratar um serviço — é reservar uma conversa, sem custo e sem compromisso. Se não puderes comparecer, avisa com antecedência para libertarmos o horário.",
    ],
  },
  {
    titulo: "Preços e orçamentos",
    conteudo: [
      `Os valores indicados no site, como os ${VIDEO_PRICE_EUR}€ por vídeo, são pontos de partida por imóvel e não constituem proposta. O preço final depende do âmbito de cada trabalho e é acordado por escrito antes de começarmos.`,
    ],
  },
  {
    titulo: "Conteúdos que nos entregas",
    conteudo: [
      "As fotografias e os textos que nos entregas continuam a ser teus. Ao entregá-los, garantes que tens direito a usá-los e autorizas-nos a trabalhá-los para produzir o que pediste.",
      "Só mostramos trabalho teu como exemplo no nosso site ou nas nossas redes se nos autorizares por escrito.",
    ],
  },
  {
    titulo: "Conteúdos deste site",
    conteudo: [
      "Os textos, imagens, vídeos e código deste site são nossos ou usados com autorização. Os exemplos identificados como demonstração usam alojamentos fictícios — os nomes, contactos e preços que lá aparecem não são reais.",
    ],
  },
  {
    titulo: "Limites",
    conteudo: [
      "Fazemos o possível por manter o site disponível e correto, mas não garantimos funcionamento sem interrupções nem ausência total de erros. Não respondemos por decisões de negócio tomadas apenas com base no que aqui está escrito.",
    ],
  },
  {
    titulo: "Lei aplicável",
    conteudo: [
      "Aplica-se a lei portuguesa. Em caso de litígio de consumo, podes recorrer a uma entidade de resolução alternativa de litígios, nos termos da Lei n.º 144/2015.",
    ],
  },
];

export default function TermosPage() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-page max-w-3xl!">
        <p className="eyebrow">Documentos</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Termos de utilização
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
          Vê também a{" "}
          <Link
            href="/privacidade"
            className="font-semibold text-blue hover:text-navy"
          >
            política de privacidade
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
