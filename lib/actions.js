"use server";

import getDb from "./db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

// ======================================================
// 📌 LOGIN (NISN atau Email)
// ======================================================
export async function loginUser(formData) {
  const rawIdentifier = (formData.get("identifier") || "").toString().trim();
  const normalizedIdentifier = rawIdentifier.toLowerCase();
  const identifierNoSpace = normalizedIdentifier.replace(/\s+/g, "");
  const password = formData.get("password");

  const guruAliasMap = {
    guru01: "guru01@smktb.sch.id",
    guru02: "guru02@smktb.sch.id",
    guru03: "guru03@smktb.sch.id",
    guru04: "guru04@smktb.sch.id",
  };
  const identifier = guruAliasMap[identifierNoSpace] || rawIdentifier;

  // Login normal dengan database untuk SISWA, GURU, ADMIN dan identifier lainnya
  const db = await getDb();
  const [rows] = await db.query(
    "SELECT * FROM users WHERE (email = ? OR nisn = ?) AND is_active = 1",
    [identifier, identifier]
  );

  if (rows.length === 0) throw new Error("Akun tidak ditemukan");
  const user = rows[0];
  const match = bcrypt.compareSync(password, user.password);
  if (!match) throw new Error("Password salah!");

  await db.execute("UPDATE users SET last_login = NOW() WHERE id = ?", [
    user.id,
  ]);
  return user;
}

// ======================================================
// 📌 GET ALL GURU (untuk siswa pilih guru)
// ======================================================
export async function getAllGuru() {
  const db = await getDb();
  const [rows] = await db.execute(
    `SELECT u.id, u.username, u.email, u.avatar, gp.nama_guru, gp.mata_keahlian, gp.no_wa
     FROM users u
     LEFT JOIN guru_profile gp ON u.id = gp.user_id
     WHERE u.role = 'guru' 
       AND u.is_active = 1
       AND (u.nisn IS NULL OR u.nisn != 'gurubk')
       AND (
         -- Exclude guru dengan nama generik "Guru BK 01", "Guru BK 02", dll
         COALESCE(gp.nama_guru, u.username) NOT REGEXP '^Guru BK [0-9]'
         AND COALESCE(gp.nama_guru, u.username) NOT REGEXP '^GURU BK [0-9]'
         AND COALESCE(gp.nama_guru, u.username) NOT LIKE 'Guru BK Demo%'
         AND COALESCE(gp.nama_guru, u.username) NOT LIKE 'GURU BK%'
       )`
  );
  return rows;
}

// ======================================================
// 📌 GET ALL SISWA (untuk guru lihat data siswa)
// ======================================================
export async function getAllSiswa() {
  const db = await getDb();
  const [rows] = await db.execute(
    `SELECT u.id, u.nisn, u.username, u.email, u.avatar, 
            sp.nama_siswa, sp.kelas, sp.jurusan, sp.alamat, sp.no_hp
     FROM users u
     LEFT JOIN siswa_profile sp ON u.id = sp.user_id
     WHERE u.role = 'siswa' AND u.is_active = 1
     ORDER BY sp.nama_siswa ASC`
  );
  return rows;
}

// ======================================================
// 📌 GET JADWAL GURU
// ======================================================
export async function getJadwalGuru(guruId) {
  const db = await getDb();
  const [rows] = await db.execute(
    "SELECT * FROM jadwal_guru WHERE guru_id = ? AND is_active = 1 ORDER BY hari, jam_mulai",
    [guruId]
  );
  return rows;
}

