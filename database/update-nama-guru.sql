-- ======================================================
-- UPDATE NAMA GURU BK YANG MASIH MENGGUNAKAN NAMA GENERIK
-- Script ini akan mengupdate nama guru yang masih "Guru BK 01", "Guru BK 02", dll
-- menjadi nama guru yang sebenarnya sesuai dengan email mereka
-- ======================================================

USE db_bk;

-- Update username dan nama_guru untuk guru yang sudah ada berdasarkan email
UPDATE users u
LEFT JOIN guru_profile gp ON u.id = gp.user_id
SET 
    u.username = 'Heni Siswati, S.Psi',
    gp.nama_guru = 'Heni Siswati, S.Psi'
WHERE u.email = 'heni.bk@smktb.sch.id' 
    AND (u.username LIKE 'Guru BK%' OR gp.nama_guru LIKE 'Guru BK%');

UPDATE users u
LEFT JOIN guru_profile gp ON u.id = gp.user_id
SET 
    u.username = 'Kasandra Fitriani. N, S.Pd',
    gp.nama_guru = 'Kasandra Fitriani. N, S.Pd'
WHERE u.email = 'kasandra.bk@smktb.sch.id' 
    AND (u.username LIKE 'Guru BK%' OR gp.nama_guru LIKE 'Guru BK%');

UPDATE users u
LEFT JOIN guru_profile gp ON u.id = gp.user_id
SET 
    u.username = 'Nadya Afriliani Ariesta, S.Pd',
    gp.nama_guru = 'Nadya Afriliani Ariesta, S.Pd'
WHERE u.email = 'nadya.bk@smktb.sch.id' 
    AND (u.username LIKE 'Guru BK%' OR gp.nama_guru LIKE 'Guru BK%');

UPDATE users u
LEFT JOIN guru_profile gp ON u.id = gp.user_id
SET 
    u.username = 'Ika Rafika, S.Pd',
    gp.nama_guru = 'Ika Rafika, S.Pd'
WHERE u.email = 'ika.bk@smktb.sch.id' 
    AND (u.username LIKE 'Guru BK%' OR gp.nama_guru LIKE 'Guru BK%');

-- Update email yang salah (guru03@smktb.sch.id -> nadya.bk@smktb.sch.id jika perlu)
UPDATE users u
LEFT JOIN guru_profile gp ON u.id = gp.user_id
SET 
    u.email = 'nadya.bk@smktb.sch.id',
    u.username = 'Nadya Afriliani Ariesta, S.Pd',
    gp.nama_guru = 'Nadya Afriliani Ariesta, S.Pd'
WHERE u.email = 'guru03@smktb.sch.id' 
    AND (u.username LIKE 'Guru BK%' OR gp.nama_guru LIKE 'Guru BK%');

-- Cek hasil update
SELECT 
    u.id,
    u.username,
    u.email,
    gp.nama_guru,
    gp.mata_keahlian
FROM users u
LEFT JOIN guru_profile gp ON u.id = gp.user_id
WHERE u.role = 'guru'
ORDER BY u.id;

-- ======================================================
-- Catatan:
-- Jika masih ada nama "Guru BK 01", "Guru BK 02", dll setelah script ini dijalankan,
-- berarti email mereka tidak cocok dengan yang di atas.
-- Silakan cek data di database dan sesuaikan email atau tambahkan kondisi WHERE yang sesuai.
-- ======================================================
