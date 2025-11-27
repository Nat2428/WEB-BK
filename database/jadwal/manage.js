/**
 * Script Terpusat untuk Management Jadwal Guru BK
 * 
 * Usage:
 *   node database/jadwal/manage.js check    - Cek jadwal duplikat
 *   node database/jadwal/manage.js cleanup  - Hapus jadwal duplikat
 *   node database/jadwal/manage.js generate - Generate jadwal untuk semua guru
 */

import getDb from "../../lib/db.js";

// ======================================================
// FUNGSI: Check Jadwal Duplikat
// ======================================================
async function checkJadwalDuplikat() {
  const db = await getDb();
  console.log("🔍 Mengecek jadwal duplikat...\n");

  try {
    const [jadwal] = await db.execute(`
      SELECT 
        u.id as guru_id,
        u.username,
        gp.nama_guru,
        jg.hari,
        COUNT(*) as jumlah
      FROM jadwal_guru jg
      JOIN users u ON jg.guru_id = u.id
      LEFT JOIN guru_profile gp ON u.id = gp.user_id
      WHERE u.role = 'guru' AND jg.is_active = 1
      GROUP BY u.id, jg.hari
      HAVING COUNT(*) > 1
      ORDER BY u.id, jg.hari
    `);

    if (jadwal.length > 0) {
      console.log("⚠️  Ditemukan jadwal duplikat:\n");
      jadwal.forEach((j) => {
        console.log(`   ${j.nama_guru || j.username} - ${j.hari}: ${j.jumlah} jadwal`);
      });
    } else {
      console.log("✅ Tidak ada jadwal duplikat");
    }

    const [totalJadwal] = await db.execute(`
      SELECT 
        u.id as guru_id,
        u.username,
        gp.nama_guru,
        COUNT(*) as total_jadwal
      FROM jadwal_guru jg
      JOIN users u ON jg.guru_id = u.id
      LEFT JOIN guru_profile gp ON u.id = gp.user_id
      WHERE u.role = 'guru' AND jg.is_active = 1
      GROUP BY u.id
      ORDER BY u.id
    `);

    console.log("\n📊 Total jadwal per guru:");
    totalJadwal.forEach((t) => {
      const status = t.total_jadwal === 6 ? "✅" : "⚠️";
      console.log(`   ${status} ${t.nama_guru || t.username}: ${t.total_jadwal} jadwal (seharusnya 6: Senin-Sabtu)`);
    });
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

// ======================================================
// FUNGSI: Cleanup Jadwal Duplikat
// ======================================================
async function cleanupJadwalDuplikat() {
  const db = await getDb();
  console.log("🧹 Membersihkan jadwal duplikat...\n");

  try {
    const [deleted] = await db.execute(`
      DELETE jg1 FROM jadwal_guru jg1
      INNER JOIN jadwal_guru jg2
      WHERE jg1.guru_id = jg2.guru_id
        AND jg1.hari = jg2.hari
        AND jg1.id < jg2.id
        AND jg1.is_active = 1
        AND jg2.is_active = 1
    `);

    console.log(`✅ Menghapus ${deleted.affectedRows} jadwal duplikat`);

    const [totalJadwal] = await db.execute(`
      SELECT 
        u.id as guru_id,
        u.username,
        gp.nama_guru,
        COUNT(*) as total_jadwal
      FROM jadwal_guru jg
      JOIN users u ON jg.guru_id = u.id
      LEFT JOIN guru_profile gp ON u.id = gp.user_id
      WHERE u.role = 'guru' AND jg.is_active = 1
      GROUP BY u.id
      ORDER BY u.id
    `);

    console.log("\n📊 Total jadwal per guru setelah cleanup:");
    totalJadwal.forEach((t) => {
      const status = t.total_jadwal === 6 ? "✅" : "⚠️";
      console.log(`   ${status} ${t.nama_guru || t.username}: ${t.total_jadwal} jadwal`);
    });

    const [duplikat] = await db.execute(`
      SELECT 
        u.id as guru_id,
        gp.nama_guru,
        jg.hari,
        COUNT(*) as jumlah
      FROM jadwal_guru jg
      JOIN users u ON jg.guru_id = u.id
      LEFT JOIN guru_profile gp ON u.id = gp.user_id
      WHERE u.role = 'guru' AND jg.is_active = 1
      GROUP BY u.id, jg.hari
      HAVING COUNT(*) > 1
    `);

    if (duplikat.length > 0) {
      console.log("\n⚠️  Masih ada duplikat:");
      duplikat.forEach((d) => {
        console.log(`   ${d.nama_guru} - ${d.hari}: ${d.jumlah} jadwal`);
      });
    } else {
      console.log("\n✅ Tidak ada duplikat lagi!");
    }
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
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
  check: checkJadwalDuplikat,
  cleanup: cleanupJadwalDuplikat,
  generate: generateJadwal,
};

if (!command || !commands[command]) {
  console.log(`
📚 Script Management Jadwal Guru BK

Usage: node database/jadwal/manage.js <command>

Commands:
  check    - Cek jadwal duplikat
  cleanup  - Hapus jadwal duplikat
  generate - Generate jadwal untuk semua guru

Contoh:
  node database/jadwal/manage.js check
  node database/jadwal/manage.js cleanup
  node database/jadwal/manage.js generate
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

