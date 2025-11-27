# 📚 DOKUMENTASI PROYEK
## Sistem Bimbingan Konseling (BK) SMK Taruna Bhakti

---

## 📋 Daftar Dokumen

### 1. Software Requirements Specification (SRS)
📄 **File**: `DOKUMEN_SRS.md`

Dokumen lengkap spesifikasi kebutuhan perangkat lunak yang mencakup:
- Pendahuluan dan deskripsi umum
- Spesifikasi fungsional untuk semua fitur
- Spesifikasi non-fungsional (performance, security, usability)
- Model data (ERD) dan aturan bisnis
- Arsitektur sistem
- Interface dan testing requirements

### 2. Data Flow Diagram (DFD)
📄 **File**: `DIAGRAM_DFD.md`

Diagram alur data sistem yang mencakup:
- **DFD Level 0**: Context Diagram (sistem secara keseluruhan)
- **DFD Level 1**: Top Level (proses utama sistem)
- **DFD Level 2**: Detail setiap proses:
  - P1: Proses Autentikasi
  - P2: Manajemen Data Admin
  - P3: Manajemen Konsultasi (Guru)
  - P4: Pengajuan Konsultasi (Siswa)
  - P5: Manajemen Jadwal
  - P6: Generate Laporan
- Data Dictionary (penjelasan setiap data store)

### 3. Dokumentasi Database
📄 **File**: `database/README.md`

Panduan setup dan konfigurasi database, termasuk:
- Setup database
- Script management guru dan jadwal
- Kredensial login default

---

## 🎯 Ringkasan Sistem

### Fitur Utama

1. **Autentikasi & Autorisasi**
   - Login untuk 3 role: Admin, Guru BK, Siswa
   - Session-based authentication
   - Password hashing dengan bcrypt

2. **Landing Page**
   - Informasi sistem BK
   - Daftar guru BK dengan foto
   - Navigasi ke halaman login

3. **Dashboard Admin**
   - Statistik sistem (total siswa, guru, konseling)
   - CRUD Data Siswa
   - CRUD Data Guru BK
   - Laporan semua konseling

4. **Dashboard Guru BK**
   - Statistik permintaan konseling
   - Manajemen permintaan (terima/tolak)
   - Laporan konseling yang ditangani
   - Data siswa (read-only)

5. **Dashboard Siswa**
   - Statistik konseling pribadi
   - Pengajuan konseling baru
   - Riwayat konseling
   - Profil siswa

6. **Manajemen Jadwal**
   - Jadwal default: Senin-Sabtu, 06:30-19:30
   - Cek ketersediaan jadwal
   - Pilih jadwal kosong untuk konseling

---

## 🏗️ Arsitektur Sistem

### Teknologi Stack
- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js Server Actions, API Routes
- **Database**: MySQL/MariaDB
- **Authentication**: Session cookies
- **Password Hashing**: bcryptjs

### Struktur Database

**Tabel Utama**:
1. `users` - Data user (admin, guru, siswa)
2. `siswa_profile` - Profil lengkap siswa
3. `guru_profile` - Profil lengkap guru BK
4. `jadwal_guru` - Jadwal konseling guru
5. `sesi_bk` - Sesi konsultasi
6. `riwayat_bk` - Catatan dan rekomendasi konseling
7. `notifications` - Notifikasi untuk user

---

## 📊 Alur Proses Utama

### 1. Flow Pengajuan Konseling

```
Siswa Login
    ↓
Dashboard Siswa
    ↓
Menu Konsultasi
    ↓
Pilih Guru BK
    ↓
Pilih Jadwal (hari & jam)
    ↓
Isi Form (keluhan, jenis konseling)
    ↓
Submit Permintaan → Status: "menunggu"
    ↓
Guru melihat permintaan
    ↓
Guru: Terima/Tolak
    ↓
Status: "diterima" / "ditolak"
    ↓
Konseling berlangsung → Status: "progress"
    ↓
Konseling selesai → Status: "selesai"
    ↓
Guru membuat catatan & rekomendasi
    ↓
Riwayat konseling tersimpan
```

