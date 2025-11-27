# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## Sistem Bimbingan Konseling (BK) SMK Taruna Bhakti

---

## 1. PENDAHULUAN

### 1.1 Tujuan Dokumen
Dokumen ini menjelaskan spesifikasi kebutuhan perangkat lunak untuk Sistem Bimbingan Konseling (BK) SMK Taruna Bhakti. Dokumen ini digunakan sebagai acuan dalam pengembangan sistem.

### 1.2 Lingkup Produk
Sistem Bimbingan Konseling (BK) adalah aplikasi web yang digunakan untuk mengelola proses konseling antara siswa dengan guru BK di SMK Taruna Bhakti. Sistem ini memungkinkan siswa untuk mengajukan permintaan konseling, guru BK untuk mengelola permintaan dan jadwal, serta admin untuk mengelola data siswa, guru, dan laporan.

### 1.3 Definisi, Akronim, dan Singkatan
- **BK**: Bimbingan Konseling
- **SRS**: Software Requirements Specification
- **DFD**: Data Flow Diagram
- **CRUD**: Create, Read, Update, Delete
- **NISN**: Nomor Induk Siswa Nasional
- **S.Psi**: Sarjana Psikologi
- **S.Pd**: Sarjana Pendidikan

### 1.4 Referensi
- IEEE Std 830-1998 - IEEE Recommended Practice for Software Requirements Specifications
- Dokumentasi Next.js 14
- Dokumentasi MySQL

### 1.5 Overview Dokumen
Dokumen ini terdiri dari:
- Deskripsi umum produk
- Spesifikasi fungsional
- Spesifikasi non-fungsional
- Model data dan diagram

---

## 2. DESKRIPSI UMUM

### 2.1 Perspektif Produk
Sistem BK adalah aplikasi web yang terhubung dengan database MySQL. Sistem ini dibangun menggunakan Next.js 14 (React framework) dengan server-side rendering. Sistem terintegrasi dengan database untuk menyimpan data siswa, guru, jadwal, dan sesi konseling.

### 2.2 Fungsi Produk
Sistem menyediakan fungsi utama:
1. **Manajemen Autentikasi**: Login untuk 3 role (Admin, Guru BK, Siswa)
2. **Landing Page**: Halaman depan menampilkan informasi sistem dan daftar guru BK
3. **Dashboard Admin**: Statistik sistem, manajemen data siswa dan guru
4. **Dashboard Guru**: Statistik permintaan, manajemen permintaan konseling
5. **Dashboard Siswa**: Statistik konseling, pengajuan konseling
6. **Manajemen Konseling**: Pengajuan, persetujuan, dan pencatatan hasil konseling
7. **Laporan**: Laporan data konseling untuk admin dan guru

### 2.3 Karakteristik Pengguna
1. **Admin**: Mengelola seluruh data sistem, melihat laporan
2. **Guru BK**: Mengelola permintaan konseling, melihat jadwal, membuat catatan konseling
3. **Siswa**: Mengajukan konseling, melihat riwayat konseling

### 2.4 Batasan
- Sistem hanya dapat diakses oleh user yang sudah terdaftar
- Konseling harus dilakukan dalam jadwal yang sudah ditentukan
- Setiap siswa hanya bisa mengajukan satu konseling per waktu tertentu

### 2.5 Asumsi dan Ketergantungan
- Database MySQL sudah terinstall dan berjalan
- Browser modern mendukung JavaScript ES6+
- Koneksi internet stabil untuk akses sistem
- Server dapat menjalankan Node.js 18+

---

## 3. SPESIFIKASI FUNGSIONAL

### 3.1 Landing Page (Halaman Beranda)

#### 3.1.1 Deskripsi
Halaman utama yang menampilkan informasi sistem BK dan daftar guru BK yang tersedia.

#### 3.1.2 Input
- Tidak ada input dari user (hanya tampilan)

#### 3.1.3 Pemrosesan
- Sistem mengambil data guru BK aktif dari database
- Menampilkan foto dan informasi guru BK dalam format carousel

#### 3.1.4 Output
- Hero section dengan informasi sistem
- Daftar guru BK dengan foto dan nama
- Informasi layanan BK
- Tombol navigasi ke halaman login

### 3.2 Autentikasi dan Autorisasi

#### 3.2.1 Login
**Deskripsi**: Halaman untuk login ke sistem