// ======================================================
// 📌 GET JADWAL KOSONG (slot yang belum diambil)
// ======================================================
export async function getJadwalKosong(guruId) {
  const db = await getDb();

  // Ambil jadwal dengan GROUP BY hari untuk menghindari duplikat
  // Hanya ambil 1 jadwal per hari (yang paling baru/id terbesar)
  const [jadwalList] = await db.execute(
    `SELECT jg.* FROM jadwal_guru jg
     INNER JOIN (
       SELECT guru_id, hari, MAX(id) as max_id
       FROM jadwal_guru
       WHERE guru_id = ? AND is_active = 1
       GROUP BY guru_id, hari
     ) latest ON jg.id = latest.max_id
     WHERE jg.guru_id = ? AND jg.is_active = 1
     ORDER BY 
       CASE jg.hari
         WHEN 'Senin' THEN 1
         WHEN 'Selasa' THEN 2
         WHEN 'Rabu' THEN 3
         WHEN 'Kamis' THEN 4
         WHEN 'Jumat' THEN 5
         WHEN 'Sabtu' THEN 6
       END`,
    [guruId, guruId]
  );

  const [sesiTerpakai] = await db.execute(
    `SELECT DISTINCT jadwal_id FROM sesi_bk 
     WHERE guru_id = ? AND jadwal_id IS NOT NULL 
     AND status IN ('diterima', 'progress')`,
    [guruId]
  );

  const jadwalTerpakaiIds = new Set(sesiTerpakai.map((s) => s.jadwal_id));
  return jadwalList.filter((j) => !jadwalTerpakaiIds.has(j.id));
}

// ======================================================
// 📌 CREATE KONSULTASI (Siswa ajukan konsultasi)
// ======================================================
export async function createKonsultasi(siswaId, formData) {
  const guruId = formData.get("guru_id");
  const tanggal = formData.get("tanggal");
  const jam = formData.get("jam");
  const keluhan = formData.get("keluhan");
  const jadwalId = formData.get("jadwal_id") || null;

  const db = await getDb();
  // Cek apakah kolom jenis_konseling ada
  const [columns] = await db.execute(
    "SHOW COLUMNS FROM sesi_bk LIKE 'jenis_konseling'"
  );

  if (columns.length > 0) {
    // Kolom ada, insert dengan jenis_konseling (default 'pribadi')
    const [result] = await db.execute(
      `INSERT INTO sesi_bk (siswa_id, guru_id, jadwal_id, tanggal_konsultasi, jam_konsultasi, keluhan, jenis_konseling, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pribadi', 'menunggu')`,
      [siswaId, guruId, jadwalId, tanggal, jam, keluhan]
    );
    return result.insertId;
  } else {
    // Kolom belum ada, insert tanpa jenis_konseling
    const [result] = await db.execute(
      `INSERT INTO sesi_bk (siswa_id, guru_id, jadwal_id, tanggal_konsultasi, jam_konsultasi, keluhan, status)
       VALUES (?, ?, ?, ?, ?, ?, 'menunggu')`,
      [siswaId, guruId, jadwalId, tanggal, jam, keluhan]
    );
    return result.insertId;
  }
}

