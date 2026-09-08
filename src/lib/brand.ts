// Identidade da marca — muda só aqui para atualizar o nome em todo o site
// (emails, metadata, nav, footer, etc.).
export const BRAND_NAME = "NextIA Marketing";

// Preço de referência do vídeo, mostrado na página /videos (sem checkout —
// o pagamento é combinado na reunião, não no site).
export const VIDEO_PRICE_EUR = 49;

/**
 * Link da agenda de marcação — Google Calendar "Appointment schedule"
 * (calendar.app.google/...) ou Calendly (calendly.com/...). Vazio -> usa
 * o formulário de fallback em /videos/marcar-reuniao.
 */
export function getBookingUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_BOOKING_URL;
  return url && url.trim().length > 0 ? url.trim() : null;
}
