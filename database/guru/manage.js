/**
 * Script Terpusat untuk Management Guru BK
 *
 * Usage:
 *   node database/guru/manage.js check          - Cek data guru
 *   node database/guru/manage.js check-foto     - Cek foto guru
 *   node database/guru/manage.js update-foto    - Update foto guru di database
 *   node database/guru/manage.js cleanup        - Hapus guru generic/demo
 *   node database/guru/manage.js import         - Import 4 guru BK default
 *   node database/guru/manage.js generate-jadwal - Generate jadwal untuk semua guru
 */

import getDb from "../../lib/db.js";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicImagesPath = join(__dirname, "..", "..", "public", "images");
const publicGuruPath = join(publicImagesPath, "guru");

// Mapping foto guru berdasarkan email
const fotoGuruMapping = [
  {
    email: "heni.bk@smktb.sch.id",
    nama_guru: "Heni Siswati, S.Psi",
    nama_file: "heni.jpg",
  },
  {
    email: "kasandra.bk@smktb.sch.id",
    nama_guru: "Kasandra Fitriani. N, S.Pd",
    nama_file: "kasandra.jpg",
  },
  {
    email: "nadya.bk@smktb.sch.id",
    nama_guru: "Nadya Afriliani Ariesta, S.Pd",
    nama_file: "nadya.jpg",
  },
  {
    email: "ika.bk@smktb.sch.id",
    nama_guru: "Ika Rafika, S.Pd",
    nama_file: "ika.jpg",
  },
];

// Default guru data
const guruDefaults = [
  {
    email: "heni.bk@smktb.sch.id",
    username: "Heni Siswati, S.Psi",
    nama_guru: "Heni Siswati, S.Psi",
    mata_keahlian: "Bimbingan Konseling",
    no_wa: "081200000001",
  },
  {
    email: "kasandra.bk@smktb.sch.id",
    username: "Kasandra Fitriani. N, S.Pd",
    nama_guru: "Kasandra Fitriani. N, S.Pd",
    mata_keahlian: "Bimbingan Konseling",
    no_wa: "081200000002",
  },
  {
    email: "nadya.bk@smktb.sch.id",
    username: "Nadya Afriliani Ariesta, S.Pd",
    nama_guru: "Nadya Afriliani Ariesta, S.Pd",
    mata_keahlian: "Bimbingan Konseling",
    no_wa: "081200000003",
  },
  {
    email: "ika.bk@smktb.sch.id",
    username: "Ika Rafika, S.Pd",
    nama_guru: "Ika Rafika, S.Pd",
    mata_keahlian: "Bimbingan Konseling",
    no_wa: "081200000004",
  },
];

const defaultPassword = "Smktb25!";

