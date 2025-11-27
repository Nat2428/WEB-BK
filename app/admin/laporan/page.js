import { getLaporanAdmin } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session-utils";
import { redirect } from "next/navigation";
import LaporanClient from "./LaporanClient";

export default async function LaporanAdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  // Ambil laporan dari database
  const laporanList = await getLaporanAdmin();

  return <LaporanClient laporanList={laporanList} />;
}