// ======================================================
// 📌 GET KONSULTASI BY SISWA
// ======================================================
export async function getKonsultasiBySiswa(siswaId) {
  const db = await getDb();

  // Cek apakah kolom jenis_konseling ada
  const [columns] = await db.execute(
    "SHOW COLUMNS FROM sesi_bk LIKE 'jenis_konseling'"
  );

  const hasJenisKonseling = columns.length > 0;

  const query = hasJenisKonseling
    ? `SELECT 
        sb.id,
        sb.siswa_id,
        sb.guru_id,
        sb.jadwal_id,
        DATE_FORMAT(sb.tanggal_konsultasi, '%Y-%m-%d') as tanggal_konsultasi,
        TIME_FORMAT(sb.jam_konsultasi, '%H:%i') as jam_konsultasi,
        sb.keluhan,
        sb.jenis_konseling,
        sb.status,
        sb.tanggal_pengajuan,
        sb.tanggal_respon,
        u.username as guru_username, 
        gp.nama_guru, 
        jg.hari, 
        TIME_FORMAT(jg.jam_mulai, '%H:%i') as jam_mulai, 
        TIME_FORMAT(jg.jam_selesai, '%H:%i') as jam_selesai
       FROM sesi_bk sb
       JOIN users u ON sb.guru_id = u.id
       LEFT JOIN guru_profile gp ON u.id = gp.user_id
       LEFT JOIN jadwal_guru jg ON sb.jadwal_id = jg.id
       WHERE sb.siswa_id = ?
       ORDER BY sb.tanggal_pengajuan DESC`
    : `SELECT 
        sb.id,
        sb.siswa_id,
        sb.guru_id,
        sb.jadwal_id,
        DATE_FORMAT(sb.tanggal_konsultasi, '%Y-%m-%d') as tanggal_konsultasi,
        TIME_FORMAT(sb.jam_konsultasi, '%H:%i') as jam_konsultasi,
        sb.keluhan,
        'pribadi' as jenis_konseling,
        sb.status,
        sb.tanggal_pengajuan,
        sb.tanggal_respon,
        u.username as guru_username, 
        gp.nama_guru, 
        jg.hari, 
        TIME_FORMAT(jg.jam_mulai, '%H:%i') as jam_mulai, 
        TIME_FORMAT(jg.jam_selesai, '%H:%i') as jam_selesai
       FROM sesi_bk sb
       JOIN users u ON sb.guru_id = u.id
       LEFT JOIN guru_profile gp ON u.id = gp.user_id
       LEFT JOIN jadwal_guru jg ON sb.jadwal_id = jg.id
       WHERE sb.siswa_id = ?
       ORDER BY sb.tanggal_pengajuan DESC`;

  const [rows] = await db.execute(query, [siswaId]);
  return rows;
}

// ======================================================
// 📌 GET PERMINTAAN BY GURU
// ======================================================
export async function getPermintaanByGuru(guruId) {
  const db = await getDb();

  // Cek apakah kolom jenis_konseling ada
  const [columns] = await db.execute(
    "SHOW COLUMNS FROM sesi_bk LIKE 'jenis_konseling'"
  );

  const hasJenisKonseling = columns.length > 0;

  const query = hasJenisKonseling
    ? `SELECT 
        sb.id,
        sb.siswa_id,
        sb.guru_id,
        sb.jadwal_id,
        DATE_FORMAT(sb.tanggal_konsultasi, '%Y-%m-%d') as tanggal_konsultasi,
        TIME_FORMAT(sb.jam_konsultasi, '%H:%i') as jam_konsultasi,
        sb.keluhan,
        sb.jenis_konseling,
        sb.status,
        sb.tanggal_pengajuan,
        sb.tanggal_respon,
        u.username as siswa_username, 
        sp.nama_siswa, 
        sp.kelas, 
        jg.hari, 
        TIME_FORMAT(jg.jam_mulai, '%H:%i') as jam_mulai, 
        TIME_FORMAT(jg.jam_selesai, '%H:%i') as jam_selesai
       FROM sesi_bk sb
       JOIN users u ON sb.siswa_id = u.id
       LEFT JOIN siswa_profile sp ON u.id = sp.user_id
       LEFT JOIN jadwal_guru jg ON sb.jadwal_id = jg.id
       WHERE sb.guru_id = ?
       ORDER BY sb.tanggal_pengajuan DESC`
    : `SELECT 
        sb.id,
        sb.siswa_id,
        sb.guru_id,
        sb.jadwal_id,
        DATE_FORMAT(sb.tanggal_konsultasi, '%Y-%m-%d') as tanggal_konsultasi,
        TIME_FORMAT(sb.jam_konsultasi, '%H:%i') as jam_konsultasi,
        sb.keluhan,
        'pribadi' as jenis_konseling,
        sb.status,
        sb.tanggal_pengajuan,
        sb.tanggal_respon,
        u.username as siswa_username, 
        sp.nama_siswa, 
        sp.kelas, 
        jg.hari, 
        TIME_FORMAT(jg.jam_mulai, '%H:%i') as jam_mulai, 
        TIME_FORMAT(jg.jam_selesai, '%H:%i') as jam_selesai
       FROM sesi_bk sb
       JOIN users u ON sb.siswa_id = u.id
       LEFT JOIN siswa_profile sp ON u.id = sp.user_id
       LEFT JOIN jadwal_guru jg ON sb.jadwal_id = jg.id
       WHERE sb.guru_id = ?
       ORDER BY sb.tanggal_pengajuan DESC`;

  const [rows] = await db.execute(query, [guruId]);
  return rows;
}

