import { NextResponse } from "next/server";

const dummyGuru = [
  { id: 1, nama: "Bu Kasandra", mapel: "BK", status: "aktif" },
  { id: 2, nama: "Pak Ricky", mapel: "BK", status: "aktif" },
  { id: 2, nama: "Bu Heni", mapel: "BK", status: "aktif" },
  { id: 2, nama: "Bu Adi", mapel: "BK", status: "aktif" },
];

export async function GET() {
  return NextResponse.json({ data: dummyGuru });
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body?.nama) {
    return NextResponse.json({ message: "Nama guru wajib diisi." }, { status: 400 });
  }

  return NextResponse.json({
    message: "Guru berhasil ditambahkan.",
    data: { ...body, id: Date.now() },
  });
}

