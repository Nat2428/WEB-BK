"use client";

import { BookOpen, Calendar, Clock, CheckCircle, MessageSquare, FileText } from "lucide-react";

export default function RiwayatClient({ user, riwayatList }) {
  return (
    <section className="space-y-8">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative z-10">
          <h1 className="mb-2 text-4xl font-extrabold md:text-5xl">Riwayat Konsultasi</h1>
          <p className="text-lg text-blue-50">
            Lihat riwayat konsultasi dan catatan dari guru BK.
          </p>
        </div>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 text-white shadow-lg">
            <BookOpen className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
            Total Konsultasi
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {riwayatList.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-3 text-white shadow-lg">
            <CheckCircle className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
            Selesai
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {riwayatList.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-3 text-white shadow-lg">
            <MessageSquare className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
            Catatan Tersedia
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {riwayatList.filter((r) => r.catatan_guru).length}
          </p>
        </div>
      </div>

      {/* Daftar Riwayat */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
          Daftar Riwayat Konsultasi
        </h2>
        {riwayatList.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              Belum ada riwayat konsultasi. Riwayat akan muncul setelah konsultasi selesai dan guru memberikan catatan.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {riwayatList.map((riwayat) => (
              <div
                key={riwayat.id}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-100/30 blur-3xl dark:bg-blue-500/10"></div>
                <div className="relative z-10">
                  {/* Header */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white shadow-lg">
                        {(riwayat.nama_guru || riwayat.guru_username || "Guru BK").charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {riwayat.nama_guru || riwayat.guru_username || "Guru BK"}
                        </h3>
                        <div className="mt-1 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{riwayat.tanggal_konsultasi}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{riwayat.jam_konsultasi}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-500/20 dark:text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      Selesai
                    </div>
                  </div>

                  {/* Keluhan */}
                  <div className="mb-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <MessageSquare className="h-4 w-4" />
                      Keluhan
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{riwayat.keluhan}</p>
                  </div>

                  {/* Catatan Guru */}
                  {riwayat.catatan_guru && (
                    <div className="mb-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-500/10">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-400">
                        <FileText className="h-4 w-4" />
                        Catatan Guru
                      </div>
                      <p className="text-blue-600 dark:text-blue-300">{riwayat.catatan_guru}</p>
                    </div>
                  )}

                  {/* Rekomendasi */}
                  {riwayat.rekomendasi && (
                    <div className="rounded-lg bg-green-50 p-4 dark:bg-green-500/10">
                      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        Rekomendasi
                      </div>
                      <p className="text-green-600 dark:text-green-300">{riwayat.rekomendasi}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

