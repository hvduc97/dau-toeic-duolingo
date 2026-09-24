"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { sampleToeicTests } from "@/data/toeicTests";
import { ToeicQuestion, ToeicTest } from "@/types/toeic";
import { askGeminiExplanation, AiExplanationResponse } from "@/lib/gemini";
import { soundManager } from "@/lib/soundEffects";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Bot,
  Loader2,
  ChevronDown,
  BookOpen,
  Volume2
} from "lucide-react";

export default function TestResultPage({ params }: { params: Promise<{ testId: string }> }) {
  const resolvedParams = use(params);
  const [test, setTest] = useState<ToeicTest>(() => {
    return sampleToeicTests.find((t) => t.id === resolvedParams.testId) || sampleToeicTests[0];
  });

  const [resultData, setResultData] = useState<{
    listeningScore: number;
    readingScore: number;
    totalScore: number;
    totalCorrect: number;
    timeSpentSeconds: number;
    levelEvaluation: string;
    badge: string;
    answers: Record<number, "A" | "B" | "C" | "D">;
  } | null>(null);

  const [filterType, setFilterType] = useState<"ALL" | "CORRECT" | "INCORRECT">("ALL");
  const [selectedAiQuestion, setSelectedAiQuestion] = useState<ToeicQuestion | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<AiExplanationResponse | null>(null);

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (_) {}

    // Load custom test if needed
    const defaultFound = sampleToeicTests.find((t) => t.id === resolvedParams.testId);
    if (!defaultFound) {
      try {
        const localCustom = JSON.parse(localStorage.getItem("dau_custom_tests") || "[]") as ToeicTest[];
        const localTest = localCustom.find((item) => item.id === resolvedParams.testId);
        if (localTest) {
          setTest(localTest);
        } else {
          fetch(`/api/admin/tests/${resolvedParams.testId}`)
            .then((r) => r.json())
            .then((d) => {
              if (d.test) setTest(d.test);
            })
            .catch(() => {});
        }
      } catch {}
    }

    // Load result from localStorage
    const saved = localStorage.getItem(`dau_test_result_${resolvedParams.testId}`);
    if (saved) {
      try {
        setResultData(JSON.parse(saved));
      } catch (_) {}
    } else {
      // Fallback sample result if direct visit
      setResultData({
        listeningScore: 410,
        readingScore: 360,
        totalScore: 770,
        totalCorrect: 155,
        timeSpentSeconds: 5400,
        levelEvaluation: "Tốt (Giao tiếp công việc trôi chảy - B2)",
        badge: "⭐ Cao thủ TOEIC",
        answers: { 1: "C", 2: "B", 7: "A", 8: "B", 32: "B", 33: "C", 71: "A", 101: "D", 102: "A", 103: "B", 104: "A", 131: "A", 147: "C", 148: "A" }
      });
    }
  }, [test.id]);

  const answers = resultData?.answers || {};

  const filteredQuestions = test.questions.filter((q) => {
    const isCorrect = answers[q.id] === q.correctAnswer;
    if (filterType === "CORRECT") return isCorrect;
    if (filterType === "INCORRECT") return !isCorrect;
    return true;
  });

  const handleAskAi = async (q: ToeicQuestion) => {
    setSelectedAiQuestion(q);
    setAiLoading(true);
    setAiResponse(null);

    const userAns = answers[q.id];
    const res = await askGeminiExplanation({
      questionText: q.questionText || "Question",
      passage: q.passage,
      options: q.options,
      userAnswer: userAns,
      correctAnswer: q.correctAnswer,
    });

    setAiResponse(res);
    setAiLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/mock-test"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về danh sách đề thi</span>
        </Link>
      </div>

      {/* Score Summary Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 text-white p-6 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-black inline-block">
              {resultData?.badge || "⭐ ĐẬU TOEIC"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Bảng Điểm Thi Thử ETS 990
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Đánh giá trình độ: <span className="font-bold text-emerald-400">{resultData?.levelEvaluation}</span>
            </p>
          </div>

          {/* Scores Breakdown Box */}
          <div className="flex items-center gap-4 sm:gap-6 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15">
            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-teal-300">Listening</div>
              <div className="text-2xl sm:text-3xl font-black text-white">{resultData?.listeningScore || 0}</div>
              <div className="text-[10px] text-slate-400">/ 495 điểm</div>
            </div>

            <div className="w-px h-10 bg-white/20" />

            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-sky-300">Reading</div>
              <div className="text-2xl sm:text-3xl font-black text-white">{resultData?.readingScore || 0}</div>
              <div className="text-[10px] text-slate-400">/ 495 điểm</div>
            </div>

            <div className="w-px h-10 bg-white/20" />

            <div className="text-center">
              <div className="text-[10px] uppercase font-bold text-amber-300">Tổng điểm</div>
              <div className="text-3xl sm:text-4xl font-black text-amber-400">{resultData?.totalScore || 0}</div>
              <div className="text-[10px] text-slate-400">/ 990 điểm</div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Review Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Chi Tiết Bài Làm & Lời Giải
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Xem lại từng câu hỏi, dịch nghĩa song ngữ và hỏi trợ lý AI giải đáp thắc mắc
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === "ALL"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            Tất cả ({test.questions.length})
          </button>
          <button
            onClick={() => setFilterType("CORRECT")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === "CORRECT"
                ? "bg-emerald-600 text-white shadow-duo-green"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
            }`}
          >
            Câu đúng
          </button>
          <button
            onClick={() => setFilterType("INCORRECT")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === "INCORRECT"
                ? "bg-rose-600 text-white shadow-duo-red"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
            }`}
          >
            Câu sai
          </button>
        </div>
      </div>

      {/* Questions Review List */}
      <div className="space-y-6">
        {filteredQuestions.map((q) => {
          const userAns = answers[q.id];
          const isCorrect = userAns === q.correctAnswer;

          return (
            <div
              key={q.id}
              className={`p-6 rounded-3xl border-2 transition-all space-y-4 ${
                isCorrect
                  ? "bg-white dark:bg-slate-900 border-emerald-200 dark:border-emerald-900/60"
                  : "bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-900/60"
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
                      isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                    }`}
                  >
                    {q.questionNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Part {q.part}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                      isCorrect
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đúng (+5)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Sai (Bạn chọn {userAns || "Trống"})</span>
                      </>
                    )}
                  </span>

                  {/* Ask AI button */}
                  <button
                    onClick={() => handleAskAi(q)}
                    className="btn-duo px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 dark:hover:bg-purple-900 text-xs font-bold border border-purple-200 dark:border-purple-800 flex items-center gap-1.5 transition-all"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Hỏi AI giải thích</span>
                  </button>
                </div>
              </div>

              {/* Passage if any */}
              {q.passage && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-sans">
                  {q.passage}
                </div>
              )}

              {/* Question Text */}
              {q.questionText && (
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {q.questionText}
                </div>
              )}

              {/* Options Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(["A", "B", "C", "D"] as const).map((opt) => {
                  const optText = q.options[opt];
                  if (!optText) return null;
                  const isUserSelection = userAns === opt;
                  const isThisCorrect = q.correctAnswer === opt;

                  return (
                    <div
                      key={opt}
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        isThisCorrect
                          ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-900 dark:text-emerald-200 font-bold"
                          : isUserSelection
                          ? "bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-900 dark:text-rose-200 font-semibold"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-black">{opt}.</span>
                        <span>{optText}</span>
                      </div>
                      {isThisCorrect && <span className="text-[10px] text-emerald-600 font-black">Đáp án đúng</span>}
                      {isUserSelection && !isThisCorrect && <span className="text-[10px] text-rose-600 font-black">Bạn chọn</span>}
                    </div>
                  );
                })}
              </div>

              {/* Detailed Explanation */}
              <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-slate-800/80 border border-brand-100 dark:border-slate-700 space-y-2 text-xs">
                <div className="font-black text-brand-700 dark:text-brand-300">
                  💡 Dịch nghĩa & Giải thích chi tiết:
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-semibold text-slate-900 dark:text-white">Bản dịch:</span> {q.explanation.translation}
                </p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-semibold text-slate-900 dark:text-white">Phân tích:</span> {q.explanation.analysis}
                </p>
                {q.explanation.vocabulary && q.explanation.vocabulary.length > 0 && (
                  <div className="pt-2 border-t border-brand-100 dark:border-slate-700 flex flex-wrap gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Từ vựng then chốt:</span>
                    {q.explanation.vocabulary.map((v, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-brand-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-medium">
                        {v.word} ({v.phonetic}): {v.meaning}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Explanation Modal */}
      {selectedAiQuestion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                    Trợ Lý AI Phân Tích Câu {selectedAiQuestion.questionNumber}
                  </h3>
                  <p className="text-[10px] text-purple-600 dark:text-purple-400">
                    Google Gemini 1.5 Flash TOEIC Coach
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAiQuestion(null)}
                className="text-slate-400 hover:text-slate-600 font-black text-sm"
              >
                ✕ Đóng
              </button>
            </div>

            {aiLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                <span className="text-xs font-bold">AI đang phân tích cấu trúc và bẫy ngữ pháp...</span>
              </div>
            ) : aiResponse ? (
              <div className="space-y-4 text-xs">
                {aiResponse.isMock && (
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] border border-amber-200 dark:border-amber-900">
                    💡 Đang chạy ở chế độ Mock AI. Bạn có thể nhập Gemini API Key trong phần Cài đặt để nhận phân tích thời gian thực từ Google.
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 space-y-2">
                  <div className="font-black text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Tại sao đáp án {selectedAiQuestion.correctAnswer} đúng:
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                    {aiResponse.whyCorrect}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    Phân tích bẫy các phương án sai:
                  </div>
                  <div className="space-y-1.5">
                    {Object.entries(aiResponse.distractorAnalysis).map(([opt, desc]) => (
                      <div key={opt} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="font-bold text-slate-900 dark:text-white mr-2">Đáp án {opt}:</span>
                        <span className="text-slate-600 dark:text-slate-300">{desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200">
                  <span className="font-bold">🎯 Mẹo thi ETS: </span>
                  <span>{aiResponse.proTip}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
