import mysql from "mysql2/promise";

let db;

async function getDb() {
  if (!db) {
    try {
      db = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "", // Isi password MySQL Anda jika ada
        database: "db_bk",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        charset: "utf8mb4",
      });

      // Test koneksi
      const testConnection = await db.getConnection();
      await testConnection.ping();
      testConnection.release();
    } catch (error) {
      console.error("❌ Error koneksi database:", error.message);
      if (error.code === "ER_BAD_DB_ERROR") {
        console.error("💡 Database 'db_bk' belum ada!");
        console.error(
          "💡 Jalankan: node database/check-db.js untuk membuat database"
        );
      } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
        console.error("💡 Username atau password MySQL salah!");
        console.error("💡 Edit file lib/db.js untuk mengubah konfigurasi");
      } else if (error.code === "ECONNREFUSED") {
        console.error("💡 MySQL/MariaDB tidak running!");
        console.error("💡 Pastikan MySQL service sudah start");
      }
      throw error;
    }
  }
  return db;
}

export default getDb;
