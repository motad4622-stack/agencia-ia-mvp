"use client";

import { useState } from "react";

/**
 * Exemplo de vídeo real: mostra o poster (a fotografia de origem) com um
 * botão de play e só carrega o vídeo quando o visitante clica — mantém a
 * página leve e o aspeto igual ao resto da secção.
 */
export function VideoExample({
  src,
  poster,
  caption,
  duration,
  className = "",
}: {
  src: string;
  poster: string;
  caption?: string;
  duration?: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className={className}>
      <div className="relative aspect-video overflow-hidden rounded-lg border border-line bg-navy">
        {playing ? (
          <video
            src={src}
            poster={poster}
            controls
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={caption ? `Reproduzir vídeo: ${caption}` : "Reproduzir vídeo"}
            className="group absolute inset-0 h-full w-full cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={poster} alt="" className="h-full w-full object-cover" />
            <span
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-navy/45 via-transparent to-transparent"
            />
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/95 shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-transform duration-200 group-hover:scale-105"
            >
              <svg width="15" height="17" viewBox="0 0 15 17">
                <path d="M0 0l15 8.5L0 17V0z" fill="#0b2545" />
              </svg>
            </span>
            {duration && (
              <span
                aria-hidden
                className="absolute bottom-3 right-3 rounded-sm bg-black/50 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-white/90"
              >
                {duration}
              </span>
            )}
          </button>
        )}
      </div>
      {caption && <figcaption className="mt-3 text-sm text-body">{caption}</figcaption>}
    </figure>
  );
}
