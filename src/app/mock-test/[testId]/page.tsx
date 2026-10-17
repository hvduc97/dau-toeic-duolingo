"use client";

import React, { useState, useEffect, use, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
  Layers,
  BookOpen
} from "lucide-react";

export default function ExamRoomPageWrapper({ params }: { params: Promise<{ testId: string }> }) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold text-slate-500">Đang tải phòng thi...</div>}>
      <ExamRoomContent testId={resolvedParams.testId} />
    </Suspense>
  );
}

function ExamRoomContent({ testId }: { testId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode") || "test"; // "test" | "practice"
  const partsParam = searchParams.get("parts"); // e.g. "1,2" or "5,6"
  const initialExplain = searchParams.get("explain") === "1";

  const [test, setTest] = useState<ToeicTest>(() => {
    return sampleToeicTests.find((t) => t.id === testId) || sampleToeicTests[0];
  });

  // Allowed parts for practice mode
  const allowedParts = useMemo<number[]>(() => {
    if (mode === "practice" && partsParam) {
      const parsed = partsParam.split(",").map(Number).filter((n) => n >= 1 && n <= 7);
      if (parsed.length > 0) return parsed;
    }
    return [1, 2, 3, 4, 5, 6, 7];
  }, [mode, partsParam]);

  // Filtered active questions for this session
  const activeQuestions = useMemo<ToeicQuestion[]>(() => {
    if (!test.questions || test.questions.length === 0) return [];
    return test.questions.filter((q) => allowedParts.includes(q.part));
  }, [test.questions, allowedParts]);

  // Initial part to select
  const [selectedPart, setSelectedPart] = useState<ToeicPart>(() => {
    return (allowedParts[0] || 1) as ToeicPart;
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(120 * 60); // countdown for test mode
  const [timeElapsed, setTimeElapsed] = useState<number>(0); // stopwatch for practice mode
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  
  const [instantExplainEnabled, setInstantExplainEnabled] = useState<boolean>(initialExplain);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [palettePartFilter, setPalettePartFilter] = useState<string>("all");

  // Load custom tests from API / localStorage if not standard test
  useEffect(() => {
    const loadTest = async () => {
      const defaultFound = sampleToeicTests.find((t) => t.id === testId);
      if (defaultFound) {
        setTest(defaultFound);
        return;
      }

      try {
        const res = await fetch(`/api/admin/tests/${testId}`);
        const data = await res.json();
        if (res.ok && data.test) {
          setTest(data.test);
          setTimeLeft((data.test.durationMinutes || 120) * 60);
          return;
        }
      } catch {}

      try {
        const localCustom = JSON.parse(localStorage.getItem("dau_custom_tests") || "[]") as ToeicTest[];
        const localTest = localCustom.find((item) => item.id === testId);
        if (localTest) {
          setTest(localTest);
          setTimeLeft((localTest.durationMinutes || 120) * 60);
        }
      } catch {}
    };

    loadTest();
  }, [testId]);

  // Update selectedPart when allowedParts changes
  useEffect(() => {
    if (!allowedParts.includes(selectedPart)) {
      setSelectedPart((allowedParts[0] || 1) as ToeicPart);
      setCurrentQuestionIndex(0);
    }
  }, [allowedParts, selectedPart]);

  // Questions in current active part
  const questionsInCurrentPart = activeQuestions.filter((q) => q.part === selectedPart);
  const currentQuestion = questionsInCurrentPart[currentQuestionIndex] || activeQuestions[0] || test.questions?.[0] || sampleToeicTests[0].questions[0];

  // Timer logic
  useEffect(() => {
    if (isTimerPaused) return;

    if (mode === "test") {
      if (timeLeft <= 0) return;
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
    } else {
      // Practice mode: stopwatch
      const interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerPaused, timeLeft, mode]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
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
    soundManager.playClick();
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
    soundManager.playClick();
    setSelectedPart(part);
    setCurrentQuestionIndex(0);
  };

  // Cross-part navigation
  const goToNextQuestion = () => {
    soundManager.playClick();
    if (currentQuestionIndex < questionsInCurrentPart.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Find next available part in allowedParts
      const currentPartIndex = allowedParts.indexOf(selectedPart);
      if (currentPartIndex !== -1 && currentPartIndex < allowedParts.length - 1) {
        const nextPart = allowedParts[currentPartIndex + 1] as ToeicPart;
        setSelectedPart(nextPart);
        setCurrentQuestionIndex(0);
      }
    }
  };

  const goToPrevQuestion = () => {
    soundManager.playClick();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      // Find previous available part in allowedParts
      const currentPartIndex = allowedParts.indexOf(selectedPart);
      if (currentPartIndex > 0) {
        const prevPart = allowedParts[currentPartIndex - 1] as ToeicPart;
        setSelectedPart(prevPart);
        const prevQuestions = activeQuestions.filter((q) => q.part === prevPart);
        setCurrentQuestionIndex(Math.max(0, prevQuestions.length - 1));
      }
    }
  };

  const answeredCount = Object.keys(userAnswers).length;

  const handleSubmitTest = () => {
    // Calculate Listening & Reading correct counts
    let listeningCorrect = 0;
    let readingCorrect = 0;

    activeQuestions.forEach((q) => {
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
      timeSpentSeconds: mode === "test" ? (120 * 60 - timeLeft) : timeElapsed,
      answers: userAnswers,
    };

    // Save to localStorage
    localStorage.setItem(`dau_test_result_${test.id}`, JSON.stringify(testSummary));
    localStorage.setItem("dau_last_test_result", JSON.stringify(testSummary));

    // Update XP and streak
    const currentXp = parseInt(localStorage.getItem("dau_xp") || "50", 10);
    localStorage.setItem("dau_xp", String(currentXp + (mode === "test" ? 30 : 15)));

    soundManager.playFanfare();
    router.push(`/mock-test/${test.id}/result`);
  };

  const allParts: { part: ToeicPart; name: string }[] = [
    { part: 1, name: "Part 1 (Ảnh)" },
    { part: 2, name: "Part 2 (Hỏi đáp)" },
    { part: 3, name: "Part 3 (Hội thoại)" },
    { part: 4, name: "Part 4 (Độc thoại)" },
    { part: 5, name: "Part 5 (Điền câu)" },
    { part: 6, name: "Part 6 (Điền đoạn)" },
    { part: 7, name: "Part 7 (Đọc hiểu)" },
  ];
  const partsList = allParts.filter((item) => allowedParts.includes(item.part));

  const hasAnsweredCurrent = Boolean(userAnswers[currentQuestion.id]);
  const isCurrentCorrect = userAnswers[currentQuestion.id] === currentQuestion.correctAnswer;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-[#070b13]">
      {/* Exam Room Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-16 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href={`/mock-test/${test.id}/intro`}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Thoát phòng thi"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-1">
                {test.title}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-black ${
                  mode === "practice"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    : "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300"
                }`}
              >
                {mode === "practice" ? "Luyện tập" : "Thi thử 120'"}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:block">
              Part {selectedPart} · Câu {currentQuestion.questionNumber}
            </div>
          </div>
        </div>

        {/* Right Tools: Timer & Submit */}
        <div className="flex items-center gap-3">
          {/* Practice Toggle Instant Explain */}
          {mode === "practice" && (
            <button
              onClick={() => {
                soundManager.playClick();
                setInstantExplainEnabled(!instantExplainEnabled);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors hidden sm:flex items-center gap-1.5 ${
                instantExplainEnabled
                  ? "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:border-amber-800"
                  : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Giải thích: {instantExplainEnabled ? "Bật" : "Tắt"}</span>
            </button>
          )}

          {/* Timer Display */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl font-mono text-xs sm:text-sm font-black border ${
              mode === "test" && timeLeft < 300
                ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/60 dark:border-rose-900 animate-pulse"
                : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
            }`}
          >
            <Clock className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>{formatTime(mode === "test" ? timeLeft : timeElapsed)}</span>
            <button
              onClick={() => setIsTimerPaused(!isTimerPaused)}
              className="text-slate-400 hover:text-slate-600 ml-1"
              title={isTimerPaused ? "Tiếp tục" : "Tạm dừng"}
            >
              {isTimerPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Submit / Finish Button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="btn-duo px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-duo-green flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {mode === "practice" ? "Nộp bài" : "Nộp bài"} ({answeredCount}/{activeQuestions.length})
            </span>
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
                ? "bg-cyan-600 text-white shadow-duo-cyan"
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
                  <span className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-black text-sm shadow-duo-cyan">
                    {currentQuestion.questionNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Câu số {currentQuestion.questionNumber} / 200 (Part {selectedPart})
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
                      <span>{isPlayingAudio ? "Đang phát..." : "Phát Audio"}</span>
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
                  
                  // In practice mode with explain: show green for correct answer
                  const showAnswerFeedback = mode === "practice" && instantExplainEnabled && hasAnsweredCurrent;
                  const isCorrectChoice = opt === currentQuestion.correctAnswer;

                  let borderClass = "border-slate-200 dark:border-slate-700/80 hover:border-cyan-300";
                  let bgClass = "bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200";

                  if (showAnswerFeedback) {
                    if (isCorrectChoice) {
                      borderClass = "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-100";
                    } else if (isSelected) {
                      borderClass = "border-rose-500 bg-rose-50/80 dark:bg-rose-950/60 text-rose-900 dark:text-rose-100";
                    }
                  } else if (isSelected) {
                    borderClass = "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/70 text-cyan-900 dark:text-cyan-100 shadow-sm";
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectAnswer(opt)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${borderClass} ${bgClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm transition-colors ${
                            showAnswerFeedback && isCorrectChoice
                              ? "bg-emerald-600 text-white"
                              : showAnswerFeedback && isSelected
                              ? "bg-rose-600 text-white"
                              : isSelected
                              ? "bg-cyan-600 text-white"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                          }`}
                        >
                          {opt}
                        </span>
                        <span className="text-sm font-medium">{optionText}</span>
                      </div>

                      {showAnswerFeedback && isCorrectChoice && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {showAnswerFeedback && isSelected && !isCorrectChoice && (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant Explanation Box (Practice Mode Only) */}
              {mode === "practice" && instantExplainEnabled && hasAnsweredCurrent && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isCurrentCorrect ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Chính xác!
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          <XCircle className="w-3.5 h-3.5" />
                          Đáp án đúng: {currentQuestion.correctAnswer}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Giải thích chi tiết
                    </span>
                  </div>

                  {currentQuestion.explanation && (
                    <div className="space-y-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      <div>
                        <strong className="text-slate-900 dark:text-white">Dịch nghĩa: </strong>
                        <span>{currentQuestion.explanation.translation}</span>
                      </div>
                      <div>
                        <strong className="text-slate-900 dark:text-white">Phân tích: </strong>
                        <span>{currentQuestion.explanation.analysis}</span>
                      </div>

                      {currentQuestion.explanation.vocabulary && currentQuestion.explanation.vocabulary.length > 0 && (
                        <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40">
                          <strong className="text-slate-900 dark:text-white block mb-1">Từ vựng trọng tâm:</strong>
                          <div className="flex flex-wrap gap-1.5">
                            {currentQuestion.explanation.vocabulary.map((voc, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-amber-200 dark:border-amber-800 text-[11px]"
                              >
                                <strong>{voc.word}</strong>: {voc.meaning}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Previous / Next Question Navigation */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={goToPrevQuestion}
                disabled={currentQuestionIndex === 0 && selectedPart === allowedParts[0]}
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
                disabled={currentQuestionIndex === questionsInCurrentPart.length - 1 && selectedPart === allowedParts[allowedParts.length - 1]}
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed shadow-duo-cyan"
              >
                <span>Câu tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Bảng Lưới Câu Hỏi ({activeQuestions.length})
            </h3>
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
              Đã làm: {answeredCount}/{activeQuestions.length}
            </span>
          </div>

          {/* Part Filter Bar for Palette */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setPalettePartFilter("all")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                palettePartFilter === "all"
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              Tất cả ({activeQuestions.length})
            </button>
            {allowedParts.map((p) => {
              const partCount = activeQuestions.filter((item) => item.part === p).length;
              return (
                <button
                  key={p}
                  onClick={() => setPalettePartFilter(String(p))}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                    palettePartFilter === String(p)
                      ? "bg-cyan-600 text-white"
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
            {activeQuestions
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
                      soundManager.playClick();
                      setSelectedPart(q.part);
                      const idx = activeQuestions.filter((item) => item.part === q.part).findIndex((item) => item.id === q.id);
                      setCurrentQuestionIndex(Math.max(0, idx));
                    }}
                    className={`h-9 rounded-xl font-bold text-xs transition-all relative flex items-center justify-center border ${
                      isCurrent
                        ? "ring-2 ring-cyan-500 border-cyan-500"
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
                Xác Nhận Nộp Bài?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bạn đã trả lời được <span className="font-bold text-emerald-600">{answeredCount}</span> trên tổng số{" "}
                <span className="font-bold">{activeQuestions.length}</span> câu hỏi.
                {activeQuestions.length - answeredCount > 0 && (
                  <span className="block mt-1 text-rose-500 font-semibold">
                    Còn {activeQuestions.length - answeredCount} câu chưa điền đáp án!
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
