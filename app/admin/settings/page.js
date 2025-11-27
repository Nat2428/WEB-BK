import { getCurrentUser } from "@/lib/session-utils";
import { redirect } from "next/navigation";
import SettingsPageClient from "./SettingsPageClient";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  return <SettingsPageClient user={user} />;
}

