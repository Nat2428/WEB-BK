import { getProfileSiswa } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session-utils";
import { redirect } from "next/navigation";
import ProfilClient from "./ProfilClient";

export default async function ProfilPage() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== "siswa") {
    redirect("/login");
  }

  // Ambil profil lengkap dari database
  const profile = await getProfileSiswa(user.id);

  return <ProfilClient user={user} profile={profile} />;
}
