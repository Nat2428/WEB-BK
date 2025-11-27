"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, User, MessageSquare, CheckCircle, AlertCircle, XCircle, BookOpen, PlayCircle, CheckCircle2 } from "lucide-react";
import { updateStatusSesiBK } from "@/lib/actions";

export default function PermintaanClient({ user, permintaanList: initialPermintaanList }) {
  const router = useRouter();
  const [permintaanList] = useState(initialPermintaanList);
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [loading, setLoading] = useState({});

  const handleAction = async (sesiId, action) => {
    if (loading[sesiId]) return;
    
    setLoading(prev => ({ ...prev, [sesiId]: true }));
    
    try {
      let newStatus;
      if (action === "terima") {
        newStatus = "diterima";
      } else if (action === "tolak") {
        newStatus = "ditolak";
      } else if (action === "progress") {
        newStatus = "progress";
      } else if (action === "selesai") {
        newStatus = "selesai";
      } else {
        return;
      }

      await updateStatusSesiBK(sesiId, newStatus, user.id);
      alert(`Status berhasil diubah menjadi ${newStatus === "diterima" ? "Disetujui" : newStatus === "ditolak" ? "Ditolak" : newStatus === "progress" ? "Progress" : "Selesai"}`);
      router.refresh();
    } catch (error) {
      alert("Error: " + (error.message || "Gagal mengupdate status"));
    } finally {
      setLoading(prev => ({ ...prev, [sesiId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Disetujui":
      case "diterima":
        return "bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-400";
      case "Pending":
      case "menunggu":
        return "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400";
      case "Ditolak":
      case "ditolak":
        return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
      case "progress":
        return "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400";
      case "Selesai":
      case "selesai":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Disetujui":
      case "diterima":
        return <CheckCircle className="h-4 w-4" />;
      case "Pending":
      case "menunggu":
        return <Clock className="h-4 w-4" />;
      case "Ditolak":
      case "ditolak":
        return <XCircle className="h-4 w-4" />;
      case "progress":
        return <PlayCircle className="h-4 w-4" />;
      case "Selesai":
      case "selesai":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    if (typeof date === "string") return date;
    return new Date(date).toLocaleDateString("id-ID");
  };

  const filteredPermintaan =
    filterStatus === "Semua"
      ? permintaanList
      : permintaanList.filter((p) => {
          if (filterStatus === "Pending") return p.status === "menunggu";
          if (filterStatus === "Disetujui") return p.status === "diterima";
          if (filterStatus === "Ditolak") return p.status === "ditolak";
          if (filterStatus === "Progress") return p.status === "progress";
          if (filterStatus === "Selesai") return p.status === "selesai";
          return true;
        });

  return (
    <section className="space-y-8">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative z-10">
          <h1 className="mb-2 text-4xl font-extrabold md:text-5xl">Permintaan Konseling</h1>
          <p className="text-lg text-green-50/90">
            Kelola permintaan konseling dari siswa dan update status konsultasi.
          </p>
        </div>
      </header>

      {/* Filter */}
      <div className="flex flex-wrap gap-3">
        {["Semua", "Pending", "Disetujui", "Progress", "Selesai", "Ditolak"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded-xl px-6 py-2.5 font-semibold transition-all ${
              filterStatus === status
                ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg"
                : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Daftar Permintaan */}
      <div className="space-y-4">
        {filteredPermintaan.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-slate-600 dark:text-slate-400">Tidak ada permintaan dengan status ini.</p>
          </div>
        ) : (
          filteredPermintaan.map((permintaan) => (
            <div
              key={permintaan.id}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-green-100/30 blur-3xl dark:bg-green-500/10"></div>
              <div className="relative z-10">
                <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-xl font-bold text-white shadow-lg">
                      {(permintaan.nama_siswa || permintaan.siswa_username || "S").charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {permintaan.nama_siswa || permintaan.siswa_username || "Siswa"}
                      </h3>
                      {permintaan.kelas && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">{permintaan.kelas}</p>
                      )}
                      <div className="mt-1 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(permintaan.tanggal_konsultasi)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{permintaan.jam_konsultasi || permintaan.jam_mulai || "-"}</span>
                        </div>
                        {permintaan.jenis_konseling && (
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            <span className="capitalize">{permintaan.jenis_konseling}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
                      permintaan.status
                    )}`}
                  >
                    {getStatusIcon(permintaan.status)}
                    {permintaan.status === "diterima" ? "Disetujui" : 
                     permintaan.status === "menunggu" ? "Pending" : 
                     permintaan.status === "ditolak" ? "Ditolak" : 
                     permintaan.status === "progress" ? "Progress" :
                     permintaan.status === "selesai" ? "Selesai" :
                     permintaan.status}
                  </div>
                </div>

                <div className="mb-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <MessageSquare className="h-4 w-4" />
                    Keluhan
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{permintaan.keluhan}</p>
                </div>

                {/* Action Buttons berdasarkan status */}
                {permintaan.status === "menunggu" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction(permintaan.id, "terima")}
                      disabled={loading[permintaan.id]}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50"
                    >
                      <CheckCircle className="h-5 w-5" />
                      {loading[permintaan.id] ? "Memproses..." : "Terima"}
                    </button>
                    <button
                      onClick={() => handleAction(permintaan.id, "tolak")}
                      disabled={loading[permintaan.id]}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50"
                    >
                      <XCircle className="h-5 w-5" />
                      Tolak
                    </button>
                  </div>
                )}

                {permintaan.status === "diterima" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction(permintaan.id, "progress")}
                      disabled={loading[permintaan.id]}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50"
                    >
                      <PlayCircle className="h-5 w-5" />
                      {loading[permintaan.id] ? "Memproses..." : "Mulai Pertemuan"}
                    </button>
                  </div>
                )}

                {permintaan.status === "progress" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction(permintaan.id, "selesai")}
                      disabled={loading[permintaan.id]}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      {loading[permintaan.id] ? "Memproses..." : "Selesaikan Pertemuan"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
