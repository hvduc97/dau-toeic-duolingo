import React from "react";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2.5">
          <img src="/images/logo.png" alt="LET'S English" className="w-6 h-6 object-contain" />
          <span className="font-extrabold text-slate-800 dark:text-slate-200">
            <span className="text-brand-600">LET&apos;S</span>{" "}
            <span className="text-earth-600">English</span>
          </span>
          <span className="hidden sm:inline">— Chất lượng là ưu tiên hàng đầu</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/mock-test" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Phòng thi thử ETS
          </Link>
          <Link href="/listening" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Luyện nghe 4 chế độ
          </Link>
          <Link href="/vocabulary" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Từ vựng Flashcard
          </Link>
          <Link href="/grammar" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Ngữ pháp Part 5
          </Link>
          <Link href="/settings" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Cấu hình AI
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <span>Phát triển với</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>cho người tự học TOEIC</span>
        </div>
      </div>
    </footer>
  );
}