// ======================================================
// 📌 UPDATE STATUS SESI BK
// ======================================================
export async function updateStatusSesiBK(sesiId, status, guruId) {
  const db = await getDb();
  const validStatus = [
    "menunggu",
    "diterima",
    "ditolak",
    "progress",
    "selesai",
  ];
  if (!validStatus.includes(status)) {
    throw new Error("Status tidak valid!");
  }
  await db.execute(
    `UPDATE sesi_bk SET status = ?, tanggal_respon = NOW() WHERE id = ? AND guru_id = ?`,
    [status, sesiId, guruId]
  );
}

// ======================================================
// 📌 GET STATISTIK SISWA
// ======================================================
export async function getStatistikSiswa(siswaId) {
  const db = await getDb();
  const [rows] = await db.execute(
    `SELECT 
      COALESCE(COUNT(*), 0) as total,
      COALESCE(SUM(CASE WHEN status = 'diterima' THEN 1 ELSE 0 END), 0) as disetujui,
      COALESCE(SUM(CASE WHEN status = 'menunggu' THEN 1 ELSE 0 END), 0) as pending,
      COALESCE(SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END), 0) as ditolak
     FROM sesi_bk
     WHERE siswa_id = ?`,
    [siswaId]
  );
  const result = rows[0] || { total: 0, disetujui: 0, pending: 0, ditolak: 0 };
  return {
    total: Number(result.total) || 0,
    disetujui: Number(result.disetujui) || 0,
    pending: Number(result.pending) || 0,
    ditolak: Number(result.ditolak) || 0,
  };
}

// ======================================================
// 📌 GET STATISTIK GURU
// ======================================================
export async function getStatistikGuru(guruId) {
  const db = await getDb();
  const [rows] = await db.execute(
    `SELECT 
      COALESCE(COUNT(*), 0) as total,
      COALESCE(SUM(CASE WHEN status = 'menunggu' THEN 1 ELSE 0 END), 0) as pending,
      COALESCE(SUM(CASE WHEN status = 'diterima' THEN 1 ELSE 0 END), 0) as disetujui,
      COALESCE(SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END), 0) as ditolak
     FROM sesi_bk
     WHERE guru_id = ?`,
    [guruId]
  );
  const result = rows[0] || { total: 0, pending: 0, disetujui: 0, ditolak: 0 };
  return {
    total: Number(result.total) || 0,
    pending: Number(result.pending) || 0,
    disetujui: Number(result.disetujui) || 0,
    ditolak: Number(result.ditolak) || 0,
  };
}

// ======================================================
// 📌 GET PROFILE SISWA
// ======================================================
export async function getProfileSiswa(userId) {
  const db = await getDb();
  const [rows] = await db.execute(
    "SELECT * FROM siswa_profile WHERE user_id = ?",
    [userId]
  );
  return rows[0];
}

// ======================================================
// 📌 UPDATE PROFILE SISWA
// ======================================================
export async function updateProfileSiswa(userId, formData) {
  const namaSiswa = formData.get("nama_siswa");
  const kelas = formData.get("kelas");
  const jurusan = formData.get("jurusan");
  const alamat = formData.get("alamat");
  const noHp = formData.get("no_hp") || null;

  const db = await getDb();
  const [existing] = await db.execute(
    "SELECT id FROM siswa_profile WHERE user_id = ?",
    [userId]
  );

  if (existing.length > 0) {
    await db.execute(
      "UPDATE siswa_profile SET nama_siswa = ?, kelas = ?, jurusan = ?, alamat = ?, no_hp = ? WHERE user_id = ?",
      [namaSiswa, kelas, jurusan, alamat, noHp, userId]
    );
  } else {
    await db.execute(
      "INSERT INTO siswa_profile (user_id, nama_siswa, kelas, jurusan, alamat, no_hp) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, namaSiswa, kelas, jurusan, alamat, noHp]
    );
  }
}

