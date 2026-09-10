import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

/**
 * Layout do site da agência: navegação e rodapé da NextIA Marketing.
 *
 * Fica fora daqui tudo o que tem de aparecer sem esta moldura — por
 * exemplo os sites-exemplo em /exemplos, que se apresentam como sites
 * independentes.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </>
  );
}
