"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { sampleToeicTests } from "@/data/toeicTests";
import { ToeicTest } from "@/types/toeic";
import { soundManager } from "@/lib/soundEffects";
import PracticeModal from "@/components/mock-test/PracticeModal";
import {
  ArrowLeft,
  Play,
  BookOpen,
  Clock,
  Headphones,
  FileText,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
} from "lucide-react";

const TOEIC_PARTS_BREAKDOWN = [
  { part: "Part 1", skill: "Nghe", type: "Mô tả tranh", count: 6, desc: "Quan sát hình ảnh và chọn câu mô tả đúng nhất." },
  { part: "Part 2", skill: "Nghe", type: "Hỏi – đáp", count: 25, desc: "Nghe câu hỏi hoặc phát biểu và chọn câu hồi đáp phù hợp nhất (3 lựa chọn A, B, C)." },
  { part: "Part 3", skill: "Nghe", type: "Đoạn hội thoại", count: 39, desc: "Nghe các đoạn đối thoại giữa 2 hoặc 3 người và trả lời câu hỏi kèm biểu đồ." },
  { part: "Part 4", skill: "Nghe", type: "Bài nói ngắn", count: 30, desc: "Nghe thông báo, bản tin, bài thuyết trình hoặc tin nhắn thoại của một người nói." },
  { part: "Part 5", skill: "Đọc", type: "Hoàn thành câu", count: 30, desc: "Điền từ loại, thì của động từ, liên từ hoặc từ vựng vào chỗ trống trong câu." },
  { part: "Part 6", skill: "Đọc", type: "Hoàn thành đoạn văn", count: 16, desc: "Điền từ hoặc chọn cả câu hoàn chỉnh phù hợp với ngữ cảnh của bức thư/thông báo." },
  { part: "Part 7", skill: "Đọc", type: "Đọc hiểu đoạn văn", count: 54, desc: "Đọc hiểu đoạn đơn (Single), đoạn kép (Double) và đoạn ba (Triple) đa văn bản." },
];