// ======================================================
// 📌 GET RIWAYAT BK BY SESI
// ======================================================
export async function getRiwayatBk(sesiId) {
  const db = await getDb();
  const [rows] = await db.execute(
    "SELECT * FROM riwayat_bk WHERE sesi_id = ?",
    [sesiId]
  );
  return rows[0];
}

// ======================================================
// 📌 GENERATE JADWAL DEFAULT GURU (Senin-Sabtu, 06:30-19:30)
// ======================================================
export async function generateJadwalDefaultGuru(guruId) {
  const db = await getDb();
  const hariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  for (const hari of hariList) {
    const [existing] = await db.execute(
      "SELECT id FROM jadwal_guru WHERE guru_id = ? AND hari = ?",
      [guruId, hari]
    );

    if (existing.length === 0) {
      await db.execute(
        "INSERT INTO jadwal_guru (guru_id, hari, jam_mulai, jam_selesai, is_active) VALUES (?, ?, ?, ?, 1)",
        [guruId, hari, "06:30:00", "19:30:00"]
      );
    } else {
      await db.execute(
        "UPDATE jadwal_guru SET jam_mulai = ?, jam_selesai = ?, is_active = 1 WHERE guru_id = ? AND hari = ?",
        ["06:30:00", "19:30:00", guruId, hari]
      );
    }
  }
}

// ======================================================
// 📌 GENERATE JADWAL DEFAULT UNTUK SEMUA GURU
// ======================================================
export async function generateJadwalDefaultSemuaGuru() {
  const db = await getDb();
  const [guruList] = await db.execute(
    "SELECT id FROM users WHERE role = 'guru' AND is_active = 1"
  );

  for (const guru of guruList) {
    await generateJadwalDefaultGuru(guru.id);
  }

  return {
    success: true,
    message: `Jadwal default berhasil dibuat untuk ${guruList.length} guru`,
  };
}

// ======================================================
// 📌 GET LAPORAN BULANAN GURU
// ======================================================
export async function getLaporanBulananGuru(guruId) {
  const db = await getDb();
  const [rows] = await db.execute(
    `SELECT 
      DATE_FORMAT(tanggal_pengajuan, '%Y-%m') as bulan_key,
      DATE_FORMAT(tanggal_pengajuan, '%M %Y') as bulan,
      COUNT(*) as total_konsultasi,
      SUM(CASE WHEN status = 'diterima' THEN 1 ELSE 0 END) as disetujui,
      SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) as ditolak,
      SUM(CASE WHEN status = 'menunggu' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'progress' THEN 1 ELSE 0 END) as progress,
      SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai
     FROM sesi_bk
     WHERE guru_id = ?
     GROUP BY DATE_FORMAT(tanggal_pengajuan, '%Y-%m'), DATE_FORMAT(tanggal_pengajuan, '%M %Y')
     ORDER BY bulan_key DESC`,
    [guruId]
  );

  // Format bulan ke bahasa Indonesia
  const bulanIndo = {
    January: "Januari",
    February: "Februari",
    March: "Maret",
    April: "April",
    May: "Mei",
    June: "Juni",
    July: "Juli",
    August: "Agustus",
    September: "September",
    October: "Oktober",
    November: "November",
    December: "Desember",
  };

  return rows.map((row) => {
    let bulanFormatted = row.bulan;
    for (const [en, id] of Object.entries(bulanIndo)) {
      bulanFormatted = bulanFormatted.replace(en, id);
    }
    return {
      ...row,
      bulan: bulanFormatted,
      totalKonsultasi: Number(row.total_konsultasi) || 0,
      disetujui: Number(row.disetujui) || 0,
      ditolak: Number(row.ditolak) || 0,
      pending: Number(row.pending) || 0,
      progress: Number(row.progress) || 0,
      selesai: Number(row.selesai) || 0,
    };
  });
}

