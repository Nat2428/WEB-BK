import { getAllGuru, getKonsultasiBySiswa, getJadwalGuru } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session-utils";
import { redirect } from "next/navigation";
import KonsultasiClient from "./KonsultasiClient";

export default async function KonsultasiPage() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== "siswa") {
    redirect("/login");
  }

  // Ambil data guru dan konsultasi dari database
  const [guruList, konsultasiList] = await Promise.all([
    getAllGuru(),
    getKonsultasiBySiswa(user.id),
  ]);

  // Format konsultasi
  const konsultasi = konsultasiList.map((k) => {
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
      namaGuru: k.nama_guru || k.guru_username || "Guru BK",
      tanggal: tanggalFormatted,
      tanggalKonsultasi: tanggalFormatted,
      jam: k.jam_konsultasi ? String(k.jam_konsultasi) : "-",
      jamKonsultasi: k.jam_konsultasi ? String(k.jam_konsultasi) : "-",
      keluhan: k.keluhan || "",
      status: k.status || "menunggu",
    };
  });

  return (
    <KonsultasiClient 
      user={user}
      guruList={guruList}
      konsultasi={konsultasi}
    />
  );
}
