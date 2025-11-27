"use server";

import { cookies } from "next/headers";
import getDb from "./db";

/**
 * Get current user from session
 * Returns user data if logged in, null otherwise
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;
    
    if (!userId) return null;

    const db = await getDb();
    const [rows] = await db.execute(
      `SELECT u.*, sp.nama_siswa, sp.kelas, sp.jurusan, gp.nama_guru
       FROM users u
       LEFT JOIN siswa_profile sp ON u.id = sp.user_id
       LEFT JOIN guru_profile gp ON u.id = gp.user_id
       WHERE u.id = ? AND u.is_active = 1`,
      [userId]
    );

    if (rows.length === 0) return null;

    const user = rows[0];
    return {
      id: user.id,
      nisn: user.nisn,
      username: user.username,
      email: user.email,
      role: user.role,
      nama: user.nama_siswa || user.nama_guru || user.username,
      kelas: user.kelas,
      jurusan: user.jurusan,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

