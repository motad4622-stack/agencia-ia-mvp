/**
 * Mockups visuais usados no hero e na secção "Exemplos".
 *
 * São representações abstratas e propositadamente neutras — não inventam
 * clientes, marcas nem resultados. Quando existirem casos reais, basta
 * trocar o conteúdo destes componentes por imagens/vídeos verdadeiros.
 */

/** Moldura de leitor de vídeo com um interior sugerido lá dentro. */
export function VideoFrame({
  caption,
  duration = "0:24",
  variant = "interior",
  className = "",
}: {
  caption?: string;
  duration?: string;
  variant?: "interior" | "exterior";
  className?: string;
}) {
  const isInterior = variant === "interior";

  return (
    <figure className={className}>
      <div className="relative aspect-video overflow-hidden rounded-lg border border-line bg-navy">
        {/* Fundo: parede/céu */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: isInterior
              ? "linear-gradient(165deg, #1b4675 0%, #0f2c50 48%, #071a33 100%)"
              : "linear-gradient(180deg, #2a5c94 0%, #14375f 55%, #0a2340 100%)",
          }}
        />

        {/* Luz vinda da janela */}
        <div
          aria-hidden
          className="absolute -left-4 top-0 h-full w-2/3 opacity-70"
          style={{
            background:
              "radial-gradient(70% 60% at 25% 25%, rgba(255,236,204,0.28), transparent 70%)",
          }}
        />

        {isInterior ? (
          <>
            {/* Janela */}
            <div
              aria-hidden
              className="absolute left-[11%] top-[14%] h-[44%] w-[31%] rounded-[2px] border border-white/15"
              style={{
                background:
                  "linear-gradient(150deg, rgba(255,246,230,0.35), rgba(255,255,255,0.05))",
              }}
            />
            <div aria-hidden className="absolute left-[26%] top-[14%] h-[44%] w-px bg-white/15" />
            {/* Sofá / móvel */}
            <div
              aria-hidden
              className="absolute bottom-[19%] left-[9%] h-[13%] w-[26%] rounded-t-[3px] bg-white/12"
            />
            {/* Mesa lateral */}
            <div
              aria-hidden
              className="absolute bottom-[19%] left-[39%] h-[7%] w-[8%] rounded-t-[2px] bg-white/8"
            />
            {/* Quadro na parede */}
            <div
              aria-hidden
              className="absolute right-[14%] top-[22%] h-[20%] w-[16%] rounded-[2px] border border-white/12 bg-white/6"
            />
          </>
        ) : (
          <>
            {/* Fachada */}
            <div
              aria-hidden
              className="absolute bottom-[18%] left-[12%] h-[46%] w-[44%] rounded-t-[3px] bg-white/10"
            />
            <div aria-hidden className="absolute bottom-[40%] left-[17%] h-[10%] w-[9%] bg-white/18" />
            <div aria-hidden className="absolute bottom-[40%] left-[31%] h-[10%] w-[9%] bg-white/18" />
            <div aria-hidden className="absolute bottom-[18%] left-[24%] h-[14%] w-[8%] bg-white/14" />
            {/* Vegetação */}
            <div
              aria-hidden
              className="absolute bottom-[16%] right-[14%] h-[22%] w-[18%] rounded-t-full bg-white/8"
            />
          </>
        )}

        {/* Chão / piso */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[19%]"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(0,0,0,0.12))" }}
        />

        {/* Botão de play */}
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/95 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
            <svg width="15" height="17" viewBox="0 0 15 17" aria-hidden>
              <path d="M0 0l15 8.5L0 17V0z" fill="#0b2545" />
            </svg>
          </span>
        </div>

        {/* Barra de progresso + duração */}
        <div className="absolute inset-x-4 bottom-4 flex items-center gap-3">
          <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
            <span className="block h-full w-1/3 rounded-full bg-white/90" />
          </span>
          <span className="rounded-sm bg-black/45 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-white/90">
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
  variant = "landing",
  className = "",
}: {
  caption?: string;
  withChat?: boolean;
  variant?: "landing" | "conteudo";
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
          <span aria-hidden className="ml-2 h-5 flex-1 rounded-sm border border-line bg-white" />
        </div>

        {/* Barra de navegação do site */}
        <div aria-hidden className="flex items-center justify-between border-b border-line px-5 py-3">
          <span className="h-3 w-16 rounded-sm bg-navy/85" />
          <span className="flex items-center gap-2">
            <span className="h-2 w-9 rounded-sm bg-line" />
            <span className="h-2 w-9 rounded-sm bg-line" />
            <span className="h-5 w-14 rounded-sm bg-blue/75" />
          </span>
        </div>

        {/* Conteúdo esquematizado */}
        <div className="relative p-5">
          {variant === "landing" ? (
            <div aria-hidden className="space-y-4">
              <div className="space-y-2">
                <span className="block h-4 w-4/5 rounded-sm bg-ink/85" />
                <span className="block h-4 w-3/5 rounded-sm bg-ink/85" />
              </div>
              <div className="space-y-1.5">
                <span className="block h-2 w-full rounded-sm bg-line" />
                <span className="block h-2 w-11/12 rounded-sm bg-line" />
                <span className="block h-2 w-2/3 rounded-sm bg-line" />
              </div>
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <span className="h-12 rounded-md border border-line bg-surface" />
                <span className="h-12 rounded-md border border-line bg-surface" />
                <span className="h-12 rounded-md border border-line bg-surface" />
              </div>
            </div>
          ) : (
            <div aria-hidden className="grid grid-cols-[1.4fr_1fr] gap-4">
              <div className="space-y-2">
                <span className="block h-3.5 w-3/4 rounded-sm bg-ink/85" />
                <span className="block h-2 w-full rounded-sm bg-line" />
                <span className="block h-2 w-5/6 rounded-sm bg-line" />
                <span className="block h-2 w-11/12 rounded-sm bg-line" />
                <span className="block h-2 w-3/4 rounded-sm bg-line" />
                <span className="mt-3 block h-7 w-24 rounded-md bg-navy/85" />
              </div>
              <div className="space-y-2.5">
                <span className="block h-20 rounded-md border border-line bg-surface" />
                <span className="block h-2 w-2/3 rounded-sm bg-line" />
                <span className="block h-2 w-1/2 rounded-sm bg-line" />
              </div>
            </div>
          )}

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
