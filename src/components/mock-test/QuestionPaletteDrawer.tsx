"use client";

import React from "react";
import { ToeicQuestion, ToeicPart } from "@/types/toeic";
import { X, Send } from "lucide-react";
import { soundManager } from "@/lib/soundEffects";

interface QuestionPaletteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  questions: ToeicQuestion[];
  currentQuestionId: number;
  userAnswers: Record<number, "A" | "B" | "C" | "D">;
  flaggedQuestions: Record<number, boolean>;
  onSelectQuestion: (questionId: number) => void;
  onSubmitTest: () => void;
}

const PART_NAMES: Record<number, string> = {
  1: "Part 1 (6 câu)",
  2: "Part 2 (25 câu)",
  3: "Part 3 (39 câu)",
  4: "Part 4 (30 câu)",
  5: "Part 5 (30 câu)",
  6: "Part 6 (16 câu)",
  7: "Part 7 (54 câu)",
};

export default function QuestionPaletteDrawer({
  isOpen,
  onClose,
  questions,
  currentQuestionId,
  userAnswers,
  flaggedQuestions,
  onSelectQuestion,
  onSubmitTest,
}: QuestionPaletteDrawerProps) {
  if (!isOpen) return null;

  const answeredCount = Object.keys(userAnswers).length;

  // Group questions by part
  const questionsByPart = questions.reduce<Record<number, ToeicQuestion[]>>((acc, q) => {
    if (!acc[q.part]) acc[q.part] = [];
    acc[q.part].push(q);
    return acc;
  }, {});

  const parts = Object.keys(questionsByPart).map(Number).sort((a, b) => a - b);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer content */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl border-t-2 border-slate-200 dark:border-slate-800 flex flex-col max-h-[82vh] z-10 animate-in slide-in-from-bottom-6 duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Bảng Câu Hỏi ({answeredCount}/{questions.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Bấm vào số câu để di chuyển nhanh đến vị trí câu hỏi đó
            </p>
          </div>

          <div className="flex items-center gap-2">
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
        </div>

        {/* Legend */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-around sm:justify-start sm:gap-6 text-xs font-bold shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-lg bg-emerald-500" />
            <span className="text-slate-700 dark:text-slate-300">Đã làm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-lg bg-cyan-100 border-2 border-[#0891b2]" />
            <span className="text-slate-700 dark:text-slate-300">Đang xem</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative w-3.5 h-3.5 rounded-lg bg-slate-200 dark:bg-slate-700">
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
            </span>
            <span className="text-slate-700 dark:text-slate-300">Đánh dấu</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
            <span className="text-slate-700 dark:text-slate-300">Chưa làm</span>
          </div>
        </div>

        {/* Drawer Body: Questions Grid by Part */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {parts.map((partNum) => {
            const partQuestions = questionsByPart[partNum] || [];

            return (
              <div key={partNum} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {PART_NAMES[partNum] || `Part ${partNum}`}
                  </h4>
                  <span className="text-[11px] font-bold text-slate-400">
                    {partQuestions.filter((q) => Boolean(userAnswers[q.id])).length}/{partQuestions.length} câu
                  </span>
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {partQuestions.map((q) => {
                    const isCurrent = q.id === currentQuestionId;
                    const isAnswered = Boolean(userAnswers[q.id]);
                    const isFlagged = Boolean(flaggedQuestions[q.id]);

                    let buttonClass = "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200";

                    if (isCurrent) {
                      buttonClass = "ring-2 ring-[#0891b2] bg-cyan-50 dark:bg-cyan-950/80 text-[#0891b2] font-black";
                    } else if (isAnswered) {
                      buttonClass = "bg-emerald-500 text-white font-black shadow-sm hover:bg-emerald-600";
                    }

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          soundManager.playClick();
                          onSelectQuestion(q.id);
                          onClose();
                        }}
                        className={`h-9 sm:h-10 rounded-xl font-bold text-xs relative flex items-center justify-center transition-all ${buttonClass}`}
                      >
                        <span>{q.questionNumber}</span>
                        {isFlagged && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white dark:border-slate-900" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onSubmitTest();
            }}
            className="btn-duo py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-duo-green flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Nộp Bài ({answeredCount}/{questions.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
