import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { AuthProvider } from "@/components/auth/AuthDialog";
import { googleConfigurado } from "@/auth";

/**
 * Layout do site da agência: navegação, rodapé, botão de WhatsApp e a
 * janela de conta que trava os botões de marcação.
 *
 * Fica fora daqui tudo o que tem de aparecer sem esta moldura — por
 * exemplo os sites-exemplo em /exemplos, que se apresentam como sites
 * independentes.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <AuthProvider googleAtivo={googleConfigurado}>
      <Nav />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
      <WhatsAppButton />
    </AuthProvider>
  );
}
