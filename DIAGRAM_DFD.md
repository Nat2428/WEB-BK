# DATA FLOW DIAGRAM (DFD)
## Sistem Bimbingan Konseling (BK) SMK Taruna Bhakti

---

## DFD LEVEL 0 (Context Diagram)

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│                    SISTEM BK SMK TARUNA BHAKTI                │
│                                                               │
│  ┌──────────┐         ┌──────────┐         ┌──────────┐    │
│  │  Admin   │         │  Guru    │         │  Siswa   │    │
│  │          │         │   BK     │         │          │    │
│  └────┬─────┘         └────┬─────┘         └────┬─────┘    │
│       │                    │                    │           │
│       │ Data Admin         │ Data Guru          │ Data      │
│       │ Request            │ Request            │ Siswa     │
│       │                    │                    │ Request   │
│       ▼                    ▼                    ▼           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                                      │  │
│  │              PROSES SISTEM BK                        │  │
│  │                                                      │  │
│  │  • Autentikasi                                      │  │
│  │  • Manajemen Data                                   │  │
│  │  • Manajemen Konseling                              │  │
│  │  • Laporan                                          │  │
│  │                                                      │  │
│  └──────────────┬─────────────────────────────────────┘  │
│                 │                                         │
│                 │ Query/Update Data                       │
│                 │                                         │
│                 ▼                                         │
│         ┌──────────────┐                                  │
│         │   DATABASE   │                                  │
│         │     MySQL    │                                  │
│         └──────────────┘                                  │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**Arus Data**:
1. Admin → Sistem: Data Admin Request (login, CRUD data)
2. Guru BK → Sistem: Data Guru Request (login, manage konseling)
3. Siswa → Sistem: Data Siswa Request (login, ajukan konseling)
4. Sistem → Database: Query/Update Data
5. Database → Sistem: Response Data

---

## DFD LEVEL 1 (Top Level)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         SISTEM BK SMK TARUNA BHAKTI                        │
│                                                                            │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                            │
│  │  Admin   │    │  Guru    │    │  Siswa   │                            │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘                            │
│       │               │               │                                    │
│       │               │               │                                    │
│       ▼               ▼               ▼                                    │
│  ┌────────────────────────────────────────────────────────┐              │
│  │  P1: PROSES AUTENTIKASI                                │              │
│  │  - Validasi kredensial                                 │              │
│  │  - Generate session                                    │              │
│  └───────────┬────────────────────────────────────────────┘              │
│              │                                                           │
│              ▼                                                           │
│  ┌────────────────────────────────────────────────────────┐              │
│  │  P2: MANAJEMEN DATA ADMIN                              │              │
│  │  - CRUD Siswa                                          │              │
│  │  - CRUD Guru                                           │              │
│  │  - Lihat Laporan                                       │              │
│  └───────────┬────────────────────────────────────────────┘              │
│              │                                                           │
│              ▼                                                           │
│  ┌────────────────────────────────────────────────────────┐              │
│  │  P3: MANAJEMEN KONSULTASI (GURU)                       │              │
│  │  - Lihat permintaan                                    │              │
│  │  - Terima/Tolak permintaan                             │              │
│  │  - Update status konseling                             │              │
│  │  - Buat catatan konseling                              │              │
│  └───────────┬────────────────────────────────────────────┘              │
│              │                                                           │
│              ▼                                                           │
│  ┌────────────────────────────────────────────────────────┐              │
│  │  P4: PENGJUAN KONSULTASI (SISWA)                       │              │
│  │  - Pilih guru                                          │              │
│  │  - Pilih jadwal                                        │              │
│  │  - Isi form keluhan                                    │              │
│  │  - Submit permintaan                                   │              │
│  └───────────┬────────────────────────────────────────────┘              │
│              │                                                           │
│              ▼                                                           │
│  ┌────────────────────────────────────────────────────────┐              │
│  │  P5: MANAJEMEN JADWAL                                  │              │
│  │  - Tampilkan jadwal guru                               │              │
│  │  - Cek jadwal kosong                                   │              │
│  │  - Update ketersediaan jadwal                          │              │
│  └───────────┬────────────────────────────────────────────┘              │
│              │                                                           │
│              ▼                                                           │
│  ┌────────────────────────────────────────────────────────┐              │
│  │  P6: GENERATE LAPORAN                                  │              │
│  │  - Statistik konseling                                 │              │
│  │  - Laporan per periode                                 │              │
│  │  - Export data                                         │              │
│  └───────────┬────────────────────────────────────────────┘              │
│              │                                                           │
│              ▼                                                           │
│         ┌─────────────────┐                                              │
│         │  DATABASE       │                                              │
│         │  - users        │                                              │
│         │  - siswa_profile│                                              │
│         │  - guru_profile │                                              │
│         │  - jadwal_guru  │                                              │
│         │  - sesi_bk      │                                              │
│         │  - riwayat_bk   │                                              │
│         │  - notifications│                                              │
│         └─────────────────┘                                              │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

