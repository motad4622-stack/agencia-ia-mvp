import { NextResponse } from "next/server";
import { horasLivres } from "@/lib/agenda";
import { carregarOcupacao } from "@/lib/agenda-servidor";

export const dynamic = "force-dynamic";

/** Dias e horas livres, em UTC (o browser mostra-as na hora de Lisboa). */
export async function GET() {
  const { ocupadas, bloqueios } = await carregarOcupacao();
  return NextResponse.json(
    { dias: horasLivres(ocupadas, bloqueios) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
