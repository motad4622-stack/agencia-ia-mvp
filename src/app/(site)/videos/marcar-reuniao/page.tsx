import { getBookingUrl } from "@/lib/brand";
import { BookingEmbed } from "@/components/BookingEmbed";
import { MeetingRequestForm } from "@/components/MeetingRequestForm";

export default function MarcarReuniaoPage() {
  const bookingUrl = getBookingUrl();

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-page max-w-3xl!">
        <div className="mb-10 text-center">
          <p className="eyebrow">Vídeos de IA para alojamento</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Marcar reunião
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-body">
            Trinta minutos para percebermos o teu imóvel e combinarmos os
            próximos passos. Sem compromisso.
          </p>
        </div>

        {bookingUrl ? (
          <div className="card overflow-hidden p-2 sm:p-3">
            <BookingEmbed url={bookingUrl} />
          </div>
        ) : (
          <div className="card p-7 sm:p-9">
            <p className="mb-7 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              A agenda online ainda não está ligada — preenche o formulário e
              entramos em contacto para marcar o melhor horário.
            </p>
            <MeetingRequestForm />
          </div>
        )}
      </div>
    </section>
  );
}
