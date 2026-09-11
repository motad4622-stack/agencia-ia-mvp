import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const marcacoes = await prisma.booking.findMany({
    orderBy: { startsAt: "desc" },
    take: 200,
    include: { user: { select: { email: true, createdAt: true } } },
  });
  return NextResponse.json(marcacoes);
}
