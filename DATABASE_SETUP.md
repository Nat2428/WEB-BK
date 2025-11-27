# Setup Database dan Koneksi ke Halaman

## 📋 Langkah Setup Database

### 1. Install MySQL/MariaDB
Pastikan MySQL sudah terinstall di sistem Anda.

### 2. Setup Database
Jalankan salah satu cara berikut:

#### Cara Otomatis (Recommended):
```bash
node database/setup.js
```

#### Cara Manual:
```bash
mysql -u root -p < database/schema.sql
```

### 3. Konfigurasi Database
Edit file `lib/db.js` jika perlu mengubah konfigurasi:
```javascript
host: "localhost",
user: "root",
password: "", // Isi password MySQL Anda
database: "bk_smk",
```

## 🔗 Koneksi Halaman ke Database

Semua fungsi untuk mengambil data dari database sudah tersedia di `lib/actions.js`. Berikut cara menggunakannya:

### Untuk Halaman Siswa:

#### Dashboard Siswa (`app/siswa/page.js`):
```javascript
import { getStatistikSiswa, getKonsultasiBySiswa } from "../../lib/actions";
import { getCurrentUser } from "../../lib/session";

export default async function SiswaDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'siswa') {
    redirect('/login');
  }
  
  const stats = await getStatistikSiswa(user.id);
  const konsultasi = await getKonsultasiBySiswa(user.id);
  
  // Gunakan data dari database
  return (
    // ... JSX dengan data stats dan konsultasi
  );
}
```

#### Konsultasi (`app/siswa/konsultasi/page.js`):
```javascript
import { getAllGuru, getKonsultasiBySiswa, createKonsultasi } from "../../lib/actions";
import { getCurrentUser } from "../../lib/session";

// Untuk form submit:
const handleSubmit = async (formData) => {
  'use server';
  const user = await getCurrentUser();
  await createKonsultasi(user.id, formData);
  revalidatePath('/siswa/konsultasi');
};
```

### Untuk Halaman Guru:

#### Permintaan (`app/guru/permintaan/page.js`):
```javascript
import { getPermintaanByGuru, updateStatusSesiBK } from "../../lib/actions";
import { getCurrentUser } from "../../lib/session";

export default async function PermintaanPage() {
  const user = await getCurrentUser();
  const permintaan = await getPermintaanByGuru(user.id);
  // ...
}
```

### Untuk Halaman Admin:

#### Data Siswa (`app/admin/siswa/page.js`):
```javascript
import { getAllSiswa, createOrUpdateSiswa, deleteSiswa } from "../../lib/actions";

export default async function DataSiswaAdminPage() {
  const siswa = await getAllSiswa();
  // ...
}
```

## 📝 Fungsi-Fungsi yang Tersedia

### Untuk Siswa:
- `getStatistikSiswa(siswaId)` - Ambil statistik konsultasi siswa
- `getKonsultasiBySiswa(siswaId)` - Ambil daftar konsultasi siswa
- `createKonsultasi(siswaId, formData)` - Buat konsultasi baru
- `getProfileSiswa(userId)` - Ambil profil siswa
- `updateProfileSiswa(userId, formData)` - Update profil siswa

### Untuk Guru:
- `getStatistikGuru(guruId)` - Ambil statistik permintaan guru
- `getPermintaanByGuru(guruId)` - Ambil daftar permintaan
- `updateStatusSesiBK(sesiId, status, guruId)` - Update status konsultasi
- `getAllSiswa()` - Ambil semua siswa
- `getLaporanBulanan(bulan, tahun)` - Ambil laporan bulanan

### Untuk Admin:
- `getStatistikAdmin()` - Ambil statistik admin
- `getAllSiswa()` - Ambil semua siswa
- `getAllGuruBK()` - Ambil semua guru
- `createOrUpdateSiswa(formData, siswaId)` - Create/Update siswa
- `createOrUpdateGuru(formData, guruId)` - Create/Update guru
- `deleteSiswa(siswaId)` - Hapus siswa (soft delete)
- `deleteGuru(guruId)` - Hapus guru (soft delete)
- `getLaporanBulanan(bulan, tahun)` - Ambil laporan bulanan

## 🔄 Cara Update Halaman

### Contoh: Update Dashboard Siswa

**Sebelum (dummy data):**
```javascript
const stats = [
  { label: "Total Konseling", value: "12", ... },
  // ...
];
```

**Sesudah (dari database):**
```javascript
'use server';
import { getStatistikSiswa } from "../../lib/actions";
import { getCurrentUser } from "../../lib/session";

export default async function SiswaDashboardPage() {
  const user = await getCurrentUser();
  const statsData = await getStatistikSiswa(user.id);
  
  const stats = [
    { label: "Total Konseling", value: statsData.total.toString(), ... },
    { label: "Disetujui", value: statsData.disetujui.toString(), ... },
    // ...
  ];
}
```

## ⚠️ Catatan Penting

1. **Server Components**: Halaman yang menggunakan database harus menjadi Server Component (tanpa "use client")
2. **Client Components**: Untuk form dan interaksi, gunakan Client Component terpisah
3. **Session Management**: Gunakan `getCurrentUser()` untuk mendapatkan user yang sedang login
4. **Error Handling**: Selalu handle error saat mengambil data dari database

## 🚀 Next Steps

1. Update semua halaman untuk menggunakan data dari database
2. Implementasi proper session management (NextAuth)
3. Tambahkan error handling yang lebih baik
4. Tambahkan loading states
5. Implementasi real-time updates jika diperlukan

