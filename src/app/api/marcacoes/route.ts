import crypto from "crypto";
import { after, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AGENDA, TIPOS_IMOVEL, horaEstaLivre } from "@/lib/agenda";
import { carregarOcupacao } from "@/lib/agenda-servidor";
import { notificarMarcacao } from "@/lib/email";

/** Quantas reuniões futuras uma conta pode ter marcadas ao mesmo tempo. */
const MAX_ATIVAS_POR_CONTA = 3;

const schema = z
  .object({
    servico: z.enum(["videos", "sites"]),
    inicio: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Hora inválida."),
    nome: z.string().trim().min(2, "Escreve o teu nome.").max(80),
    email: z.string().trim().toLowerCase().email("Esse email não parece válido."),
    telefone: z.string().trim().max(30).optional(),
    assunto: z.string().trim().min(2, "Falta o nome do alojamento ou da empresa.").max(120),
    tipoAssunto: z.string().trim().min(2, "Falta o tipo.").max(80),
    mensagem: z.string().trim().max(2000).optional(),
  })
  .refine((d) => d.servico !== "videos" || d.tipoAssunto in TIPOS_IMOVEL, {
    message: "Escolhe o tipo de alojamento.",
    path: ["tipoAssunto"],
  });

export async function POST(request: Request) {
  const sessao = await auth();
  if (!sessao?.user?.id) {
    return NextResponse.json({ error: "Precisas de entrar na tua conta para marcar." }, { status: 401 });
  }

  const corpo = await request.json().catch(() => null);
  const parsed = schema.safeParse(corpo);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 },
    );
  }
  const d = parsed.data;
  const inicio = new Date(d.inicio);

  const { ocupadas, bloqueios } = await carregarOcupacao();
  if (!horaEstaLivre(inicio, ocupadas, bloqueios)) {
    return NextResponse.json(
      { error: "Essa hora já não está livre. Escolhe outra.", codigo: "hora_ocupada" },
      { status: 409 },
    );
  }

  const ativas = await prisma.booking.count({
    where: { userId: sessao.user.id, status: "marcada", startsAt: { gte: new Date() } },
  });
  if (ativas >= MAX_ATIVAS_POR_CONTA) {
    return NextResponse.json(
      { error: `Já tens ${ativas} reuniões marcadas. Se precisares de outra, fala connosco.` },
      { status: 429 },
    );
  }

  let marcacao;
  try {
    marcacao = await prisma.booking.create({
      data: {
        service: d.servico,
        startsAt: inicio,
        durationMin: AGENDA.duracaoMin,
        slotKey: inicio.toISOString(),
        cancelToken: crypto.randomBytes(24).toString("base64url"),
        clientName: d.nome,
        clientEmail: d.email,
        clientPhone: d.telefone || null,
        subject: d.assunto,
        subjectType: d.tipoAssunto,
        message: d.mensagem || null,
        userId: sessao.user.id,
      },
    });
  } catch (e) {
    // Duas pessoas carregaram na mesma hora ao mesmo tempo: ganha a primeira.
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        { error: "Alguém marcou essa hora mesmo agora. Escolhe outra.", codigo: "hora_ocupada" },
        { status: 409 },
      );
    }
    throw e;
  }

  // Os emails saem depois de responder: a pessoa não fica à espera deles,
  // e se falharem a marcação já está gravada (ficam no registo de emails).
  after(() => notificarMarcacao(marcacao.id));

  return NextResponse.json(
    { id: marcacao.id },
    { status: 201 },
  );
}