// ======================================================
// FUNGSI: Check Guru
// ======================================================
async function checkGuru() {
  const db = await getDb();
  console.log("🔍 Mengecek data guru di database...\n");

  try {
    const [allGuru] = await db.execute(`
      SELECT 
        u.id, u.username, u.email, u.nisn, u.is_active, u.avatar,
        gp.nama_guru, gp.mata_keahlian, gp.no_wa
      FROM users u
      LEFT JOIN guru_profile gp ON u.id = gp.user_id
      WHERE u.role = 'guru'
      ORDER BY u.id
    `);

    console.log(`📊 Total guru di database: ${allGuru.length}\n`);

    if (allGuru.length > 0) {
      console.log("Daftar semua guru:");
      allGuru.forEach((guru, idx) => {
        const status = guru.is_active ? "✅ Aktif" : "❌ Nonaktif";
        console.log(`\n${idx + 1}. ${status}`);
        console.log(`   ID: ${guru.id}`);
        console.log(`   Username: ${guru.username}`);
        console.log(`   Email: ${guru.email || "Tidak ada"}`);
        console.log(`   NISN: ${guru.nisn || "Tidak ada"}`);
        console.log(`   Nama Guru: ${guru.nama_guru || "Tidak ada"}`);
        console.log(`   Mata Keahlian: ${guru.mata_keahlian || "Tidak ada"}`);
        console.log(`   Avatar: ${guru.avatar || "Tidak ada"}`);
      });
    } else {
      console.log("❌ Tidak ada guru di database!");
    }

    // Cek guru yang seharusnya ada
    const expectedGuru = [
      "heni.bk@smktb.sch.id",
      "kasandra.bk@smktb.sch.id",
      "nadya.bk@smktb.sch.id",
      "ika.bk@smktb.sch.id",
    ];

    console.log("\n\n🔎 Mengecek guru yang seharusnya ada:");
    for (const email of expectedGuru) {
      const [found] = await db.execute(
        "SELECT u.id, u.username, u.email, gp.nama_guru FROM users u LEFT JOIN guru_profile gp ON u.id = gp.user_id WHERE u.email = ?",
        [email]
      );
      if (found.length > 0) {
        console.log(`✅ ${email} - ${found[0].nama_guru || found[0].username}`);
      } else {
        console.log(`❌ ${email} - TIDAK DITEMUKAN`);
      }
    }
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

// ======================================================
// FUNGSI: Check Foto Guru
// ======================================================
async function checkFotoGuru() {
  const db = await getDb();
  console.log("🖼️  Mengecek foto guru di database...\n");

  try {
    const [guru] = await db.execute(`
      SELECT 
        u.id, u.username, u.email, u.avatar, gp.nama_guru
      FROM users u
      LEFT JOIN guru_profile gp ON u.id = gp.user_id
      WHERE u.role = 'guru' AND u.is_active = 1
      ORDER BY u.email
    `);

    console.log(`📊 Total guru: ${guru.length}\n`);
    guru.forEach((g, idx) => {
      console.log(`${idx + 1}. ${g.nama_guru || g.username}`);
      console.log(`   Email: ${g.email}`);
      if (g.avatar) {
        console.log(`   ✅ Avatar: ${g.avatar}`);
      } else {
        console.log(`   ❌ Avatar: TIDAK ADA`);
      }
      console.log("");
    });
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

// ======================================================
// FUNGSI: Update Foto Guru
// ======================================================
async function updateFotoGuru() {
  const db = await getDb();
  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  console.log("🔄 Memulai update foto guru...\n");
  console.log(`📁 Mencari foto di: ${publicImagesPath}\n`);

  for (const guru of fotoGuruMapping) {
    try {
      const [users] = await db.execute("SELECT id FROM users WHERE email = ?", [
        guru.email,
      ]);

      if (users.length === 0) {
        console.log(`⏭️  ${guru.email} tidak ditemukan di database, dilewati`);
        skipped++;
        continue;
      }

      const userId = users[0].id;
      const possibleExtensions = [".jpg", ".jpeg", ".png", ".webp"];
      const baseFileName = guru.nama_file.replace(/\.[^/.]+$/, "");
      let fotoPath = null;
      let fotoFileName = null;
      let fotoLocation = null;

      if (!existsSync(publicImagesPath)) {
        console.log(`⚠️  Folder ${publicImagesPath} tidak ditemukan!`);
        notFound++;
        continue;
      }

      // Cek di folder guru/ dulu
      if (existsSync(publicGuruPath)) {
        for (const ext of possibleExtensions) {
          const testFileName = baseFileName + ext;
          const testPath = join(publicGuruPath, testFileName);
          if (existsSync(testPath)) {
            fotoFileName = testFileName;
            fotoPath = `/images/guru/${testFileName}`;
            fotoLocation = "guru";
            break;
          }
        }
      }

      // Jika tidak ditemukan, cek di folder images/
      if (!fotoPath) {
        for (const ext of possibleExtensions) {
          const testFileName = baseFileName + ext;
          const testPath = join(publicImagesPath, testFileName);
          if (existsSync(testPath)) {
            fotoFileName = testFileName;
            fotoPath = `/images/${testFileName}`;
            fotoLocation = "images";
            break;
          }
        }
      }

      if (!fotoPath) {
        console.log(
          `⚠️  Foto tidak ditemukan untuk ${guru.nama_guru} (${guru.email})`
        );
        console.log(`   Mencari file: ${baseFileName}.{jpg|jpeg|png|webp}`);
        notFound++;
        continue;
      }

      await db.execute("UPDATE users SET avatar = ? WHERE id = ?", [
        fotoPath,
        userId,
      ]);

      console.log(
        `✅ ${guru.nama_guru} berhasil diupdate: ${fotoPath} (dari folder ${fotoLocation})`
      );
      updated++;
    } catch (error) {
      console.error(`❌ Error update ${guru.email}:`, error.message);
    }
  }

  console.log("\n📊 Ringkasan:");
  console.log(`   ✅ Berhasil diupdate: ${updated}`);
  console.log(`   ⚠️  Foto tidak ditemukan: ${notFound}`);
  console.log(`   ⏭️  Dilewati: ${skipped}`);

  if (notFound > 0) {
    console.log("\n💡 Tips:");
    console.log(
      `   1. Pastikan foto sudah disimpan di folder: public/images/guru/`
    );
    console.log(
      `   2. Nama file bisa: ${fotoGuruMapping
        .map((g) => g.nama_file.replace(/\.[^/.]+$/, ""))
        .join(".jpg, ")}.jpg`
    );
    console.log(`   3. Format foto yang didukung: .jpg, .jpeg, .png, .webp`);
  }
}

// ======================================================
// FUNGSI: Cleanup Guru Generic
// ======================================================
async function cleanupGuruGeneric() {
  const db = await getDb();
  console.log("🧹 Membersihkan data guru generic/demo...\n");

  try {
    // 1. Hapus jadwal_guru yang terkait
    const [jadwalDeleted] = await db.execute(`
      DELETE jg FROM jadwal_guru jg
      INNER JOIN users u ON jg.guru_id = u.id
      WHERE u.role = 'guru' 
        AND (
          u.nisn = 'gurubk'
          OR u.username LIKE 'Guru BK%'
          OR u.username LIKE 'GURU BK%'
          OR u.username REGEXP '^Guru BK [0-9]'
          OR u.username REGEXP '^GURU BK [0-9]'
        )
    `);
    console.log(
      `✅ Menghapus ${jadwalDeleted.affectedRows} jadwal guru generic`
    );

    // 2. Hapus sesi_bk yang terkait
    const [sesiDeleted] = await db.execute(`
      DELETE sb FROM sesi_bk sb
      INNER JOIN users u ON sb.guru_id = u.id
      WHERE u.role = 'guru' 
        AND (
          u.nisn = 'gurubk'
          OR u.username LIKE 'Guru BK%'
          OR u.username LIKE 'GURU BK%'
          OR u.username REGEXP '^Guru BK [0-9]'
          OR u.username REGEXP '^GURU BK [0-9]'
        )
    `);
    console.log(
      `✅ Menghapus ${sesiDeleted.affectedRows} sesi BK yang terkait dengan guru generic`
    );

    // 3. Hapus guru_profile
    const [profileDeleted] = await db.execute(`
      DELETE gp FROM guru_profile gp
      INNER JOIN users u ON gp.user_id = u.id
      WHERE u.role = 'guru' 
        AND (
          u.nisn = 'gurubk'
          OR u.username LIKE 'Guru BK%'
          OR u.username LIKE 'GURU BK%'
          OR u.username REGEXP '^Guru BK [0-9]'
          OR u.username REGEXP '^GURU BK [0-9]'
          OR gp.nama_guru LIKE 'Guru BK%'
          OR gp.nama_guru LIKE 'GURU BK%'
          OR gp.nama_guru REGEXP '^Guru BK [0-9]'
          OR gp.nama_guru REGEXP '^GURU BK [0-9]'
        )
    `);
    console.log(
      `✅ Menghapus ${profileDeleted.affectedRows} profil guru generic`
    );

    // 4. Hapus users
    const [usersDeleted] = await db.execute(`
      DELETE FROM users
      WHERE role = 'guru' 
        AND (
          nisn = 'gurubk'
          OR username LIKE 'Guru BK%'
          OR username LIKE 'GURU BK%'
          OR username REGEXP '^Guru BK [0-9]'
          OR username REGEXP '^GURU BK [0-9]'
        )
    `);
    console.log(`✅ Menghapus ${usersDeleted.affectedRows} user guru generic`);

    // 5. Cek apakah masih ada
    const [remaining] = await db.execute(`
      SELECT u.id, u.username, u.email, u.nisn, gp.nama_guru
      FROM users u
      LEFT JOIN guru_profile gp ON u.id = gp.user_id
      WHERE u.role = 'guru' 
        AND (
          u.nisn = 'gurubk'
          OR u.username LIKE 'Guru BK%'
          OR u.username LIKE 'GURU BK%'
          OR u.username REGEXP '^Guru BK [0-9]'
          OR u.username REGEXP '^GURU BK [0-9]'
          OR COALESCE(gp.nama_guru, u.username) LIKE 'Guru BK%'
          OR COALESCE(gp.nama_guru, u.username) LIKE 'GURU BK%'
          OR COALESCE(gp.nama_guru, u.username) REGEXP '^Guru BK [0-9]'
          OR COALESCE(gp.nama_guru, u.username) REGEXP '^GURU BK [0-9]'
        )
    `);

    if (remaining.length > 0) {
      console.log("\n⚠️  Masih ada guru generic yang tersisa:");
      remaining.forEach((guru) => {
        console.log(
          `   - ID: ${guru.id}, Username: ${guru.username}, Nama: ${
            guru.nama_guru || "N/A"
          }`
        );
      });
    } else {
      console.log("\n✅ Semua guru generic/demo berhasil dihapus!");
    }

    // 6. Tampilkan guru yang tersisa
    const [guruAsli] = await db.execute(`
      SELECT u.id, u.username, u.email, gp.nama_guru
      FROM users u
      LEFT JOIN guru_profile gp ON u.id = gp.user_id
      WHERE u.role = 'guru' AND u.is_active = 1
      ORDER BY u.id
    `);

    console.log(`\n📊 Total guru asli yang tersisa: ${guruAsli.length}`);
    if (guruAsli.length > 0) {
      console.log("\nGuru yang tersisa:");
      guruAsli.forEach((guru) => {
        console.log(`   ✅ ${guru.nama_guru || guru.username} (${guru.email})`);
      });
    }
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

// ======================================================
// FUNGSI: Import Guru
// ======================================================
async function importGuru() {
  const db = await getDb();
  const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
  let success = 0;
  let skipped = 0;

  console.log("📥 Mengimport 4 guru BK default...\n");

  for (const guru of guruDefaults) {
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [guru.email]
    );

    if (existing.length > 0) {
      console.log(`⏭️  ${guru.email} sudah ada, dilewati`);
      skipped++;
      continue;
    }

    const [userInsert] = await db.execute(
      "INSERT INTO users (username, email, password, role, is_active) VALUES (?, ?, ?, 'guru', 1)",
      [guru.username, guru.email, hashedPassword]
    );

    const guruId = userInsert.insertId;
    await db.execute(
      "INSERT INTO guru_profile (user_id, nama_guru, mata_keahlian, no_wa) VALUES (?, ?, ?, ?)",
      [guruId, guru.nama_guru, guru.mata_keahlian, guru.no_wa]
    );

    console.log(`✅ ${guru.email} berhasil dibuat`);
    success++;
  }

  console.log("\n📊 Ringkasan:");
  console.log(`   ✅ Berhasil: ${success}`);
  console.log(`   ⏭️  Dilewati: ${skipped}`);
  console.log("\n🔑 Login setiap guru dengan:");
  console.log(
    "   - Email: heni.bk@smktb.sch.id, kasandra.bk@smktb.sch.id, nadya.bk@smktb.sch.id, atau ika.bk@smktb.sch.id"
  );
  console.log("   - Password default: Smktb25!");
}

// ======================================================
// FUNGSI: Generate Jadwal
// ======================================================
async function generateJadwal() {
  const db = await getDb();
  console.log("📅 Generating jadwal untuk semua guru BK...\n");

  try {
    const hariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

    const [guruList] = await db.execute(
      "SELECT id, username, email FROM users WHERE role = 'guru' AND is_active = 1"
    );

    console.log(`📋 Ditemukan ${guruList.length} guru aktif:\n`);
    guruList.forEach((guru, idx) => {
      console.log(`   ${idx + 1}. ${guru.username} (${guru.email})`);
    });

    let totalJadwal = 0;
    let skipped = 0;

    for (const guru of guruList) {
      console.log(`\n📅 Membuat jadwal untuk ${guru.username}...`);

      for (const hari of hariList) {
        const [existing] = await db.execute(
          "SELECT id FROM jadwal_guru WHERE guru_id = ? AND hari = ? AND is_active = 1",
          [guru.id, hari]
        );

        if (existing.length > 0) {
          await db.execute(
            "UPDATE jadwal_guru SET jam_mulai = ?, jam_selesai = ?, is_active = 1 WHERE guru_id = ? AND hari = ? AND is_active = 1",
            ["06:30:00", "19:30:00", guru.id, hari]
          );
          skipped++;
        } else {
          await db.execute(
            "INSERT INTO jadwal_guru (guru_id, hari, jam_mulai, jam_selesai, is_active) VALUES (?, ?, ?, ?, 1)",
            [guru.id, hari, "06:30:00", "19:30:00"]
          );
          totalJadwal++;
        }
      }
      console.log(`   ✅ Selesai (${hariList.length} hari)`);
    }

    console.log("\n\n📊 Ringkasan:");
    console.log(`   ✅ Jadwal baru dibuat: ${totalJadwal}`);
    console.log(`   🔄 Jadwal yang diupdate: ${skipped}`);
    console.log(`   📅 Total jadwal: ${totalJadwal + skipped}`);

    const [jadwalCount] = await db.execute(
      "SELECT COUNT(*) as total FROM jadwal_guru WHERE is_active = 1"
    );
    console.log(`\n✨ Total jadwal aktif di database: ${jadwalCount[0].total}`);
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

// ======================================================
// MAIN
// ======================================================
const command = process.argv[2];

const commands = {
  check: checkGuru,
  "check-foto": checkFotoGuru,
  "update-foto": updateFotoGuru,
  cleanup: cleanupGuruGeneric,
  import: importGuru,
  "generate-jadwal": generateJadwal,
};

if (!command || !commands[command]) {
  console.log(`
📚 Script Management Guru BK

Usage: node database/guru/manage.js <command>

Commands:
  check              - Cek data guru di database
  check-foto         - Cek foto/avatar guru
  update-foto        - Update foto guru di database
  cleanup            - Hapus guru generic/demo
  import             - Import 4 guru BK default
  generate-jadwal    - Generate jadwal untuk semua guru

Contoh:
  node database/guru/manage.js check
  node database/guru/manage.js update-foto
  node database/guru/manage.js cleanup
`);
  process.exit(1);
}

commands[command]()
  .then(() => {
    console.log("\n✨ Selesai!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
