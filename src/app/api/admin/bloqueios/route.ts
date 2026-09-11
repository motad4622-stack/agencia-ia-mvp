import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { lisboaParaUtc } from "@/lib/agenda";

const schema = z.object({
  dia: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Dia inválido."),
  das: z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida."),
  as: z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida."),
  motivo: z.string().trim().max(120).optional(),
});

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const bloqueios = await prisma.blockedSlot.findMany({
    where: { endsAt: { gte: new Date() } },
    orderBy: { startsAt: "asc" },
  });
  return NextResponse.json(bloqueios);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." }, { status: 400 });
  }
  const { dia, das, as, motivo } = parsed.data;
  const startsAt = lisboaParaUtc(dia, das);
  const endsAt = lisboaParaUtc(dia, as);
  if (endsAt <= startsAt) {
    return NextResponse.json({ error: "A hora de fim tem de ser depois da de início." }, { status: 400 });
  }
  const bloqueio = await prisma.blockedSlot.create({ data: { startsAt, endsAt, reason: motivo || null } });
  return NextResponse.json(bloqueio, { status: 201 });
}
