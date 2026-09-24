"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { sampleToeicTests } from "@/data/toeicTests";
import { ToeicQuestion, ToeicPart, ToeicTest } from "@/types/toeic";
import { calculateToeicScores } from "@/lib/toeicScoreConverter";
import { soundManager } from "@/lib/soundEffects";
import {
  Clock,
  Volume2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertCircle,
  HelpCircle,
  Pause,
  Play,
  RotateCcw
} from "lucide-react";

export default function ExamRoomPage({ params }: { params: Promise<{ testId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [test, setTest] = useState<ToeicTest>(() => {
    return sampleToeicTests.find((t) => t.id === resolvedParams.testId) || sampleToeicTests[0];
  });

  // State
  const [selectedPart, setSelectedPart] = useState<ToeicPart>(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState<number>(120 * 60); // 120 minutes in seconds
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [palettePartFilter, setPalettePartFilter] = useState<string>("all");

  // Load custom tests from API / localStorage if not standard test
  useEffect(() => {
    const loadTest = async () => {
      const defaultFound = sampleToeicTests.find((t) => t.id === resolvedParams.testId);
      if (defaultFound) {
        setTest(defaultFound);
        return;
      }

      try {
        const res = await fetch(`/api/admin/tests/${resolvedParams.testId}`);
        const data = await res.json();
        if (res.ok && data.test) {
          setTest(data.test);
          setTimeLeft((data.test.durationMinutes || 120) * 60);
          return;
        }
      } catch {}

      try {
        const localCustom = JSON.parse(localStorage.getItem("dau_custom_tests") || "[]") as ToeicTest[];
        const localTest = localCustom.find((item) => item.id === resolvedParams.testId);
        if (localTest) {
          setTest(localTest);
          setTimeLeft((localTest.durationMinutes || 120) * 60);
        }
      } catch {}
    };

    loadTest();
  }, [resolvedParams.testId]);

  const questionsInCurrentPart = test.questions?.filter((q) => q.part === selectedPart) || [];
  const currentQuestion = questionsInCurrentPart[currentQuestionIndex] || test.questions?.[0] || sampleToeicTests[0].questions[0];

  // Timer countdown
  useEffect(() => {
    if (isTimerPaused || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerPaused, timeLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = (option: "A" | "B" | "C" | "D") => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
    soundManager.playCorrect();
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));
  };

  const handlePlayQuestionAudio = async () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    let textToSpeak = "";
    if (currentQuestion.passage) textToSpeak += currentQuestion.passage + ". ";
    if (currentQuestion.questionText) textToSpeak += currentQuestion.questionText;

    if (!textToSpeak && currentQuestion.part === 1) {
      textToSpeak = `Question number ${currentQuestion.questionNumber}. Look at the photograph. Option A: ${currentQuestion.options.A}. Option B: ${currentQuestion.options.B}. Option C: ${currentQuestion.options.C}. Option D: ${currentQuestion.options.D}.`;
    }

    await soundManager.speakEnglish(textToSpeak || "Audio test listening");
    setIsPlayingAudio(false);
  };

  const handlePartChange = (part: ToeicPart) => {
    setSelectedPart(part);
    setCurrentQuestionIndex(0);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questionsInCurrentPart.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (selectedPart < 7) {
      const nextPart = (selectedPart + 1) as ToeicPart;
      setSelectedPart(nextPart);
      setCurrentQuestionIndex(0);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (selectedPart > 1) {
      const prevPart = (selectedPart - 1) as ToeicPart;
      setSelectedPart(prevPart);
      const prevQuestions = test.questions?.filter((q) => q.part === prevPart) || [];
      setCurrentQuestionIndex(Math.max(0, prevQuestions.length - 1));
    }
  };

  const answeredCount = Object.keys(userAnswers).length;

  const handleSubmitTest = () => {
    // Calculate Listening & Reading correct counts
    let listeningCorrect = 0;
    let readingCorrect = 0;

    test.questions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected === q.correctAnswer) {
        if (q.part <= 4) {
          listeningCorrect++;
        } else {
          readingCorrect++;
        }
      }
    });

    const scoreData = calculateToeicScores(listeningCorrect, readingCorrect);

    const testSummary = {
      testId: test.id,
      testTitle: test.title,
      completedAt: new Date().toISOString(),
      listeningCorrect,
      readingCorrect,
      totalCorrect: listeningCorrect + readingCorrect,
      ...scoreData,
      timeSpentSeconds: 120 * 60 - timeLeft,
      answers: userAnswers,
    };

    // Save to localStorage for Result Review
    localStorage.setItem(`dau_test_result_${test.id}`, JSON.stringify(testSummary));
    localStorage.setItem("dau_last_test_result", JSON.stringify(testSummary));

    // Update XP and streak in localStorage
    const currentXp = parseInt(localStorage.getItem("dau_xp") || "50", 10);
    localStorage.setItem("dau_xp", String(currentXp + 25));

    soundManager.playFanfare();
    router.push(`/mock-test/${test.id}/result`);
  };

  const partsList: { part: ToeicPart; name: string }[] = [
    { part: 1, name: "Part 1 (Ảnh)" },
    { part: 2, name: "Part 2 (Hỏi đáp)" },
    { part: 3, name: "Part 3 (Hội thoại)" },
    { part: 4, name: "Part 4 (Độc thoại)" },
    { part: 5, name: "Part 5 (Điền câu)" },
    { part: 6, name: "Part 6 (Điền đoạn)" },
    { part: 7, name: "Part 7 (Đọc hiểu)" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#070b13]">
      {/* Exam Room Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-16 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-black text-slate-800 dark:text-slate-100 text-sm hidden md:inline">
            {test.title}
          </span>
          <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-bold text-xs">
            Part {selectedPart}
          </span>
        </div>

        {/* Timer Bar */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl font-mono text-sm font-black border ${
              timeLeft < 300
                ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/60 dark:border-rose-900 animate-pulse"
                : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
            }`}
          >
            <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>{formatTime(timeLeft)}</span>
            <button
              onClick={() => setIsTimerPaused(!isTimerPaused)}
              className="text-slate-400 hover:text-slate-600 ml-1"
              title={isTimerPaused ? "Tiếp tục làm bài" : "Tạm dừng"}
            >
              {isTimerPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Submit Test Button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="btn-duo px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-duo-green flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Nộp Bài ({answeredCount}/{test.questions.length})</span>
          </button>
        </div>
      </div>

      {/* Part Navigation Tabs */}
      <div className="bg-slate-100 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-2 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        {partsList.map((item) => (
          <button
            key={item.part}
            onClick={() => handlePartChange(item.part)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedPart === item.part
                ? "bg-brand-600 text-white shadow-duo-cyan"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Main Exam Room Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Question & Passage Content */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-black text-sm shadow-duo-cyan">
                    {currentQuestion.questionNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Câu hỏi số {currentQuestion.questionNumber} / 200
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Audio Player Button (Part 1-4) */}
                  {currentQuestion.part <= 4 && (
                    <button
                      onClick={handlePlayQuestionAudio}
                      disabled={isPlayingAudio}
                      className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 text-xs font-bold border border-sky-200 dark:border-sky-800 flex items-center gap-1.5 hover:bg-sky-100 transition-colors"
                    >
                      <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "animate-bounce text-sky-500" : ""}`} />
                      <span>{isPlayingAudio ? "Đang phát audio..." : "Phát Audio"}</span>
                    </button>
                  )}

                  {/* Flag / Star Button */}
                  <button
                    onClick={handleToggleFlag}
                    className={`p-2 rounded-xl border transition-colors ${
                      flaggedQuestions[currentQuestion.id]
                        ? "bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/60 dark:border-amber-800"
                        : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                    }`}
                    title="Đánh dấu câu hỏi cần xem lại sau"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${flaggedQuestions[currentQuestion.id] ? "fill-amber-500 text-amber-500" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* Part 1 Photograph Display */}
              {currentQuestion.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-72 flex justify-center bg-slate-100 dark:bg-slate-800">
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Photograph for question"
                    className="object-contain max-h-72 w-full"
                  />
                </div>
              )}

              {/* Part 3, 4, 6, 7 Passage Display */}
              {currentQuestion.passage && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200 font-sans">
                  {currentQuestion.passage}
                </div>
              )}

              {/* Question Text */}
              {currentQuestion.questionText && (
                <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {currentQuestion.questionText}
                </div>
              )}

              {/* Options Radio List */}
              <div className="space-y-3 pt-2">
                {(["A", "B", "C", "D"] as const).map((opt) => {
                  const optionText = currentQuestion.options[opt];
                  if (!optionText && opt === "D" && currentQuestion.part === 2) return null;
                  const isSelected = userAnswers[currentQuestion.id] === opt;

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectAnswer(opt)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                        isSelected
                          ? "bg-brand-50 dark:bg-brand-950/70 border-brand-500 text-brand-900 dark:text-brand-100 shadow-sm"
                          : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-brand-300 dark:hover:border-brand-600 text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm transition-colors ${
                            isSelected
                              ? "bg-brand-600 text-white"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-brand-100 dark:group-hover:bg-brand-950"
                          }`}
                        >
                          {opt}
                        </span>
                        <span className="text-sm font-medium">{optionText}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Previous / Next Question Navigation */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={goToPrevQuestion}
                disabled={currentQuestionIndex === 0 && selectedPart === 1}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Câu trước</span>
              </button>

              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                Câu {currentQuestion?.questionNumber || 1} / 200 (Part {selectedPart}: {currentQuestionIndex + 1}/{questionsInCurrentPart.length})
              </span>

              <button
                onClick={goToNextQuestion}
                disabled={currentQuestionIndex === questionsInCurrentPart.length - 1 && selectedPart === 7}
                className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed shadow-duo-cyan"
              >
                <span>Câu tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette (Grid 200 câu) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Bảng Lưới 200 Câu Hỏi
            </h3>
            <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
              Đã làm: {answeredCount}/{test.questions.length}
            </span>
          </div>

          {/* Part Filter Bar for Palette */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setPalettePartFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                palettePartFilter === "all"
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              Tất cả (200)
            </button>
            {[1, 2, 3, 4, 5, 6, 7].map((p) => {
              const partCount = test.questions.filter((item) => item.part === p).length;
              return (
                <button
                  key={p}
                  onClick={() => setPalettePartFilter(String(p))}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                    palettePartFilter === String(p)
                      ? "bg-brand-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  P{p} ({partCount})
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Đã làm</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span>Đánh dấu</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700" />
              <span>Chưa làm</span>
            </div>
          </div>

          {/* Questions Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-96 overflow-y-auto pr-1">
            {test.questions
              .filter((q) => {
                if (palettePartFilter === "all") return true;
                return q.part === Number(palettePartFilter);
              })
              .map((q) => {
                const isAnswered = Boolean(userAnswers[q.id]);
                const isFlagged = Boolean(flaggedQuestions[q.id]);
                const isCurrent = q.id === currentQuestion.id;

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSelectedPart(q.part);
                      const idx = test.questions.filter((item) => item.part === q.part).findIndex((item) => item.id === q.id);
                      setCurrentQuestionIndex(Math.max(0, idx));
                    }}
                    className={`h-9 rounded-xl font-bold text-xs transition-all relative flex items-center justify-center border ${
                      isCurrent
                        ? "ring-2 ring-brand-500 border-brand-500"
                        : "border-slate-200 dark:border-slate-700"
                    } ${
                      isAnswered
                        ? "bg-emerald-500 text-white border-emerald-600 shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
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
      </div>

      {/* Confirmation Modal before Submit */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Xác Nhận Nộp Bài Thi?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bạn đã trả lời được <span className="font-bold text-emerald-600">{answeredCount}</span> trên tổng số{" "}
                <span className="font-bold">{test.questions.length}</span> câu hỏi.
                {test.questions.length - answeredCount > 0 && (
                  <span className="block mt-1 text-rose-500 font-semibold">
                    Còn {test.questions.length - answeredCount} câu chưa điền đáp án!
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Tiếp tục làm bài
              </button>
              <button
                onClick={handleSubmitTest}
                className="btn-duo flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-duo-green transition-all"
              >
                Chấm Điểm Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
