"use client";

import { useState } from "react";
import { User, Search, GraduationCap, Mail, Phone, MapPin } from "lucide-react";

export default function DataSiswaClient({ siswaList }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSiswa = siswaList.filter(
    (siswa) =>
      siswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      siswa.nisn.includes(searchTerm) ||
      siswa.kelas.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hitung statistik
  const totalSiswa = siswaList.length;
  const totalKelas = new Set(siswaList.map((s) => s.kelas).filter(Boolean)).size;
  const totalJurusan = new Set(siswaList.map((s) => s.jurusan).filter(Boolean)).size;

  return (
    <section className="space-y-8">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative z-10">
          <h1 className="mb-2 text-4xl font-extrabold md:text-5xl">Data Siswa</h1>
          <p className="text-lg text-green-50/90">
            Lihat dan kelola data siswa yang telah melakukan konsultasi.
          </p>
        </div>
      </header>

      {/* Search */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari siswa berdasarkan nama, NISN, atau kelas..."
          className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 text-slate-900 transition-all focus:border-green-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-green-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 p-3 text-white shadow-lg">
            <User className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
            Total Siswa
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {totalSiswa}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 text-white shadow-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
            Total Kelas
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {totalKelas}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-3 text-white shadow-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
            Total Jurusan
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {totalJurusan}
          </p>
        </div>
      </div>

      {/* Daftar Siswa */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
          Daftar Siswa ({filteredSiswa.length})
        </h2>
        {filteredSiswa.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <User className="mx-auto mb-4 h-12 w-12 text-slate-400" />
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
              {searchTerm ? "Tidak ada siswa yang ditemukan" : "Belum ada data siswa"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredSiswa.map((siswa) => (
              <div
                key={siswa.id}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-green-100/30 blur-3xl dark:bg-green-500/10"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-2xl font-bold text-white shadow-lg">
                      {siswa.nama.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {siswa.nama}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        NISN: {siswa.nisn}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <GraduationCap className="h-4 w-4" />
                      <span>{siswa.kelas}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <GraduationCap className="h-4 w-4" />
                      <span>{siswa.jurusan}</span>
                    </div>
                    {siswa.email !== "-" && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Mail className="h-4 w-4" />
                        <span>{siswa.email}</span>
                      </div>
                    )}
                    {siswa.noHp !== "-" && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Phone className="h-4 w-4" />
                        <span>{siswa.noHp}</span>
                      </div>
                    )}
                    {siswa.alamat !== "-" && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate">{siswa.alamat}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

