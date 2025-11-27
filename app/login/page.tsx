"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { loginUser } from "@/lib/actions";
import { useRouter } from "next/navigation";

// Gunakan foto dari folder public/images
// Simpan foto dengan nama: login-background.jpg atau login-background.png
// Path: public/images/login-background.jpg
const loginBackgroundImage = "/images/login-background.jpg";

export default function LoginPage() {
  const [nisn, setNisn] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("identifier", nisn);
      formData.append("password", password);

      const user = await loginUser(formData);

      // Set session di cookie
      document.cookie = `user_id=${user.id}; path=/; max-age=${
        60 * 60 * 24 * 7
      }`;

      // Redirect berdasarkan role
      if (user.role === "siswa") {
        router.push("/siswa");
      } else if (user.role === "guru") {
        router.push("/guru");
      } else if (user.role === "admin" || user.role === "superadmin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Login gagal. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12">
      {/* Background Image dengan Overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${loginBackgroundImage})`,
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
      <section className="relative z-10 mx-auto w-full max-w-md px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md p-3 shadow-lg border border-white/30">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="mb-3 text-4xl font-extrabold text-white">
            Masuk Konsultasi BK
          </h1>
          <p className="text-base text-blue-50">
            Gunakan NIPD/Email dan kata sandi yang diberikan sekolah.
          </p>
        </div>

        {/* Login Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/95 backdrop-blur-lg p-8 shadow-2xl dark:bg-slate-900/95">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-blue-200/20 blur-3xl dark:bg-blue-500/10"></div>
          <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-purple-200/20 blur-3xl dark:bg-purple-500/10"></div>

          <div className="relative z-10">
            {error && (
              <div className="mb-6 rounded-xl bg-red-50/95 backdrop-blur-sm border border-red-200 p-4 text-sm font-medium text-red-700 dark:bg-red-500/20 dark:border-red-500/30 dark:text-red-400">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2.5">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  NIPD / Email
                </span>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 text-base text-slate-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-400"
                    placeholder="Masukkan NIPD atau Email"
                    required
                    disabled={loading}
                  />
                </div>
              </label>

              <label className="flex flex-col gap-2.5">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Kata Sandi
                </span>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 text-base text-slate-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-400"
                    placeholder="Masukkan password"
                    required
                    disabled={loading}
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
                      Masuk
                      <svg
                        className="h-5 w-5 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/90 drop-shadow-lg transition-all hover:text-white hover:scale-105"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
