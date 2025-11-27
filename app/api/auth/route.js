import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { nisn, password } = body;

  // TODO: ganti dengan validasi nyata menggunakan database/MySQL.
  const isValid = nisn === "1234567890" && password === "admin123";

  if (!isValid) {
    return NextResponse.json({ success: false, message: "NISN atau password salah." }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    message: "Login berhasil.",
    user: {
      id: 1,
      nama: "Siswa Contoh",
      role: "siswa",
    },
  });
}