### 2. Flow Manajemen Data Admin

```
Admin Login
    ↓
Dashboard Admin
    ↓
Pilih Menu (Siswa/Guru)
    ↓
Tampilkan Daftar
    ↓
Aksi CRUD:
  - Create: Form tambah data
  - Read: Tampilkan daftar
  - Update: Form edit data
  - Delete: Soft delete (nonaktifkan)
    ↓
Simpan ke Database
    ↓
Auto-refresh UI (30 detik)
```

---

## 🔐 Kredensial Default

### Admin
- **Email**: `admin@smktb.sch.id`
- **Password**: `admintb25!`

### Guru BK
- **Email**: `heni.bk@smktb.sch.id`, `kasandra.bk@smktb.sch.id`, dll
- **Password**: `Smktb25!`

### Siswa
- **Login**: NISN (contoh: 242510044)
- **Password**: `Smktb25!`

---

## 📁 Struktur Folder

```
BK/
├── app/                      # Next.js App Router
│   ├── admin/               # Halaman admin
│   ├── guru/                # Halaman guru
│   ├── siswa/               # Halaman siswa
│   ├── login/               # Halaman login
│   └── page.tsx             # Landing page
├── components/              # Komponen React
├── lib/                     # Library & utilities
│   ├── actions.js          # Server actions (CRUD)
│   ├── db.js               # Database connection
│   └── session-utils.js    # Session management
├── database/                # Script database
│   ├── create-tables.sql   # Schema database
│   ├── guru/               # Script management guru
│   └── jadwal/             # Script management jadwal
├── public/                  # Static files
│   └── images/             # Gambar (foto guru, dll)
├── DOKUMEN_SRS.md          # Dokumentasi SRS
├── DIAGRAM_DFD.md          # Dokumentasi DFD
└── DOKUMENTASI.md          # File ini
```

---

## 🎨 Fitur UI/UX

- **Design Modern**: Gradient colors, card-based layout
- **Responsive**: Mobile, tablet, desktop friendly
- **Auto-refresh**: Data refresh setiap 30 detik di dashboard
- **Real-time Feedback**: Alert dan notifikasi untuk setiap aksi
- **Search & Filter**: Pencarian dan filter data
- **Statistics**: Dashboard dengan statistik visual

---

## ✅ Status Fitur

### ✅ Sudah Implementasi

- [x] Landing Page dengan daftar guru
- [x] Autentikasi & autorisasi (3 role)
- [x] Dashboard Admin (statistik, CRUD siswa, CRUD guru, laporan)
- [x] Dashboard Guru (statistik, manajemen permintaan, laporan)
- [x] Dashboard Siswa (statistik, pengajuan konseling, riwayat)
- [x] Manajemen jadwal
- [x] Auto-refresh data
- [x] Responsive design

### 🔄 Bisa Dikembangkan

- [ ] Sistem notifikasi real-time
- [ ] Export laporan ke PDF/Excel
- [ ] Chat/messaging antara siswa dan guru
- [ ] Kalender konseling yang lebih interaktif
- [ ] Multi-language support

---

## 📝 Catatan Penting

1. **Database**: Pastikan MySQL sudah terinstall dan database `db_bk` sudah dibuat
2. **Environment**: Pastikan Node.js 18+ sudah terinstall
3. **Dependencies**: Install dengan `npm install` sebelum menjalankan aplikasi
4. **Security**: Jangan commit password atau kredensial ke repository publik
5. **Backup**: Lakukan backup database secara berkala

---

## 📞 Kontak & Support

Untuk pertanyaan atau masalah terkait sistem, silakan hubungi tim pengembang.

---

**Versi Dokumentasi**: 1.0  
**Tanggal Update**: 2024  
**Status**: Production Ready ✅

