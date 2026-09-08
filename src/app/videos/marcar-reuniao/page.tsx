import { getBookingUrl } from "@/lib/brand";
import { BookingEmbed } from "@/components/BookingEmbed";
import { MeetingRequestForm } from "@/components/MeetingRequestForm";

export default function MarcarReuniaoPage() {
  const bookingUrl = getBookingUrl();

  return (
    <section className="mx-auto max-w-2xl px-4 sm:px-6 py-20 w-full">
      <div className="text-center mb-10">
        <p className="eyebrow mx-auto mb-6">Vídeos de IA para Alojamento</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">Marcar reunião</h1>
        <p className="mt-3 text-body max-w-md mx-auto">
          Conta-nos sobre o teu imóvel — combinamos os próximos passos numa
          chamada rápida.
        </p>
      </div>

      {bookingUrl ? (
        <div className="card p-2 sm:p-3">
          <BookingEmbed url={bookingUrl} />
        </div>
      ) : (
        <div className="card p-8 sm:p-10">
          <p className="mb-7 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            A agenda online ainda não está ligada — preenche o formulário
            abaixo e entramos em contacto para marcar o melhor horário.
          </p>
          <MeetingRequestForm />
        </div>
      )}
    </section>
  );
}
