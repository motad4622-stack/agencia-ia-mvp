/**
 * Acordeão em <details>/<summary> nativo: sem JavaScript, acessível por
 * teclado e por leitores de ecrã, e continua a funcionar se o JS falhar.
 */
const ITEMS: { question: string; answer: string }[] = [
  {
    question: "Como funciona o vídeo de IA?",
    answer:
      "Marcamos uma reunião curta para perceber o imóvel, envias-nos as fotografias que já tens, e a nossa equipa usa ferramentas de IA para as transformar num vídeo com movimento e ritmo de vídeo profissional. Não precisas de filmar nem de contratar ninguém para ir ao local.",
  },
  {
    question: "Que tipo de fotografias preciso de enviar?",
    answer:
      "As fotografias que já usas no anúncio costumam chegar. Quanto melhor a luz natural e a resolução, melhor o resultado — e quantos mais divisões cobrires, mais completo fica o percurso pelo espaço.",
  },
  {
    question: "Quanto tempo demora?",
    answer:
      "Combinamos o prazo na reunião, consoante o número de imóveis e o detalhe pretendido. Como não há filmagens nem deslocações, o processo é bastante mais rápido do que uma produção de vídeo tradicional.",
  },
  {
    question: "Posso usar o vídeo no Airbnb e nas redes sociais?",
    answer:
      "Sim. O vídeo é teu e pensado para ser usado no anúncio, no teu site e nas redes sociais. Se precisares de um formato específico (vertical para reels, por exemplo), é só dizeres na reunião.",
  },
  {
    question: "Criam sites para qualquer tipo de negócio?",
    answer:
      "Trabalhamos sobretudo com pequenas e médias empresas que querem um site que faça mais do que estar bonito. Se o teu caso não se enquadrar, dizemos-te com franqueza na primeira conversa.",
  },
  {
    question: "O site pode ter chatbot?",
    answer:
      "Pode. Um chatbot treinado com a informação do teu negócio consegue responder às perguntas mais frequentes a qualquer hora e encaminhar os pedidos que precisam mesmo de ti.",
  },
  {
    question: "Posso pedir automações personalizadas?",
    answer:
      "Sim. Automações de email, geração de conteúdo ou ligações às ferramentas que já usas — definimos o que faz sentido no briefing, em função do que te dá mais tempo de volta.",
  },
  {
    question: "Como começa o projeto?",
    answer:
      "Com uma reunião de 30 minutos. Ouvimos o que precisas, explicamos o que dá para fazer e enviamos uma proposta. Só avançamos quando estiver claro dos dois lados.",
  },
];

export function Faq() {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
      {ITEMS.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-5 py-5 text-[17px] font-semibold text-ink transition-colors hover:bg-surface sm:px-7">
            {item.question}
            <span
              aria-hidden
              className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-line-strong text-body transition-transform group-open:rotate-45"
            >
              <svg width="11" height="11" viewBox="0 0 11 11">
                <path
                  d="M5.5 0v11M0 5.5h11"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </summary>
          <div className="px-5 pb-6 text-[15px] leading-relaxed text-body sm:px-7 sm:pr-16">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
