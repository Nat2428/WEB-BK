"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  LogOut,
} from "lucide-react";

// Konfigurasi Logo Sekolah (sama dengan Navbar.js)
const logoPath = "/images/logo-sekolah.png"; // atau .jpg
// const logoPath = "https://example.com/logo-sekolah.png"; // Link eksternal
const useLogo = true; // Set false jika ingin pakai icon GraduationCap

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/siswa", label: "Data Siswa", icon: Users },
  { href: "/admin/guru", label: "Data Guru", icon: Users },
  { href: "/admin/laporan", label: "Laporan", icon: FileText },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export default function NavbarAdmin() {
  const pathname = usePathname();
  const [logoError, setLogoError] = useState(false);

  const handleLogout = async () => {
    // Clear cookie
    document.cookie = "user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg dark:border-slate-800/80 dark:bg-slate-950/80 shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/admin" className="group flex items-center gap-2">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg transition-transform group-hover:scale-105 overflow-hidden">
            {useLogo && !logoError ? (
              logoPath.startsWith("http") ? (
                <img
                  src={logoPath}
                  alt="Logo Sekolah"
                  className="h-full w-full object-contain p-1"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <Image
                  src={logoPath}
                  alt="Logo Sekolah"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain p-1"
                  onError={() => setLogoError(true)}
                />
              )
            ) : (
              <GraduationCap className="h-6 w-6 text-white" />
            )}
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Admin BK
          </span>
        </Link>
        <div className="flex items-center gap-1 text-sm font-semibold">
          {navLinks.map((link) => {
            // Fix: Dashboard harus exact match, halaman lain bisa exact atau startsWith
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname === link.href || pathname?.startsWith(link.href + "/");
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 rounded-lg px-4 py-2 transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-1/2 -translate-x-1/2 rounded-full bg-white"></span>
                )}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="ml-2 flex items-center gap-2 rounded-lg px-4 py-2 text-slate-700 transition-all duration-200 hover:bg-red-100 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-900/50 dark:hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </div>
    </nav>
  );
}