**Proses Utama**:
1. **P1: PROSES AUTENTIKASI** - Login dan validasi user
2. **P2: MANAJEMEN DATA ADMIN** - CRUD siswa dan guru
3. **P3: MANAJEMEN KONSULTASI (GURU)** - Kelola permintaan konseling
4. **P4: PENGAJUAN KONSULTASI (SISWA)** - Ajukan permintaan konseling
5. **P5: MANAJEMEN JADWAL** - Kelola jadwal konseling
6. **P6: GENERATE LAPORAN** - Buat laporan dan statistik

---

## DFD LEVEL 2 - PROSES AUTENTIKASI (P1)

```
┌─────────────────────────────────────────────────────────────────┐
│                    P1: PROSES AUTENTIKASI                        │
│                                                                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │  Admin   │    │  Guru    │    │  Siswa   │                  │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘                  │
│       │               │               │                          │
│  Login Info    Login Info      Login Info (NISN)                │
│       │               │               │                          │
│       └───────────────┼───────────────┘                          │
│                       ▼                                          │
│              ┌──────────────────┐                                │
│              │ 1.1 Validasi     │                                │
│              │    Kredensial    │                                │
│              └────────┬─────────┘                                │
│                       │                                          │
│                       ▼                                          │
│              ┌──────────────────┐                                │
│              │ 1.2 Cek User     │                                │
│              │    di Database   │                                │
│              └────────┬─────────┘                                │
│                       │                                          │
│                       ▼                                          │
│              ┌──────────────────┐                                │
│              │ 1.3 Verifikasi   │                                │
│              │    Password      │                                │
│              └────────┬─────────┘                                │
│                       │                                          │
│                       ▼                                          │
│              ┌──────────────────┐                                │
│              │ 1.4 Generate     │                                │
│              │    Session       │                                │
│              └────────┬─────────┘                                │
│                       │                                          │
│                       ▼                                          │
│         ┌─────────────────────────┐                              │
│         │ D1: USER DATA           │                              │
│         │ (users table)           │                              │
│         └─────────────────────────┘                              │
│                                                                   │
│  Output: Redirect ke Dashboard sesuai Role                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Data Store**: D1: USER DATA

**Arus Data**:
- Login Info → Validasi Kredensial
- Query User → Database (D1)
- Valid Password → Generate Session
- Session → Redirect Dashboard

---

## DFD LEVEL 2 - MANAJEMEN DATA ADMIN (P2)

```
┌─────────────────────────────────────────────────────────────────┐
│                  P2: MANAJEMEN DATA ADMIN                        │
│                                                                   │
│  ┌──────────┐                                                    │
│  │  Admin   │                                                    │
│  └────┬─────┘                                                    │
│       │                                                          │
│       │ Data Siswa/Guru Request                                 │
│       ▼                                                          │
│  ┌──────────────────────────────────────────┐                   │
│  │ 2.1 Tampilkan Daftar                     │                   │
│  │     (Siswa/Guru)                         │                   │
│  └───────────┬──────────────────────────────┘                   │
│              │                                                  │
│              ▼                                                  │
│  ┌──────────────────────────────────────────┐                   │
│  │ 2.2 CRUD Data Siswa                      │                   │
│  │     - Create                             │                   │
│  │     - Read                               │                   │
│  │     - Update                             │                   │
│  │     - Delete (Soft)                      │                   │
│  └───────────┬──────────────────────────────┘                   │
│              │                                                  │
│              ▼                                                  │
│  ┌──────────────────────────────────────────┐                   │
│  │ 2.3 CRUD Data Guru                       │                   │
│  │     - Create                             │                   │
│  │     - Read                               │                   │
│  │     - Update                             │                   │
│  │     - Delete (Soft)                      │                   │
│  └───────────┬──────────────────────────────┘                   │
│              │                                                  │
│              ▼                                                  │
│  ┌──────────────────────────────────────────┐                   │
│  │ 2.4 Generate Laporan                     │                   │
│  │     - Statistik Sistem                   │                   │
│  │     - Laporan Konseling                  │                   │
│  └───────────┬──────────────────────────────┘                   │
│              │                                                  │
│              ▼                                                  │
│  ┌────────────────────┐  ┌────────────────────┐               │
│  │ D2: SISWA DATA     │  │ D3: GURU DATA      │               │
│  │ - users            │  │ - users            │               │
│  │ - siswa_profile    │  │ - guru_profile     │               │
│  └────────────────────┘  └────────────────────┘               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Data Store**: 
- D2: SISWA DATA
- D3: GURU DATA