export default function MockTestIntroPage({ params }: { params: Promise<{ testId: string }> }) {
  const resolvedParams = use(params);
  const [test, setTest] = useState<ToeicTest>(() => {
    return sampleToeicTests.find((t) => t.id === resolvedParams.testId) || sampleToeicTests[0];
  });
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);

  useEffect(() => {
    const found = sampleToeicTests.find((t) => t.id === resolvedParams.testId);
    if (found) {
      setTest(found);
    } else {
      // Check local custom
      try {
        const localCustom = JSON.parse(localStorage.getItem("dau_custom_tests") || "[]") as ToeicTest[];
        const localTest = localCustom.find((item) => item.id === resolvedParams.testId);
        if (localTest) {
          setTest(localTest);
          return;
        }
      } catch {}

      // Fetch from API
      fetch(`/api/admin/tests/${resolvedParams.testId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.test) setTest(d.test);
        })
        .catch(() => {});
    }
  }, [resolvedParams.testId]);

  // Find other tests in the same series
  const otherTestsInSeries = sampleToeicTests.filter(
    (t) => t.series === test.series && t.id !== test.id
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link
          href="/mock-test"
          className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Đề thi thử</span>
        </Link>
        <span>›</span>
        <span className="text-slate-600 dark:text-slate-300">
          {test.series || "Đậu TOEIC"}
        </span>
        <span>›</span>
        <span className="text-cyan-600 dark:text-cyan-400 font-bold truncate">
          {test.title}
        </span>
      </nav>

      {/* Main Intro Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Miễn phí 100%
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              test.difficulty === "Khó"
                ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                : test.difficulty === "Dễ"
                ? "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
            }`}
          >
            Độ khó: {test.difficulty}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Năm {test.year}
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {test.title} — Đề thi thử TOEIC online
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {test.description}
          </p>
        </div>

        {/* Quick Specs Highlight Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
          <div className="p-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Số lượng câu</div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {test.questions?.length || test.totalQuestions} câu hỏi
            </div>
            <div className="text-[11px] text-slate-400">100 Nghe + 100 Đọc</div>
          </div>

          <div className="p-3 border-y sm:border-y-0 sm:border-x border-slate-200 dark:border-slate-700">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tổng thời gian</div>
            <div className="text-xl font-black text-cyan-600 dark:text-cyan-400">
              {test.durationMinutes} phút
            </div>
            <div className="text-[11px] text-slate-400">Nghe 45&apos; · Đọc 75&apos;</div>
          </div>

          <div className="p-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Thang điểm chuẩn</div>
            <div className="text-xl font-black text-amber-500">
              990 Điểm
            </div>
            <div className="text-[11px] text-slate-400">Chuẩn quy đổi ETS</div>
          </div>
        </div>

        {/* Big CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Link
            href={`/mock-test/${test.id}?mode=test`}
            onClick={() => soundManager.playCorrect()}
            className="btn-duo py-4 px-6 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-base shadow-duo-cyan text-center flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Thi Thử Như Thật (120&apos;)</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setIsPracticeModalOpen(true);
            }}
            className="btn-duo py-4 px-6 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-black text-base border-2 border-slate-200 dark:border-slate-700 text-center flex items-center justify-center gap-2 shadow-sm"
          >
            <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <span>Luyện Tập Từng Phần</span>
          </button>
        </div>
      </div>

      {/* Structure Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <span>Cấu trúc đề thi ({test.title})</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Đề thi bao gồm trọn vẹn 200 câu hỏi liên tục theo chuẩn quốc tế của Viện Khảo thí Giáo dục Hoa Kỳ (ETS):
        </p>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 uppercase font-black tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Phần</th>
                <th className="p-3.5">Kỹ năng</th>
                <th className="p-3.5">Dạng bài</th>
                <th className="p-3.5 text-center">Số câu</th>
                <th className="p-3.5 hidden md:table-cell">Mô tả chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {TOEIC_PARTS_BREAKDOWN.map((row) => (
                <tr key={row.part} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-black text-slate-900 dark:text-white whitespace-nowrap">
                    {row.part}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        row.skill === "Nghe"
                          ? "bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300"
                          : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {row.skill}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                    {row.type}
                  </td>
                  <td className="p-3.5 font-black text-center text-slate-900 dark:text-white">
                    {row.count}
                  </td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400 hidden md:table-cell">
                    {row.desc}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50/80 dark:bg-slate-800/60 font-black text-xs border-t border-slate-200 dark:border-slate-800">
              <tr>
                <td colSpan={3} className="p-3.5 text-slate-900 dark:text-white">
                  Tổng cộng (Listening &amp; Reading)
                </td>
                <td className="p-3.5 text-center text-cyan-600 dark:text-cyan-400">
                  200 câu
                </td>
                <td className="p-3.5 text-slate-400 hidden md:table-cell">
                  120 phút làm bài
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Benefits on Dau TOEIC */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Trải nghiệm làm đề trên Đậu TOEIC</span>
        </h2>
        <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Thi thử đủ 120 phút như phòng thi</strong>, hoặc chọn luyện riêng từng Part không giới hạn thời gian để củng cố kỹ năng còn yếu.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Nộp bài là có điểm ngay</strong>, xem lại từng câu kèm giải thích chi tiết, dịch song ngữ Anh – Việt và phân tích ngữ pháp.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Lưu câu sai &amp; từ vựng của đề</strong> vào sổ tay để ôn tập lại bất cứ lúc nào trước kỳ thi thực tế.
            </span>
          </li>
        </ul>
      </div>

      {/* Other Tests In Series */}
      {otherTestsInSeries.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Các đề khác trong bộ {test.series}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {otherTestsInSeries.map((ot) => (
              <Link
                key={ot.id}
                href={`/mock-test/${ot.id}/intro`}
                onClick={() => soundManager.playClick()}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 hover:shadow-sm transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {ot.title}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {ot.difficulty} · 200 câu
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Practice Modal */}
      <PracticeModal
        isOpen={isPracticeModalOpen}
        test={test}
        onClose={() => setIsPracticeModalOpen(false)}
      />
    </div>
  );
}
