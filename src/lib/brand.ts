// Identidade da marca — muda só aqui para atualizar o nome em todo o site
// (emails, metadata, nav, footer, etc.).
export const BRAND_NAME = "NextIA Marketing";

// Preço de referência do vídeo, mostrado na página /videos (sem checkout —
// o pagamento é combinado na reunião, não no site).
export const VIDEO_PRICE_EUR = 49;

/** Link do Calendly/Cal.com para marcar reunião. Vazio -> usa o formulário de fallback. */
export function getCalendlyUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_CALENDLY_URL;
  return url && url.trim().length > 0 ? url.trim() : null;
}