// ======================================================
// 📌 ADMIN FUNCTIONS
// ======================================================

// ======================================================
// 📌 GET STATISTIK ADMIN (Dashboard)
// ======================================================
export async function getStatistikAdmin() {
  const db = await getDb();

  // Total Siswa
  const [totalSiswaResult] = await db.execute(
    "SELECT COUNT(*) as total FROM users WHERE role = 'siswa' AND is_active = 1"
  );
  const totalSiswa = Number(totalSiswaResult[0].total) || 0;

  // Total Guru BK
  const [totalGuruResult] = await db.execute(
    `SELECT COUNT(*) as total 
     FROM users u
     LEFT JOIN guru_profile gp ON u.id = gp.user_id
     WHERE u.role = 'guru' 
       AND u.is_active = 1
       AND (u.nisn IS NULL OR u.nisn != 'gurubk')
       AND (
         COALESCE(gp.nama_guru, u.username) NOT REGEXP '^Guru BK [0-9]'
         AND COALESCE(gp.nama_guru, u.username) NOT REGEXP '^GURU BK [0-9]'
         AND COALESCE(gp.nama_guru, u.username) NOT LIKE 'Guru BK Demo%'
         AND COALESCE(gp.nama_guru, u.username) NOT LIKE 'GURU BK%'
       )`
  );
  const totalGuru = Number(totalGuruResult[0].total) || 0;

  // Pengajuan Aktif (pending + diterima + progress)
  const [pengajuanAktifResult] = await db.execute(
    "SELECT COUNT(*) as total FROM sesi_bk WHERE status IN ('menunggu', 'diterima', 'progress')"
  );
  const pengajuanAktif = Number(pengajuanAktifResult[0].total) || 0;

  // Sesi Selesai
  const [sesiSelesaiResult] = await db.execute(
    "SELECT COUNT(*) as total FROM sesi_bk WHERE status = 'selesai'"
  );
  const sesiSelesai = Number(sesiSelesaiResult[0].total) || 0;

  return {
    totalSiswa,
    totalGuru,
    pengajuanAktif,
    sesiSelesai,
  };
}

// ======================================================
// 📌 GET ALL GURU FOR ADMIN (termasuk semua guru)
// ======================================================
export async function getAllGuruForAdmin() {
  const db = await getDb();
  const [rows] = await db.execute(
    `SELECT u.id, u.username, u.email, u.avatar, u.is_active, 
            gp.nama_guru, gp.mata_keahlian, gp.no_wa
     FROM users u
     LEFT JOIN guru_profile gp ON u.id = gp.user_id
     WHERE u.role = 'guru'
     ORDER BY u.is_active DESC, gp.nama_guru ASC, u.username ASC`
  );
  return rows;
}

