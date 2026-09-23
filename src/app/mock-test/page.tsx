"use client";

import React, { useState } from "react";
import Link from "next/link";
import { sampleToeicTests } from "@/data/toeicTests";
import { GraduationCap, Clock, Award, CheckCircle2, Play, Filter, BookOpen } from "lucide-react";
import { soundManager } from "@/lib/soundEffects";

export default function MockTestListPage() {
  const [filterDifficulty, setFilterDifficulty] = useState<string>("Tất cả");

  const filteredTests = sampleToeicTests.filter((t) => {
    if (filterDifficulty === "Tất cả") return true;
    return t.difficulty === filterDifficulty;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-xs font-black mb-2">
            <GraduationCap className="w-4 h-4" />
            Phòng Thi Chuẩn ETS
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Đề Thi Thử TOEIC 990 Điểm
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Mô phỏng 100% thời gian thi thực tế 120 phút với 200 câu hỏi Listening & Reading.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          {["Tất cả", "Trung bình", "Khó"].map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterDifficulty === diff
                  ? "bg-brand-600 text-white shadow-duo-cyan"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-400 shadow-sm transition-all space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  Năm {test.year}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                    test.difficulty === "Khó"
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  }`}
                >
                  Độ khó: {test.difficulty}
                </span>
              </div>

              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {test.title}
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {test.description}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="font-black text-slate-900 dark:text-white">{test.totalQuestions}</div>
                  <div className="text-[10px] text-slate-400">Câu hỏi</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="font-black text-slate-900 dark:text-white">{test.durationMinutes} phút</div>
                  <div className="text-[10px] text-slate-400">Thời gian</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="font-black text-amber-500">990</div>
                  <div className="text-[10px] text-slate-400">Thang ETS</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Link
                href={`/mock-test/${test.id}`}
                onClick={() => soundManager.playCorrect()}
                className="btn-duo flex-1 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm shadow-duo-cyan text-center flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                Vào Phòng Thi Full Test
              </Link>
              <Link
                href={`/mock-test/${test.id}?mode=part`}
                onClick={() => soundManager.playCorrect()}
                className="btn-duo px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700"
                title="Luyện riêng theo từng phần"
              >
                Luyện theo Part
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
