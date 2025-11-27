import { getAllSiswa } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session-utils";
import { redirect } from "next/navigation";
import DataSiswaClient from "./DataSiswaClient";

export default async function DataSiswaAdminPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  // Ambil data siswa dari database
  const siswaList = await getAllSiswa();

  return <DataSiswaClient siswaList={siswaList} />;
}

