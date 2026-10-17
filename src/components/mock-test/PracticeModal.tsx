"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ToeicTest } from "@/types/toeic";
import { X, Play, Headphones, BookOpen, Layers, CheckSquare, Square, Clock, Sparkles } from "lucide-react";
import { soundManager } from "@/lib/soundEffects";

interface PracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  test: ToeicTest | null;
}

const PART_SPECS: Record<number, { name: string; type: "Listening" | "Reading"; questions: number; desc: string }> = {
  1: { name: "Part 1", type: "Listening", questions: 6, desc: "Mô tả tranh" },
  2: { name: "Part 2", type: "Listening", questions: 25, desc: "Hỏi – đáp" },
  3: { name: "Part 3", type: "Listening", questions: 39, desc: "Đoạn hội thoại" },
  4: { name: "Part 4", type: "Listening", questions: 30, desc: "Bài nói ngắn" },
  5: { name: "Part 5", type: "Reading", questions: 30, desc: "Hoàn thành câu" },
  6: { name: "Part 6", type: "Reading", questions: 16, desc: "Hoàn thành đoạn văn" },
  7: { name: "Part 7", type: "Reading", questions: 54, desc: "Đọc hiểu văn bản" },
};

export default function PracticeModal({ isOpen, onClose, test }: PracticeModalProps) {
  const router = useRouter();
  const [selectedParts, setSelectedParts] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  const [instantExplain, setInstantExplain] = useState<boolean>(true);

  if (!isOpen || !test) return null;

  const totalQuestionsSelected = selectedParts.reduce(
    (sum, part) => sum + (PART_SPECS[part]?.questions || 0),
    0
  );

  const handleSelectPreset = (preset: "full" | "listening" | "reading") => {
    soundManager.playClick();
    if (preset === "full") {
      setSelectedParts([1, 2, 3, 4, 5, 6, 7]);
    } else if (preset === "listening") {
      setSelectedParts([1, 2, 3, 4]);
    } else if (preset === "reading") {
      setSelectedParts([5, 6, 7]);
    }
  };

  const togglePart = (partNum: number) => {
    soundManager.playClick();
    setSelectedParts((prev) => {
      if (prev.includes(partNum)) {
        if (prev.length === 1) return prev; // Keep at least 1 part selected
        return prev.filter((p) => p !== partNum);
      } else {
        return [...prev, partNum].sort((a, b) => a - b);
      }
    });
  };

  const handleStartPractice = () => {
    soundManager.playCorrect();
    const partsParam = selectedParts.join(",");
    const explainParam = instantExplain ? "1" : "0";
    router.push(`/mock-test/${test.id}/play?mode=practice&parts=${partsParam}&explain=${explainParam}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300">
                {test.series || "Đề thi thử"}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Luyện tập tự do
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
              Luyện tập: {test.title}
            </h3>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Presets */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 block">
              1. Chọn phạm vi nhanh
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset("full")}
                className={`p-3 rounded-2xl border-2 text-center text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                  selectedParts.length === 7
                    ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-300"
                }`}
              >
                <Layers className="w-4 h-4 text-cyan-500" />
                <span>Toàn bộ 7 Part</span>
                <span className="text-[10px] text-slate-400 font-normal">200 câu</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset("listening")}
                className={`p-3 rounded-2xl border-2 text-center text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                  selectedParts.length === 4 && selectedParts.every((p) => p <= 4)
                    ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-300"
                }`}
              >
                <Headphones className="w-4 h-4 text-sky-500" />
                <span>Listening</span>
                <span className="text-[10px] text-slate-400 font-normal">Part 1 – 4 (100 câu)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset("reading")}
                className={`p-3 rounded-2xl border-2 text-center text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                  selectedParts.length === 3 && selectedParts.every((p) => p >= 5)
                    ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-300"
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>Reading</span>
                <span className="text-[10px] text-slate-400 font-normal">Part 5 – 7 (100 câu)</span>
              </button>
            </div>
          </div>

          {/* Individual Part Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Tùy chọn từng phần cụ thể
              </label>
              <span className="text-xs font-black text-cyan-600 dark:text-cyan-400">
                Đã chọn: {totalQuestionsSelected} câu
              </span>
            </div>

            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6, 7].map((partNum) => {
                const spec = PART_SPECS[partNum];
                const isSelected = selectedParts.includes(partNum);

                return (
                  <div
                    key={partNum}
                    onClick={() => togglePart(partNum)}
                    className={`flex items-center justify-between p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-cyan-500/80 bg-cyan-50/60 dark:bg-cyan-950/20 text-slate-900 dark:text-white"
                        : "border-slate-100 dark:border-slate-800 hover:border-slate-200 text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs">{spec.name}:</span>
                          <span className="text-xs font-medium">{spec.desc}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {spec.type} · {spec.questions} câu hỏi
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        spec.type === "Listening"
                          ? "bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300"
                          : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {spec.questions} câu
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mode Highlights */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/60 space-y-3">
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <span className="font-bold">Không tính giờ gắt gao:</span> Đồng hồ đếm xuôi giúp bạn thoải mái suy nghĩ, làm liền mạch từ câu này sang câu khác và nộp bài bất kỳ lúc nào.
              </div>
            </div>

            <label className="flex items-center gap-2.5 pt-2 border-t border-amber-200/50 dark:border-amber-900/50 cursor-pointer">
              <input
                type="checkbox"
                checked={instantExplain}
                onChange={(e) => setInstantExplain(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300"
              />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Bật nút &quot;Xem giải thích ngay&quot; sau khi chọn đáp án
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            Đóng
          </button>
          <button
            type="button"
            disabled={selectedParts.length === 0}
            onClick={handleStartPractice}
            className="flex-2 py-3 px-6 rounded-2xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-black shadow-duo-cyan transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Bắt Đầu Luyện ({totalQuestionsSelected} câu)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