// ======================================================
// 📌 CREATE OR UPDATE SISWA (Admin)
// ======================================================
export async function createOrUpdateSiswa(formData, siswaId = null) {
  const db = await getDb();
  const nisn = formData.get("nisn")?.toString().trim();
  const namaSiswa = formData.get("nama_siswa")?.toString().trim();
  const kelas = formData.get("kelas")?.toString().trim();
  const jurusan = formData.get("jurusan")?.toString().trim();
  const email = formData.get("email")?.toString().trim() || null;
  const alamat = formData.get("alamat")?.toString().trim() || null;
  const noHp = formData.get("no_hp")?.toString().trim() || null;
  const password = formData.get("password")?.toString().trim();

  if (!nisn || !namaSiswa || !kelas || !jurusan) {
    throw new Error("NISN, Nama, Kelas, dan Jurusan wajib diisi");
  }

  if (siswaId) {
    // Update
    const [user] = await db.execute("SELECT id FROM users WHERE id = ?", [
      siswaId,
    ]);
    if (user.length === 0) throw new Error("Siswa tidak ditemukan");

    // Update user
    if (email) {
      await db.execute(
        "UPDATE users SET email = ?, username = ? WHERE id = ?",
        [email, namaSiswa, siswaId]
      );
    } else {
      await db.execute("UPDATE users SET username = ? WHERE id = ?", [
        namaSiswa,
        siswaId,
      ]);
    }

    // Update password jika diisi
    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await db.execute("UPDATE users SET password = ? WHERE id = ?", [
        hashedPassword,
        siswaId,
      ]);
    }

    // Update atau insert profile
    const [profile] = await db.execute(
      "SELECT id FROM siswa_profile WHERE user_id = ?",
      [siswaId]
    );
    if (profile.length > 0) {
      await db.execute(
        "UPDATE siswa_profile SET nama_siswa = ?, kelas = ?, jurusan = ?, alamat = ?, no_hp = ? WHERE user_id = ?",
        [namaSiswa, kelas, jurusan, alamat, noHp, siswaId]
      );
    } else {
      await db.execute(
        "INSERT INTO siswa_profile (user_id, nama_siswa, kelas, jurusan, alamat, no_hp) VALUES (?, ?, ?, ?, ?, ?)",
        [siswaId, namaSiswa, kelas, jurusan, alamat, noHp]
      );
    }
    return { success: true, message: "Data siswa berhasil diupdate" };
  } else {
    // Create
    // Cek apakah NISN sudah ada
    const [existing] = await db.execute("SELECT id FROM users WHERE nisn = ?", [
      nisn,
    ]);
    if (existing.length > 0) {
      throw new Error("NISN sudah terdaftar");
    }

    // Hash password default jika tidak diisi
    const defaultPassword = password || "Smktb25!";
    const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

    // Insert user
    const [result] = await db.execute(
      "INSERT INTO users (nisn, username, email, password, role, is_active) VALUES (?, ?, ?, ?, 'siswa', 1)",
      [nisn, namaSiswa, email, hashedPassword]
    );

    const userId = result.insertId;

    // Insert profile
    await db.execute(
      "INSERT INTO siswa_profile (user_id, nama_siswa, kelas, jurusan, alamat, no_hp) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, namaSiswa, kelas, jurusan, alamat, noHp]
    );

    return { success: true, message: "Data siswa berhasil ditambahkan" };
  }
}

// ======================================================
// 📌 DELETE SISWA (Soft Delete - Admin)
// ======================================================
export async function deleteSiswa(siswaId) {
  const db = await getDb();
  await db.execute("UPDATE users SET is_active = 0 WHERE id = ?", [siswaId]);
  return { success: true, message: "Siswa berhasil dinonaktifkan" };
}

