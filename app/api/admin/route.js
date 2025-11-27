import { NextResponse } from "next/server";

const dummyAdmins = [
  { id: 1, nama: "Admin Utama", email: "admin@bk.sch.id" },
];

export async function GET() {
  return NextResponse.json({ data: dummyAdmins });
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body?.nama || !body?.email) {
    return NextResponse.json({ message: "Nama dan email admin wajib diisi." }, { status: 400 });
  }

  return NextResponse.json({
    message: "Admin berhasil ditambahkan (dummy).",
    data: { ...body, id: Date.now() },
  });
}

