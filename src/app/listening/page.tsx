"use client";

import React, { useState } from "react";
import Link from "next/link";
import { sampleListeningLessons } from "@/data/listeningLessons";
import { Headphones, CheckCircle2, Play, Flame, Sparkles, Filter } from "lucide-react";
import { soundManager } from "@/lib/soundEffects";

export default function ListeningListPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");

  const categories = ["Tất cả", "Part 1 - Photo", "Part 2 - Q&A", "Part 3 - Conversations"];

  const filteredLessons = sampleListeningLessons.filter((l) => {
    if (selectedCategory === "Tất cả") return true;
    return l.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 text-xs font-black mb-2">
            <Headphones className="w-4 h-4" />
            Đặc Sắc LET&apos;S English
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Luyện Nghe 4 Chế Độ Đột Phá
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Phương pháp luyện nghe từng bước: Điền từ, Chép chính tả, Nghe Check và Nghe Full transcript song ngữ.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-sky-600 text-white shadow-duo-blue"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Modes Explanation Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-3xl bg-sky-50/50 dark:bg-slate-900/60 border border-sky-100 dark:border-slate-800">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 space-y-1">
          <div className="font-extrabold text-xs text-sky-600 dark:text-sky-400">1. Nghe Điền Từ</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Điền các từ khóa quan trọng còn thiếu để kích hoạt phản xạ bắt âm chính xác.
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 space-y-1">
          <div className="font-extrabold text-xs text-sky-600 dark:text-sky-400">2. Nghe Chép Chính Tả</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Gõ toàn bộ câu nghe được, hệ thống so khớp độ chính xác từng từ và chấm %.
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 space-y-1">
          <div className="font-extrabold text-xs text-sky-600 dark:text-sky-400">3. Nghe Check</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Nghe từng câu ngắn, lật xem bản dịch song ngữ Anh - Việt để đối chiếu.
          </p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-sky-100 dark:border-slate-700 space-y-1">
          <div className="font-extrabold text-xs text-sky-600 dark:text-sky-400">4. Nghe Full</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Audio player chỉnh tốc độ (0.75x–1.25x), tua 5s và cuộn transcript song ngữ.
          </p>
        </div>
      </div>

      {/* Lessons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-400 shadow-sm transition-all space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black px-2.5 py-1 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                  {lesson.category}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {lesson.level}
                </span>
              </div>

              <h2 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                {lesson.title}
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gồm {lesson.sentences.length} câu đàm thoại thực tế trong đề thi TOEIC.
              </p>
            </div>

            <Link
              href={`/listening/${lesson.id}`}
              onClick={() => soundManager.playCorrect()}
              className="btn-duo w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs shadow-duo-blue flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              Luyện Cả 4 Chế Độ Ngay
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