// ======================================================
// 📌 CREATE OR UPDATE GURU (Admin)
// ======================================================
export async function createOrUpdateGuru(formData, guruId = null) {
  const db = await getDb();
  const namaGuru = formData.get("nama_guru")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const noWa = formData.get("no_wa")?.toString().trim() || null;
  const mataKeahlian =
    formData.get("mata_keahlian")?.toString().trim() || "Bimbingan Konseling";
  const password = formData.get("password")?.toString().trim();

  if (!namaGuru || !email) {
    throw new Error("Nama dan Email wajib diisi");
  }

  if (guruId) {
    // Update
    const [user] = await db.execute("SELECT id FROM users WHERE id = ?", [
      guruId,
    ]);
    if (user.length === 0) throw new Error("Guru tidak ditemukan");

    // Update user
    await db.execute("UPDATE users SET username = ?, email = ? WHERE id = ?", [
      namaGuru,
      email,
      guruId,
    ]);

    // Update password jika diisi
    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await db.execute("UPDATE users SET password = ? WHERE id = ?", [
        hashedPassword,
        guruId,
      ]);
    }

    // Update atau insert profile
    const [profile] = await db.execute(
      "SELECT id FROM guru_profile WHERE user_id = ?",
      [guruId]
    );
    if (profile.length > 0) {
      await db.execute(
        "UPDATE guru_profile SET nama_guru = ?, mata_keahlian = ?, no_wa = ? WHERE user_id = ?",
        [namaGuru, mataKeahlian, noWa, guruId]
      );
    } else {
      await db.execute(
        "INSERT INTO guru_profile (user_id, nama_guru, mata_keahlian, no_wa) VALUES (?, ?, ?, ?)",
        [guruId, namaGuru, mataKeahlian, noWa]
      );
    }
    return { success: true, message: "Data guru berhasil diupdate" };
  } else {
    // Create
    // Cek apakah email sudah ada
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      throw new Error("Email sudah terdaftar");
    }

    // Hash password default jika tidak diisi
    const defaultPassword = password || "Smktb25!";
    const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

    // Insert user
    const [result] = await db.execute(
      "INSERT INTO users (username, email, password, role, is_active) VALUES (?, ?, ?, 'guru', 1)",
      [namaGuru, email, hashedPassword]
    );

    const userId = result.insertId;

    // Insert profile
    await db.execute(
      "INSERT INTO guru_profile (user_id, nama_guru, mata_keahlian, no_wa) VALUES (?, ?, ?, ?)",
      [userId, namaGuru, mataKeahlian, noWa]
    );

    return { success: true, message: "Data guru berhasil ditambahkan" };
  }
}

// ======================================================
// 📌 DELETE GURU (Soft Delete - Admin)
// ======================================================
export async function deleteGuru(guruId) {
  const db = await getDb();
  await db.execute("UPDATE users SET is_active = 0 WHERE id = ?", [guruId]);
  return { success: true, message: "Guru berhasil dinonaktifkan" };
}

// ======================================================
// 📌 GET LAPORAN ADMIN (Semua konsultasi)
// ======================================================
export async function getLaporanAdmin() {
  const db = await getDb();
  const [rows] = await db.execute(
    `SELECT 
      DATE_FORMAT(tanggal_pengajuan, '%Y-%m') as bulan_key,
      DATE_FORMAT(tanggal_pengajuan, '%M %Y') as bulan,
      COUNT(*) as total_konsultasi,
      COUNT(DISTINCT siswa_id) as total_siswa,
      SUM(CASE WHEN status = 'diterima' THEN 1 ELSE 0 END) as disetujui,
      SUM(CASE WHEN status = 'ditolak' THEN 1 ELSE 0 END) as ditolak,
      SUM(CASE WHEN status = 'menunggu' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'progress' THEN 1 ELSE 0 END) as progress,
      SUM(CASE WHEN status = 'selesai' THEN 1 ELSE 0 END) as selesai
     FROM sesi_bk
     GROUP BY DATE_FORMAT(tanggal_pengajuan, '%Y-%m'), DATE_FORMAT(tanggal_pengajuan, '%M %Y')
     ORDER BY bulan_key DESC
     LIMIT 12`
  );

  // Format bulan ke bahasa Indonesia
  const bulanIndo = {
    January: "Januari",
    February: "Februari",
    March: "Maret",
    April: "April",
    May: "Mei",
    June: "Juni",
    July: "Juli",
    August: "Agustus",
    September: "September",
    October: "Oktober",
    November: "November",
    December: "Desember",
  };

  return rows.map((row) => {
    let bulanFormatted = row.bulan;
    for (const [en, id] of Object.entries(bulanIndo)) {
      bulanFormatted = bulanFormatted.replace(en, id);
    }
    return {
      ...row,
      bulan: bulanFormatted,
      totalKonsultasi: Number(row.total_konsultasi) || 0,
      totalSiswa: Number(row.total_siswa) || 0,
      disetujui: Number(row.disetujui) || 0,
      ditolak: Number(row.ditolak) || 0,
      pending: Number(row.pending) || 0,
      progress: Number(row.progress) || 0,
      selesai: Number(row.selesai) || 0,
    };
  });
}
