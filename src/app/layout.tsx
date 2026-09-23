import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Đậu TOEIC — Luyện thi TOEIC 4 kỹ năng chuẩn ETS & Gamification Duolingo",
  description: "Luyện thi TOEIC online miễn phí với đề thi thử ETS 990, luyện nghe 4 chế độ độc quyền, từ vựng Flashcard SRS và hơn 5.000 câu ngữ pháp giải thích chi tiết.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌱</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var s = localStorage.getItem("dautoeic-theme");
                  var sys = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
                  var dark = s === "dark" || ((!s || s === "system") && sys);
                  if (dark) document.documentElement.classList.add("dark");
                  else document.documentElement.classList.remove("dark");
                } catch (_) {}
              })();
            `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 antialiased selection:bg-brand-500 selection:text-white transition-colors">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
