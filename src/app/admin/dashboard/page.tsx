import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { Dashboard } from "./Dashboard";

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 w-full">
      <Dashboard />
    </section>
  );
}
