/**
 * Mockups visuais usados no hero e na secção "Exemplos".
 *
 * São representações abstratas e propositadamente neutras — não inventam
 * clientes, marcas nem resultados. Quando existirem casos reais, basta
 * trocar o conteúdo destes componentes por imagens/vídeos verdadeiros.
 */

/** Moldura de leitor de vídeo com um espaço abstrato lá dentro. */
export function VideoFrame({
  caption,
  duration = "0:24",
  className = "",
}: {
  caption?: string;
  duration?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className="relative aspect-video overflow-hidden rounded-lg border border-line bg-navy">
        {/* Abstração de um interior: parede, janela com luz e linha de chão */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, #17406f 0%, #0b2545 55%, #071a33 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute left-[12%] top-[16%] h-[46%] w-[34%] rounded-sm"
          style={{
            background:
              "linear-gradient(150deg, rgba(255,255,255,0.22), rgba(255,255,255,0.04))",
          }}
        />
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-[28%]"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.06), transparent)" }}
        />
        <div
          aria-hidden
          className="absolute bottom-[26%] left-[58%] h-[22%] w-[26%] rounded-sm bg-white/10"
        />

        {/* Botão de play */}
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/95 shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
            <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden>
              <path d="M0 0l16 9-16 9V0z" fill="#0b2545" />
            </svg>
          </span>
        </div>

        {/* Barra de progresso + duração */}
        <div className="absolute inset-x-4 bottom-4 flex items-center gap-3">
          <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
            <span className="block h-full w-1/3 rounded-full bg-white/90" />
          </span>
          <span className="rounded-sm bg-black/40 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-white/90">
            {duration}
          </span>
        </div>
      </div>
      {caption && <figcaption className="mt-3 text-sm text-body">{caption}</figcaption>}
    </figure>
  );
}

/** Moldura de browser com o esqueleto de um site lá dentro. */
export function BrowserFrame({
  caption,
  withChat = false,
  className = "",
}: {
  caption?: string;
  withChat?: boolean;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-lg border border-line bg-white shadow-[0_10px_30px_-20px_rgba(15,32,56,0.4)]">
        {/* Chrome do browser */}
        <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2.5">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          </span>
          <span
            aria-hidden
            className="ml-2 h-5 flex-1 rounded-sm border border-line bg-white"
          />
        </div>

        {/* Conteúdo esquematizado */}
        <div className="relative space-y-4 p-5">
          <div aria-hidden className="flex items-center justify-between">
            <span className="h-3 w-20 rounded-sm bg-navy/85" />
            <span className="flex gap-2">
              <span className="h-2.5 w-10 rounded-sm bg-line" />
              <span className="h-2.5 w-10 rounded-sm bg-line" />
              <span className="h-2.5 w-14 rounded-sm bg-blue/70" />
            </span>
          </div>

          <div aria-hidden className="space-y-2 pt-2">
            <span className="block h-4 w-3/4 rounded-sm bg-ink/80" />
            <span className="block h-4 w-1/2 rounded-sm bg-ink/80" />
            <span className="block h-2.5 w-5/6 rounded-sm bg-line" />
            <span className="block h-2.5 w-2/3 rounded-sm bg-line" />
          </div>

          <div aria-hidden className="grid grid-cols-3 gap-2.5 pt-2">
            <span className="h-14 rounded-md border border-line bg-surface" />
            <span className="h-14 rounded-md border border-line bg-surface" />
            <span className="h-14 rounded-md border border-line bg-surface" />
          </div>

          {withChat && (
            <div
              aria-hidden
              className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 shadow-[0_6px_18px_-10px_rgba(15,32,56,0.45)]"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-green text-[11px] font-bold text-white">
                IA
              </span>
              <span className="space-y-1">
                <span className="block h-1.5 w-16 rounded-sm bg-line" />
                <span className="block h-1.5 w-10 rounded-sm bg-line" />
              </span>
            </div>
          )}
        </div>
      </div>
      {caption && <figcaption className="mt-3 text-sm text-body">{caption}</figcaption>}
    </figure>
  );
}
