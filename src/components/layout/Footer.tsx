import React from "react";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
            🌱
          </div>
          <span className="font-bold text-slate-700 dark:text-slate-300">Đậu TOEIC</span>
          <span>— Nền tảng luyện thi TOEIC 4 kỹ năng lấy cảm hứng từ dauenglish.com</span>
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
