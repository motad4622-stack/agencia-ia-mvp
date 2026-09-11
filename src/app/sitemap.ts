import type { MetadataRoute } from "next";

const BASE = "https://nextiamarketing.website";

/** Páginas públicas que interessa o Google indexar. */
export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  return [
    { url: `${BASE}/`, lastModified: agora, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/videos`, lastModified: agora, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/sites-ia`, lastModified: agora, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/privacidade`, lastModified: agora, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/termos`, lastModified: agora, changeFrequency: "yearly", priority: 0.2 },
  ];
}
