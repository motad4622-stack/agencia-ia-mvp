import { getBookingUrl } from "@/lib/brand";
import { BookingEmbed } from "@/components/BookingEmbed";
import { MeetingRequestForm } from "@/components/MeetingRequestForm";

export default function MarcarReuniaoPage() {
  const bookingUrl = getBookingUrl();

  return (
    <section className="mx-auto max-w-2xl px-4 sm:px-6 py-16 w-full">
      <h1 className="text-3xl font-bold text-brand">Marcar reunião</h1>
      <p className="mt-2 text-gray-600">
        Conta-nos sobre o teu imóvel — combinamos os próximos passos numa
        chamada rápida.
      </p>

      <div className="mt-8">
        {bookingUrl ? (
          <BookingEmbed url={bookingUrl} />
        ) : (
          <>
            <p className="mb-6 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              A agenda online ainda não está ligada — preenche o formulário
              abaixo e entramos em contacto para marcar o melhor horário.
            </p>
            <MeetingRequestForm />
          </>
        )}
      </div>
    </section>
  );
}
