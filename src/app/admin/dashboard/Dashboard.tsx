"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface MeetingRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  propertyName: string;
  propertyType: string;
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

const STATUS_LABEL: Record<string, string> = {
  novo: "Novo",
  em_contacto: "Em contacto",
  fechado: "Fechado",
};

const STATUS_COLOR: Record<string, string> = {
  novo: "bg-blue-100 text-blue-700",
  em_contacto: "bg-amber-100 text-amber-700",
  fechado: "bg-green-100 text-green-700",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Dashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"meetings" | "leads">("meetings");
  const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>([]);
  const [leads, setLeads] = useState<WebsiteLead[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    const [meetingsRes, leadsRes] = await Promise.all([
      fetch("/api/admin/meeting-requests", { cache: "no-store" }),
      fetch("/api/admin/leads", { cache: "no-store" }),
    ]);
    if (meetingsRes.status === 401 || leadsRes.status === 401) {
      router.push("/admin");
      return;
    }
    setMeetingRequests(await meetingsRes.json());
    setLeads(await leadsRes.json());
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

  async function handleMeetingStatus(id: string, status: string) {
    await fetch(`/api/admin/meeting-requests/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadData();
  }

  async function handleLeadStatus(id: string, status: string) {
    await fetch(`/api/admin/leads/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadData();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Painel de administração
        </h1>
        <button onClick={handleLogout} className="text-sm font-medium text-muted transition-colors hover:text-navy">
          Sair
        </button>
      </div>

      <div className="flex gap-2 border-b border-line mb-6">
        <TabButton active={tab === "meetings"} onClick={() => setTab("meetings")}>
          Pedidos de Reunião — Vídeos ({meetingRequests.length})
        </TabButton>
        <TabButton active={tab === "leads"} onClick={() => setTab("leads")}>
          Leads de Sites com IA ({leads.length})
        </TabButton>
      </div>

      {loading && <p className="text-muted text-sm">A carregar…</p>}

      {!loading && tab === "meetings" && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-line">
                <th className="py-3 pl-5 pr-4 font-medium">Estado</th>
                <th className="py-3 pr-4 font-medium">Cliente</th>
                <th className="py-3 pr-4 font-medium">Imóvel</th>
                <th className="py-3 pr-4 font-medium">Mensagem</th>
                <th className="py-3 pr-5 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {meetingRequests.map((mr) => (
                <tr key={mr.id} className="border-b border-line last:border-0 align-top">
                  <td className="py-4 pl-5 pr-4">
                    <select
                      value={mr.status}
                      onChange={(e) => handleMeetingStatus(mr.id, e.target.value)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold border-0 ${STATUS_COLOR[mr.status] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {Object.entries(STATUS_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="font-medium text-ink">{mr.clientName}</div>
                    <div className="text-muted text-xs">{mr.clientEmail}</div>
                    {mr.clientPhone && <div className="text-muted text-xs">{mr.clientPhone}</div>}
                  </td>
                  <td className="py-4 pr-4">
                    <div className="text-ink">{mr.propertyName}</div>
                    <div className="text-muted text-xs">{mr.propertyType}</div>
                  </td>
                  <td className="py-4 pr-4 text-body max-w-xs">
                    <p className="line-clamp-2">{mr.message || "—"}</p>
                  </td>
                  <td className="py-4 pr-5 text-muted">{formatDate(mr.createdAt)}</td>
                </tr>
              ))}
              {meetingRequests.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-muted">
                    Ainda não há pedidos de reunião.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!loading && tab === "leads" && (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-line">
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
                <tr key={lead.id} className="border-b border-line last:border-0 align-top">
                  <td className="py-4 pl-5 pr-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleLeadStatus(lead.id, e.target.value)}
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold border-0 ${STATUS_COLOR[lead.status] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {Object.entries(STATUS_LABEL).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="font-medium text-ink">{lead.companyName}</div>
                    <div className="text-muted text-xs">{lead.businessType}</div>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="text-ink">{lead.clientName}</div>
                    <div className="text-muted text-xs">{lead.clientEmail}</div>
                    {lead.clientPhone && (
                      <div className="text-muted text-xs">{lead.clientPhone}</div>
                    )}
                  </td>
                  <td className="py-4 pr-4 text-body">{lead.budgetRange || "—"}</td>
                  <td className="py-4 pr-4 text-body max-w-xs">
                    <p className="line-clamp-2">{lead.needs}</p>
                    {lead.message && (
                      <p className="text-muted text-xs mt-1 line-clamp-2">{lead.message}</p>
                    )}
                  </td>
                  <td className="py-4 pr-5 text-muted">{formatDate(lead.createdAt)}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted">
                    Ainda não há leads de sites com IA.
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
      className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
        active ? "border-navy text-navy" : "border-transparent text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
