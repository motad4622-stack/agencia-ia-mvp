"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const NEEDS_OPTIONS = [
  "Chatbot de apoio ao cliente",
  "Automação de emails",
  "Geração automática de conteúdo",
  "Motor de recomendação",
  "Outro / não sei ainda",
];

export default function ContactoSitesIaPage() {
  const router = useRouter();
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleNeed(need: string) {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const messageFreeText = String(formData.get("needsFreeText") || "").trim();
    const needs = [selectedNeeds.join(", "), messageFreeText].filter(Boolean).join(" — ") ||
      "Não especificado";

    const payload = {
      clientName: formData.get("clientName"),
      clientEmail: formData.get("clientEmail"),
      clientPhone: formData.get("clientPhone") || undefined,
      companyName: formData.get("companyName"),
      businessType: formData.get("businessType"),
      needs,
      budgetRange: formData.get("budgetRange") || undefined,
      message: formData.get("message") || undefined,
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/sites-ia/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao enviar o pedido.");
      router.push("/sites-ia/contacto/sucesso");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido. Tenta novamente.");
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-4 sm:px-6 py-20 w-full">
      <div className="text-center mb-10">
        <p className="eyebrow mx-auto mb-6">Sites com IA para Empresas</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">Pedido de briefing</h1>
        <p className="mt-3 text-body max-w-md mx-auto">
          Conta-nos sobre o teu negócio — entramos em contacto em 24h úteis.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 sm:p-10 space-y-7">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Nome" name="clientName" required />
          <Field label="Email" name="clientEmail" type="email" required />
          <Field label="Telefone (opcional)" name="clientPhone" />
          <Field label="Nome da empresa" name="companyName" required />
          <Field label="Tipo de negócio / setor" name="businessType" required />
          <div>
            <label className="field-label">Orçamento aproximado</label>
            <select name="budgetRange" defaultValue="" className="input">
              <option value="">Não sei ainda</option>
              <option value="<1000">Menos de 1000€</option>
              <option value="1000-5000">1000€ – 5000€</option>
              <option value="5000+">Mais de 5000€</option>
            </select>
          </div>
        </div>

        <div>
          <label className="field-label mb-2.5">O que pretendes integrar?</label>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {NEEDS_OPTIONS.map((need) => (
              <label
                key={need}
                className="flex items-center gap-2.5 rounded-xl border border-line px-3.5 py-2.5 text-sm text-body cursor-pointer transition-colors hover:border-accent-blue/40 has-[:checked]:border-accent-blue has-[:checked]:bg-accent-blue-50 has-[:checked]:text-ink"
              >
                <input
                  type="checkbox"
                  checked={selectedNeeds.includes(need)}
                  onChange={() => toggleNeed(need)}
                  className="rounded border-line text-brand focus:ring-accent-blue-50"
                />
                {need}
              </label>
            ))}
          </div>
          <textarea
            name="needsFreeText"
            rows={2}
            placeholder="Ou descreve por palavras tuas o que precisas…"
            className="input mt-3.5 resize-none"
          />
        </div>

        <div>
          <label className="field-label">Mensagem livre (opcional)</label>
          <textarea
            name="message"
            rows={4}
            placeholder="Conta-nos mais sobre o teu negócio e objetivos…"
            className="input resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
          {submitting ? "A enviar…" : "Enviar pedido"}
        </button>
      </form>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input name={name} type={type} required={required} className="input" />
    </div>
  );
}
