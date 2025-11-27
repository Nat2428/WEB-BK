"use client";

import { useState, useEffect } from "react";
import { FileText, Calendar, Download, Filter, BarChart3, TrendingUp, Users, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { getLaporanAdmin } from "@/lib/actions";

export default function LaporanClient({ laporanList: initialLaporanList }) {
  const router = useRouter();
  const [laporanList, setLaporanList] = useState(initialLaporanList);
  const [selectedBulan, setSelectedBulan] = useState("Semua");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Auto-refresh setiap 30 detik
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // 30 detik

    return () => clearInterval(interval);
  }, []);

  // Update laporanList ketika initialLaporanList berubah
  useEffect(() => {
    setLaporanList(initialLaporanList);
  }, [initialLaporanList]);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const freshData = await getLaporanAdmin();
      setLaporanList(freshData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const totalKonsultasi = laporanList.reduce((sum, l) => sum + l.totalKonsultasi, 0);
  const totalSiswa = laporanList.reduce((sum, l) => sum + l.totalSiswa, 0);
  const totalDisetujui = laporanList.reduce((sum, l) => sum + l.disetujui, 0);
  const totalDitolak = laporanList.reduce((sum, l) => sum + l.ditolak, 0);
  const totalPending = laporanList.reduce((sum, l) => sum + l.pending, 0);

  const filteredLaporan =
    selectedBulan === "Semua"
      ? laporanList
      : laporanList.filter((l) => l.bulan === selectedBulan);

  const handleDownload = (laporan) => {
    // Buat konten laporan dalam format teks
    const content = `LAPORAN BULANAN BIMBINGAN KONSELING
SMK TARUNA BHAKTI
${laporan.bulan}

===========================================

STATISTIK KONSULTASI:
- Total Konsultasi: ${laporan.totalKonsultasi}
- Total Siswa: ${laporan.totalSiswa}
- Disetujui: ${laporan.disetujui}
- Ditolak: ${laporan.ditolak}
- Pending: ${laporan.pending}
- Progress: ${laporan.progress || 0}
- Selesai: ${laporan.selesai || 0}

===========================================

Tanggal Generate: ${new Date().toLocaleDateString("id-ID")}`;

    // Buat blob dan download
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Laporan_${laporan.bulan.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const bulanOptions = ["Semua", ...laporanList.map((l) => l.bulan)];

  return (
    <section className="space-y-8">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-700 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-extrabold md:text-5xl">Laporan Sistem</h1>
            <p className="text-lg text-indigo-50">Lihat dan unduh laporan sistem secara menyeluruh.</p>
          </div>
          <button
            onClick={refreshData}
            disabled={isRefreshing}
            className="hidden rounded-xl bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/30 hover:scale-105 md:flex items-center gap-2 disabled:opacity-50"
            title={`Terakhir diupdate: ${lastRefresh.toLocaleTimeString('id-ID')}`}
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Memperbarui...' : 'Perbarui'}
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 text-white shadow-lg">
            <FileText className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
            Total Konsultasi
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalKonsultasi}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 text-white shadow-lg">
            <Users className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">Total Siswa</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalSiswa}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-3 text-white shadow-lg">
            <TrendingUp className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">Disetujui</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalDisetujui}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-red-500 to-red-600 p-3 text-white shadow-lg">
            <BarChart3 className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">Ditolak</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalDitolak}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-3 text-white shadow-lg">
            <Calendar className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">Pending</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalPending}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        <select
          value={selectedBulan}
          onChange={(e) => setSelectedBulan(e.target.value)}
          className="rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-900 transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          {bulanOptions.map((bulan) => (
            <option key={bulan} value={bulan}>
              {bulan}
            </option>
          ))}
        </select>
      </div>

      {/* Daftar Laporan */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
          Laporan Per Bulan ({filteredLaporan.length})
        </h2>
        {filteredLaporan.length > 0 ? (
          <div className="space-y-4">
            {filteredLaporan.map((laporan) => (
              <div
                key={laporan.bulan_key}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-indigo-100/30 blur-3xl dark:bg-indigo-500/10"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {laporan.bulan}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleDownload(laporan)}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                    >
                      <Download className="h-5 w-5" />
                      Unduh
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-5">
                    <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-500/10">
                      <p className="mb-1 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        Total
                      </p>
                      <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                        {laporan.totalKonsultasi}
                      </p>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-500/10">
                      <p className="mb-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                        Siswa
                      </p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {laporan.totalSiswa}
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
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <p className="text-slate-600 dark:text-slate-400">Belum ada data laporan</p>
          </div>
        )}
      </div>
    </section>
  );
}
