import { NextResponse } from "next/server";
import { lisboaParaUtc } from "@/lib/agenda";
import { linkGoogleCalendar } from "@/lib/ics";
import {
  tplBriefingAdmin,
  tplBriefingCliente,
  tplContaAdmin,
  tplMarcacaoAdmin,
  tplMarcacaoCliente,
} from "@/lib/email-templates";

/** Pré-visualização dos templates com dados fictícios. Só existe em desenvolvimento. */
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") return new NextResponse(null, { status: 404 });

  const tipo = new URL(request.url).searchParams.get("tipo");
  const inicio = lisboaParaUtc("2026-09-15", "10:00");
  const marcacao = {
    id: "exemplo",
    servico: "videos",
    inicio,
    duracaoMin: 30,
    nome: "Marta Silva",
    email: "marta.silva@exemplo.pt",
    telefone: "912 345 678",
    assunto: "Casa do Rio",
    tipoAssunto: "airbnb",
    mensagem: "Temos 3 quartos e está anunciada no Airbnb e no Booking.\nGostava de ter o vídeo antes do verão.",
    criadaEm: lisboaParaUtc("2026-09-11", "11:42"),
    contaCriadaEm: lisboaParaUtc("2026-09-11", "11:38"),
  };
  const briefing = {
    id: "exemplo",
    nome: "Ricardo Pereira",
    email: "ricardo@clinicaexemplo.pt",
    telefone: "934 000 111",
    empresa: "Clínica Exemplo",
    tipoNegocio: "Clínica de estética",
    necessidades: "Chatbot de apoio ao cliente, Automação de emails",
    orcamento: "1000-5000",
    mensagem: "Queremos que o site marque consultas sozinho.",
    criadoEm: lisboaParaUtc("2026-09-11", "15:10"),
  };
  const cal = linkGoogleCalendar({
    inicio,
    fim: new Date(inicio.getTime() + 30 * 60000),
    titulo: "Reunião NextIA Marketing",
    descricao: "Videochamada",
    local: "Videochamada",
  });

  const email =
    tipo === "booking_admin" ? tplMarcacaoAdmin(marcacao)
    : tipo === "account_admin" ? tplContaAdmin({ nome: "Marta Silva", email: "marta.silva@exemplo.pt", metodo: "password", criadaEm: marcacao.contaCriadaEm, total: 12 })
    : tipo === "briefing_admin" ? tplBriefingAdmin(briefing)
    : tipo === "briefing_client" ? tplBriefingCliente(briefing)
    : tplMarcacaoCliente(marcacao, cal);

  return new NextResponse(email.html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
