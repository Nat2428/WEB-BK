"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, GraduationCap, Edit2, Save, X } from "lucide-react";
import { updateProfileSiswa } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function ProfilClient({ user, profile }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nama: profile?.nama_siswa || user.nama || user.username || "",
    nisn: user.nisn || "",
    kelas: profile?.kelas || user.kelas || "",
    jurusan: profile?.jurusan || user.jurusan || "",
    email: user.email || "",
    noHp: profile?.no_hp || "",
    alamat: profile?.alamat || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      formDataObj.append("nama_siswa", formData.nama);
      formDataObj.append("kelas", formData.kelas);
      formDataObj.append("jurusan", formData.jurusan);
      formDataObj.append("alamat", formData.alamat);
      if (formData.noHp) {
        formDataObj.append("no_hp", formData.noHp);
      }

      await updateProfileSiswa(user.id, formDataObj);
      alert("Profil berhasil diperbarui!");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      alert("Error: " + (error.message || "Gagal memperbarui profil"));
    }
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-extrabold md:text-5xl">Profil Saya</h1>
            <p className="text-lg text-blue-50">
              Kelola informasi profil dan data pribadi Anda.
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="hidden rounded-xl bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/30 hover:scale-105 md:flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <X className="h-5 w-5" />
                Batal
              </>
            ) : (
              <>
                <Edit2 className="h-5 w-5" />
                Edit Profil
              </>
            )}
          </button>
        </div>
      </header>

      {/* Profil Card */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Foto Profil */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-4xl font-bold text-white shadow-xl">
              {formData.nama.charAt(0).toUpperCase()}
            </div>
            <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
              {formData.nama}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">{formData.kelas}</p>
            <div className="mt-4 flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-500/20 dark:text-blue-400">
              <GraduationCap className="h-4 w-4" />
              Siswa
            </div>
          </div>
        </div>

        {/* Form Data Profil */}
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <User className="h-4 w-4" />
                  Nama Lengkap
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                ) : (
                  <p className="rounded-xl bg-slate-50 px-4 py-3 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                    {formData.nama}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <GraduationCap className="h-4 w-4" />
                  NISN
                </label>
                <p className="rounded-xl bg-slate-50 px-4 py-3 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                  {formData.nisn}
                </p>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <GraduationCap className="h-4 w-4" />
                  Kelas
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="kelas"
                    value={formData.kelas}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                ) : (
                  <p className="rounded-xl bg-slate-50 px-4 py-3 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                    {formData.kelas}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <GraduationCap className="h-4 w-4" />
                  Jurusan
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="jurusan"
                    value={formData.jurusan}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                ) : (
                  <p className="rounded-xl bg-slate-50 px-4 py-3 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                    {formData.jurusan}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <p className="rounded-xl bg-slate-50 px-4 py-3 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                  {formData.email || "-"}
                </p>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <Phone className="h-4 w-4" />
                  No. HP
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="noHp"
                    value={formData.noHp}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                ) : (
                  <p className="rounded-xl bg-slate-50 px-4 py-3 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                    {formData.noHp || "-"}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <MapPin className="h-4 w-4" />
                Alamat
              </label>
              {isEditing ? (
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              ) : (
                <p className="rounded-xl bg-slate-50 px-4 py-3 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                  {formData.alamat || "-"}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  <Save className="h-5 w-5" />
                  Simpan Perubahan
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Batal
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

