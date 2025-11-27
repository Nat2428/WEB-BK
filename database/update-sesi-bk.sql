-- ======================================================
-- UPDATE TABLE sesi_bk untuk menambahkan jenis_konseling dan status progress
-- Jalankan script ini di MySQL Workbench jika kolom belum ada
-- ======================================================

USE db_bk;

-- Tambah kolom jenis_konseling jika belum ada
-- Note: Jika error "Duplicate column name", berarti kolom sudah ada, skip saja
ALTER TABLE sesi_bk 
ADD COLUMN jenis_konseling ENUM('pribadi', 'akademik', 'karir') DEFAULT 'pribadi' AFTER keluhan;

-- Update ENUM status untuk menambahkan 'progress'
-- Note: Jika error, berarti sudah ada, skip saja
ALTER TABLE sesi_bk 
MODIFY COLUMN status ENUM('menunggu', 'diterima', 'ditolak', 'progress', 'selesai') DEFAULT 'menunggu';

-- Cek struktur tabel
DESCRIBE sesi_bk;
