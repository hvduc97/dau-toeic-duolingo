"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Headphones,
  BookOpen,
  Bookmark,
  Flame,
  Trophy,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Clock,
  Volume2,
  TrendingUp,
  Brain
} from "lucide-react";
import { soundManager } from "@/lib/soundEffects";

export default function HomePage() {
  const [xp, setXp] = useState(65);
  const [streak, setStreak] = useState(3);
  const [recentScore, setRecentScore] = useState<{ score: number; date: string } | null>(null);

  useEffect(() => {
    const savedXp = localStorage.getItem("dau_xp");
    if (savedXp) setXp(parseInt(savedXp, 10));

    const savedStreak = localStorage.getItem("dau_streak_days");
    if (savedStreak) setStreak(parseInt(savedStreak, 10));

    const savedLastResult = localStorage.getItem("dau_last_test_result");
    if (savedLastResult) {
      try {
        const parsed = JSON.parse(savedLastResult);
        setRecentScore({
          score: parsed.totalScore || 750,
          date: parsed.completedAt ? new Date(parsed.completedAt).toLocaleDateString("vi-VN") : "Hôm nay",
        });
      } catch (_) {}
    }
  }, []);

  const handleCardClick = () => {
    soundManager.playCorrect();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-10">
      {/* Hero Banner with Duolingo Mascot style */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-emerald-600 to-teal-700 text-white p-6 sm:p-10 shadow-xl shadow-brand-600/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-black tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Chất lượng là ưu tiên hàng đầu
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              HỌC CÙNG <br />
              <span className="text-amber-300 drop-shadow-sm">LET&apos;S ENGLISH</span>
            </h1>
            <p className="text-emerald-50 text-sm sm:text-base leading-relaxed">
              Trang bị trọn gói 4 kỹ năng với phương pháp luyện nghe 4 chế độ đột phá, phòng thi thử 120 phút chấm điểm ETS 990 và thẻ từ vựng Spaced Repetition thông minh.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <Link
                href="/mock-test"
                onClick={handleCardClick}
                className="btn-duo px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold shadow-duo-yellow flex items-center gap-2 transition-all"
              >
                <GraduationCap className="w-5 h-5 text-slate-900" />
                Vào Phòng Thi Thử Ngay
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                href="/listening"
                onClick={handleCardClick}
                className="btn-duo px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold backdrop-blur-sm border border-white/20 flex items-center gap-2 transition-all"
              >
                <Headphones className="w-5 h-5" />
                Luyện Nghe 4 Chế Độ
              </Link>
            </div>
          </div>

          {/* Gamification Progress Widget */}
          <div className="w-full md:w-80 bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 p-5 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <img src="/images/logo.png" alt="LET'S English" className="w-10 h-10 object-contain" />
                <div>
                  <h3 className="font-extrabold text-sm">LET&apos;S English</h3>
                  <p className="text-[11px] text-brand-600 dark:text-brand-400 font-bold">Chất lượng hàng đầu</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-500 font-black text-sm">
                <Flame className="w-4 h-4 fill-amber-500" />
                {streak} Ngày
              </div>
            </div>

            {/* XP Goal bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Điểm kinh nghiệm (XP)</span>
                <span className="text-brand-600 dark:text-brand-400">{xp} / 100 XP</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, xp)}%` }}
                />
              </div>
            </div>

            {recentScore ? (
              <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-100 dark:border-brand-900/50 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400">Điểm thi gần nhất</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">{recentScore.score} / 990</div>
                </div>
                <Trophy className="w-7 h-7 text-amber-500" />
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <Brain className="w-4 h-4 text-brand-500" />
                <span>Hoàn thành 1 bài thi để nhận điểm quy đổi ETS 990!</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4 Core Pillars of Dau TOEIC */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-brand-600 dark:text-brand-400">4 Trụ Cột</span> Luyện Thi Cốt Lõi
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
              Phương pháp học tập khoa học của LET&apos;S English — Cam kết chất lượng là ưu tiên hàng đầu
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Mock Test */}
          <Link
            href="/mock-test"
            onClick={handleCardClick}
            className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-400 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform shadow-duo-cyan">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Chuẩn ETS 2024
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-brand-600 transition-colors">
                  Phòng Thi Thử TOEIC
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                  Đề Full 200 câu tính giờ 120 phút hoặc luyện riêng từng Part 1–7. Tự động chấm điểm thang 990 và giải thích chi tiết.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400">
              <span>Bắt đầu thi thử</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: 4 Listening Modes */}
          <Link
            href="/listening"
            onClick={handleCardClick}
            className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-duo-blue dark:hover:border-duo-blue shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform shadow-duo-blue">
                <Headphones className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  Đặc sắc LET&apos;S English
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-sky-600 transition-colors">
                  Luyện Nghe 4 Chế Độ
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                  4 cấp độ: Điền từ (Dictation), Chép chính tả, Nghe Check, và Nghe Full kèm chỉnh tốc độ (0.75x–1.25x) và transcript song ngữ.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400">
              <span>Khám phá 4 chế độ</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Vocabulary SRS */}
          <Link
            href="/vocabulary"
            onClick={handleCardClick}
            className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-duo-green dark:hover:border-duo-green shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform shadow-duo-green">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Spaced Repetition
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-emerald-600 transition-colors">
                  Từ Vựng Flashcard SRS
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                  600 từ vựng cốt lõi TOEIC theo chủ đề (Hợp đồng, Văn phòng, Tài chính...). Thẻ lật 3D có phát âm và phân loại trí nhớ.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Lật thẻ học ngay</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Grammar Part 5 */}
          <Link
            href="/grammar"
            onClick={handleCardClick}
            className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-duo-purple dark:hover:border-duo-purple shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform shadow-duo">
                <Bookmark className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Part 5 & Sổ Tay
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 group-hover:text-purple-600 transition-colors">
                  Ngữ Pháp & Sổ Tay Sai
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 leading-relaxed">
                  Luyện câu hỏi Part 5 theo chuyên đề (Thì, Mệnh đề quan hệ, Từ loại...). Tự động lưu sổ tay câu làm sai để ôn tập lại.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>Luyện ngữ pháp</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Gamification Highlights & Features Showcase */}
      <section className="p-8 rounded-3xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Học Tiếng Anh Mỗi Ngày — Không Còn Buồn Ngủ
            </h3>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-2xl">
            Tận hưởng âm thanh phản hồi Web Audio SFX giòn giã khi làm đúng, hiệu ứng pháo hoa Confetti khi chinh phục điểm cao, và trợ lý Google Gemini giải thích ngữ pháp tức thì.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/settings"
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          >
            Cấu hình Gemini AI
          </Link>
          <Link
            href="/mock-test"
            onClick={handleCardClick}
            className="btn-duo px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-black shadow-duo-cyan transition-all"
          >
            Làm bài ngay
          </Link>
        </div>
      </section>
    </div>
  );
}
