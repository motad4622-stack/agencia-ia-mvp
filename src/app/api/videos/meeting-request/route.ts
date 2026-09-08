import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendMeetingRequestConfirmationEmail } from "@/lib/email";

const schema = z.object({
  clientName: z.string().min(2, "Nome demasiado curto."),
  clientEmail: z.string().email("Email inválido."),
  clientPhone: z.string().optional(),
  propertyName: z.string().min(2, "Nome do imóvel demasiado curto."),
  propertyType: z.enum(["airbnb", "alojamento_local", "hotel"]),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
        { status: 400 }
      );
    }
    const fields = parsed.data;

    const meetingRequest = await prisma.meetingRequest.create({
      data: {
        clientName: fields.clientName,
        clientEmail: fields.clientEmail,
        clientPhone: fields.clientPhone || null,
        propertyName: fields.propertyName,
        propertyType: fields.propertyType,
        message: fields.message || null,
        status: "novo",
      },
    });

    await sendMeetingRequestConfirmationEmail({
      to: meetingRequest.clientEmail,
      clientName: meetingRequest.clientName,
      propertyName: meetingRequest.propertyName,
    });

    return NextResponse.json({ id: meetingRequest.id });
  } catch (err) {
    console.error("Erro ao criar pedido de reunião:", err);
    return NextResponse.json(
      { error: "Erro interno ao enviar o pedido. Tenta novamente." },
      { status: 500 }
    );
  }
}
