import { getStatistikAdmin } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session-utils";
import { redirect } from "next/navigation";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  // Ambil statistik dari database
  const statsData = await getStatistikAdmin();

  // Recent activity (bisa dikembangkan lebih lanjut)
  const recentActivity = [];

  return (
    <AdminDashboardClient statsData={statsData} recentActivity={recentActivity} />
  );
}

