/**
 * Script untuk import data siswa dari kelas XI RPL 1
 * Jalankan: node database/import-siswa.js
 */

import getDb from "../lib/db.js";
import bcrypt from "bcryptjs";

// Data siswa dari tabel yang diberikan
const dataSiswa = [
  { nisn: "242510044", nama: "Ahmad Faishal Majdii" },
  { nisn: "242510045", nama: "Algifahri Tri Ramadhan" },
  { nisn: "242510046", nama: "Alif AlFathar" },
  { nisn: "242510047", nama: "Alissya Alfathunnisa" },
  { nisn: "242510048", nama: "Arden Pratama Maskuri" },
  { nisn: "242510049", nama: "Aufa Putri Rahmadani" },
  { nisn: "242510050", nama: "Bhuminindra Al Hafiz" },
  { nisn: "242510051", nama: "Dandi Fairuz" },
  { nisn: "242510052", nama: "Daud Edwin Falero Manurung" },
  { nisn: "242510053", nama: "Dennis Ali Fadillah" },
  { nisn: "242510054", nama: "Dhea Rizki Maulani" },
  { nisn: "242510055", nama: "Farel Al Fatir Fauzan" },
  { nisn: "242510056", nama: "Fathan Achmadzaky Anwary" },
  { nisn: "242510057", nama: "Gading Mochamad Milan" },
  { nisn: "242510058", nama: "Hafiz Alviansyah" },
  { nisn: "242510059", nama: "Haiqal Rachmat Syarief" },
  { nisn: "242510060", nama: "Humayra" },
  { nisn: "242510061", nama: "Julyandres Saputra Pratama Kurniawan" },
  { nisn: "242510062", nama: "Kenzi Yasser Kautsar" },
  { nisn: "242510063", nama: "Muhamad Husein Al Fahreza" },
  { nisn: "242510070", nama: "Muhammad Rezky Setiansyah" },
  { nisn: "242510064", nama: "Miko Wahyu Andrianto" },
  { nisn: "242510065", nama: "Muhamad Reza Alfian" },
  { nisn: "242510066", nama: "Muhammad Ardiansyah" },
  { nisn: "242510067", nama: "Muhammad Arkan Afif" },
  { nisn: "242510068", nama: "Muhammad Irfan Hakim" },
  { nisn: "242510069", nama: "Muhammad Raffi Barzally" },
  { nisn: "242510071", nama: "Nadya Cheril Dedi" },
  { nisn: "242510072", nama: "Narendra Bintang Ramadan" },
  { nisn: "242510073", nama: "Nathanael Calvin Bastian Tumengkol" },
  { nisn: "242510074", nama: "Nazaka Septian" },
  { nisn: "242510076", nama: "Prisa Setyani" },
  { nisn: "242510078", nama: "Rakha Zuhdi Naufal" },
  { nisn: "242510079", nama: "Rega Syakib Ramadhan" },
  { nisn: "242510081", nama: "Rizqyka Poetri Dheenar" },
  { nisn: "242510082", nama: "Satria Arief Wibowo" },
  { nisn: "242510080", nama: "Riansa Putra" },
  { nisn: "242510608", nama: "Farraz Khairi" },
  { nisn: "242510618", nama: "Chika Julia Fairuz" },
];

const password = "Smktb25!"; // Password untuk semua siswa
const kelas = "XI RPL 1";
const jurusan = "Rekayasa Perangkat Lunak";

async function importSiswa() {
  try {
    console.log("🔄 Mengimpor data siswa...");
    const db = await getDb();

    // Hash password sekali untuk semua siswa
    const hashedPassword = bcrypt.hashSync(password, 10);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const siswa of dataSiswa) {
      try {
        // Cek apakah NISN sudah ada
        const [existing] = await db.execute(
          "SELECT id FROM users WHERE nisn = ?",
          [siswa.nisn]
        );

        if (existing.length > 0) {
          console.log(`⏭️  NISN ${siswa.nisn} (${siswa.nama}) sudah ada, dilewati`);
          skipCount++;
          continue;
        }

        // Insert user
        const [result] = await db.execute(
          "INSERT INTO users (nisn, username, password, role) VALUES (?, ?, ?, 'siswa')",
          [siswa.nisn, siswa.nama, hashedPassword]
        );

        const userId = result.insertId;

        // Insert profil siswa
        await db.execute(
          "INSERT INTO siswa_profile (user_id, nama_siswa, kelas, jurusan) VALUES (?, ?, ?, ?)",
          [userId, siswa.nama, kelas, jurusan]
        );

        console.log(`✅ ${siswa.nisn} - ${siswa.nama} berhasil diimport`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error import ${siswa.nisn} (${siswa.nama}):`, error.message);
        errorCount++;
      }
    }

    console.log("\n📊 Ringkasan Import:");
    console.log(`   ✅ Berhasil: ${successCount}`);
    console.log(`   ⏭️  Dilewati: ${skipCount}`);
    console.log(`   ❌ Error: ${errorCount}`);
    console.log(`\n🔑 Login dengan:`);
    console.log(`   - NISN: (sesuai USER di tabel)`);
    console.log(`   - Password: ${password}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

importSiswa();

