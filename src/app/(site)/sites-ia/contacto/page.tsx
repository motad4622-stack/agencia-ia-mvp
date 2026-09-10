import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ContactoForm } from "./ContactoForm";

export default async function ContactoSitesIaPage() {
  const sessao = await auth();
  if (!sessao?.user) {
    redirect("/entrar?next=" + encodeURIComponent("/sites-ia/contacto"));
  }

  return (
    <ContactoForm
      defaultName={sessao.user.name ?? ""}
      defaultEmail={sessao.user.email ?? ""}
    />
  );
}
