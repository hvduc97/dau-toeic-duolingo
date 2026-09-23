"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { sampleGrammarQuestions, grammarTopics } from "@/data/grammarQuestions";
import { GrammarQuestion } from "@/types/toeic";
import { soundManager } from "@/lib/soundEffects";
import {
  Bookmark,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Filter,
  Flame,
  Star,
  Trash2
} from "lucide-react";

export default function GrammarPage() {
  const [selectedTopic, setSelectedTopic] = useState<string>("Tất cả");
  const [activeTab, setActiveTab] = useState<"PRACTICE" | "WRONG_NOTES" | "STARRED">("PRACTICE");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  // Persistence for Wrong Notebook and Starred Questions
  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>([]);
  const [starredQuestionIds, setStarredQuestionIds] = useState<string[]>([]);

  useEffect(() => {
    const savedWrong = localStorage.getItem("dau_wrong_grammar_ids");
    if (savedWrong) {
      try {
        setWrongQuestionIds(JSON.parse(savedWrong));
      } catch (_) {}
    }

    const savedStarred = localStorage.getItem("dau_starred_grammar_ids");
    if (savedStarred) {
      try {
        setStarredQuestionIds(JSON.parse(savedStarred));
      } catch (_) {}
    }
  }, []);

  // Filter pool based on activeTab and topic
  let questionsPool = sampleGrammarQuestions;
  if (activeTab === "WRONG_NOTES") {
    questionsPool = sampleGrammarQuestions.filter((q) => wrongQuestionIds.includes(q.id));
  } else if (activeTab === "STARRED") {
    questionsPool = sampleGrammarQuestions.filter((q) => starredQuestionIds.includes(q.id));
  }

  const filteredQuestions = questionsPool.filter((q) => {
    if (selectedTopic === "Tất cả") return true;
    return q.topic === selectedTopic;
  });

  const currentQuestion: GrammarQuestion | undefined = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleSelectOption = (opt: "A" | "B" | "C" | "D") => {
    if (hasAnswered || !currentQuestion) return;
    setSelectedAnswer(opt);
    setHasAnswered(true);

    const isCorrect = opt === currentQuestion.correctAnswer;
    if (isCorrect) {
      soundManager.playCorrect();
      // If was in wrong list, we can remove it or keep
      const currentXp = parseInt(localStorage.getItem("dau_xp") || "50", 10);
      localStorage.setItem("dau_xp", String(currentXp + 10));
    } else {
      soundManager.playIncorrect();
      // Add to wrong notebook
      if (!wrongQuestionIds.includes(currentQuestion.id)) {
        const nextWrong = [...wrongQuestionIds, currentQuestion.id];
        setWrongQuestionIds(nextWrong);
        localStorage.setItem("dau_wrong_grammar_ids", JSON.stringify(nextWrong));
      }
    }
  };

  const handleToggleStar = (qId: string) => {
    let nextStarred: string[];
    if (starredQuestionIds.includes(qId)) {
      nextStarred = starredQuestionIds.filter((id) => id !== qId);
    } else {
      nextStarred = [...starredQuestionIds, qId];
      soundManager.playCorrect();
    }
    setStarredQuestionIds(nextStarred);
    localStorage.setItem("dau_starred_grammar_ids", JSON.stringify(nextStarred));
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setHasAnswered(false);
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
      soundManager.playFanfare();
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch (_) {}
    }
  };

  const handleClearWrongNotes = () => {
    setWrongQuestionIds([]);
    localStorage.removeItem("dau_wrong_grammar_ids");
    setCurrentIndex(0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-xs font-black mb-2">
            <Bookmark className="w-4 h-4" />
            Part 5 & Sổ Tay Câu Sai
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Ngữ Pháp & Sổ Tay Ôn Tập
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Luyện tập các bẫy ngữ pháp Part 5 kinh điển và tự động gom câu trả lời sai để rèn luyện lại.
          </p>
        </div>

        {/* Tab Switcher: Practice vs Wrong Notes vs Starred */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => {
              setActiveTab("PRACTICE");
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setHasAnswered(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "PRACTICE"
                ? "bg-purple-600 text-white shadow-duo"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
            }`}
          >
            Luyện Part 5
          </button>
          <button
            onClick={() => {
              setActiveTab("WRONG_NOTES");
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setHasAnswered(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === "WRONG_NOTES"
                ? "bg-rose-600 text-white shadow-duo-red"
                : "text-slate-600 dark:text-slate-300 hover:text-rose-600"
            }`}
          >
            <span>Sổ tay câu sai</span>
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
              {wrongQuestionIds.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab("STARRED");
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setHasAnswered(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === "STARRED"
                ? "bg-amber-500 text-white shadow-duo-yellow"
                : "text-slate-600 dark:text-slate-300 hover:text-amber-500"
            }`}
          >
            <span>Đã lưu</span>
            <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-[10px] flex items-center justify-center font-bold">
              {starredQuestionIds.length}
            </span>
          </button>
        </div>
      </div>

      {/* Topic Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {grammarTopics.map((topic) => (
          <button
            key={topic}
            onClick={() => {
              setSelectedTopic(topic);
              setCurrentIndex(0);
              setSelectedAnswer(null);
              setHasAnswered(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedTopic === topic
                ? "bg-purple-600 text-white shadow-duo"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Main Question Box */}
      {currentQuestion ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-black">
                {currentQuestion.topic}
              </span>
              <span className="text-xs font-bold text-slate-400">
                Câu {currentIndex + 1} / {filteredQuestions.length}
              </span>
            </div>

            <button
              onClick={() => handleToggleStar(currentQuestion.id)}
              className={`p-2 rounded-xl border transition-colors ${
                starredQuestionIds.includes(currentQuestion.id)
                  ? "bg-amber-50 border-amber-300 text-amber-500 dark:bg-amber-950/60 dark:border-amber-800"
                  : "bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700"
              }`}
              title="Đánh dấu câu hay để xem lại"
            >
              <Star
                className={`w-4 h-4 ${
                  starredQuestionIds.includes(currentQuestion.id) ? "fill-amber-400" : ""
                }`}
              />
            </button>
          </div>

          {/* Question Text */}
          <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQuestion.question}
          </div>

          {/* Options List */}
          <div className="space-y-3 pt-2">
            {(["A", "B", "C", "D"] as const).map((opt) => {
              const optText = currentQuestion.options[opt];
              const isSelected = selectedAnswer === opt;
              const isCorrect = currentQuestion.correctAnswer === opt;

              let style = "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-purple-300";

              if (hasAnswered) {
                if (isCorrect) {
                  style = "bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold shadow-sm";
                } else if (isSelected) {
                  style = "bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-900 dark:text-rose-100 font-bold";
                } else {
                  style = "opacity-50 border-slate-200 dark:border-slate-800";
                }
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  disabled={hasAnswered}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${
                        hasAnswered && isCorrect
                          ? "bg-emerald-500 text-white"
                          : hasAnswered && isSelected
                          ? "bg-rose-500 text-white"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {opt}
                    </span>
                    <span className="text-sm font-semibold">{optText}</span>
                  </div>

                  {hasAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                  {hasAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600" />}
                </button>
              );
            })}
          </div>

          {/* Explanation reveal when answered */}
          {hasAnswered && (
            <div className="p-5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-2.5 text-xs animate-in fade-in">
              <div className="font-black text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Giải thích ngữ pháp:</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {currentQuestion.explanation}
              </p>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 text-purple-700 dark:text-purple-300 font-bold">
                {currentQuestion.keyRule}
              </div>
              <div className="text-slate-500 dark:text-slate-400">
                <span className="font-semibold">Dịch nghĩa:</span> {currentQuestion.vietnameseTranslation}
              </div>
            </div>
          )}

          {/* Next Button */}
          {hasAnswered && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="btn-duo px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-duo-green flex items-center gap-1.5"
              >
                <span>Câu tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="text-4xl">🎉</div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">
            {activeTab === "WRONG_NOTES"
              ? "Bạn chưa có câu nào trong sổ tay câu sai!"
              : activeTab === "STARRED"
              ? "Chưa có câu hỏi nào được đánh dấu sao!"
              : "Đã hoàn thành toàn bộ câu hỏi trong chủ đề này!"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeTab === "WRONG_NOTES"
              ? "Khi làm sai bất kỳ câu hỏi nào, hệ thống sẽ tự động lưu vào đây để bạn rèn luyện lại."
              : "Bấm nút ngôi sao ở mỗi câu hỏi để lưu lại các câu hay hoặc câu khó."}
          </p>
          {activeTab === "WRONG_NOTES" && wrongQuestionIds.length > 0 && (
            <button
              onClick={handleClearWrongNotes}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200"
            >
              <Trash2 className="w-3.5 h-3.5 inline mr-1" />
              Xóa sổ tay câu sai
            </button>
          )}
        </div>
      )}
    </div>
  );
}
