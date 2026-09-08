"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Revelação subtil ao entrar no ecrã.
 *
 * O estado "escondido" só é aplicado depois de o componente montar — assim,
 * sem JavaScript (ou se algo falhar), o conteúdo aparece normalmente em vez
 * de ficar invisível.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    setArmed(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const state = !armed ? "" : shown ? "reveal-in" : "reveal-init";

  return (
    <div ref={ref} className={`${state} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