**Input**:
- NISN/Email (untuk siswa/guru)
- Password

**Pemrosesan**:
- Validasi format input
- Cek kredensial di database
- Verifikasi password dengan bcrypt
- Generate session cookie
- Redirect berdasarkan role

**Output**:
- Redirect ke dashboard sesuai role
- Error message jika kredensial salah

**Validasi**:
- NISN/Email wajib diisi
- Password wajib diisi
- Password minimal 8 karakter

### 3.3 Fungsi Admin

#### 3.3.1 Dashboard Admin
**Deskripsi**: Halaman utama admin menampilkan statistik sistem

**Output**:
- Total Siswa
- Total Guru BK
- Total Konseling (menunggu, diterima, ditolak, selesai)
- Grafik statistik (jika ada)

**Auto-refresh**: Data di-refresh setiap 30 detik

#### 3.3.2 Manajemen Data Siswa
**Deskripsi**: CRUD data siswa

**Fitur Create**:
- Input: NISN, Nama, Kelas, Jurusan, Email, No. HP, Alamat, Password
- Validasi: NISN unik, semua field wajib diisi
- Output: Data siswa baru ditambahkan ke database

**Fitur Read**:
- Menampilkan daftar semua siswa
- Pencarian berdasarkan nama, NISN, atau kelas
- Statistik: Total siswa, Total kelas, Total jurusan
- Filter berdasarkan status aktif

**Fitur Update**:
- Edit semua data siswa (kecuali NISN)
- Update password (opsional)

**Fitur Delete**:
- Soft delete (nonaktifkan siswa)
- Update `is_active` menjadi 0

#### 3.3.3 Manajemen Data Guru BK
**Deskripsi**: CRUD data guru BK

**Fitur Create**:
- Input: Nama, Email, No. WA, Mata Keahlian, Password
- Validasi: Email unik, Nama dan Email wajib
- Output: Data guru baru ditambahkan

**Fitur Read**:
- Menampilkan daftar semua guru dalam format card
- Pencarian berdasarkan nama atau email
- Statistik: Total guru, Guru aktif

**Fitur Update**:
- Edit semua data guru
- Update password (opsional)

**Fitur Delete**:
- Soft delete (nonaktifkan guru)
- Update `is_active` menjadi 0

#### 3.3.4 Laporan Admin
**Deskripsi**: Laporan semua konseling di sistem

**Output**:
- Daftar semua sesi konseling
- Filter berdasarkan status
- Statistik konseling

### 3.4 Fungsi Guru BK

#### 3.4.1 Dashboard Guru
**Deskripsi**: Halaman utama guru menampilkan statistik dan permintaan terbaru

**Output**:
- Total Permintaan
- Pending (menunggu)
- Disetujui (diterima)
- Ditolak
- Daftar 3 permintaan terbaru
- Aksi cepat: Terima/Tolak permintaan

#### 3.4.2 Manajemen Permintaan Konseling
**Deskripsi**: Mengelola permintaan konseling dari siswa

**Fitur**:
- Melihat semua permintaan konseling
- Filter berdasarkan status
- Menerima permintaan (update status menjadi "diterima")
- Menolak permintaan (update status menjadi "ditolak")
- Melihat detail permintaan (nama siswa, kelas, keluhan, tanggal, jam)

**Status Konseling**:
- `menunggu`: Baru diajukan, belum ada respon
- `diterima`: Guru menyetujui permintaan
- `ditolak`: Guru menolak permintaan
- `progress`: Konseling sedang berlangsung
- `selesai`: Konseling selesai

#### 3.4.3 Laporan Guru
**Deskripsi**: Laporan konseling yang ditangani oleh guru tersebut

**Output**:
- Daftar semua konseling yang ditangani
- Filter berdasarkan status
- Statistik konseling

#### 3.4.4 Data Siswa
**Deskripsi**: Melihat daftar siswa (read-only)

**Output**:
- Daftar semua siswa dengan informasi lengkap
- Pencarian siswa

### 3.5 Fungsi Siswa

#### 3.5.1 Dashboard Siswa
**Deskripsi**: Halaman utama siswa menampilkan statistik konseling

**Output**:
- Total Konseling
- Pending
- Disetujui
- Ditolak
- Daftar 3 konseling terbaru

