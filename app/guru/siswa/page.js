import { getAllSiswa } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session-utils";
import { redirect } from "next/navigation";
import DataSiswaClient from "./DataSiswaClient";

export default async function DataSiswaPage() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== "guru") {
    redirect("/login");
  }

  // Ambil semua data siswa dari database
  const siswaList = await getAllSiswa();

  // Format data siswa
  const siswaData = siswaList.map((s) => ({
    id: s.id,
    nama: s.nama_siswa || s.username || "Siswa",
    nisn: s.nisn || "-",
    kelas: s.kelas || "-",
    jurusan: s.jurusan || "-",
    email: s.email || "-",
    noHp: s.no_hp || "-",
    alamat: s.alamat || "-",
  }));

  return (
    <DataSiswaClient siswaList={siswaData} />
  );
}
