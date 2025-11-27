"use client";

import { useState } from "react";
import { FileText, Calendar, Download, Filter, BarChart3, TrendingUp } from "lucide-react";

export default function LaporanClient({ laporanBulanan, statsData }) {
  const [selectedBulan, setSelectedBulan] = useState("Semua");

  // Hitung total dari statistik
  const totalKonsultasi = statsData.total || 0;
  const totalDisetujui = statsData.disetujui || 0;
  const totalDitolak = statsData.ditolak || 0;
  const totalPending = statsData.pending || 0;

  const filteredLaporan =
    selectedBulan === "Semua"
      ? laporanBulanan
      : laporanBulanan.filter((l) => l.bulan === selectedBulan);

  const handleDownload = (bulan) => {
    // TODO: Implementasi download laporan
    alert(`Download laporan untuk ${bulan}`);
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative z-10">
          <h1 className="mb-2 text-4xl font-extrabold md:text-5xl">Laporan Konseling</h1>
          <p className="text-lg text-green-50/90">
            Lihat dan unduh laporan konseling per bulan.
          </p>
        </div>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 text-white shadow-lg">
            <FileText className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
            Total Konsultasi
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalKonsultasi}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-3 text-white shadow-lg">
            <TrendingUp className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
            Disetujui
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalDisetujui}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-red-500 to-red-600 p-3 text-white shadow-lg">
            <BarChart3 className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
            Ditolak
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalDitolak}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-3 text-white shadow-lg">
            <Calendar className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
            Pending
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalPending}</p>
        </div>
      </div>

      {/* Filter */}
      {laporanBulanan.length > 0 && (
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          <select
            value={selectedBulan}
            onChange={(e) => setSelectedBulan(e.target.value)}
            className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-900 transition-all focus:border-green-400 focus:outline-none focus:ring-4 focus:ring-green-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <option value="Semua">Semua Bulan</option>
            {laporanBulanan.map((l, idx) => (
              <option key={idx} value={l.bulan}>
                {l.bulan}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Daftar Laporan */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
          Laporan Per Bulan
        </h2>
        {filteredLaporan.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <FileText className="mx-auto mb-4 h-12 w-12 text-slate-400" />
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
              Belum ada laporan konseling
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Laporan akan muncul setelah ada konsultasi yang dilakukan
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLaporan.map((laporan, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-green-100/30 blur-3xl dark:bg-green-500/10"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {laporan.bulan}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Total {laporan.totalKonsultasi} konsultasi
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(laporan.bulan)}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                    >
                      <Download className="h-5 w-5" />
                      Unduh
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-500/10">
                      <p className="mb-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                        Total
                      </p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {laporan.totalKonsultasi}
                      </p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-4 dark:bg-green-500/10">
                      <p className="mb-1 text-sm font-medium text-green-600 dark:text-green-400">
                        Disetujui
                      </p>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {laporan.disetujui}
                      </p>
                    </div>
                    <div className="rounded-lg bg-red-50 p-4 dark:bg-red-500/10">
                      <p className="mb-1 text-sm font-medium text-red-600 dark:text-red-400">
                        Ditolak
                      </p>
                      <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                        {laporan.ditolak}
                      </p>
                    </div>
                    <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-500/10">
                      <p className="mb-1 text-sm font-medium text-orange-600 dark:text-orange-400">
                        Pending
                      </p>
                      <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                        {laporan.pending}
                      </p>
                    </div>
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

