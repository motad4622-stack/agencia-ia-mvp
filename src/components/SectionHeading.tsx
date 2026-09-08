/**
 * Padrão repetido em todas as secções: rótulo pequeno, título e um
 * parágrafo curto de contexto. É o que dá ritmo e hierarquia ao site.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  onNavy = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  onNavy?: boolean;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={onNavy ? "eyebrow-on-navy" : "eyebrow"}>{eyebrow}</p>
      <h2
        className={`mt-3 text-3xl font-bold tracking-tight sm:text-[2.5rem] sm:leading-[1.15] ${
          onNavy ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-[17px] leading-relaxed ${onNavy ? "text-white/70" : "text-body"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
