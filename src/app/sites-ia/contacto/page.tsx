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
    <section className="mx-auto max-w-2xl px-4 sm:px-6 py-16 w-full">
      <h1 className="text-3xl font-bold text-brand">Pedido de briefing</h1>
      <p className="mt-2 text-gray-600">
        Conta-nos sobre o teu negócio — entramos em contacto em 24h úteis.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nome" name="clientName" required />
          <Field label="Email" name="clientEmail" type="email" required />
          <Field label="Telefone (opcional)" name="clientPhone" />
          <Field label="Nome da empresa" name="companyName" required />
          <Field label="Tipo de negócio / setor" name="businessType" required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orçamento aproximado
            </label>
            <select
              name="budgetRange"
              defaultValue=""
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Não sei ainda</option>
              <option value="<1000">Menos de 1000€</option>
              <option value="1000-5000">1000€ – 5000€</option>
              <option value="5000+">Mais de 5000€</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            O que pretendes integrar?
          </label>
          <div className="grid sm:grid-cols-2 gap-2">
            {NEEDS_OPTIONS.map((need) => (
              <label
                key={need}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm cursor-pointer hover:border-gray-300"
              >
                <input
                  type="checkbox"
                  checked={selectedNeeds.includes(need)}
                  onChange={() => toggleNeed(need)}
                  className="rounded border-gray-300"
                />
                {need}
              </label>
            ))}
          </div>
          <textarea
            name="needsFreeText"
            rows={2}
            placeholder="Ou descreve por palavras tuas o que precisas…"
            className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mensagem livre (opcional)
          </label>
          <textarea
            name="message"
            rows={4}
            placeholder="Conta-nos mais sobre o teu negócio e objetivos…"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand text-white font-semibold px-6 py-3 hover:bg-brand-light disabled:opacity-50 transition-colors"
        >
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
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />
    </div>
  );
}
