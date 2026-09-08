"use client";

import Script from "next/script";

/**
 * Agenda de marcação embutida. Suporta:
 * - Google Calendar "Appointment schedule" (calendar.app.google ou
 *   calendar.google.com/calendar/appointments/...) — embutido como
 *   iframe simples, tal como o Google recomenda.
 * - Calendly (calendly.com/...) — usa o widget JS oficial deles.
 *
 * Detetamos o fornecedor pelo próprio URL, para o resto do site não ter
 * de saber qual dos dois estás a usar.
 */
export function BookingEmbed({ url }: { url: string }) {
  const isCalendly = url.includes("calendly.com");

  if (isCalendly) {
    return (
      <>
        <div
          className="calendly-inline-widget rounded-xl"
          data-url={url}
          style={{ minWidth: "280px", height: "700px" }}
        />
        <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
      </>
    );
  }

  return (
    <iframe
      src={url}
      title="Marcar reunião"
      className="w-full rounded-xl"
      style={{ minWidth: "280px", height: "700px", border: 0 }}
    />
  );
}
