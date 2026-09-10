import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminLoginForm } from "./LoginForm";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/dashboard");
  }

  return (
    <section className="bg-surface py-24">
      <div className="container-page max-w-sm!">
        <div className="card p-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-ink">Área da equipa</h1>
          <p className="mt-2 text-sm text-muted">
            Acesso restrito à equipa da NextIA Marketing.
          </p>
          <AdminLoginForm />
        </div>
      </div>
    </section>
  );
}
