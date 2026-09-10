/**
 * Mockups de site usados na secção "Exemplos".
 *
 * Representações abstratas e propositadamente neutras — não inventam
 * clientes, marcas nem resultados. Os vídeos já são reais (ver
 * components/VideoExample.tsx); estes mockups de site ficam até existirem
 * casos reais para mostrar.
 */

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
