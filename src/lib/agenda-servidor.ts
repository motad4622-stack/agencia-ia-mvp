import { prisma } from "@/lib/prisma";
import { AGENDA, fimDe } from "@/lib/agenda";

/**
 * Marcações ativas e bloqueios que ainda interessam (de ontem até ao fim
 * do horizonte). A disponibilidade e a validação de uma nova marcação usam
 * exatamente isto, para nunca discordarem.
 */
export async function carregarOcupacao(agora = new Date()) {
  const desde = new Date(agora.getTime() - 24 * 3600000);
  const ate = new Date(agora.getTime() + (AGENDA.horizonteDias + 2) * 24 * 3600000);

  const [marcacoes, bloqueios] = await Promise.all([
    prisma.booking.findMany({
      where: { status: "marcada", startsAt: { gte: desde, lte: ate } },
      select: { startsAt: true, durationMin: true },
    }),
    prisma.blockedSlot.findMany({
      where: { endsAt: { gte: desde }, startsAt: { lte: ate } },
      select: { startsAt: true, endsAt: true },
    }),
  ]);

  return {
    ocupadas: marcacoes.map((m) => ({ startsAt: m.startsAt, endsAt: fimDe(m.startsAt, m.durationMin) })),
    bloqueios,
  };
}
