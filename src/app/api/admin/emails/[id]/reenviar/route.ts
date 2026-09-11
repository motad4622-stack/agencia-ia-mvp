import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { reenviarEmail } from "@/lib/email";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const { id } = await params;
  const r = await reenviarEmail(id);
  return NextResponse.json(r, { status: r.ok ? 200 : 502 });
}