#### 3.5.2 Pengajuan Konseling
**Deskripsi**: Mengajukan permintaan konseling ke guru BK

**Proses**:
1. Pilih Guru BK yang tersedia
2. Pilih jadwal (hari dan jam) dari jadwal kosong guru
3. Isi keluhan/masalah
4. Pilih jenis konseling (pribadi, akademik, karir)
5. Submit permintaan

**Input**:
- Guru ID
- Jadwal ID (hari dan jam)
- Keluhan (text)
- Jenis konseling (enum: pribadi, akademik, karir)
- Tanggal konsultasi

**Validasi**:
- Guru harus aktif
- Jadwal harus tersedia
- Keluhan wajib diisi
- Tanggal tidak boleh di masa lalu

**Output**:
- Status permintaan: "menunggu"
- Notifikasi permintaan berhasil diajukan

#### 3.5.3 Riwayat Konseling
**Deskripsi**: Melihat riwayat semua konseling yang pernah diajukan

**Output**:
- Daftar semua konseling dengan status
- Detail konseling (guru, tanggal, jam, keluhan, status)
- Catatan dari guru (jika ada)
- Rekomendasi dari guru (jika ada)

#### 3.5.4 Profil Siswa
**Deskripsi**: Melihat dan mengedit profil sendiri

**Fitur**:
- Lihat data profil
- Update profil (nama, email, no. HP, alamat)
- Update password

### 3.6 Manajemen Jadwal

#### 3.6.1 Jadwal Guru BK
**Deskripsi**: Setiap guru BK memiliki jadwal konseling

**Default Jadwal**:
- Hari: Senin - Sabtu
- Jam: 06:30 - 19:30 (full day)

**Fitur**:
- Admin/guru dapat melihat jadwal
- Siswa dapat melihat jadwal kosong untuk memilih

---

## 4. SPESIFIKASI NON-FUNGSIONAL

### 4.1 Performance
- Halaman harus load dalam waktu < 3 detik
- Auto-refresh data setiap 30 detik untuk dashboard
- Database query harus dioptimasi dengan index

### 4.2 Security
- Password di-hash menggunakan bcrypt
- Session management dengan cookie secure
- Autorisasi role-based untuk setiap halaman
- SQL injection prevention dengan prepared statements
- XSS prevention dengan sanitasi input

### 4.3 Usability
- Interface responsive (mobile, tablet, desktop)
- UI modern dengan Tailwind CSS
- Navigasi yang mudah dipahami
- Feedback yang jelas untuk setiap aksi

### 4.4 Reliability
- Error handling untuk semua operasi
- Validasi input di client dan server
- Backup data database secara berkala

### 4.5 Maintainability
- Code structure yang rapi dan modular
- Dokumentasi code yang jelas
- Database schema yang terstruktur

---

## 5. MODEL DATA

### 5.1 Entity Relationship Diagram (ERD)

**Entities**:
1. **users** (id, nisn, username, email, password, role, avatar, is_active, last_login, created_at, updated_at)
2. **siswa_profile** (id, user_id, nama_siswa, kelas, jurusan, alamat, no_hp, created_at, updated_at)
3. **guru_profile** (id, user_id, nama_guru, mata_keahlian, no_wa, created_at, updated_at)
4. **jadwal_guru** (id, guru_id, hari, jam_mulai, jam_selesai, is_active, created_at, updated_at)
5. **sesi_bk** (id, siswa_id, guru_id, jadwal_id, tanggal_konsultasi, jam_konsultasi, keluhan, jenis_konseling, status, tanggal_pengajuan, tanggal_respon, created_at, updated_at)
6. **riwayat_bk** (id, sesi_id, catatan_guru, rekomendasi, created_at, updated_at)
7. **notifications** (id, user_id, title, body, type, is_read, created_at)

**Relationships**:
- users (1) → (1) siswa_profile
- users (1) → (1) guru_profile
- users (1) → (N) jadwal_guru
- users (1) → (N) sesi_bk (sebagai siswa_id)
- users (1) → (N) sesi_bk (sebagai guru_id)
- jadwal_guru (1) → (N) sesi_bk
- sesi_bk (1) → (1) riwayat_bk
- users (1) → (N) notifications

### 5.2 Aturan Bisnis

1. **Siswa**:
   - Login menggunakan NISN dan password
   - Satu siswa hanya bisa login dengan satu akun
   - Password default: "Smktb25!"

