import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminLoginForm } from "./LoginForm";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/dashboard");
  }

  return (
    <section className="mx-auto max-w-sm px-4 sm:px-6 py-28 w-full">
      <div className="card p-8 text-center">
        <h1 className="text-2xl font-bold text-ink">Admin</h1>
        <p className="mt-2 text-sm text-muted">
          Acesso restrito à equipa da NextIA Marketing.
        </p>
        <AdminLoginForm />
      </div>
    </section>
  );
}
