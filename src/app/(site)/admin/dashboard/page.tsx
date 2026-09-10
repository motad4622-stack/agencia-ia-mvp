import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { Dashboard } from "./Dashboard";

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  return (
    <section className="bg-white py-12">
      <div className="container-page">
        <Dashboard />
      </div>
    </section>
  );
}
