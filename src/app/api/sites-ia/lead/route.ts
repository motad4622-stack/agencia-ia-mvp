import { auth } from "@/auth";
import { after, NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notificarBriefing } from "@/lib/email";

const leadSchema = z.object({
  clientName: z.string().min(2, "Nome demasiado curto."),
  clientEmail: z.string().email("Email inválido."),
  clientPhone: z.string().optional(),
  companyName: z.string().min(2, "Nome da empresa demasiado curto."),
  businessType: z.string().min(2, "Indica o tipo de negócio."),
  needs: z.string().min(2, "Conta-nos o que pretendes integrar."),
  budgetRange: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
        { status: 400 }
      );
    }
    const fields = parsed.data;
    const sessao = await auth();

    const lead = await prisma.websiteLead.create({
      data: {
        clientName: fields.clientName,
        clientEmail: fields.clientEmail,
        clientPhone: fields.clientPhone || null,
        companyName: fields.companyName,
        businessType: fields.businessType,
        needs: fields.needs,
        budgetRange: fields.budgetRange || null,
        message: fields.message || null,
        status: "novo",
        userId: sessao?.user?.id ?? null,
      },
    });

    // Aviso ao administrador e confirmação ao cliente, depois de responder.
    after(() => notificarBriefing(lead.id));

    return NextResponse.json({ id: lead.id });
  } catch (err) {
    console.error("Erro ao criar lead de sites-ia:", err);
    return NextResponse.json(
      { error: "Erro interno ao enviar o pedido. Tenta novamente." },
      { status: 500 }
    );
  }
}
