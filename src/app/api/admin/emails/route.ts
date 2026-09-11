import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const emails = await prisma.emailLog.findMany({ orderBy: { createdAt: "desc" }, take: 150 });
  return NextResponse.json(emails);
}
