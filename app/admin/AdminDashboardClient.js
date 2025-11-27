"use client";

import { Users, GraduationCap, FileText, CheckCircle, TrendingUp, Settings, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStatistikAdmin } from "@/lib/actions";

export default function AdminDashboardClient({ statsData: initialStatsData, recentActivity }) {
  const router = useRouter();
  const [statsData, setStatsData] = useState(initialStatsData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Auto-refresh setiap 30 detik
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // 30 detik

    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const freshData = await getStatistikAdmin();
      setStatsData(freshData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Update statsData ketika initialStatsData berubah (setelah router refresh)
  useEffect(() => {
    if (initialStatsData) {
      setStatsData(initialStatsData);
    }
  }, [initialStatsData]);
  const stats = [
    {
      label: "Total Siswa",
      value: statsData.totalSiswa,
      icon: Users,
      color: "blue",
      change: `+${statsData.totalSiswa > 0 ? Math.round((statsData.totalSiswa / 100) * 10) : 0}`,
    },
    {
      label: "Total Guru BK",
      value: statsData.totalGuru,
      icon: GraduationCap,
      color: "purple",
      change: `+${statsData.totalGuru > 0 ? Math.round((statsData.totalGuru / 10) * 1) : 0}`,
    },
    {
      label: "Pengajuan Aktif",
      value: statsData.pengajuanAktif,
      icon: FileText,
      color: "orange",
      change: `+${statsData.pengajuanAktif > 0 ? Math.round((statsData.pengajuanAktif / 50) * 5) : 0}`,
    },
    {
      label: "Sesi Selesai",
      value: statsData.sesiSelesai,
      icon: CheckCircle,
      color: "green",
      change: `+${statsData.sesiSelesai > 0 ? Math.round((statsData.sesiSelesai / 50) * 8) : 0}`,
    },
  ];

  return (
    <section className="space-y-8">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-700 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-extrabold md:text-5xl">Dashboard Admin</h1>
            <p className="text-lg text-indigo-50">
              Kelola master data dan pantau aktivitas bimbingan secara menyeluruh.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="hidden rounded-xl bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/30 hover:scale-105 md:flex items-center gap-2 disabled:opacity-50"
              title={`Terakhir diupdate: ${lastRefresh.toLocaleTimeString('id-ID')}`}
            >
              <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Memperbarui...' : 'Perbarui'}
            </button>
            <Link
              href="/admin/settings"
              className="hidden rounded-xl bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/30 hover:scale-105 md:flex items-center gap-2"
            >
              <Settings className="h-5 w-5" />
              Pengaturan
            </Link>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: "from-blue-500 to-blue-600",
            purple: "from-purple-500 to-purple-600",
            orange: "from-orange-500 to-orange-600",
            green: "from-green-500 to-green-600",
          };
          return (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-slate-100/50 blur-3xl dark:bg-slate-800/50"></div>
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`rounded-xl bg-gradient-to-br ${colorClasses[stat.color]} p-3 text-white shadow-lg`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/20 dark:text-green-400">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </div>
                </div>
                <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                  {stat.label}
                </p>
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Content */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
            Aktivitas Terkini
          </h3>
          <div className="space-y-4">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-400">Belum ada aktivitas</p>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h3>
          <div className="grid gap-3">
            <Link
              href="/admin/siswa"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-left font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Kelola Data Siswa
            </Link>
            <Link
              href="/admin/guru"
              className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-left font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Kelola Data Guru
            </Link>
            <Link
              href="/admin/laporan"
              className="rounded-xl bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 text-left font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              Generate Laporan
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
