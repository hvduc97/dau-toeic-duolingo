"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { sampleToeicTests } from "@/data/toeicTests";
import { ToeicTest } from "@/types/toeic";
import { GraduationCap, Award, Play, Filter, ShieldCheck, Sparkles, Layers, BookOpen, Clock, ChevronRight, CheckCircle2 } from "lucide-react";
import { soundManager } from "@/lib/soundEffects";
import PracticeModal from "@/components/mock-test/PracticeModal";

interface StoredTestResult {
  totalScore: number;
  listeningScore: number;
  readingScore: number;
  totalCorrect: number;
  completedAt?: string;
}

const SERIES_TABS = [
  { id: "ALL", label: "Tất cả" },
  { id: "Pass TOEIC", label: "Pass TOEIC (6 đề)" },
  { id: "Crack TOEIC Vol 1", label: "Crack TOEIC Vol 1" },
  { id: "Crack TOEIC Vol 2", label: "Crack TOEIC Vol 2" },
  { id: "ETS Series", label: "ETS Series" },
  { id: "CUSTOM", label: "Đề Admin / Cào mới" },
];

export default function MockTestListPage() {
  const [selectedSeries, setSelectedSeries] = useState<string>("ALL");
  const [filterDifficulty, setFilterDifficulty] = useState<string>("Tất cả");
  const [tests, setTests] = useState<ToeicTest[]>(sampleToeicTests);
  const [testResults, setTestResults] = useState<Record<string, StoredTestResult>>({});
  const [practiceModalTest, setPracticeModalTest] = useState<ToeicTest | null>(null);

  // Load custom tests from API and LocalStorage
  useEffect(() => {
    const loadAllTests = async () => {
      let combined = [...sampleToeicTests];

      try {
        const res = await fetch("/api/admin/tests");
        const data = await res.json();
        if (res.ok && data.tests && data.tests.length > 0) {
          const apiIds = new Set(data.tests.map((t: ToeicTest) => t.id));
          combined = [...data.tests, ...sampleToeicTests.filter((t) => !apiIds.has(t.id))];
        }
      } catch (err) {
        console.error("Lỗi khi fetch đề thi từ API:", err);
      }

      // Merge with localStorage custom tests
      try {
        const localCustom = JSON.parse(localStorage.getItem("dau_custom_tests") || "[]") as ToeicTest[];
        if (localCustom.length > 0) {
          const customIds = new Set(localCustom.map((t) => t.id));
          combined = [...localCustom, ...combined.filter((t) => !customIds.has(t.id))];
        }
      } catch {}

      setTests(combined);

      // Load results history for all tests
      try {
        const resultsMap: Record<string, StoredTestResult> = {};
        for (const test of combined) {
          const saved = localStorage.getItem(`dau_test_result_${test.id}`);
          if (saved) {
            resultsMap[test.id] = JSON.parse(saved);
          }
        }
        setTestResults(resultsMap);
      } catch {}
    };

    loadAllTests();
  }, []);

  const filteredTests = tests.filter((t) => {
    // Filter series
    if (selectedSeries !== "ALL") {
      if (selectedSeries === "CUSTOM") {
        if (!t.isCustom && t.series !== "Khác") return false;
      } else {
        if (t.series !== selectedSeries) return false;
      }
    }

    // Filter difficulty
    if (filterDifficulty !== "Tất cả") {
      if (t.difficulty !== filterDifficulty) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 text-xs font-black">
              <GraduationCap className="w-4 h-4" />
              Đậu TOEIC — Phòng Thi Online Chuẩn ETS
            </div>
            <Link
              href="/admin/mock-tests"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs font-black transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Quản Trị Đề Thi</span>
            </Link>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Đề Thi Thử TOEIC Online
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
            Làm đề thi thử TOEIC Listening &amp; Reading sát đề thật, chấm điểm tự động, xem giải thích từng câu, dịch song ngữ và thống kê điểm mạnh yếu theo từng Part.
          </p>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block mr-1" />
          {["Tất cả", "Dễ", "Trung bình", "Khó"].map((diff) => (
            <button
              key={diff}
              onClick={() => {
                soundManager.playClick();
                setFilterDifficulty(diff);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterDifficulty === diff
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Series Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100 dark:border-slate-800/80">
        {SERIES_TABS.map((tab) => {
          const isActive = selectedSeries === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedSeries(tab.id);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-cyan-600 text-white shadow-duo-cyan"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850"
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => {
          const isCustom = test.isCustom;
          const result = testResults[test.id];

          return (
            <div
              key={test.id}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 transition-all space-y-4 flex flex-col justify-between hover:shadow-lg ${
                isCustom
                  ? "border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-500"
                  : "border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-400"
              }`}
            >
              <div className="space-y-3">
                {/* Badges */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                      {test.series || "Đề thi"}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      Năm {test.year}
                    </span>
                    {isCustom && (
                      <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Admin
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                      test.difficulty === "Khó"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        : test.difficulty === "Dễ"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {test.difficulty}
                  </span>
                </div>

                {/* Title with link to intro */}
                <Link
                  href={`/mock-test/${test.id}/intro`}
                  onClick={() => soundManager.playClick()}
                  className="block group"
                >
                  <h2 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {test.title}
                  </h2>
                </Link>

                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {test.description}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="font-black text-slate-900 dark:text-white">
                      {test.questions?.length || test.totalQuestions}
                    </div>
                    <div className="text-[10px] text-slate-400">Số câu</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="font-black text-slate-900 dark:text-white">{test.durationMinutes}&apos;</div>
                    <div className="text-[10px] text-slate-400">Thời gian</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="font-black text-cyan-600 dark:text-cyan-400">990</div>
                    <div className="text-[10px] text-slate-400">Thang ETS</div>
                  </div>
                </div>

                {/* User past attempt status */}
                <div className="pt-1">
                  {result ? (
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Đã thi: {result.totalScore}/990</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        L: {result.listeningScore} · R: {result.readingScore}
                      </span>
                    </div>
                  ) : (
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 text-center">
                      Chưa làm đề này
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/mock-test/${test.id}?mode=test`}
                    onClick={() => soundManager.playCorrect()}
                    className="btn-duo flex-1 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs shadow-duo-cyan text-center flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Thi Thử (120&apos;)</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setPracticeModalTest(test);
                    }}
                    className="btn-duo flex-1 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 text-center flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>Luyện Tập</span>
                  </button>
                </div>

                <div className="text-center">
                  <Link
                    href={`/mock-test/${test.id}/intro`}
                    onClick={() => soundManager.playClick()}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    <span>Xem cấu trúc đề &amp; giải thích</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Practice Modal */}
      <PracticeModal
        isOpen={!!practiceModalTest}
        test={practiceModalTest}
        onClose={() => setPracticeModalTest(null)}
      />
    </div>
  );
}
