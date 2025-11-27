"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Shield } from "lucide-react";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/login", label: "Login" },
];

// Konfigurasi Logo Sekolah
// Opsi 1: Gunakan file lokal (simpan di public/images/logo-sekolah.png atau .jpg)
const logoPath = "/images/logo-sekolah.png"; // atau .jpg

// Opsi 2: Gunakan link eksternal (uncomment baris di bawah dan comment baris di atas)
// const logoPath = "https://example.com/logo-sekolah.png";

// Jika logo tidak ada, akan menggunakan icon Shield sebagai fallback
const useLogo = true; // Set false jika ingin pakai icon Shield

export default function Navbar() {
  const pathname = usePathname();
  const [logoError, setLogoError] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/30 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/30 shadow-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm shadow-md transition-transform group-hover:scale-105 md:h-12 md:w-12 overflow-hidden">
            {useLogo && !logoError ? (
              logoPath.startsWith("http") ? (
                // Logo dari link eksternal
                <img
                  src={logoPath}
                  alt="Logo Sekolah"
                  className="h-full w-full object-contain p-1"
                  onError={() => setLogoError(true)}
                />
              ) : (
                // Logo dari file lokal
                <Image
                  src={logoPath}
                  alt="Logo Sekolah"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain p-1"
                  onError={() => setLogoError(true)}
                />
              )
            ) : (
              <Shield className="h-6 w-6 text-white md:h-7 md:w-7" />
            )}
          </div>
          <span className="text-base font-bold text-white drop-shadow-lg md:text-lg">
            YAYASAN SETIA BHAKTI
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 md:px-5 md:py-2.5 md:text-base ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:from-indigo-600 hover:to-purple-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
