import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["novo", "em_contacto", "fechado"];

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json().catch(() => ({ status: "" }));

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Estado inválido." }, { status: 400 });
  }

  const lead = await prisma.websiteLead.update({ where: { id }, data: { status } });
  return NextResponse.json(lead);
}
