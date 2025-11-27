import { getStatistikGuru, getPermintaanByGuru } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session-utils";
import { redirect } from "next/navigation";
import GuruDashboardClient from "./GuruDashboardClient";

export default async function GuruDashboardPage() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== "guru") {
    redirect("/login");
  }

  // Ambil statistik dari database
  const statsData = await getStatistikGuru(user.id);
  
  // Ambil permintaan konseling terbaru (5 terbaru untuk dashboard)
  const allPermintaan = await getPermintaanByGuru(user.id);
  const recentPermintaan = allPermintaan.slice(0, 5);

  // Format permintaan untuk ditampilkan
  const requests = recentPermintaan.map((p) => {
    // Format tanggal menjadi string
    let tanggalFormatted = "-";
    if (p.tanggal_konsultasi) {
      try {
        const date = new Date(p.tanggal_konsultasi);
        if (!isNaN(date.getTime())) {
          tanggalFormatted = date.toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        } else {
          tanggalFormatted = String(p.tanggal_konsultasi);
        }
      } catch {
        tanggalFormatted = String(p.tanggal_konsultasi || "-");
      }
    }

    // Format jam
    const jamFormatted = p.jam_konsultasi ? String(p.jam_konsultasi) : "-";
    
    // Map status
    const statusMap = {
      menunggu: "Pending",
      diterima: "Disetujui",
      ditolak: "Ditolak",
      progress: "Progress",
      selesai: "Selesai",
    };

    return {
      id: p.id,
      siswa: p.nama_siswa || p.siswa_username || "Siswa",
      kelas: p.kelas || "-",
      tanggal: tanggalFormatted,
      jam: jamFormatted,
      status: statusMap[p.status] || p.status || "Pending",
      statusKey: p.status || "menunggu",
      keluhan: p.keluhan || "",
    };
  });

  return (
    <GuruDashboardClient 
      user={user}
      statsData={statsData}
      requests={requests}
    />
  );
}
