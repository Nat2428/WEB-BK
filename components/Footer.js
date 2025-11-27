import { Heart, Mail, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-gradient-to-b from-white to-slate-50 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              BK SMK Taruna Bhakti
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Platform bimbingan konseling digital untuk mendukung perkembangan siswa menuju masa depan yang lebih baik.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              Kontak
            </h3>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>bk@smktarunabhakti.sch.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>+62 21 1234 5678</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              Tautan Cepat
            </h3>
            <div className="space-y-2 text-sm">
              <a href="/" className="block text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                Beranda
              </a>
              <a href="/login" className="block text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                Masuk
              </a>
              <a href="/siswa" className="block text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
                Dashboard Siswa
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-slate-200 pt-6 text-center dark:border-slate-800">
          <p className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            © {currentYear} BK SMK Taruna Bhakti Depok. Made with{" "}
            <Heart className="h-4 w-4 fill-red-500 text-red-500" /> All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

