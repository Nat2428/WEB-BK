# Konfigurasi Database BK SMK Taruna Bhakti

## Setup Database

### 1. Buat Database (Otomatis)

Jalankan script untuk membuat database:

```bash
node database/check-db.js
```

Script ini akan:

- Mengecek apakah database `db_bk` sudah ada
- Membuat database jika belum ada
- Menampilkan tabel-tabel yang ada

### 2. Buat Tabel-Tabel

Setelah database dibuat, buat tabel-tabel dengan salah satu cara:

#### Cara A: Menggunakan File SQL (Recommended)

1. Buka MySQL Workbench
2. Buka file `database/create-tables.sql`
3. Jalankan semua query di file tersebut
4. Atau copy-paste isi file ke MySQL Workbench dan execute

#### Cara B: Manual di MySQL Workbench

Buat tabel-tabel berikut secara manual:

- users
- siswa_profile
- guru_profile
- jadwal_guru
- sesi_bk
- riwayat_bk
- notifications

(Struktur lengkap ada di file `database/create-tables.sql`)

## Konfigurasi Koneksi

Edit file `lib/db.js` untuk mengubah konfigurasi koneksi database jika diperlukan:

```javascript
host: "localhost",
user: "root",
password: "", // Isi password MySQL Anda jika ada
database: "db_bk",
```

**Penting**: Jika MySQL Anda menggunakan password, edit field `password` di `lib/db.js`!

## Struktur Database

Pastikan database `db_bk` memiliki tabel-tabel berikut:

### Tabel Utama:

1. **users** - Tabel user (siswa, guru, admin)
2. **siswa_profile** - Profil lengkap siswa
3. **guru_profile** - Profil lengkap guru BK
4. **jadwal_guru** - Jadwal konsultasi guru
5. **sesi_bk** - Sesi konsultasi BK
6. **riwayat_bk** - Riwayat dan catatan konsultasi
7. **notifications** - Notifikasi untuk user

## Kredensial Login

### Login Admin:

- **Email**: `admin@smktb.sch.id`
- **Password**: `admintb25!`

**Setup Admin:**

```bash
node database/setup-admin.js
```

Script ini akan membuat atau mengupdate akun admin dengan email dan password di atas.

### Login Normal (Password Harus Benar):

- **Siswa**: Harus menggunakan NISN (USER dari tabel) dan password yang benar
  - Password default untuk kelas XI RPL 1: `Smktb25!`
  - Login dengan NISN sesuai USER di tabel (contoh: 242510044, 242510045, dll)
- **Guru BK**: Login dengan email dan password yang benar
  - Email: heni.bk@smktb.sch.id, kasandra.bk@smktb.sch.id, nadya.bk@smktb.sch.id, atau ika.bk@smktb.sch.id
  - Password default: `Smktb25!`

## Import Data Siswa

### Import Data Kelas XI RPL 1:

Jika Anda punya data siswa dari tabel, gunakan script import:

```bash
node database/import-siswa.js
```

Script ini akan:

- Mengimport semua siswa dari kelas XI RPL 1 (35 siswa)
- Menggunakan password: `Smktb25!` (sesuai data)
- Membuat user dan profil siswa secara otomatis
- Melewati siswa yang sudah ada (tidak duplikat)

**Cara Login Setelah Import:**

- NISN: Gunakan USER dari tabel (contoh: 242510044)
- Password: `Smktb25!`

## Management Guru BK

Semua script untuk management guru BK tersedia di folder `database/guru/`:

```bash
# Cek data guru
node database/guru/manage.js check

# Cek foto guru
node database/guru/manage.js check-foto

# Update foto guru di database
node database/guru/manage.js update-foto

# Hapus guru generic/demo
node database/guru/manage.js cleanup

# Import 4 guru BK default
node database/guru/manage.js import

# Generate jadwal untuk semua guru
node database/guru/manage.js generate-jadwal
```

### Import Akun Guru BK

Import 4 akun guru default (password: `Smktb25!`):

```bash
node database/guru/manage.js import
```

Akun yang dibuat:
- **Heni Siswati, S.Psi** - heni.bk@smktb.sch.id
- **Kasandra Fitriani. N, S.Pd** - kasandra.bk@smktb.sch.id
- **Nadya Afriliani Ariesta, S.Pd** - nadya.bk@smktb.sch.id
- **Ika Rafika, S.Pd** - ika.bk@smktb.sch.id

### Hapus Guru Generic/Demo

**⚠️ PERINGATAN**: Script ini akan menghapus SEMUA data guru generic/demo dari database!

```bash
node database/guru/manage.js cleanup
```

### Update Foto Guru

1. Simpan foto di `public/images/guru/` atau `public/images/` dengan nama:
   - `heni.jpg`, `kasandra.jpg`, `nadya.jpg`, `ika.jpg`

2. Jalankan script:
   ```bash
   node database/guru/manage.js update-foto
   ```

## Management Jadwal

Script untuk management jadwal tersedia di folder `database/jadwal/`:

```bash
# Cek jadwal duplikat
node database/jadwal/manage.js check

# Hapus jadwal duplikat
node database/jadwal/manage.js cleanup

# Generate jadwal untuk semua guru
node database/jadwal/manage.js generate
```

## Membuat User Siswa Baru

### Menggunakan Fungsi Register:

Gunakan fungsi `registerSiswa` yang sudah ada di `lib/actions.js` melalui form registrasi di aplikasi.

### Insert Manual ke Database:

Jika ingin insert manual, pastikan password di-hash dengan bcrypt:

```sql
-- Hash password dengan bcrypt (contoh: password "Smktb25!")
INSERT INTO users (nisn, username, email, password, role) VALUES
('1234567890', 'Nama Siswa', 'siswa@email.com', '$2a$10$...', 'siswa');

-- Insert profil siswa
INSERT INTO siswa_profile (user_id, nama_siswa, kelas, jurusan, alamat, no_hp) VALUES
(LAST_INSERT_ID(), 'Nama Siswa', 'XI RPL 1', 'Rekayasa Perangkat Lunak', 'Alamat', '081234567890');
```

## Troubleshooting

### Error: "Unknown database 'db_bk'"

1. Pastikan database sudah dibuat di MySQL Workbench
2. Atau jalankan: `node database/check-db.js` untuk membuat database otomatis
3. Cek nama database apakah benar `db_bk` (case sensitive)

### Error: "Access denied"

1. Cek username dan password MySQL di `lib/db.js`
2. Pastikan user MySQL memiliki akses ke database

### Error: "Connection refused"

1. Pastikan MySQL/MariaDB service sudah running
2. Cek apakah port MySQL (3306) tidak terblokir
