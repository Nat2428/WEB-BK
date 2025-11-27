import { getKonsultasiBySiswa, getRiwayatBk } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session-utils";
import { redirect } from "next/navigation";
import RiwayatClient from "./RiwayatClient";

export default async function RiwayatPage() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== "siswa") {
    redirect("/login");
  }

  // Ambil konsultasi yang sudah selesai
  const konsultasiList = await getKonsultasiBySiswa(user.id);
  
  // Filter hanya yang selesai
  const riwayatList = konsultasiList.filter(k => k.status === "selesai");

  return <RiwayatClient user={user} riwayatList={riwayatList} />;
}
