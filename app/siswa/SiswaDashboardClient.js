"use client";

import { useRouter } from "next/navigation";
import CardKonsultasi from "../../components/CardKonsultasi";
import { Calendar, Clock, CheckCircle, AlertCircle, BookOpen } from "lucide-react";

export default function SiswaDashboardClient({ user, statsData, appointments }) {
  const router = useRouter();

  const stats = [
    { 
      label: "Total Konseling", 
      value: (statsData.total || 0).toString(), 
      icon: BookOpen, 
      color: "blue" 
    },
    { 
      label: "Disetujui", 
      value: (statsData.disetujui || 0).toString(), 
      icon: CheckCircle, 
      color: "green" 
    },
    { 
      label: "Pending", 
      value: (statsData.pending || 0).toString(), 
      icon: Clock, 
      color: "orange" 
    },
    { 
      label: "Ditolak", 
      value: (statsData.ditolak || 0).toString(), 
      icon: AlertCircle, 
      color: "red" 
    },
  ];

  return (
    <section className="space-y-8">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative z-10">
          <h1 className="mb-2 text-4xl font-extrabold md:text-5xl">
            Dashboard Siswa
          </h1>
          <p className="text-lg text-blue-50">
            Selamat datang, <span className="font-bold">{user.nama || user.username}</span>!
          </p>
          <p className="text-sm text-blue-100 mt-1">
            Pantau pengajuan bimbingan dan jadwalkan sesi konsultasi.
          </p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: "from-blue-500 to-blue-600",
            green: "from-green-500 to-green-600",
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

      {/* Appointments Section */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Jadwal Konsultasi
          </h2>
          <button 
            onClick={() => router.push("/siswa/konsultasi")}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <Calendar className="h-5 w-5" />
            Buat Jadwal Baru
          </button>
        </div>
        {appointments.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <p className="text-slate-600 dark:text-slate-400">
              Belum ada konsultasi. Klik "Buat Jadwal Baru" untuk mengajukan konsultasi.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {appointments.map((item) => (
              <CardKonsultasi key={item.id} data={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

