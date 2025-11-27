/**
 * Script untuk check dan create database db_bk
 * Jalankan: node database/check-db.js
 */

import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "", // Isi password MySQL Anda jika ada
  multipleStatements: true,
};

async function checkAndCreateDatabase() {
  let connection;

  try {
    console.log("🔄 Menghubungkan ke MySQL...");
    connection = await mysql.createConnection(dbConfig);

    console.log("✅ Koneksi MySQL berhasil!");
    console.log("🔍 Mengecek database db_bk...");

    // Cek apakah database ada
    const [databases] = await connection.query("SHOW DATABASES LIKE 'db_bk'");

    if (databases.length === 0) {
      console.log("📦 Database db_bk belum ada, membuat database...");
      await connection.query(
        "CREATE DATABASE db_bk CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
      );
      console.log("✅ Database db_bk berhasil dibuat!");
    } else {
      console.log("✅ Database db_bk sudah ada!");
    }

    // Cek tabel-tabel yang ada
    await connection.query("USE db_bk");
    const [tables] = await connection.query("SHOW TABLES");

    console.log(`\n📊 Tabel yang ada di database db_bk: ${tables.length}`);
    if (tables.length > 0) {
      console.log("   Tabel:");
      tables.forEach((table) => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
    } else {
      console.log("   ⚠️  Belum ada tabel di database!");
      console.log("   💡 Buat tabel-tabel yang diperlukan di MySQL Workbench");
    }

    console.log("\n✅ Selesai!");
    await connection.end();
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.log("\n💡 Tips:");
      console.log("   - Pastikan username dan password MySQL benar");
      console.log(
        "   - Edit file database/check-db.js untuk mengubah konfigurasi"
      );
    } else if (error.code === "ECONNREFUSED") {
      console.log("\n💡 Tips:");
      console.log("   - Pastikan MySQL/MariaDB sudah running");
      console.log("   - Cek apakah MySQL service sudah start");
    }
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

checkAndCreateDatabase();
