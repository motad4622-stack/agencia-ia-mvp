import Image from "next/image";

/**
 * Logótipo oficial da NextIA Marketing (public/logo.png — recortado e
 * comprimido a partir do ficheiro original enviado pelo cliente).
 *
 * `compact` usa só o alto do lockup (para a navbar, mais estreita);
 * o footer/hero podem usar o tamanho default, mais largo.
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Image
      src="/logo.png"
      alt="NextIA Marketing"
      width={700}
      height={209}
      priority
      className={compact ? "h-8 w-auto" : "h-10 w-auto"}
    />
  );
}
