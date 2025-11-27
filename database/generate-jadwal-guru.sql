-- ======================================================
-- GENERATE JADWAL GURU BK (Senin-Sabtu, 06:30-19:30)
-- Jalankan script ini di MySQL Workbench
-- ======================================================

USE db_bk;

-- Hapus jadwal lama jika ingin reset (optional - uncomment jika perlu)
-- DELETE FROM jadwal_guru;

-- Generate jadwal untuk semua guru BK yang aktif
-- Jadwal: Senin-Sabtu, 06:30-19:30 (setiap hari full day)
-- Format waktu: 06:30:00 sampai 19:30:00

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
ON DUPLICATE KEY UPDATE 
    jam_mulai = VALUES(jam_mulai),
    jam_selesai = VALUES(jam_selesai),
    is_active = VALUES(is_active);

-- Cek hasil jadwal yang sudah dibuat
SELECT 
    jg.id,
    u.username,
    gp.nama_guru,
    jg.hari,
    TIME_FORMAT(jg.jam_mulai, '%H:%i') as jam_mulai,
    TIME_FORMAT(jg.jam_selesai, '%H:%i') as jam_selesai,
    jg.is_active
FROM jadwal_guru jg
JOIN users u ON jg.guru_id = u.id
LEFT JOIN guru_profile gp ON u.id = gp.user_id
ORDER BY u.id, 
    CASE jg.hari
        WHEN 'Senin' THEN 1
        WHEN 'Selasa' THEN 2
        WHEN 'Rabu' THEN 3
        WHEN 'Kamis' THEN 4
        WHEN 'Jumat' THEN 5
        WHEN 'Sabtu' THEN 6
    END;
