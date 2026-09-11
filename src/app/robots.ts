import type { MetadataRoute } from "next";

/** Deixa o Google ler o site, menos o back-office, a API e as páginas pessoais. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/entrar", "/marcar-reuniao", "/marcacao/"],
    },
    sitemap: "https://nextiamarketing.website/sitemap.xml",
  };
}
