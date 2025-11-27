# PROMPT UNTUK CHATGPT - MEMBUAT DFD
## Sistem Bimbingan Konseling (BK) SMK Taruna Bhakti

---

## PROMPT YANG BISA DICOPY-PASTE KE CHATGPT:

```
Gua punya website Sistem Bimbingan Konseling (BK) untuk SMK Taruna Bhakti. Lu bisa bikin Data Flow Diagram (DFD) yang lengkap buat sistem ini? Detailnya sebagai berikut:

## DESKRIPSI SISTEM

Sistem Bimbingan Konseling (BK) adalah aplikasi web yang dipake buat ngelola proses konseling antara siswa dengan guru BK di SMK Taruna Bhakti. Sistem ini dibangun pake Next.js 14 dengan database MySQL. Sistem punya 3 role pengguna: Admin, Guru BK, dan Siswa.

## ROLE DAN FITUR UTAMA

### 1. ADMIN
- Login pake email dan password (admin@smktb.sch.id)
- Dashboard Admin nampilin statistik:
  - Total Siswa
  - Total Guru BK
  - Total Konseling (menunggu, diterima, ditolak, selesai)
- Manajemen Data Siswa (CRUD):
  - Create: Tambah siswa baru (NISN, Nama, Kelas, Jurusan, Email, No. HP, Alamat, Password)
  - Read: Liat daftar semua siswa dengan pencarian dan filter
  - Update: Edit data siswa
  - Delete: Nonaktifkan siswa (soft delete)
- Manajemen Data Guru BK (CRUD):
  - Create: Tambah guru baru (Nama, Email, No. WA, Mata Keahlian, Password)
  - Read: Liat daftar semua guru dengan pencarian
  - Update: Edit data guru
  - Delete: Nonaktifkan guru (soft delete)
- Laporan: Liat laporan semua konseling di sistem dengan filter

### 2. GURU BK
- Login pake email dan password
- Dashboard Guru nampilin:
  - Statistik: Total Permintaan, Pending, Disetujui, Ditolak
  - Daftar 3 permintaan konseling terbaru
  - Quick action: Terima/Tolak permintaan
- Manajemen Permintaan Konseling:
  - Liat semua permintaan konseling dari siswa
  - Filter berdasarkan status (menunggu, diterima, ditolak, progress, selesai)
  - Terima permintaan (update status jadi "diterima")
  - Tolak permintaan (update status jadi "ditolak")
  - Update status konseling jadi "progress" atau "selesai"
  - Liat detail permintaan (nama siswa, kelas, keluhan, tanggal, jam)
- Laporan: Liat laporan konseling yang ditangani sama guru tersebut
- Data Siswa: Liat daftar siswa (read-only)

### 3. SISWA
- Login pake NISN dan password
- Dashboard Siswa nampilin:
  - Statistik: Total Konseling, Pending, Disetujui, Ditolak
  - Daftar 3 konseling terbaru
- Pengajuan Konseling:
  - Pilih Guru BK yang tersedia (dari daftar guru aktif)
  - Pilih jadwal (hari dan jam) dari jadwal kosong guru
  - Isi form keluhan/masalah
  - Pilih jenis konseling (pribadi, akademik, karir)
  - Submit permintaan (status awal: "menunggu")
- Riwayat Konseling:
  - Liat semua konseling yang pernah diajukan
  - Liat detail konseling (guru, tanggal, jam, keluhan, status)
  - Liat catatan dari guru (kalau ada)
  - Liat rekomendasi dari guru (kalau ada)
- Profil Siswa:
  - Liat dan edit profil sendiri
  - Update password

### 4. LANDING PAGE (PUBLIC)
- Nampilin informasi sistem BK
- Nampilin daftar guru BK aktif dengan foto dan nama
- Tombol navigasi ke halaman login

## STRUKTUR DATABASE

Sistem pake database MySQL dengan tabel-tabel berikut:

1. **users** (id, nisn, username, email, password, role, avatar, is_active, last_login, created_at, updated_at)
   - Tabel utama untuk semua user (admin, guru, siswa)

2. **siswa_profile** (id, user_id, nama_siswa, kelas, jurusan, alamat, no_hp, created_at, updated_at)
   - Profil lengkap siswa (relasi 1-1 dengan users)

3. **guru_profile** (id, user_id, nama_guru, mata_keahlian, no_wa, created_at, updated_at)
   - Profil lengkap guru BK (relasi 1-1 dengan users)

4. **jadwal_guru** (id, guru_id, hari, jam_mulai, jam_selesai, is_active, created_at, updated_at)
   - Jadwal konseling guru BK (Senin-Sabtu, default 06:30-19:30)
   - Relasi N-1 dengan users (satu guru punya banyak jadwal)

5. **sesi_bk** (id, siswa_id, guru_id, jadwal_id, tanggal_konsultasi, jam_konsultasi, keluhan, jenis_konseling, status, tanggal_pengajuan, tanggal_respon, created_at, updated_at)
   - Sesi konsultasi BK
   - Status: menunggu, diterima, ditolak, progress, selesai
   - Jenis konseling: pribadi, akademik, karir
   - Relasi dengan users (siswa_id dan guru_id), relasi dengan jadwal_guru

6. **riwayat_bk** (id, sesi_id, catatan_guru, rekomendasi, created_at, updated_at)
   - Catatan dan rekomendasi dari guru setelah konseling
   - Relasi 1-1 dengan sesi_bk

7. **notifications** (id, user_id, title, body, type, is_read, created_at)
   - Notifikasi untuk user

## ALUR PROSES UTAMA

### ALUR 1: LOGIN DAN AUTENTIKASI
1. User buka halaman login
2. Masukin kredensial (NISN buat siswa, Email buat guru/admin, Password)
3. Sistem ngecek validasi kredensial di database
4. Sistem verifikasi password pake bcrypt
5. Sistem bikin session cookie
6. Redirect ke dashboard sesuai role

### ALUR 2: PENGAJUAN KONSULTASI (SISWA)
1. Siswa login → Dashboard Siswa
2. Siswa klik menu "Konsultasi"
3. Sistem nampilin daftar guru BK yang aktif
4. Siswa pilih guru BK
5. Sistem nampilin jadwal kosong guru (hari dan jam yang tersedia)
6. Siswa pilih jadwal (hari dan jam)
7. Siswa isi form: keluhan, jenis konseling
8. Siswa submit permintaan
9. Sistem simpan ke tabel sesi_bk dengan status "menunggu"
10. Permintaan muncul di dashboard guru

### ALUR 3: MANAJEMEN PERMINTAAN (GURU)
1. Guru login → Dashboard Guru
2. Guru liat daftar permintaan konseling yang statusnya "menunggu"
3. Guru liat detail permintaan (nama siswa, kelas, keluhan, tanggal, jam)
4. Guru pilih aksi:
   - TERIMA: Update status jadi "diterima", update tanggal_respon
   - TOLAK: Update status jadi "ditolak", update tanggal_respon
5. Status konseling bisa diupdate jadi "progress" terus "selesai"
6. Setelah konseling selesai, guru bisa bikin catatan dan rekomendasi di tabel riwayat_bk

### ALUR 4: MANAJEMEN DATA ADMIN
1. Admin login → Dashboard Admin
2. Admin pilih menu (Data Siswa atau Data Guru)
3. Buat Create: Admin isi form → Simpan ke database
4. Buat Read: Sistem nampilin daftar dari database
5. Buat Update: Admin edit form → Update di database
6. Buat Delete: Admin nonaktifkan (update is_active = 0)
7. Data auto-refresh tiap 30 detik

### ALUR 5: MANAJEMEN JADWAL
1. Sistem nampilin jadwal guru BK (default: Senin-Sabtu, 06:30-19:30)
2. Sistem cek jadwal kosong dengan query:
   - Ambil semua jadwal dari jadwal_guru
   - Cek sesi_bk yang udah dipake di tanggal tertentu
   - Jadwal kosong = jadwal yang belum dipake
3. Siswa bisa pilih jadwal kosong pas pengajuan konseling

### ALUR 6: LAPORAN
1. Admin/Guru login → Menu Laporan
2. Sistem query data konseling dari sesi_bk dan riwayat_bk
3. Sistem hitung statistik (total, per status, per periode)
4. Sistem nampilin laporan dengan filter

## DATA FLOW YANG PERLU DIPETAKAN

1. **Data dari User ke Sistem**: Login info, form data, request data
2. **Data dari Sistem ke Database**: Query, Insert, Update, Delete
3. **Data dari Database ke Sistem**: User data, siswa data, guru data, jadwal data, sesi konseling data, riwayat data
4. **Data dari Sistem ke User**: Dashboard stats, daftar data, detail data, laporan

## PERMINTAAN DFD

Gua minta lu bikin DFD yang lengkap dengan:

1. **DFD Level 0 (Context Diagram)**
   - Nunjukin sistem secara keseluruhan dengan entity eksternal (Admin, Guru BK, Siswa)
   - Nunjukin data store (Database MySQL)
   - Nunjukin alur data utama

2. **DFD Level 1 (Top Level)**
   - Breakdown proses utama sistem jadi 6 proses:
     - P1: PROSES AUTENTIKASI
     - P2: MANAJEMEN DATA ADMIN
     - P3: MANAJEMEN KONSULTASI (GURU)
     - P4: PENGAJUAN KONSULTASI (SISWA)
     - P5: MANAJEMEN JADWAL
     - P6: GENERATE LAPORAN
   - Nunjukin data flow antar proses
   - Nunjukin data store yang dipake

3. **DFD Level 2 (Detail Level)**
   - Breakdown tiap proses utama jadi sub-proses
   - Contoh buat P1 (Autentikasi):
     - 1.1 Validasi Kredensial
     - 1.2 Cek User di Database
     - 1.3 Verifikasi Password
     - 1.4 Generate Session
   - Contoh buat P4 (Pengajuan Konsultasi):
     - 4.1 Nampilin Daftar Guru BK
     - 4.2 Pilih Guru BK
     - 4.3 Nampilin Jadwal Kosong
     - 4.4 Pilih Jadwal
     - 4.5 Isi Form Konseling
     - 4.6 Submit Permintaan
   - Nunjukin alur data untuk tiap sub-proses

4. **Data Dictionary**
   - Daftar semua data store (D1, D2, D3, dst)
   - Penjelasan tiap data store (nama tabel, field penting)
   - Contoh:
     - D1: USER DATA (tabel users)
     - D2: SISWA DATA (tabel users + siswa_profile)
     - D3: GURU DATA (tabel users + guru_profile)
     - D4: SESI BK (tabel sesi_bk)
     - D5: RIWAYAT BK (tabel riwayat_bk)
     - D6: JADWAL GURU (tabel jadwal_guru)

## FORMAT OUTPUT

Lu bikin DFD dalam format:
- Diagram visual (ASCII art atau deskripsi struktur yang jelas)
- Penjelasan alur data buat tiap level
- Data dictionary yang lengkap
- Pake notasi standar DFD (proses, data store, external entity, data flow)

Bikin DFD yang lengkap, detail, dan sesuai sama spesifikasi sistem di atas ya.
```

---

## CATATAN PENGGUNAAN

1. Copy semua isi prompt di atas (dari bagian "PROMPT YANG BISA DICOPY-PASTE KE CHATGPT:" sampai akhir)
2. Paste ke ChatGPT
3. ChatGPT bakal bikin DFD lengkap sesuai spesifikasi
4. Lu bisa minta revisi kalau ada yang kurang atau perlu disesuaikan

---

## TIPS

- Kalau ChatGPT gak langsung kasih DFD yang lu mau, coba tambahin: "Bikin dalam format diagram yang jelas pake simbol standar DFD"
- Lu bisa minta ChatGPT buat bikin DFD dalam format gambar/visual kalau ada
- Kalau perlu format tertentu (misal buat tools kayak Draw.io atau Lucidchart), sebutin di prompt-nya

