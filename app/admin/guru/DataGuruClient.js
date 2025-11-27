"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Search, GraduationCap, Mail, Phone, Plus, Edit2, Trash2, RefreshCw } from "lucide-react";
import { createOrUpdateGuru, deleteGuru, getAllGuruForAdmin } from "@/lib/actions";

export default function DataGuruClient({ guruList: initialGuruList }) {
  const router = useRouter();
  const [guruList, setGuruList] = useState(initialGuruList);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingGuru, setEditingGuru] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Auto-refresh setiap 30 detik
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // 30 detik

    return () => clearInterval(interval);
  }, []);

  // Update guruList ketika initialGuruList berubah
  useEffect(() => {
    setGuruList(initialGuruList);
  }, [initialGuruList]);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const freshData = await getAllGuruForAdmin();
      setGuruList(freshData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredGuru = guruList.filter(
    (guru) =>
      (guru.nama_guru || guru.username || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (guru.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalGuru: guruList.length,
    guruAktif: guruList.filter((g) => g.is_active).length,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      await createOrUpdateGuru(formData, editingGuru?.id);
      // Refresh data setelah update
      await refreshData();
      setShowForm(false);
      setEditingGuru(null);
      alert(editingGuru ? "Data guru berhasil diupdate!" : "Data guru berhasil ditambahkan!");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (guru) => {
    setEditingGuru(guru);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus/nonaktifkan data guru ini?")) {
      try {
        await deleteGuru(id);
        // Refresh data setelah delete
        await refreshData();
        alert("Data guru berhasil dinonaktifkan!");
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-700 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-extrabold md:text-5xl">Data Guru BK</h1>
            <p className="text-lg text-indigo-50">Kelola data guru BK secara menyeluruh.</p>
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
            <button
              onClick={() => {
                setEditingGuru(null);
                setShowForm(!showForm);
              }}
              className="hidden rounded-xl bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/30 hover:scale-105 md:flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              {showForm ? "Batal" : "Tambah Guru"}
            </button>
          </div>
        </div>
      </header>

      {/* Form Tambah/Edit Guru */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
            {editingGuru ? "Edit Data Guru BK" : "Form Tambah Guru BK"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Nama Lengkap *
                </label>
              <input
                type="text"
                name="nama_guru"
                defaultValue={editingGuru?.nama_guru || editingGuru?.username || ""}
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                required
              />
              <p className="mt-1 text-xs text-slate-500">Nama lengkap guru BK</p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingGuru?.email || ""}
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  No. WhatsApp
                </label>
                <input
                  type="tel"
                  name="no_wa"
                  defaultValue={editingGuru?.no_wa || ""}
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Mata Keahlian
                </label>
                <input
                  type="text"
                  name="mata_keahlian"
                  defaultValue={editingGuru?.mata_keahlian || "Bimbingan Konseling"}
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              {!editingGuru && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Password (default: Smktb25!)
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Kosongkan untuk password default"
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              )}
              {editingGuru && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Ubah Password (kosongkan jika tidak ingin mengubah)
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Kosongkan jika tidak ingin mengubah"
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : editingGuru ? "Update Guru" : "Tambah Guru"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingGuru(null);
                }}
                className="rounded-xl border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari guru berdasarkan nama atau email..."
          className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 text-white shadow-lg">
            <User className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">Total Guru BK</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalGuru}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-3 text-white shadow-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">Guru Aktif</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.guruAktif}</p>
        </div>
      </div>

      {/* Daftar Guru */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
          Daftar Guru BK ({filteredGuru.length})
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredGuru.map((guru) => (
            <div
              key={guru.id}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-indigo-100/30 blur-3xl dark:bg-indigo-500/10"></div>
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold text-white shadow-lg">
                    {(guru.nama_guru || guru.username || "G").charAt(0).toUpperCase()}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(guru)}
                      className="rounded-lg bg-blue-100 p-2 text-blue-600 transition-all hover:bg-blue-200 dark:bg-blue-500/20 dark:text-blue-400"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(guru.id)}
                      className="rounded-lg bg-red-100 p-2 text-red-600 transition-all hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                  {guru.nama_guru || guru.username}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Mail className="h-4 w-4" />
                    <span>{guru.email || "-"}</span>
                  </div>
                  {guru.no_wa && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Phone className="h-4 w-4" />
                      <span>{guru.no_wa}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <GraduationCap className="h-4 w-4" />
                    <span>{guru.mata_keahlian || "Bimbingan Konseling"}</span>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        guru.is_active
                          ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                      }`}
                    >
                      {guru.is_active ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredGuru.length === 0 && (
          <div className="py-12 text-center text-slate-600 dark:text-slate-400">
            Tidak ada data guru
          </div>
        )}
      </div>
    </section>
  );
}
