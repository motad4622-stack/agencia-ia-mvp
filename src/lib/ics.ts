/**
 * Convite de calendário (.ics) e link "Adicionar ao Google Calendar".
 *
 * O .ics vai anexado aos emails de marcação e abre no Outlook, no Apple
 * Calendar e no Google Calendar. Usa METHOD:PUBLISH — é um evento para
 * guardar, não um convite com botões de aceitar/recusar, que exigiria
 * uma caixa de correio a receber respostas.
 */

type Evento = {
  uid: string;
  inicio: Date;
  fim: Date;
  titulo: string;
  descricao: string;
  local: string;
  url?: string;
};

/** 20260915T083000Z */
function carimbo(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapar(texto: string): string {
  return texto
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** As linhas de um .ics não podem passar de 75 octetos (RFC 5545 §3.1). */
function dobrar(linha: string): string {
  const bytes = Buffer.from(linha, "utf8");
  if (bytes.length <= 75) return linha;
  const partes: string[] = [];
  let atual = "";
  let tamanho = 0;
  for (const ch of linha) {
    const t = Buffer.byteLength(ch, "utf8");
    const max = partes.length === 0 ? 75 : 74; // as continuações levam um espaço
    if (tamanho + t > max) {
      partes.push(atual);
      atual = "";
      tamanho = 0;
    }
    atual += ch;
    tamanho += t;
  }
  partes.push(atual);
  return partes.join("\r\n ");
}

export function gerarIcs(e: Evento): string {
  const linhas = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NextIA Marketing//Marcacoes//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.uid}`,
    `DTSTAMP:${carimbo(new Date())}`,
    `DTSTART:${carimbo(e.inicio)}`,
    `DTEND:${carimbo(e.fim)}`,
    `SUMMARY:${escapar(e.titulo)}`,
    `DESCRIPTION:${escapar(e.descricao)}`,
    `LOCATION:${escapar(e.local)}`,
    ...(e.url ? [`URL:${e.url}`] : []),
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapar(e.titulo)}`,
    "TRIGGER:-PT30M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return linhas.map(dobrar).join("\r\n") + "\r\n";
}

export function linkGoogleCalendar(e: Omit<Evento, "uid">): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.titulo,
    dates: `${carimbo(e.inicio)}/${carimbo(e.fim)}`,
    details: e.descricao,
    location: e.local,
    ctz: "Europe/Lisbon",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
