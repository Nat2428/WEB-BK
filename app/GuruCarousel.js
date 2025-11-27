"use client";

import Image from "next/image";

export default function GuruCarousel({ guruList }) {
  if (!guruList || guruList.length === 0) return null;

  return (
    <section className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-extrabold text-slate-900 dark:text-white md:text-5xl">
            Tim Guru BK Kami
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Tim profesional yang siap membantu Anda dalam bimbingan dan konseling
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          {/* Gradient Overlay Kiri */}
          <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 pointer-events-none"></div>
          
          {/* Gradient Overlay Kanan */}
          <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 pointer-events-none"></div>

          {/* Scrolling Container - Seamless Loop */}
          <div className="flex gap-6 scroll-carousel">
            {/* First Set */}
            {guruList.map((guru, index) => (
              <div
                key={`first-${guru.id}-${index}`}
                className="group flex-shrink-0 w-64 rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                {/* Foto Guru */}
                <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl">
                  {guru.avatar ? (
                    <Image
                      src={
                        guru.avatar.startsWith("http")
                          ? guru.avatar
                          : guru.avatar.startsWith("/")
                          ? guru.avatar
                          : `/images/${guru.avatar}`
                      }
                      alt={guru.nama_guru || guru.username}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        console.error(`Failed to load image for ${guru.nama_guru}: ${guru.avatar}`);
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-4xl font-bold text-white">
                      {(guru.nama_guru || guru.username || "G").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Nama Guru */}
                <div className="text-center">
                  <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">
                    {guru.nama_guru || guru.username || "Guru BK"}
                  </h3>
                  {guru.mata_keahlian && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {guru.mata_keahlian}
                    </p>
                  )}
                </div>
              </div>
            ))}
            
            {/* Second Set - Duplicate untuk seamless loop */}
            {guruList.map((guru, index) => (
              <div
                key={`second-${guru.id}-${index}`}
                className="group flex-shrink-0 w-64 rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                {/* Foto Guru */}
                <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl">
                  {guru.avatar ? (
                    <Image
                      src={
                        guru.avatar.startsWith("http")
                          ? guru.avatar
                          : guru.avatar.startsWith("/")
                          ? guru.avatar
                          : `/images/${guru.avatar}`
                      }
                      alt={guru.nama_guru || guru.username}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-4xl font-bold text-white">
                      {(guru.nama_guru || guru.username || "G").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Nama Guru */}
                <div className="text-center">
                  <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">
                    {guru.nama_guru || guru.username || "Guru BK"}
                  </h3>
                  {guru.mata_keahlian && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {guru.mata_keahlian}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scroll-carousel {
          animation: scrollCarousel 20s linear infinite;
          will-change: transform;
          width: max-content;
        }
        
        @keyframes scrollCarousel {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 0.75rem));
          }
        }
      `}</style>
    </section>
  );
}
