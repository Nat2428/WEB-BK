import { getStatistikSiswa, getKonsultasiBySiswa } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session-utils";
import { redirect } from "next/navigation";
import SiswaDashboardClient from "./SiswaDashboardClient";

export default async function SiswaDashboardPage() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== "siswa") {
    redirect("/login");
  }

  // Ambil statistik dari database
  const statsData = await getStatistikSiswa(user.id);
  
  // Ambil konsultasi dari database
  const konsultasi = await getKonsultasiBySiswa(user.id);

  // Format konsultasi untuk CardKonsultasi
  const appointments = konsultasi.map((k) => {
    // Format tanggal menjadi string (dari SQL sudah string, tapi format ke locale)
    let tanggalFormatted = "-";
    if (k.tanggal_konsultasi) {
      try {
        const date = new Date(k.tanggal_konsultasi);
        if (!isNaN(date.getTime())) {
          tanggalFormatted = date.toLocaleDateString("id-ID");
        } else {
          tanggalFormatted = String(k.tanggal_konsultasi);
        }
      } catch {
        tanggalFormatted = String(k.tanggal_konsultasi || "-");
      }
    }
    
    return {
      id: k.id,
      guru: k.nama_guru || k.guru_username || "Guru BK",
      tanggal: tanggalFormatted,
      jam: k.jam_konsultasi ? String(k.jam_konsultasi) : "-",
      status: k.status || "menunggu",
    };
  });

  return (
    <SiswaDashboardClient 
      user={user}
      statsData={statsData}
      appointments={appointments}
    />
  );
}
