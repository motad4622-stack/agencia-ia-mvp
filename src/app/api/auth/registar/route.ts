import { after, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notificarConta } from "@/lib/email";

/** Criação de conta com email e palavra-passe. */
const schema = z.object({
  name: z.string().trim().min(2, "Escreve o teu nome.").max(80),
  email: z.string().trim().toLowerCase().email("Esse email não parece válido."),
  password: z
    .string()
    .min(8, "A palavra-passe tem de ter pelo menos 8 caracteres.")
    .max(200),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;

  const existente = await prisma.user.findUnique({ where: { email } });
  if (existente) {
    // Conta criada antes com o Google: não tem palavra-passe definida.
    if (!existente.passwordHash) {
      return NextResponse.json(
        {
          error:
            "Já existe uma conta com este email, criada com o Google. Entra com o Google.",
        },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Já existe uma conta com este email. Tenta entrar." },
      { status: 409 },
    );
  }

  const utilizador = await prisma.user.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, 12) },
  });

  after(() => notificarConta(utilizador.id));

  return NextResponse.json({ ok: true }, { status: 201 });
}
