import { getAllGuruForAdmin } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session-utils";
import { redirect } from "next/navigation";
import DataGuruClient from "./DataGuruClient";

export default async function DataGuruAdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  // Ambil data guru dari database
  const guruList = await getAllGuruForAdmin();

  return <DataGuruClient guruList={guruList} />;
}

