import Image from "next/image";

/**
 * Site real dentro de uma moldura de browser.
 *
 * A imagem é uma captura verdadeira da página, não um mockup — por isso
 * a moldura mostra o domínio e o cartão abre o site numa aba nova.
 */
export function SiteExample({
  src,
  alt,
  domain,
  href,
  title,
  description,
  linkLabel = "Abrir site",
  priority = false,
  className = "",
  sizes = "(min-width: 1024px) 560px, 92vw",
}: {
  src: string;
  alt: string;
  domain: string;
  href?: string;
  title?: string;
  description?: string;
  linkLabel?: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  const frame = (
    <div className="overflow-hidden rounded-lg border border-line bg-white shadow-[0_14px_40px_-24px_rgba(15,32,56,0.5)] transition-shadow duration-300 group-hover:shadow-[0_20px_50px_-24px_rgba(15,32,56,0.55)]">
      {/* Chrome do browser */}
      <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        </span>
        <span className="ml-2 flex h-5 flex-1 items-center rounded-sm border border-line bg-white px-2 text-[11px] text-muted">
          {domain}
        </span>
      </div>

      <div className="relative aspect-16/10 bg-surface">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top"
        />
      </div>
    </div>
  );

  return (
    <figure className={className}>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
        >
          {frame}
        </a>
      ) : (
        <div className="group">{frame}</div>
      )}

      {(title || description) && (
        <figcaption className="mt-4">
          {title && (
            <h4 className="font-semibold text-ink">
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue"
                >
                  {title}
                </a>
              ) : (
                title
              )}
            </h4>
          )}
          {description && (
            <p className="mt-1.5 text-[15px] leading-relaxed text-body">
              {description}
            </p>
          )}
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue hover:text-navy"
            >
              {linkLabel}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path
                  d="M4 10l6-6M5.2 4H10v4.8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
        </figcaption>
      )}
    </figure>
  );
}
