import { getPermintaanByGuru } from "@/lib/actions";
import { getCurrentUser } from "@/lib/session-utils";
import { redirect } from "next/navigation";
import PermintaanClient from "./PermintaanClient";

export default async function PermintaanPage() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== "guru") {
    redirect("/login");
  }

  // Ambil data permintaan dari database
  const permintaanList = await getPermintaanByGuru(user.id);

  return (
    <PermintaanClient 
      user={user}
      permintaanList={permintaanList}
    />
  );
}
