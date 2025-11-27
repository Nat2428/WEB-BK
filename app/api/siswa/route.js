import { NextResponse } from "next/server";

const dummySiswa = [
  { id: 1, nama: "Andi Putra", nisn: "1234567890", kelas: "XII RPL 1" },
  { id: 2, nama: "Siti Nurhaliza", nisn: "0987654321", kelas: "XI TKJ 2" },
];

export async function GET() {
  return NextResponse.json({ data: dummySiswa });
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body?.nama || !body?.nisn) {
    return NextResponse.json({ message: "Data siswa tidak lengkap." }, { status: 400 });
  }

  return NextResponse.json({
    message: "Siswa berhasil ditambahkan (dummy).",
    data: { ...body, id: Date.now() },
  });
}