**Arus Data**:
- Data Request → Tampilkan Daftar
- Form Data → CRUD Operations
- Query/Update → Database (D2, D3)
- Response → Tampilkan Hasil

---

## DFD LEVEL 2 - MANAJEMEN KONSULTASI GURU (P3)

```
┌─────────────────────────────────────────────────────────────────┐
│              P3: MANAJEMEN KONSULTASI (GURU)                     │
│                                                                   │
│  ┌──────────┐                                                    │
│  │  Guru    │                                                    │
│  │   BK     │                                                    │
│  └────┬─────┘                                                    │
│       │                                                          │
│       │ Request Permintaan                                      │
│       ▼                                                          │
│  ┌──────────────────────────────────────────┐                   │
│  │ 3.1 Tampilkan Permintaan Konseling       │                   │
│  │     - Filter berdasarkan status          │                   │
│  └───────────┬──────────────────────────────┘                   │
│              │                                                  │
│              ▼                                                  │
│  ┌──────────────────────────────────────────┐                   │
│  │ 3.2 Review Detail Permintaan             │                   │
│  │     - Nama siswa                         │                   │
│  │     - Keluhan                            │                   │
│  │     - Tanggal & jam                      │                   │
│  └───────────┬──────────────────────────────┘                   │
│              │                                                  │
│              ▼                                                  │
│  ┌──────────────────────────────────────────┐                   │
│  │ 3.3 Proses Permintaan                    │                   │
│  │     - Terima (status: diterima)          │                   │
│  │     - Tolak (status: ditolak)            │                   │
│  └───────────┬──────────────────────────────┘                   │
│              │                                                  │
│              ▼                                                  │
│  ┌──────────────────────────────────────────┐                   │
│  │ 3.4 Update Status Konseling              │                   │
│  │     - progress                           │                   │
│  │     - selesai                            │                   │
│  └───────────┬──────────────────────────────┘                   │
│              │                                                  │
│              ▼                                                  │
│  ┌──────────────────────────────────────────┐                   │
│  │ 3.5 Buat Catatan Konseling               │                   │
│  │     - Catatan guru                       │                   │
│  │     - Rekomendasi                        │                   │
│  └───────────┬──────────────────────────────┘                   │
│              │                                                  │
│              ▼                                                  │
│  ┌────────────────────┐  ┌────────────────────┐               │
│  │ D4: SESI BK        │  │ D5: RIWAYAT BK     │               │
│  │ - sesi_bk table    │  │ - riwayat_bk table │               │
│  └────────────────────┘  └────────────────────┘               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Data Store**:
- D4: SESI BK
- D5: RIWAYAT BK

**Arus Data**:
- Request → Tampilkan Permintaan
- Query → Database (D4)
- Aksi Terima/Tolak → Update Status (D4)
- Catatan → Insert/Update (D5)

---

## DFD LEVEL 2 - PENGAJUAN KONSULTASI SISWA (P4)

```
┌─────────────────────────────────────────────────────────────────┐
│              P4: PENGAJUAN KONSULTASI (SISWA)                    │
│                                                                   │
│  ┌──────────┐                                                    │
│  │  Siswa   │                                                    │
│  └────┬─────┘                                                    │
│       │                                                          │
│       │ Request Form Konseling                                  │
│       ▼                                                          │
│  ┌──────────────────────────────────────────┐                   │
│  │ 4.1 Tampilkan Daftar Guru BK             │                   │
│  │     - Foto & nama guru                    │                   │
│  └───────────┬──────────────────────────────┘                   │
│              │                                                  │
│              ▼                                                  │
│  ┌──────────────────────────────────────────┐                   │
│  │ 4.2 Pilih Guru BK                        │                   │
│  └───────────┬──────────────────────────────┘                   │
│              │                                                  │
│              ▼                                                  │
│  ┌──────────────────────────────────────────┐                   │
│  │ 4.3 Tampilkan Jadwal Kosong              │                   │
│  │     - Cek ketersediaan jadwal            │                   │
│  └───────────┬──────────────────────────────┘                   │
│              │                                                  │
│              ▼                                                  │
│  ┌──────────────────────────────────────────┐                   │
│  │ 4.4 Pilih Jadwal                         │                   │
│  │     - Hari                                │                   │
│  │     - Jam                                 │                   │
│  └───────────┬──────────────────────────────┘                   │
│              │                                                  │
│              ▼                                                  │
│  ┌──────────────────────────────────────────┐                   │
│  │ 4.5 Isi Form Konseling                   │                   │
│  │     - Keluhan                            │                   │
│  │     - Jenis konseling                    │                   │
│  └───────────┬──────────────────────────────┘                   │
│              │                                                  │
│              ▼                                                  │
│  ┌──────────────────────────────────────────┐                   │
│  │ 4.6 Submit Permintaan                    │                   │
│  │     - Validasi input                     │                   │
│  │     - Simpan ke database                 │                   │
│  └───────────┬──────────────────────────────┘                   │
│              │                                                  │
│              ▼                                                  │
│  ┌────────────────────┐  ┌────────────────────┐               │
│  │ D3: GURU DATA      │  │ D6: JADWAL GURU    │               │
│  │                    │  │ - jadwal_guru      │               │
│  └────────────────────┘  └────────────────────┘               │
│              │                                                  │
│              ▼                                                  │
│  ┌────────────────────┐                                        │
│  │ D4: SESI BK        │                                        │
│  │ (Insert new)       │                                        │
│  └────────────────────┘                                        │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Data Store**:
- D3: GURU DATA
- D6: JADWAL GURU
- D4: SESI BK

