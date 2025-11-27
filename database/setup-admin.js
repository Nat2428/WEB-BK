/**
 * Script untuk setup akun admin dengan email dan password
 * Jalankan: node database/setup-admin.js
 * 
 * Kredensial Admin:
 * - Email: admin@smktb.sch.id
 * - Password: admintb25!
 */

import getDb from "../lib/db.js";
import bcrypt from "bcryptjs";

const adminEmail = "admin@smktb.sch.id";
const adminPassword = "admintb25!";
const adminUsername = "Admin Sistem";

async function setupAdmin() {
  const db = await getDb();
  
  try {
    console.log("🔄 Mengatur akun admin...\n");

    // Hash password
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);

    // Cek apakah admin sudah ada
    const [existing] = await db.execute(
      "SELECT id, email FROM users WHERE email = ? OR (nisn = 'adminrole' AND role = 'admin')",
      [adminEmail]
    );

    if (existing.length > 0) {
      // Update admin yang sudah ada
      const adminId = existing[0].id;
      await db.execute(
        "UPDATE users SET email = ?, username = ?, password = ?, role = 'admin', is_active = 1 WHERE id = ?",
        [adminEmail, adminUsername, hashedPassword, adminId]
      );
      console.log(`✅ Akun admin berhasil diupdate!`);
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    } else {
      // Insert admin baru
      await db.execute(
        "INSERT INTO users (email, username, password, role, is_active) VALUES (?, ?, ?, 'admin', 1)",
        [adminEmail, adminUsername, hashedPassword]
      );
      console.log(`✅ Akun admin berhasil dibuat!`);
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    }

    console.log("\n📋 Kredensial Login Admin:");
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log("\n✅ Setup selesai!\n");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

setupAdmin();
