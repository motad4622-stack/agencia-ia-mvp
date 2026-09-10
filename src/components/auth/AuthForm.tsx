"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

/**
 * Formulário de entrada / criação de conta.
 *
 * Usado dentro da janela modal que aparece quando alguém carrega em
 * "Marcar reunião" sem sessão iniciada, e também na página /entrar (para
 * quem chega lá por link direto).
 */
export function AuthForm({
  next,
  googleAtivo,
  onSucesso,
  autoFocus = false,
}: {
  next: string;
  googleAtivo: boolean;
  onSucesso?: () => void;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [modo, setModo] = useState<"entrar" | "criar">("criar");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [aceita, setAceita] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aEnviar, setAEnviar] = useState(false);

  const aCriar = modo === "criar";

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setAEnviar(true);

    try {
      if (aCriar) {
        const resposta = await fetch("/api/auth/registar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: nome, email, password }),
        });
        if (!resposta.ok) {
          const dados = await resposta.json().catch(() => ({}));
          setErro(dados.error ?? "Não foi possível criar a conta.");
          return;
        }
      }

      const resultado = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (resultado?.error) {
        setErro(
          aCriar
            ? "A conta foi criada, mas a entrada falhou. Tenta entrar."
            : "Email ou palavra-passe errados.",
        );
        return;
      }

      onSucesso?.();
      router.push(next);
      router.refresh();
    } catch {
      setErro("Alguma coisa correu mal. Tenta outra vez.");
    } finally {
      setAEnviar(false);
    }
  }

  return (
    <div>
      {googleAtivo && (
        <>
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: next })}
            className="flex w-full items-center justify-center gap-3 rounded-md border border-line-strong bg-white px-6 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            <IconeGoogle />
            Continuar com Google
          </button>
          <div className="my-5 flex items-center gap-4">
            <span className="h-px flex-1 bg-line" />
            <span className="text-[13px] text-muted">ou</span>
            <span className="h-px flex-1 bg-line" />
          </div>
        </>
      )}

      <form onSubmit={submeter} className="space-y-4">
        {aCriar && (
          <label className="block">
            <span className="field-label">Nome</span>
            <input
              type="text"
              required
              autoFocus={autoFocus}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="name"
              className="input"
              placeholder="Como te chamamos"
            />
          </label>
        )}

        <label className="block">
          <span className="field-label">Email</span>
          <input
            type="email"
            required
            autoFocus={autoFocus && !aCriar}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="input"
            placeholder="tu@exemplo.pt"
          />
        </label>

        <label className="block">
          <span className="field-label">Palavra-passe</span>
          <input
            type="password"
            required
            minLength={aCriar ? 8 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={aCriar ? "new-password" : "current-password"}
            className="input"
            placeholder={aCriar ? "Pelo menos 8 caracteres" : "••••••••"}
          />
        </label>

        {aCriar && (
          <label className="flex cursor-pointer gap-2.5 text-[13px] leading-relaxed text-body">
            <input
              type="checkbox"
              required
              checked={aceita}
              onChange={(e) => setAceita(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#0b2545]"
            />
            <span>
              Li e aceito a{" "}
              <Link
                href="/privacidade"
                target="_blank"
                className="font-semibold text-blue hover:text-navy"
              >
                política de privacidade
              </Link>{" "}
              e os{" "}
              <Link
                href="/termos"
                target="_blank"
                className="font-semibold text-blue hover:text-navy"
              >
                termos
              </Link>
              .
            </span>
          </label>
        )}

        {erro && (
          <p
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-800"
          >
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={aEnviar}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {aEnviar
            ? "Um momento…"
            : aCriar
              ? "Criar conta e continuar"
              : "Entrar e continuar"}
        </button>
      </form>

      <p className="mt-5 text-center text-[14px] text-body">
        {aCriar ? "Já tens conta?" : "Ainda não tens conta?"}{" "}
        <button
          type="button"
          onClick={() => {
            setModo(aCriar ? "entrar" : "criar");
            setErro(null);
          }}
          className="font-semibold text-blue hover:text-navy"
        >
          {aCriar ? "Entrar" : "Criar conta"}
        </button>
      </p>
    </div>
  );
}

function IconeGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.92v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.98 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.92a9 9 0 0 0 0 8.1l3.06-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .92 4.95l3.06 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}