2. **Guru BK**:
   - Login menggunakan email dan password
   - Setiap guru memiliki jadwal default (Senin-Sabtu, 06:30-19:30)
   - Password default: "Smktb25!"

3. **Admin**:
   - Login menggunakan email: "admin@smktb.sch.id" dan password: "admintb25!"
   - Admin memiliki akses penuh ke semua fitur

4. **Konseling**:
   - Status konseling berurutan: menunggu → diterima/ditolak → progress → selesai
   - Satu jadwal tidak bisa digunakan dua kali dalam waktu bersamaan
   - Siswa harus memilih jadwal yang tersedia (kosong)

---

## 6. ARSITEKTUR SISTEM

### 6.1 Teknologi yang Digunakan
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js Server Actions, API Routes
- **Database**: MySQL/MariaDB
- **Authentication**: Session-based (cookies)
- **Password Hashing**: bcryptjs

### 6.2 Struktur Folder
```
BK/
├── app/                    # Next.js App Router
│   ├── admin/             # Halaman admin
│   ├── guru/              # Halaman guru
│   ├── siswa/             # Halaman siswa
│   ├── login/             # Halaman login
│   └── page.tsx           # Landing page
├── components/            # Komponen React
├── lib/                   # Library & utilities
│   ├── actions.js        # Server actions
│   ├── db.js             # Database connection
│   └── session-utils.js  # Session management
├── database/             # Script database
│   ├── create-tables.sql # Schema database
│   ├── guru/             # Script management guru
│   └── jadwal/           # Script management jadwal
└── public/               # Static files
    └── images/           # Gambar (foto guru, dll)
```

### 6.3 Flow Sistem

1. **Flow Pengajuan Konseling**:
   - Siswa login → Dashboard → Konsultasi → Pilih Guru → Pilih Jadwal → Isi Form → Submit
   - Sistem menyimpan permintaan dengan status "menunggu"
   - Guru melihat permintaan di dashboard → Terima/Tolak
   - Jika diterima, status menjadi "diterima"
   - Konseling berlangsung → Status menjadi "progress" → "selesai"
   - Guru membuat catatan dan rekomendasi → Disimpan di riwayat_bk

2. **Flow Manajemen Data**:
   - Admin login → Dashboard → Pilih menu (Siswa/Guru) → CRUD data
   - Data tersimpan di database → Auto-refresh di UI

---

## 7. INTERFACE

### 7.1 User Interface
- Design modern dengan gradient colors
- Responsive design untuk semua device
- Navigation bar berbeda untuk setiap role
- Form validation dengan feedback real-time

### 7.2 Hardware Interface
- Tidak ada interface hardware khusus

### 7.3 Software Interface
- MySQL Database (port 3306)
- Web Browser (Chrome, Firefox, Safari, Edge)
- Node.js Runtime Environment

### 7.4 Communication Interface
- HTTP/HTTPS protocol
- RESTful API untuk komunikasi frontend-backend

---

## 8. TESTING REQUIREMENTS

### 8.1 Unit Testing
- Test semua fungsi CRUD
- Test validasi input
- Test authentication

### 8.2 Integration Testing
- Test integrasi frontend-backend
- Test integrasi dengan database

### 8.3 System Testing
- Test semua flow pengguna
- Test semua role dan permission
- Test responsive design

---

## 9. APPENDIX

### 9.1 Glosarium
- **Konseling**: Proses konsultasi antara siswa dengan guru BK
- **Jadwal Kosong**: Slot waktu yang tersedia untuk konseling
- **Status Konseling**: Kondisi dari sebuah permintaan konseling

### 9.2 Daftar Fitur Prioritas

**Prioritas Tinggi**:
- Login/Authentication
- Pengajuan Konseling (Siswa)
- Manajemen Permintaan (Guru)
- CRUD Siswa & Guru (Admin)

**Prioritas Sedang**:
- Dashboard dengan statistik
- Riwayat Konseling
- Laporan

**Prioritas Rendah**:
- Notifikasi
- Profile update

---

**Dokumen ini dibuat untuk keperluan dokumentasi proyek Sistem Bimbingan Konseling SMK Taruna Bhakti.**

**Versi**: 1.0  
**Tanggal**: 2024  
**Pembuat**: Tim Pengembang BK System

