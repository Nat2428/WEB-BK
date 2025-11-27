"use client";

import { Users, Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateStatusSesiBK } from "@/lib/actions";

export default function GuruDashboardClient({ user, statsData, requests }) {
  const router = useRouter();

  const handleAction = async (id, action) => {
    try {
      // Map action ke status
      const statusMap = {
        menerima: "diterima",
        menolak: "ditolak",
      };

      const status = statusMap[action];
      if (!status) {
        alert("Aksi tidak valid!");
        return;
      }

      // Update status di database
      await updateStatusSesiBK(id, status, user.id);
      
      // Refresh halaman untuk update data
      router.refresh();
      
      alert(`Permintaan berhasil ${action === "menerima" ? "diterima" : "ditolak"}!`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Gagal memperbarui status. Silakan coba lagi.");
    }
  };

  const stats = [
    { 
      label: "Total Permintaan", 
      value: statsData.total.toString(), 
      icon: Users, 
      color: "blue" 
    },
    { 
      label: "Pending", 
      value: statsData.pending.toString(), 
      icon: Clock, 
      color: "orange" 
    },
    { 
      label: "Disetujui", 
      value: statsData.disetujui.toString(), 
      icon: CheckCircle, 
      color: "green" 
    },
    { 
      label: "Ditolak", 
      value: statsData.ditolak.toString(), 
      icon: AlertCircle, 
      color: "red" 
    },
  ];

  return (
    <section className="space-y-8">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative z-10">
          <h1 className="mb-2 text-4xl font-extrabold md:text-5xl">Dashboard Guru BK</h1>
          <p className="text-lg text-green-50/90">
            Kelola permintaan bimbingan dari siswa dan update status konsultasi.
          </p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: "from-blue-500 to-blue-600",
            green: "from-green-400 to-green-500",
            orange: "from-orange-500 to-orange-600",
            red: "from-red-500 to-red-600",
          };
          return (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-slate-100/50 blur-2xl dark:bg-slate-800/50"></div>
              <div className="relative z-10">
                <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${colorClasses[stat.color]} p-3 text-white shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Requests Section */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Permintaan Konseling Terbaru
          </h2>
          {requests.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Belum ada permintaan konseling
            </p>
          )}
        </div>
        {requests.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-400" />
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
              Belum ada permintaan konseling
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Permintaan konseling dari siswa akan muncul di sini
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-100/30 blur-3xl dark:bg-blue-500/10"></div>
                <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white shadow-lg">
                      {request.siswa.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        {request.siswa}
                      </p>
                      {request.kelas && (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {request.kelas}
                        </p>
                      )}
                      <div className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Calendar className="h-4 w-4" />
                        <span>{request.tanggal}</span>
                        <Clock className="ml-2 h-4 w-4" />
                        <span>{request.jam}</span>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          request.statusKey === "menunggu" 
                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                            : request.statusKey === "diterima"
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                            : request.statusKey === "ditolak"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : request.statusKey === "progress"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  {request.statusKey === "menunggu" && (
                    <div className="flex gap-3">
                      <button
                        className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                        onClick={() => handleAction(request.id, "menerima")}
                      >
                        <CheckCircle className="h-5 w-5" />
                        Terima
                      </button>
                      <button
                        className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                        onClick={() => handleAction(request.id, "menolak")}
                      >
                        <AlertCircle className="h-5 w-5" />
                        Tolak
                      </button>
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

