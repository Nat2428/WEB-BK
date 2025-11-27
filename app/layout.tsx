import type { Metadata } from "next";
import "../styles/globals.css";
import ConditionalNavbar from "../components/ConditionalNavbar";
import Footer from "../components/Footer";
import DarkModeToggle from "../components/DarkModeToggle";
import NextJsLogo from "../components/NextJsLogo";

export const metadata: Metadata = {
  title: "Sistem Informasi BK SMK Taruna Bhakti",
  description: "Platform bimbingan konseling untuk siswa, guru BK, dan admin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-50">
        <div className="flex min-h-screen flex-col">
          <ConditionalNavbar />
          <main className="flex-1">{children}</main>
          <footer className="mt-auto">
            <Footer />
          </footer>
        </div>
        <div className="fixed bottom-6 right-6">
          <DarkModeToggle />
        </div>
        <NextJsLogo />
      </body>
    </html>
  );
}
