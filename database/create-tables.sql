-- ======================================================
-- CREATE TABLES untuk Database db_bk
-- Jalankan script ini di MySQL Workbench
-- ======================================================

USE db_bk;

-- ======================================================
-- TABLE: users (Tabel utama untuk semua user)
-- ======================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nisn VARCHAR(20) UNIQUE,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('siswa', 'guru', 'admin', 'superadmin') NOT NULL DEFAULT 'siswa',
    avatar VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nisn (nisn),
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- TABLE: siswa_profile (Profil lengkap siswa)
-- ======================================================
CREATE TABLE IF NOT EXISTS siswa_profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nama_siswa VARCHAR(100) NOT NULL,
    kelas VARCHAR(50),
    jurusan VARCHAR(100),
    alamat TEXT,
    no_hp VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- TABLE: guru_profile (Profil lengkap guru BK)
-- ======================================================
CREATE TABLE IF NOT EXISTS guru_profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nama_guru VARCHAR(100) NOT NULL,
    mata_keahlian VARCHAR(100),
    no_wa VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- TABLE: jadwal_guru (Jadwal konsultasi guru BK)
-- ======================================================
CREATE TABLE IF NOT EXISTS jadwal_guru (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guru_id INT NOT NULL,
    hari ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu') NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (guru_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_guru_hari (guru_id, hari, is_active),
    INDEX idx_guru_id (guru_id),
    INDEX idx_hari (hari)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- TABLE: sesi_bk (Sesi konsultasi BK)
-- ======================================================
CREATE TABLE IF NOT EXISTS sesi_bk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    siswa_id INT NOT NULL,
    guru_id INT NOT NULL,
    jadwal_id INT,
    tanggal_konsultasi DATE NOT NULL,
    jam_konsultasi TIME NOT NULL,
    keluhan TEXT NOT NULL,
    jenis_konseling ENUM('pribadi', 'akademik', 'karir') DEFAULT 'pribadi',
    status ENUM('menunggu', 'diterima', 'ditolak', 'progress', 'selesai') DEFAULT 'menunggu',
    tanggal_pengajuan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tanggal_respon DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (siswa_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (guru_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (jadwal_id) REFERENCES jadwal_guru(id) ON DELETE SET NULL,
    INDEX idx_siswa_id (siswa_id),
    INDEX idx_guru_id (guru_id),
    INDEX idx_status (status),
    INDEX idx_tanggal (tanggal_konsultasi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- TABLE: riwayat_bk (Riwayat dan catatan konsultasi)
-- ======================================================
CREATE TABLE IF NOT EXISTS riwayat_bk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sesi_id INT NOT NULL,
    catatan_guru TEXT,
    rekomendasi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sesi_id) REFERENCES sesi_bk(id) ON DELETE CASCADE,
    UNIQUE KEY unique_sesi_id (sesi_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- TABLE: notifications (Notifikasi untuk user)
-- ======================================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT,
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================================
-- INSERT DATA DEFAULT (Admin dan Guru BK)
-- ======================================================

-- Insert Admin
-- Login: admin@smktb.sch.id
-- Password: admintb25!
INSERT INTO users (username, email, password, role, is_active) VALUES
('Admin Sistem', 'admin@smktb.sch.id', '$2a$10$yWCLDbTsrVq8cqh/OVEzve6s3lWoNYYUcDM9RRT7Z3eQVczrn8Qz.', 'admin', 1)
ON DUPLICATE KEY UPDATE 
    username = VALUES(username),
    email = VALUES(email),
    password = VALUES(password),
    role = 'admin',
    is_active = 1;

-- Insert 4 Guru BK (password default: Smktb25!)
INSERT INTO users (username, email, password, role, is_active) VALUES
('Heni Siswati, S.Psi', 'heni.bk@smktb.sch.id', '$2a$10$gMrv93Dulmp7xxzqaGI1gebbrI20/zFZPiOdUqPPpnYDXTHhx9MLa', 'guru', 1),
('Kasandra Fitriani. N, S.Pd', 'kasandra.bk@smktb.sch.id', '$2a$10$gMrv93Dulmp7xxzqaGI1gebbrI20/zFZPiOdUqPPpnYDXTHhx9MLa', 'guru', 1),
('Nadya Afriliani Ariesta, S.Pd', 'nadya.bk@smktb.sch.id', '$2a$10$gMrv93Dulmp7xxzqaGI1gebbrI20/zFZPiOdUqPPpnYDXTHhx9MLa', 'guru', 1),
('Ika Rafika, S.Pd', 'ika.bk@smktb.sch.id', '$2a$10$gMrv93Dulmp7xxzqaGI1gebbrI20/zFZPiOdUqPPpnYDXTHhx9MLa', 'guru', 1)
ON DUPLICATE KEY UPDATE username = VALUES(username);

-- Insert profile guru BK
INSERT INTO guru_profile (user_id, nama_guru, mata_keahlian, no_wa) 
SELECT id, 'Heni Siswati, S.Psi', 'Bimbingan Konseling', '081200000001' FROM users WHERE email = 'heni.bk@smktb.sch.id'
ON DUPLICATE KEY UPDATE nama_guru = VALUES(nama_guru);

INSERT INTO guru_profile (user_id, nama_guru, mata_keahlian, no_wa) 
SELECT id, 'Kasandra Fitriani. N, S.Pd', 'Bimbingan Konseling', '081200000002' FROM users WHERE email = 'kasandra.bk@smktb.sch.id'
ON DUPLICATE KEY UPDATE nama_guru = VALUES(nama_guru);

INSERT INTO guru_profile (user_id, nama_guru, mata_keahlian, no_wa) 
SELECT id, 'Nadya Afriliani Ariesta, S.Pd', 'Bimbingan Konseling', '081200000003' FROM users WHERE email = 'nadya.bk@smktb.sch.id'
ON DUPLICATE KEY UPDATE nama_guru = VALUES(nama_guru);

INSERT INTO guru_profile (user_id, nama_guru, mata_keahlian, no_wa) 
SELECT id, 'Ika Rafika, S.Pd', 'Bimbingan Konseling', '081200000004' FROM users WHERE email = 'ika.bk@smktb.sch.id'
ON DUPLICATE KEY UPDATE nama_guru = VALUES(nama_guru);

-- ======================================================
-- GENERATE JADWAL GURU BK (Senin-Sabtu, 06:30-19:30)
-- ======================================================
-- Hapus jadwal lama untuk guru yang aktif (jika ada duplikat)
DELETE jg1 FROM jadwal_guru jg1
INNER JOIN jadwal_guru jg2
WHERE jg1.guru_id = jg2.guru_id
  AND jg1.hari = jg2.hari
  AND jg1.id < jg2.id
  AND jg1.is_active = 1
  AND jg2.is_active = 1;

-- Insert jadwal baru (hanya jika belum ada)
INSERT INTO jadwal_guru (guru_id, hari, jam_mulai, jam_selesai, is_active)
SELECT 
    u.id as guru_id,
    hari.hari,
    '06:30:00' as jam_mulai,
    '19:30:00' as jam_selesai,
    1 as is_active
FROM users u
CROSS JOIN (
    SELECT 'Senin' as hari
    UNION SELECT 'Selasa'
    UNION SELECT 'Rabu'
    UNION SELECT 'Kamis'
    UNION SELECT 'Jumat'
    UNION SELECT 'Sabtu'
) hari
WHERE u.role = 'guru' AND u.is_active = 1
  AND NOT EXISTS (
    SELECT 1 FROM jadwal_guru jg 
    WHERE jg.guru_id = u.id 
      AND jg.hari = hari.hari 
      AND jg.is_active = 1
  );
