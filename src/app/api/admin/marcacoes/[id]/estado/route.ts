import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

const ESTADOS = ["marcada", "realizada", "cancelada"];

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const { id } = await params;
  const { status } = await request.json().catch(() => ({ status: "" }));
  if (!ESTADOS.includes(status)) {
    return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
  }

  const atual = await prisma.booking.findUnique({ where: { id } });
  if (!atual) return NextResponse.json({ error: "Marcação não encontrada." }, { status: 404 });

  try {
    const marcacao = await prisma.booking.update({
      where: { id },
      data: {
        status,
        // Cancelar liberta a hora; reativar volta a ocupá-la.
        slotKey: status === "cancelada" ? null : atual.startsAt.toISOString(),
      },
    });
    return NextResponse.json(marcacao);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        { error: "Essa hora já foi marcada por outra pessoa entretanto." },
        { status: 409 },
      );
    }
    throw e;
  }
}