**Arus Data**:
- Request → Tampilkan Daftar Guru
- Query → Database (D3, D6)
- Form Data → Validasi → Submit
- Insert → Database (D4)
- Response → Status "menunggu"

---

## DFD LEVEL 2 - MANAJEMEN JADWAL (P5)

```
┌─────────────────────────────────────────────────────────────────┐
│                  P5: MANAJEMEN JADWAL                            │
│                                                                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐                  │
│  │  Admin   │    │  Guru    │    │  Siswa   │                  │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘                  │
│       │               │               │                          │
│       │ Request Jadwal│ Request Jadwal│ Request Jadwal Kosong   │
│       └───────────────┼───────────────┘                          │
│                       │                                          │
│                       ▼                                          │
│              ┌──────────────────┐                                │
│              │ 5.1 Ambil        │                                │
│              │    Jadwal Guru   │                                │
│              └────────┬─────────┘                                │
│                       │                                          │
│                       ▼                                          │
│              ┌──────────────────┐                                │
│              │ 5.2 Cek          │                                │
│              │    Ketersediaan  │                                │
│              │    (Jadwal       │                                │
│              │     kosong)      │                                │
│              └────────┬─────────┘                                │
│                       │                                          │
│                       ▼                                          │
│              ┌──────────────────┐                                │
│              │ 5.3 Tampilkan    │                                │
│              │    Jadwal        │                                │
│              └────────┬─────────┘                                │
│                       │                                          │
│                       ▼                                          │
│         ┌─────────────────────────┐                              │
│         │ D6: JADWAL GURU         │                              │
│         │ - jadwal_guru table     │                              │
│         └─────────────────────────┘                              │
│                                                                   │
│         ┌─────────────────────────┐                              │
│         │ D4: SESI BK             │                              │
│         │ (cek jadwal terpakai)   │                              │
│         └─────────────────────────┘                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Data Store**:
- D6: JADWAL GURU
- D4: SESI BK

**Arus Data**:
- Request → Ambil Jadwal (D6)
- Cek Ketersediaan → Query (D4)
- Jadwal Kosong → Tampilkan

---

## DFD LEVEL 2 - GENERATE LAPORAN (P6)

```
┌─────────────────────────────────────────────────────────────────┐
│                  P6: GENERATE LAPORAN                            │
│                                                                   │
│  ┌──────────┐    ┌──────────┐                                   │
│  │  Admin   │    │  Guru    │                                   │
│  └────┬─────┘    └────┬─────┘                                   │
│       │               │                                          │
│       │ Request Laporan│ Request Laporan                         │
│       └───────────────┘                                          │
│                       │                                          │
│                       ▼                                          │
│              ┌──────────────────┐                                │
│              │ 6.1 Ambil Data   │                                │
│              │    Konseling     │                                │
│              └────────┬─────────┘                                │
│                       │                                          │
│                       ▼                                          │
│              ┌──────────────────┐                                │
│              │ 6.2 Hitung       │                                │
│              │    Statistik     │                                │
│              │    - Total       │                                │
│              │    - Per Status  │                                │
│              │    - Per Periode │                                │
│              └────────┬─────────┘                                │
│                       │                                          │
│                       ▼                                          │
│              ┌──────────────────┐                                │
│              │ 6.3 Format       │                                │
│              │    Laporan       │                                │
│              └────────┬─────────┘                                │
│                       │                                          │
│                       ▼                                          │
│         ┌─────────────────────────┐                              │
│         │ D4: SESI BK             │                              │
│         │                         │                              │
│         │ D5: RIWAYAT BK          │                              │
│         └─────────────────────────┘                              │
│                                                                   │
│  Output: Laporan & Statistik                                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Data Store**:
- D4: SESI BK
- D5: RIWAYAT BK

