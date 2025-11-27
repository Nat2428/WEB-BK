import { NextResponse } from "next/server";
import { getJadwalKosong } from "@/lib/actions";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const guruId = searchParams.get("guruId");

    if (!guruId) {
      return NextResponse.json({ error: "guruId required" }, { status: 400 });
    }

    const jadwal = await getJadwalKosong(guruId);
    
    return NextResponse.json({ jadwal });
  } catch (error) {
    console.error("Error getting jadwal kosong:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


