"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Search, GraduationCap, Mail, Plus, Edit2, Trash2, RefreshCw } from "lucide-react";
import { createOrUpdateSiswa, deleteSiswa, getAllSiswa } from "@/lib/actions";

export default function DataSiswaClient({ siswaList: initialSiswaList }) {
  const router = useRouter();
  const [siswaList, setSiswaList] = useState(initialSiswaList);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState(null);
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

  // Update siswaList ketika initialSiswaList berubah
  useEffect(() => {
    setSiswaList(initialSiswaList);
  }, [initialSiswaList]);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const freshData = await getAllSiswa();
      setSiswaList(freshData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredSiswa = siswaList.filter(
    (siswa) =>
      (siswa.nama_siswa || siswa.username || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (siswa.nisn || "").includes(searchTerm) ||
      (siswa.kelas || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalSiswa: siswaList.length,
    totalKelas: new Set(siswaList.map((s) => s.kelas).filter(Boolean)).size,
    totalJurusan: new Set(siswaList.map((s) => s.jurusan).filter(Boolean)).size,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      await createOrUpdateSiswa(formData, editingSiswa?.id);
      // Refresh data setelah update
      await refreshData();
      setShowForm(false);
      setEditingSiswa(null);
      alert(editingSiswa ? "Data siswa berhasil diupdate!" : "Data siswa berhasil ditambahkan!");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (siswa) => {
    setEditingSiswa(siswa);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus/nonaktifkan data siswa ini?")) {
      try {
        await deleteSiswa(id);
        // Refresh data setelah delete
        await refreshData();
        alert("Data siswa berhasil dinonaktifkan!");
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
            <h1 className="mb-2 text-4xl font-extrabold md:text-5xl">Data Siswa</h1>
            <p className="text-lg text-indigo-50">Kelola data siswa secara menyeluruh.</p>
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
                setEditingSiswa(null);
                setShowForm(!showForm);
              }}
              className="hidden rounded-xl bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/30 hover:scale-105 md:flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              {showForm ? "Batal" : "Tambah Siswa"}
            </button>
          </div>
        </div>
      </header>

      {/* Form Tambah/Edit Siswa */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
            {editingSiswa ? "Edit Data Siswa" : "Form Tambah Siswa"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  NISN *
                </label>
                <input
                  type="text"
                  name="nisn"
                  defaultValue={editingSiswa?.nisn || ""}
                  disabled={!!editingSiswa}
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 disabled:opacity-50"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="nama_siswa"
                  defaultValue={editingSiswa?.nama_siswa || editingSiswa?.username || ""}
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Kelas *
                </label>
                <input
                  type="text"
                  name="kelas"
                  defaultValue={editingSiswa?.kelas || ""}
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Jurusan *
                </label>
                <input
                  type="text"
                  name="jurusan"
                  defaultValue={editingSiswa?.jurusan || ""}
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingSiswa?.email || ""}
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  No. HP
                </label>
                <input
                  type="tel"
                  name="no_hp"
                  defaultValue={editingSiswa?.no_hp || ""}
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Alamat
                </label>
                <textarea
                  name="alamat"
                  defaultValue={editingSiswa?.alamat || ""}
                  rows="2"
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              {!editingSiswa && (
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
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : editingSiswa ? "Update Siswa" : "Tambah Siswa"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingSiswa(null);
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
          placeholder="Cari siswa berdasarkan nama, NISN, atau kelas..."
          className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 text-white shadow-lg">
            <User className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">Total Siswa</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalSiswa}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 text-white shadow-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">Total Kelas</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalKelas}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-3 text-white shadow-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-400">Total Jurusan</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalJurusan}</p>
        </div>
      </div>

      {/* Daftar Siswa */}
      <div>
        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
          Daftar Siswa ({filteredSiswa.length})
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Nama
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                  NISN
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Kelas
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Jurusan
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSiswa.map((siswa) => (
                <tr
                  key={siswa.id}
                  className="border-b border-slate-200 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">
                    {siswa.nama_siswa || siswa.username}
                  </td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{siswa.nisn}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{siswa.kelas || "-"}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                    {siswa.jurusan || "-"}
                  </td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                    {siswa.email || "-"}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(siswa)}
                        className="rounded-lg bg-blue-100 p-2 text-blue-600 transition-all hover:bg-blue-200 dark:bg-blue-500/20 dark:text-blue-400"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(siswa.id)}
                        className="rounded-lg bg-red-100 p-2 text-red-600 transition-all hover:bg-red-200 dark:bg-red-500/20 dark:text-red-400"
                        title="Hapus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSiswa.length === 0 && (
            <div className="py-12 text-center text-slate-600 dark:text-slate-400">
              Tidak ada data siswa
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
