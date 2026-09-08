/**
 * Recriação em SVG do logótipo da NextIA Marketing (seta ascendente
 * verde/azul + "NextIA" a azul-marinho + "MARKETING" em caixa alta).
 *
 * TODO: assim que tiveres o ficheiro .png/.svg oficial do logótipo,
 * troca este componente por um <Image src="/logo.png" .../> a apontar
 * para o ficheiro em /public — este SVG é só uma aproximação para o MVP.
 */
export function Logo({ withSubtitle = false }: { withSubtitle?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <svg width="28" height="28" viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="nextia-arrow" x1="10" y1="80" x2="70" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="var(--color-accent-blue)" />
            <stop offset="1" stopColor="var(--color-accent-green)" />
          </linearGradient>
        </defs>
        <path
          d="M12 62c14 14 42 14 56-6"
          stroke="var(--color-accent-blue)"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M20 46c12 12 34 12 46-8"
          stroke="url(#nextia-arrow)"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M52 14 L82 24 L58 44 Z" fill="var(--color-accent-green)" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-extrabold text-lg text-brand tracking-tight">
          Next<span className="text-accent-blue">IA</span>
        </span>
        {withSubtitle && (
          <span className="text-[10px] font-bold tracking-[0.2em] text-brand">MARKETING</span>
        )}
      </span>
    </span>
  );
}
