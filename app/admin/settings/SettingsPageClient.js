"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings, User, Mail, Lock, Bell, Shield, Save } from "lucide-react";
import { updateProfileAdmin } from "@/lib/actions";

export default function SettingsPageClient({ user }) {
  const router = useRouter();
  const [settings, setSettings] = useState({
    nama: user?.username || "Admin Sistem",
    email: user?.email || "admin@smktb.sch.id",
    password: "",
    notifikasi: true,
    emailNotifikasi: true,
    keamanan: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSettings({
        nama: user.username || "Admin Sistem",
        email: user.email || "admin@smktb.sch.id",
        password: "",
        notifikasi: true,
        emailNotifikasi: true,
        keamanan: true,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user || !user.id) {
        throw new Error("User tidak ditemukan");
      }
      
      const formData = new FormData();
      formData.append("username", settings.nama);
      formData.append("email", settings.email);
      if (settings.password) {
        formData.append("password", settings.password);
      }

      await updateProfileAdmin(user.id, formData);
      alert("Pengaturan berhasil disimpan!");
      router.refresh();
      setSettings({ ...settings, password: "" }); // Clear password field
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-700 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative z-10">
          <h1 className="mb-2 text-4xl font-extrabold md:text-5xl">Pengaturan</h1>
          <p className="text-lg text-indigo-50">
            Kelola pengaturan sistem dan akun admin.
          </p>
        </div>
      </header>

      {/* Form Settings */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Profil */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 text-white shadow-lg">
              <User className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Profil Admin</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <User className="h-4 w-4" />
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama"
                value={settings.nama}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <Mail className="h-4 w-4" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <Lock className="h-4 w-4" />
                Password Baru
              </label>
              <input
                type="password"
                name="password"
                value={settings.password}
                onChange={handleChange}
                placeholder="Kosongkan jika tidak ingin mengubah"
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </form>
        </div>

        {/* Notifikasi */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 text-white shadow-lg">
              <Bell className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Notifikasi</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Notifikasi Sistem
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Terima notifikasi dari sistem
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="notifikasi"
                  checked={settings.notifikasi}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-700"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Notifikasi Email
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Terima notifikasi via email
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="emailNotifikasi"
                  checked={settings.emailNotifikasi}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-700"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Keamanan */}
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-3 text-white shadow-lg">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Keamanan</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Aktifkan 2FA untuk keamanan ekstra
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  name="keamanan"
                  checked={settings.keamanan}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-indigo-300 dark:border-slate-600 dark:bg-slate-700"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50"
        >
          <Save className="h-5 w-5" />
          {loading ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </section>
  );
}

