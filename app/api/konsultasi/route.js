import { NextResponse } from "next/server";

const dummyKonsultasi = [
  {
    id: 1,
    siswaId: 1,
    guruId: 1,
    tanggal: "2025-11-14",
    jam: "09:00",
    status: "disetujui",
  },
];

export async function GET() {
  return NextResponse.json({ data: dummyKonsultasi });
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body?.siswaId || !body?.guruId || !body?.tanggal || !body?.jam) {
    return NextResponse.json({ message: "Data konsultasi tidak lengkap." }, { status: 400 });
  }

  return NextResponse.json({
    message: "Pengajuan konsultasi berhasil dibuat (dummy).",
    data: { ...body, id: Date.now(), status: "pending" },
  });
}