**Arus Data**:
- Request → Query Data (D4, D5)
- Hitung Statistik → Format Laporan
- Output → Tampilkan Laporan

---

## DATA DICTIONARY

### D1: USER DATA
- **Tabel**: users
- **Field**: id, nisn, username, email, password, role, avatar, is_active, last_login, created_at, updated_at

### D2: SISWA DATA
- **Tabel**: users, siswa_profile
- **Field**: Semua field dari users + nama_siswa, kelas, jurusan, alamat, no_hp

### D3: GURU DATA
- **Tabel**: users, guru_profile
- **Field**: Semua field dari users + nama_guru, mata_keahlian, no_wa

### D4: SESI BK
- **Tabel**: sesi_bk
- **Field**: id, siswa_id, guru_id, jadwal_id, tanggal_konsultasi, jam_konsultasi, keluhan, jenis_konseling, status, tanggal_pengajuan, tanggal_respon

### D5: RIWAYAT BK
- **Tabel**: riwayat_bk
- **Field**: id, sesi_id, catatan_guru, rekomendasi, created_at, updated_at

### D6: JADWAL GURU
- **Tabel**: jadwal_guru
- **Field**: id, guru_id, hari, jam_mulai, jam_selesai, is_active

---

**Dokumen ini menjelaskan alur data dalam Sistem Bimbingan Konseling SMK Taruna Bhakti menggunakan Data Flow Diagram (DFD).**

**Versi**: 1.0  
**Tanggal**: 2024  
**Pembuat**: Tim Pengembang BK System

