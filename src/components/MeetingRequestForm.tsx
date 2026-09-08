"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MeetingRequestForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      clientName: formData.get("clientName"),
      clientEmail: formData.get("clientEmail"),
      clientPhone: formData.get("clientPhone") || undefined,
      propertyName: formData.get("propertyName"),
      propertyType: formData.get("propertyType"),
      message: formData.get("message") || undefined,
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/videos/meeting-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao enviar o pedido.");
      router.push("/videos/marcar-reuniao/sucesso");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido. Tenta novamente.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Nome" name="clientName" required />
        <Field label="Email" name="clientEmail" type="email" required />
        <Field label="Telefone (opcional)" name="clientPhone" />
        <Field label="Nome/morada do imóvel" name="propertyName" required />
      </div>

      <div>
        <label className="field-label">Tipo de alojamento</label>
        <select name="propertyType" required defaultValue="airbnb" className="input">
          <option value="airbnb">Airbnb</option>
          <option value="alojamento_local">Alojamento Local</option>
          <option value="hotel">Hotel</option>
        </select>
      </div>

      <div>
        <label className="field-label">Mensagem (opcional)</label>
        <textarea
          name="message"
          rows={4}
          placeholder="Conta-nos um pouco sobre o imóvel e o que procuras…"
          className="input resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
        {submitting ? "A enviar…" : "Pedir reunião"}
      </button>
    </form>
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
