import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminLoginForm } from "./LoginForm";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/dashboard");
  }

  return (
    <section className="mx-auto max-w-sm px-4 sm:px-6 py-24 w-full">
      <h1 className="text-2xl font-bold text-brand text-center">Admin</h1>
      <p className="mt-2 text-gray-500 text-sm text-center">
        Acesso restrito à equipa da NextIA Marketing.
      </p>
      <AdminLoginForm />
    </section>
  );
}
