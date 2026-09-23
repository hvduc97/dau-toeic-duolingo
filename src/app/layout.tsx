import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "LET'S English — Chất Lượng Là Ưu Tiên Hàng Đầu | Luyện Thi TOEIC 4 Kỹ Năng",
  description: "LET'S English — Nền tảng học và luyện thi TOEIC 4 kỹ năng với phương châm chất lượng là ưu tiên hàng đầu. Đề thi thử ETS 990, luyện nghe 4 chế độ, từ vựng Flashcard SRS và hơn 5.000 câu ngữ pháp giải thích chi tiết.",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
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
