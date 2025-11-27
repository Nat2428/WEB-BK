"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MessageSquare, CheckCircle, AlertCircle, XCircle, ArrowRight, ArrowLeft, Users, Sparkles } from "lucide-react";
import { createKonsultasi } from "@/lib/actions";

export default function KonsultasiClient({ user, guruList, konsultasi }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [selectedGuru, setSelectedGuru] = useState("");
  const [jadwalKosong, setJadwalKosong] = useState([]);
  const [selectedJadwal, setSelectedJadwal] = useState("");
  const [keluhan, setKeluhan] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingJadwal, setLoadingJadwal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Load jadwal kosong saat guru dipilih
  useEffect(() => {
    if (selectedGuru) {
      loadJadwalKosong();
    } else {
      setJadwalKosong([]);
      setSelectedJadwal("");
    }
  }, [selectedGuru]);

  // Reset step saat form ditutup
  useEffect(() => {
    if (!showForm) {
      setCurrentStep(1);
      setSelectedGuru("");
      setSelectedJadwal("");
      setKeluhan("");
    }
  }, [showForm]);

  const loadJadwalKosong = async () => {
    if (!selectedGuru) return;
    setLoadingJadwal(true);
    try {
      const res = await fetch(`/api/jadwal-kosong?guruId=${selectedGuru}`);
      const data = await res.json();
      setJadwalKosong(data.jadwal || []);
    } catch (error) {
      console.error("Error loading jadwal:", error);
      setJadwalKosong([]);
    } finally {
      setLoadingJadwal(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGuru || !selectedJadwal || !keluhan.trim()) {
      alert("Harap lengkapi semua field!");
      return;
    }
    
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("guru_id", selectedGuru);
      formData.append("jadwal_id", selectedJadwal);
      formData.append("keluhan", keluhan);
      
      const jadwal = jadwalKosong.find(j => j.id === selectedJadwal);
      if (jadwal) {
        const today = new Date();
        const hariOrder = { Senin: 1, Selasa: 2, Rabu: 3, Kamis: 4, Jumat: 5, Sabtu: 6 };
        const currentDay = today.getDay();
        const targetDay = hariOrder[jadwal.hari];
        
        let daysUntilTarget = (targetDay - currentDay + 7) % 7;
        if (daysUntilTarget === 0) daysUntilTarget = 7;
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysUntilTarget);
        
        formData.append("tanggal", targetDate.toISOString().split('T')[0]);
        formData.append("jam", jadwal.jam_mulai);
      }

      await createKonsultasi(user.id, formData);
      alert("Pengajuan konsultasi berhasil dikirim!");
      setShowForm(false);
      setCurrentStep(1);
      setSelectedGuru("");
      setSelectedJadwal("");
      setKeluhan("");
      router.refresh();
    } catch (error) {
      alert("Error: " + (error.message || "Gagal mengajukan konsultasi"));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Disetujui":
      case "diterima":
        return "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400";
      case "Pending":
      case "menunggu":
        return "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400";
      case "Ditolak":
      case "ditolak":
        return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400";
      case "Selesai":
      case "selesai":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
      case "progress":
        return "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Disetujui":
      case "diterima":
        return <CheckCircle className="h-4 w-4" />;
      case "Pending":
      case "menunggu":
        return <Clock className="h-4 w-4" />;
      case "Ditolak":
      case "ditolak":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    if (typeof date === "string") {
      // Jika sudah string, coba parse dulu untuk memastikan format benar
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString("id-ID");
      }
      return date;
    }
    if (date instanceof Date) {
      return date.toLocaleDateString("id-ID");
    }
    if (date.toDate && typeof date.toDate === "function") {
      return date.toDate().toLocaleDateString("id-ID");
    }
    // Fallback: convert ke string
    try {
      return new Date(date).toLocaleDateString("id-ID");
    } catch {
      return String(date);
    }
  };

  const selectedGuruData = guruList.find(g => g.id === selectedGuru);

  const nextStep = () => {
    if (currentStep === 1 && selectedGuru) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedJadwal) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <section className="space-y-8">
      {/* Header */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Users className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold">Konsultasi BK</h1>
          </div>
          <p className="text-lg md:text-xl text-blue-50 max-w-2xl">
            Pilih guru BK yang tepat untuk mendapatkan bimbingan dan konseling terbaik.
          </p>
        </div>
      </header>

      {/* Form Pengajuan Konsultasi - Redesign dengan Step Wizard */}
      {showForm ? (
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 md:p-10 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                    currentStep >= step
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110"
                      : "bg-slate-200 text-slate-500 dark:bg-slate-700"
                  }`}>
                    {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${
                      currentStep > step ? "bg-gradient-to-r from-blue-600 to-purple-600" : "bg-slate-200 dark:bg-slate-700"
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm font-semibold text-slate-600 dark:text-slate-400">
              <span className={currentStep >= 1 ? "text-blue-600 dark:text-blue-400" : ""}>Pilih Guru</span>
              <span className={currentStep >= 2 ? "text-blue-600 dark:text-blue-400" : ""}>Pilih Jadwal</span>
              <span className={currentStep >= 3 ? "text-blue-600 dark:text-blue-400" : ""}>Catatan</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Pilih Guru BK */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pilih Guru BK</h2>
                  <p className="text-slate-600 dark:text-slate-400">Pilih guru yang ingin Anda konsultasikan</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {guruList.map((guru) => (
                    <button
                      key={guru.id}
                      type="button"
                      onClick={() => {
                        setSelectedGuru(guru.id);
                        setTimeout(() => nextStep(), 300);
                      }}
                      className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 ${
                        selectedGuru === guru.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-500/20 shadow-xl scale-105"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
                      }`}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`relative w-16 h-16 rounded-full overflow-hidden border-4 transition-all ${
                            selectedGuru === guru.id ? "border-blue-500 shadow-lg" : "border-slate-200 dark:border-slate-700"
                          }`}>
                            {guru.avatar ? (
                              <img
                                src={guru.avatar.startsWith('/') || guru.avatar.startsWith('http') ? guru.avatar : `/${guru.avatar}`}
                                alt={guru.nama_guru || guru.username}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold ${guru.avatar ? 'hidden' : ''}`}
                            >
                              {(guru.nama_guru || guru.username || "G").charAt(0)}
                            </div>
                          </div>
                          {selectedGuru === guru.id && (
                            <div className="ml-auto">
                              <CheckCircle className="h-6 w-6 text-blue-600" />
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                          {guru.nama_guru || guru.username || "Guru BK"}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {guru.mata_keahlian || "Bimbingan Konseling"}
                        </p>
                        {guru.email && (
                          <p className="text-xs text-slate-500 dark:text-slate-500">{guru.email}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Pilih Jadwal */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pilih Jadwal</h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Pilih waktu konsultasi dengan {selectedGuruData?.nama_guru || "guru"}
                  </p>
                </div>
                {loadingJadwal ? (
                  <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-800">
                    <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Memuat jadwal...</p>
                  </div>
                ) : jadwalKosong.length === 0 ? (
                  <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800">
                    <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      Tidak ada jadwal kosong untuk {selectedGuruData?.nama_guru || "guru ini"}.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {jadwalKosong.map((jadwal) => (
                      <button
                        key={jadwal.id}
                        type="button"
                        onClick={() => {
                          setSelectedJadwal(jadwal.id);
                          setTimeout(() => nextStep(), 300);
                        }}
                        className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-300 ${
                          selectedJadwal === jadwal.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-500/20 shadow-xl scale-105"
                            : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">{jadwal.hari}</p>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm">{jadwal.jam_mulai} - {jadwal.jam_selesai}</span>
                            </div>
                          </div>
                          {selectedJadwal === jadwal.id && (
                            <CheckCircle className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Kembali
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Isi Catatan */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Catatan / Keluhan</h2>
                  <p className="text-slate-600 dark:text-slate-400">Jelaskan masalah yang ingin dikonsultasikan</p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <MessageSquare className="inline h-4 w-4 mr-2" />
                    Detail Masalah
                  </label>
                  <textarea
                    value={keluhan}
                    onChange={(e) => setKeluhan(e.target.value)}
                    rows={6}
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    placeholder="Ceritakan masalah atau keluhan yang ingin Anda konsultasikan dengan detail..."
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !keluhan.trim()}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        Kirim Pengajuan
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 font-bold text-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl flex items-center justify-center gap-3 text-lg"
        >
          <Sparkles className="h-6 w-6" />
          Ajukan Konsultasi Baru
        </button>
      )}

      {/* Daftar Konsultasi */}
      <div>
        <h2 className="mb-6 text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          Daftar Konsultasi Saya
        </h2>
        {konsultasi.length === 0 ? (
          <div className="rounded-2xl border-2 border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <MessageSquare className="mx-auto h-16 w-16 text-slate-400 mb-4" />
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
              Belum ada konsultasi
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Klik "Ajukan Konsultasi Baru" untuk membuat pengajuan
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {konsultasi.map((konsultasiItem) => (
              <div
                key={konsultasiItem.id}
                className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-100/30 blur-3xl dark:bg-blue-500/10"></div>
                <div className="relative z-10">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white shadow-lg">
                        {(konsultasiItem.guru || "G").charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {konsultasiItem.guru || konsultasiItem.namaGuru || "Guru BK"}
                        </h3>
                        <div className="mt-1 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(konsultasiItem.tanggal)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{konsultasiItem.jam || konsultasiItem.jamKonsultasi || "-"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
                        konsultasiItem.status
                      )}`}
                    >
                      {getStatusIcon(konsultasiItem.status)}
                      {konsultasiItem.status === "diterima" ? "Disetujui" : 
                       konsultasiItem.status === "menunggu" ? "Pending" : 
                       konsultasiItem.status === "ditolak" ? "Ditolak" : 
                       konsultasiItem.status === "progress" ? "Progress" :
                       konsultasiItem.status === "selesai" ? "Selesai" :
                       konsultasiItem.status}
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <MessageSquare className="h-4 w-4" />
                      Keluhan
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-2">{konsultasiItem.keluhan || "-"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
