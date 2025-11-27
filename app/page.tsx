import Link from "next/link";
import { BookOpen, Briefcase, Users, ArrowRight, Sparkles } from "lucide-react";
import { getAllGuru } from "@/lib/actions";
import GuruCarousel from "./GuruCarousel";

// Gunakan foto dari folder public/images
// Simpan foto dengan nama: hero-background.jpg atau hero-background.png
// Path: public/images/hero-background.jpg
const heroBackgroundImage = "/images/hero-background.jpg";

export default async function LandingPage() {
  // Fetch data guru BK
  const guruList = await getAllGuru();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] overflow-hidden text-white">
        {/* Background Image dengan Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroBackgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/60 via-indigo-500/60 to-purple-500/60" />

        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl"></div>
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg bg-indigo-500/80 px-5 py-2.5 text-sm font-medium backdrop-blur-md shadow-lg border border-white/20">
              <Sparkles className="h-4 w-4" />
              <span>Platform Bimbingan Konseling Terpercaya</span>
            </div>

            {/* Title */}
            <h1 className="mb-6 text-5xl font-extrabold leading-tight md:text-6xl lg:text-7xl">
              Bimbingan Konseling
              <span className="block mt-2">SMK Taruna Bhakti</span>
            </h1>

            {/* Description */}
            <p className="mb-10 text-lg text-blue-50 md:text-xl leading-relaxed max-w-2xl mx-auto">
              Layanan bimbingan dan konseling untuk mendukung perkembangan
              akademik, karir, dan pribadi siswa.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/login"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800/90 backdrop-blur-md px-8 py-4 font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:bg-slate-900/90 hover:shadow-2xl border border-white/20"
              >
                Masuk
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#layanan"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 font-bold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-indigo-600 hover:to-purple-700 hover:shadow-2xl"
              >
                Lihat Layanan BK
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Guru BK Carousel Section */}
      {guruList && guruList.length > 0 && <GuruCarousel guruList={guruList} />}

      {/* Layanan BK Section */}
      <section
        id="layanan"
        className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-16 md:py-24"
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Konseling Akademik */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/90 to-indigo-600/90 p-8 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
              <div className="relative z-10">
                <div className="mb-6 inline-flex rounded-xl bg-white/20 backdrop-blur-md p-4 shadow-lg">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Konseling Akademik</h3>
                <p className="text-blue-50 leading-relaxed">
                  Bimbingan belajar & prestasi
                </p>
              </div>
            </div>

            {/* Konseling Karir */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/90 to-purple-600/90 p-8 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
              <div className="relative z-10">
                <div className="mb-6 inline-flex rounded-xl bg-white/20 backdrop-blur-md p-4 shadow-lg">
                  <Briefcase className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Konseling Karir</h3>
                <p className="text-indigo-50 leading-relaxed">
                  Perencanaan masa depan
                </p>
              </div>
            </div>

            {/* Konseling Pribadi */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/90 to-pink-600/90 p-8 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
              <div className="relative z-10">
                <div className="mb-6 inline-flex rounded-xl bg-white/20 backdrop-blur-md p-4 shadow-lg">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-2xl font-bold">Konseling Pribadi</h3>
                <p className="text-purple-50 leading-relaxed">
                  Dukungan emosional & sosial
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
