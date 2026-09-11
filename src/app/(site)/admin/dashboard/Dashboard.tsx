"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Marcacao {
  id: string;
  service: string;
  startsAt: string;
  durationMin: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  subject: string;
  subjectType: string;
  message: string | null;
  status: string;
  createdAt: string;
}

interface WebsiteLead {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  companyName: string;
  businessType: string;
  needs: string;
  budgetRange: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

interface Bloqueio {
  id: string;
  startsAt: string;
  endsAt: string;
  reason: string | null;
}

interface EmailLog {
  id: string;
  kind: string;
  to: string;
  subject: string;
  status: string;
  error: string | null;
  attempts: number;
  createdAt: string;
  updatedAt: string;
}

type Separador = "marcacoes" | "leads" | "agenda" | "emails";

const LEAD_ESTADOS: Record<string, string> = { novo: "Novo", em_contacto: "Em contacto", fechado: "Fechado" };
const LEAD_CORES: Record<string, string> = {
  novo: "bg-blue-100 text-blue-700",
  em_contacto: "bg-amber-100 text-amber-700",
  fechado: "bg-green-100 text-green-700",
};

const MARCACAO_ESTADOS: Record<string, string> = { marcada: "Marcada", realizada: "Realizada", cancelada: "Cancelada" };
const MARCACAO_CORES: Record<string, string> = {
  marcada: "bg-blue-100 text-blue-700",
  realizada: "bg-green-100 text-green-700",
  cancelada: "bg-gray-100 text-gray-500",
};

const SERVICOS: Record<string, string> = { videos: "Vídeo de alojamento", sites: "Site com IA" };
const TIPOS: Record<string, string> = { airbnb: "Airbnb", alojamento_local: "Alojamento local", hotel: "Hotel" };

const TIPOS_EMAIL: Record<string, string> = {
  booking_client: "Confirmação ao cliente",
  booking_admin: "Aviso de marcação",
  account_admin: "Aviso de conta nova",
  briefing_client: "Confirmação de briefing",
  briefing_admin: "Aviso de briefing",
};

const FUSO = "Europe/Lisbon";
const fmtDataHora = new Intl.DateTimeFormat("pt-PT", {
  timeZone: FUSO,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
const fmtDiaReuniao = new Intl.DateTimeFormat("pt-PT", { timeZone: FUSO, weekday: "short", day: "2-digit", month: "short" });
const fmtHora = new Intl.DateTimeFormat("pt-PT", { timeZone: FUSO, hour: "2-digit", minute: "2-digit" });

export function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Separador>("marcacoes");
  const [marcacoes, setMarcacoes] = useState<Marcacao[]>([]);
  const [leads, setLeads] = useState<WebsiteLead[]>([]);
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([]);
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [aviso, setAviso] = useState<string | null>(null);
  // Hora de referência para separar próximas de anteriores — atualizada a
  // cada carregamento, nunca durante o render.
  const [agora, setAgora] = useState(0);

  async function loadData() {
    const respostas = await Promise.all(
      ["/api/admin/marcacoes", "/api/admin/leads", "/api/admin/bloqueios", "/api/admin/emails"].map((u) =>
        fetch(u, { cache: "no-store" }),
      ),
    );
    if (respostas.some((r) => r.status === 401)) {
      router.push("/admin");
      return;
    }
    const [m, l, b, e] = await Promise.all(respostas.map((r) => r.json()));
    setMarcacoes(m);
    setLeads(l);
    setBloqueios(b);
    setEmails(e);
    setAgora(Date.now());
    setLoading(false);
  }

  useEffect(() => {
    // Polling deliberado (dashboard interno, sem websockets no MVP):
    // busca ao montar e depois a cada 8s.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function mudarEstadoMarcacao(id: string, status: string) {
    const r = await fetch(`/api/admin/marcacoes/${id}/estado`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!r.ok) setAviso((await r.json().catch(() => ({}))).error ?? "Não foi possível mudar o estado.");
    loadData();
  }

  async function mudarEstadoLead(id: string, status: string) {
    await fetch(`/api/admin/leads/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadData();
  }

  async function reenviar(id: string) {
    setAviso(null);
    const r = await fetch(`/api/admin/emails/${id}/reenviar`, { method: "POST" });
    const d = await r.json().catch(() => ({}));
    setAviso(d.ok ? "Email reenviado." : `O reenvio falhou: ${d.erro ?? "erro desconhecido"}`);
    loadData();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  const proximas = marcacoes
    .filter((m) => m.status === "marcada" && new Date(m.startsAt).getTime() >= agora - 3600000)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const outras = marcacoes.filter((m) => !proximas.includes(m));
  const falhados = emails.filter((e) => e.status === "falhou").length;

  return (
    <div>
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Painel de administração</h1>
        <button onClick={handleLogout} className="text-sm font-medium text-muted transition-colors hover:text-navy">
          Sair
        </button>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto border-b border-line">
        <TabButton active={tab === "marcacoes"} onClick={() => setTab("marcacoes")}>
          Reuniões ({proximas.length} próximas)
        </TabButton>
        <TabButton active={tab === "leads"} onClick={() => setTab("leads")}>
          Briefings ({leads.length})
        </TabButton>
        <TabButton active={tab === "agenda"} onClick={() => setTab("agenda")}>
          Agenda
        </TabButton>
        <TabButton active={tab === "emails"} onClick={() => setTab("emails")}>
          Emails{falhados > 0 ? ` (${falhados} falhados)` : ""}
        </TabButton>
      </div>

      {aviso && (
        <p className="mb-6 flex items-start justify-between gap-4 rounded-md border border-line bg-surface px-4 py-3 text-sm text-body">
          {aviso}
          <button onClick={() => setAviso(null)} className="text-muted hover:text-ink" aria-label="Fechar aviso">
            ✕
          </button>
        </p>
      )}

      {loading && <p className="text-sm text-muted">A carregar…</p>}

      {!loading && tab === "marcacoes" && (
        <div className="space-y-10">
          <TabelaMarcacoes titulo="Próximas" linhas={proximas} vazio="Não há reuniões marcadas." onEstado={mudarEstadoMarcacao} />
          {outras.length > 0 && (
            <TabelaMarcacoes titulo="Anteriores e canceladas" linhas={outras} vazio="" onEstado={mudarEstadoMarcacao} />
          )}
        </div>
      )}

      {!loading && tab === "leads" && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="py-3 pl-5 pr-4 font-medium">Estado</th>
                <th className="py-3 pr-4 font-medium">Empresa</th>
                <th className="py-3 pr-4 font-medium">Contacto</th>
                <th className="py-3 pr-4 font-medium">Orçamento</th>
                <th className="py-3 pr-4 font-medium">Necessidades</th>
                <th className="py-3 pr-5 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-line align-top last:border-0">
                  <td className="py-4 pl-5 pr-4">
                    <select
                      value={lead.status}
                      onChange={(e) => mudarEstadoLead(lead.id, e.target.value)}
                      className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold ${LEAD_CORES[lead.status] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {Object.entries(LEAD_ESTADOS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="font-medium text-ink">{lead.companyName}</div>
                    <div className="text-xs text-muted">{lead.businessType}</div>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="text-ink">{lead.clientName}</div>
                    <a href={`mailto:${lead.clientEmail}`} className="text-xs text-blue hover:text-navy">
                      {lead.clientEmail}
                    </a>
                    {lead.clientPhone && <div className="text-xs text-muted">{lead.clientPhone}</div>}
                  </td>
                  <td className="py-4 pr-4 text-body">{lead.budgetRange || "—"}</td>
                  <td className="max-w-xs py-4 pr-4 text-body">
                    <p className="line-clamp-2">{lead.needs}</p>
                    {lead.message && <p className="mt-1 line-clamp-2 text-xs text-muted">{lead.message}</p>}
                  </td>
                  <td className="py-4 pr-5 text-muted">{fmtDataHora.format(new Date(lead.createdAt))}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted">
                    Ainda não há pedidos de briefing.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === "agenda" && (
        <Agenda bloqueios={bloqueios} onMudou={loadData} onAviso={setAviso} />
      )}

      {!loading && tab === "emails" && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-muted">
                <th className="py-3 pl-5 pr-4 font-medium">Estado</th>
                <th className="py-3 pr-4 font-medium">Email</th>
                <th className="py-3 pr-4 font-medium">Para</th>
                <th className="py-3 pr-4 font-medium">Quando</th>
                <th className="py-3 pr-5 font-medium" />
              </tr>
            </thead>
            <tbody>
              {emails.map((e) => (
                <tr key={e.id} className="border-b border-line align-top last:border-0">
                  <td className="py-4 pl-5 pr-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                        e.status === "enviado" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {e.status === "enviado" ? "Enviado" : "Falhou"}
                    </span>
                  </td>
                  <td className="max-w-sm py-4 pr-4">
                    <div className="font-medium text-ink">{TIPOS_EMAIL[e.kind] ?? e.kind}</div>
                    <div className="text-xs text-muted">{e.subject}</div>
                    {e.error && <div className="mt-1 text-xs text-red-700">{e.error}</div>}
                  </td>
                  <td className="py-4 pr-4 text-body">{e.to}</td>
                  <td className="py-4 pr-4 text-muted">
                    {fmtDataHora.format(new Date(e.updatedAt))}
                    {e.attempts > 1 && <div className="text-xs">{e.attempts} tentativas</div>}
                  </td>
                  <td className="py-4 pr-5 text-right">
                    <button
                      onClick={() => reenviar(e.id)}
                      className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        e.status === "falhou"
                          ? "border-navy bg-navy text-white hover:bg-navy-800"
                          : "border-line-strong text-ink hover:border-navy"
                      }`}
                    >
                      Reenviar
                    </button>
                  </td>
                </tr>
              ))}
              {emails.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted">
                    Ainda não saiu nenhum email.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TabelaMarcacoes({
  titulo,
  linhas,
  vazio,
  onEstado,
}: {
  titulo: string;
  linhas: Marcacao[];
  vazio: string;
  onEstado: (id: string, status: string) => void;
}) {
  return (
    <div>
      <p className="eyebrow mb-3">{titulo}</p>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-muted">
              <th className="py-3 pl-5 pr-4 font-medium">Quando</th>
              <th className="py-3 pr-4 font-medium">Cliente</th>
              <th className="py-3 pr-4 font-medium">Sobre</th>
              <th className="py-3 pr-4 font-medium">Mensagem</th>
              <th className="py-3 pr-5 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((m) => {
              const inicio = new Date(m.startsAt);
              return (
                <tr key={m.id} className={`border-b border-line align-top last:border-0 ${m.status === "cancelada" ? "opacity-60" : ""}`}>
                  <td className="whitespace-nowrap py-4 pl-5 pr-4">
                    <div className="font-semibold text-ink">{fmtDiaReuniao.format(inicio)}</div>
                    <div className="text-muted">
                      {fmtHora.format(inicio)} · {m.durationMin} min
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="font-medium text-ink">{m.clientName}</div>
                    <a href={`mailto:${m.clientEmail}`} className="text-xs text-blue hover:text-navy">
                      {m.clientEmail}
                    </a>
                    {m.clientPhone && <div className="text-xs text-muted">{m.clientPhone}</div>}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="text-ink">{m.subject}</div>
                    <div className="text-xs text-muted">
                      {SERVICOS[m.service] ?? m.service} · {TIPOS[m.subjectType] ?? m.subjectType}
                    </div>
                  </td>
                  <td className="max-w-xs py-4 pr-4 text-body">
                    <p className="line-clamp-3">{m.message || "—"}</p>
                  </td>
                  <td className="py-4 pr-5">
                    <select
                      value={m.status}
                      onChange={(e) => onEstado(m.id, e.target.value)}
                      className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold ${MARCACAO_CORES[m.status] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {Object.entries(MARCACAO_ESTADOS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
            {linhas.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-muted">
                  {vazio}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Agenda({
  bloqueios,
  onMudou,
  onAviso,
}: {
  bloqueios: Bloqueio[];
  onMudou: () => void;
  onAviso: (t: string | null) => void;
}) {
  const [dia, setDia] = useState("");
  const [diaInteiro, setDiaInteiro] = useState(true);
  const [das, setDas] = useState("09:00");
  const [as, setAs] = useState("13:00");
  const [motivo, setMotivo] = useState("");
  const [aGravar, setAGravar] = useState(false);

  async function bloquear(e: React.FormEvent) {
    e.preventDefault();
    setAGravar(true);
    onAviso(null);
    const r = await fetch("/api/admin/bloqueios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dia,
        das: diaInteiro ? "00:00" : das,
        as: diaInteiro ? "23:59" : as,
        motivo: motivo || undefined,
      }),
    });
    setAGravar(false);
    if (!r.ok) {
      onAviso((await r.json().catch(() => ({}))).error ?? "Não foi possível bloquear.");
      return;
    }
    setMotivo("");
    onMudou();
  }

  async function remover(id: string) {
    await fetch(`/api/admin/bloqueios/${id}`, { method: "DELETE" });
    onMudou();
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[360px_1fr]">
      <form onSubmit={bloquear} className="card space-y-4 p-6">
        <div>
          <p className="font-semibold text-ink">Bloquear horário</p>
          <p className="mt-1 text-sm text-body">O site deixa de oferecer esse período a quem marca.</p>
        </div>
        <label className="block">
          <span className="field-label">Dia</span>
          <input type="date" required value={dia} onChange={(e) => setDia(e.target.value)} className="input" />
        </label>
        <label className="flex items-center gap-2 text-sm text-body">
          <input type="checkbox" checked={diaInteiro} onChange={(e) => setDiaInteiro(e.target.checked)} className="h-4 w-4 accent-[#0b2545]" />
          Dia inteiro
        </label>
        {!diaInteiro && (
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="field-label">Das</span>
              <input type="time" required value={das} onChange={(e) => setDas(e.target.value)} className="input" />
            </label>
            <label className="block">
              <span className="field-label">Às</span>
              <input type="time" required value={as} onChange={(e) => setAs(e.target.value)} className="input" />
            </label>
          </div>
        )}
        <label className="block">
          <span className="field-label">Motivo (só para ti)</span>
          <input value={motivo} onChange={(e) => setMotivo(e.target.value)} className="input" placeholder="Férias, consulta…" maxLength={120} />
        </label>
        <button type="submit" disabled={aGravar} className="btn-primary w-full disabled:opacity-60">
          {aGravar ? "A gravar…" : "Bloquear"}
        </button>
      </form>

      <div>
        <p className="eyebrow mb-3">Períodos bloqueados</p>
        <div className="card divide-y divide-line">
          {bloqueios.map((b) => {
            const ini = new Date(b.startsAt);
            const fim = new Date(b.endsAt);
            const inteiro = fmtHora.format(ini) === "00:00" && fmtHora.format(fim) === "23:59";
            return (
              <div key={b.id} className="flex items-center justify-between gap-4 px-5 py-4 text-sm">
                <div>
                  <div className="font-semibold text-ink">{fmtDiaReuniao.format(ini)}</div>
                  <div className="text-muted">
                    {inteiro ? "Dia inteiro" : `${fmtHora.format(ini)} – ${fmtHora.format(fim)}`}
                    {b.reason ? ` · ${b.reason}` : ""}
                  </div>
                </div>
                <button onClick={() => remover(b.id)} className="text-sm font-medium text-muted hover:text-red-700">
                  Desbloquear
                </button>
              </div>
            );
          })}
          {bloqueios.length === 0 && <p className="px-5 py-8 text-center text-sm text-muted">Nada bloqueado.</p>}
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-muted">
          Horário de marcações: segunda a sexta, 9h30–12h30 e 14h–18h, reuniões de 30 minutos com 15
          de folga. Feriados nacionais já saem automaticamente.
        </p>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
        active ? "border-navy text-navy" : "border-transparent text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
