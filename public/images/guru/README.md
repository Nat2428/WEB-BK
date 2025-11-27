# Folder Foto Guru BK

Simpan foto-foto guru BK di folder ini untuk ditampilkan di halaman beranda.

**PENTING**: Pastikan folder ini sudah dibuat di `public/images/guru/` sebelum menyimpan foto.

## Cara Menambahkan Foto Guru

### 0. Buat Folder (Jika Belum Ada)

Jika folder `public/images/guru/` belum ada, buat folder tersebut terlebih dahulu:
- Windows: Buat folder baru di `public/images/` dengan nama `guru`
- Atau jalankan di terminal: `mkdir public/images/guru` (di folder root project)

### 1. Siapkan Foto

- Format: JPG, JPEG, PNG, atau WEBP
- Ukuran disarankan: 400x400 piksel atau lebih besar (square/aspect ratio 1:1)
- Ukuran file: Maksimal 2 MB per foto

### 2. Simpan Foto dengan Nama yang Sesuai

Simpan foto dengan nama berikut (sesuai email guru):

- **heni.jpg** atau **heni.png** → untuk Heni Siswati, S.Psi (heni.bk@smktb.sch.id)
- **kasandra.jpg** atau **kasandra.png** → untuk Kasandra Fitriani. N, S.Pd (kasandra.bk@smktb.sch.id)
- **nadya.jpg** atau **nadya.png** → untuk Nadya Afriliani Ariesta, S.Pd (nadya.bk@smktb.sch.id)
- **ika.jpg** atau **ika.png** → untuk Ika Rafika, S.Pd (ika.bk@smktb.sch.id)

### 3. Update Database

Setelah foto disimpan, jalankan script untuk mengupdate database:

```bash
node database/update-foto-guru.js
```

Script ini akan:
- Mencari foto di folder `public/images/guru/`
- Mengupdate field `avatar` di tabel `users` untuk setiap guru
- Menampilkan ringkasan hasil update

### 4. Refresh Halaman Beranda

Setelah script dijalankan, refresh halaman beranda. Foto guru akan otomatis muncul di carousel.

## Struktur File

```
public/
  images/
    guru/
      heni.jpg          ← Foto Heni Siswati
      kasandra.jpg      ← Foto Kasandra Fitriani
      nadya.jpg         ← Foto Nadya Afriliani
      ika.jpg           ← Foto Ika Rafika
```

## Catatan

- Jika foto tidak ditemukan, script akan menampilkan pesan warning
- Anda bisa menjalankan script berkali-kali untuk update foto
- Jika ingin mengganti foto, cukup ganti file dengan nama yang sama dan jalankan script lagi
- Path foto di database akan disimpan sebagai: `/images/guru/nama-file.jpg`

## Troubleshooting

**Foto tidak muncul di beranda?**
1. Pastikan file foto sudah disimpan di folder `public/images/guru/`
2. Pastikan nama file sesuai dengan mapping (heni.jpg, kasandra.jpg, dll)
3. Jalankan script `update-foto-guru.js` lagi
4. Clear cache browser dan refresh halaman

**Error saat menjalankan script?**
1. Pastikan folder `public/images/guru/` sudah ada
2. Pastikan file foto menggunakan format yang didukung (jpg, png, webp)
3. Cek apakah path database sudah benar di `lib/db.js`
