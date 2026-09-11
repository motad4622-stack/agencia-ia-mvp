import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITULO = "NextIA Marketing — Vídeos de alojamento e sites com IA";
const DESCRICAO =
  "Transformamos as fotografias do teu alojamento em vídeo e construímos sites com IA integrada para pequenas e médias empresas.";

export const metadata: Metadata = {
  // Base para os links absolutos da imagem de partilha (app/opengraph-image.jpg).
  metadataBase: new URL("https://nextiamarketing.website"),
  title: TITULO,
  description: DESCRICAO,
  openGraph: {
    type: "website",
    locale: "pt_PT",
    siteName: "NextIA Marketing",
    url: "/",
    title: TITULO,
    description: DESCRICAO,
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRICAO,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-ink">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
