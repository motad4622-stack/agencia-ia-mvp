import { NextResponse } from "next/server";
import { enviarLembretes } from "@/lib/email";

/*
 * Lembretes da véspera. A Vercel chama isto uma vez por dia (vercel.json)
 * com o cabeçalho "Authorization: Bearer <CRON_SECRET>"; sem ele, recusa.
 * Correr duas vezes não duplica nada: cada lembrete só sai uma vez.
 */

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const segredo = process.env.CRON_SECRET;
  if (!segredo || request.headers.get("authorization") !== `Bearer ${segredo}`) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  const resultado = await enviarLembretes();
  return NextResponse.json(resultado);
}
