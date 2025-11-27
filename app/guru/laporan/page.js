import { getLaporanBulananGuru, getStatistikGuru } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session-utils";
import { redirect } from "next/navigation";
import LaporanClient from "./LaporanClient";

export default async function LaporanPage() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== "guru") {
    redirect("/login");
  }

  // Ambil laporan bulanan dari database
  const laporanBulanan = await getLaporanBulananGuru(user.id);
  
  // Ambil statistik total
  const statsData = await getStatistikGuru(user.id);

  return (
    <LaporanClient 
      laporanBulanan={laporanBulanan}
      statsData={statsData}
    />
  );
}
