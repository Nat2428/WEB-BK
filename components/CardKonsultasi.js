import { Calendar, Clock, User, ArrowRight } from "lucide-react";

export default function CardKonsultasi({ data }) {
  if (!data) return null;

  const statusStyles = {
    Pending: {
      bg: "bg-gradient-to-r from-amber-500 to-orange-500",
      text: "text-amber-700 dark:text-amber-200",
      badge: "bg-amber-100 dark:bg-amber-500/20",
    },
    Disetujui: {
      bg: "bg-gradient-to-r from-emerald-500 to-green-500",
      text: "text-emerald-700 dark:text-emerald-200",
      badge: "bg-emerald-100 dark:bg-emerald-500/20",
    },
    Ditolak: {
      bg: "bg-gradient-to-r from-rose-500 to-red-500",
      text: "text-rose-700 dark:text-rose-200",
      badge: "bg-rose-100 dark:bg-rose-500/20",
    },
  };

  const statusConfig = statusStyles[data.status] || {
    bg: "bg-gradient-to-r from-slate-500 to-slate-600",
    text: "text-slate-700 dark:text-slate-200",
    badge: "bg-slate-100 dark:bg-slate-800",
  };

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900">
      {/* Decorative background */}
      <div className={`absolute top-0 right-0 h-32 w-32 rounded-full ${statusConfig.bg} opacity-10 blur-3xl`}></div>
      
      {/* Status indicator bar */}
      <div className={`absolute top-0 left-0 h-1 w-full ${statusConfig.bg}`}></div>

      <div className="relative z-10">
        <header className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${statusConfig.bg} text-white shadow-lg`}>
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {data.guru}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Guru BK</p>
            </div>
          </div>
          <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusConfig.badge} ${statusConfig.text}`}>
            {data.status}
          </span>
        </header>

        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="font-medium">{data.tanggal}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="font-medium">{data.jam} WIB</span>
          </div>
        </div>

        <button
          type="button"
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          Lihat Detail
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </article>
  );
}

