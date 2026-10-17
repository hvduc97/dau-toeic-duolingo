"use client";

import React, { useState, useEffect, use, useMemo, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { sampleToeicTests } from "@/data/toeicTests";
import { ToeicQuestion, ToeicPart, ToeicTest } from "@/types/toeic";
import { calculateToeicScores } from "@/lib/toeicScoreConverter";
import { soundManager } from "@/lib/soundEffects";
import QuestionPaletteDrawer from "@/components/mock-test/QuestionPaletteDrawer";
import ExamDirectionsView from "@/components/mock-test/ExamDirectionsView";
import {
  Clock,
  Volume2,
  VolumeX,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Send,
  AlertCircle,
  Pause,
  Play,
  ArrowLeft,
  Sparkles,
  Layers,
  HelpCircle,
  Headphones,
  CheckSquare,
  Square,
  Eye,
  EyeOff,
  BookOpen,
  ArrowRight
} from "lucide-react";

export default function ExamPlayerWrapper({ params }: { params: Promise<{ testId: string }> }) {
  const resolvedParams = use(params);
  return (
    <Suspense fallback={<div className="p-12 text-center font-black text-slate-500">Đang tải phòng thi chuẩn ETS...</div>}>
      <ExamPlayerContent testId={resolvedParams.testId} />
    </Suspense>
  );
}

function ExamPlayerContent({ testId }: { testId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode") || "full"; // "full" | "test" | "practice"
  const partsParam = searchParams.get("parts");

  const [test, setTest] = useState<ToeicTest>(() => {
    return sampleToeicTests.find((t) => t.id === testId) || sampleToeicTests[0];
  });

  // Allowed parts
  const allowedParts = useMemo<number[]>(() => {
    if (partsParam) {
      const parsed = partsParam.split(",").map(Number).filter((n) => n >= 1 && n <= 7);
      if (parsed.length > 0) return parsed;
    }
    return [1, 2, 3, 4, 5, 6, 7];
  }, [partsParam]);

  // Active questions
  const activeQuestions = useMemo<ToeicQuestion[]>(() => {
    if (!test.questions || test.questions.length === 0) return [];
    return test.questions.filter((q) => allowedParts.includes(q.part));
  }, [test.questions, allowedParts]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});

  // 100% Real Exam Section & Timer Management
  // Listening: 45 mins (2700s) | Reading: 75 mins (4500s)
  const [examSection, setExamSection] = useState<"listening" | "reading">(() => {
    if (allowedParts.every((p) => p >= 5)) return "reading";
    return "listening";
  });

  const [listeningTimeLeft, setListeningTimeLeft] = useState<number>(45 * 60); // 45 minutes
  const [readingTimeLeft, setReadingTimeLeft] = useState<number>(75 * 60); // 75 minutes
  const [practiceTimeElapsed, setPracticeTimeElapsed] = useState<number>(0); // stopwatch
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  // Directions Screen Phase
  const [directionsPhase, setDirectionsPhase] = useState<"intro" | 1 | 2 | 3 | 4 | "reading_intro" | null>(() => {
    if (mode === "full") return "intro";
    return null;
  });
  const [shownDirections, setShownDirections] = useState<Record<string, boolean>>({});

  // Support mode toggle (mặc định tắt để ẩn chữ 100% như thi thật)
  const [showListeningTextHelper, setShowListeningTextHelper] = useState<boolean>(false);

  // Audio continuous state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState<boolean>(true);

  // Modals & Drawers
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showSwitchToReadingModal, setShowSwitchToReadingModal] = useState<boolean>(false);

  // Load custom tests if needed
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
          return;
        }
      } catch {}

      try {
        const localCustom = JSON.parse(localStorage.getItem("dau_custom_tests") || "[]") as ToeicTest[];
        const localTest = localCustom.find((item) => item.id === testId);
        if (localTest) {
          setTest(localTest);
        }
      } catch {}
    };

    loadTest();
  }, [testId]);

  const currentQuestion = activeQuestions[currentQuestionIndex] || activeQuestions[0] || test.questions?.[0] || sampleToeicTests[0].questions[0];

  // Grouping cluster questions for Part 3, 4, 6, 7
  const currentClusterQuestions = useMemo<ToeicQuestion[]>(() => {
    if (!currentQuestion) return [];
    if (currentQuestion.part === 1 || currentQuestion.part === 2) {
      return [currentQuestion];
    }
    if (currentQuestion.passage) {
      const cluster = activeQuestions.filter(
        (q) => q.part === currentQuestion.part && q.passage === currentQuestion.passage
      );
      if (cluster.length > 0) return cluster;
    }
    const clusterSize = currentQuestion.part === 6 ? 4 : 3;
    const samePartQuestions = activeQuestions.filter((q) => q.part === currentQuestion.part);
    const idxInPart = samePartQuestions.findIndex((q) => q.id === currentQuestion.id);
    const startIdx = Math.floor(idxInPart / clusterSize) * clusterSize;
    return samePartQuestions.slice(startIdx, startIdx + clusterSize);
  }, [currentQuestion, activeQuestions]);

  // Section & Part change watcher to display Directions if entering a new part in Full mode
  useEffect(() => {
    if (mode !== "full" || !currentQuestion) return;

    const currentPart = currentQuestion.part;
    const partKey = `part_${currentPart}`;

    // If entering part 1-4 for first time and not shown yet
    if (currentPart <= 4 && !shownDirections[partKey] && directionsPhase === null) {
      setDirectionsPhase(currentPart as 1 | 2 | 3 | 4);
      setShownDirections((prev) => ({ ...prev, [partKey]: true }));
    }
  }, [currentQuestion?.part, mode, shownDirections, directionsPhase]);

  // Timer Countdown logic: 45' Listening -> 75' Reading
  useEffect(() => {
    if (isTimerPaused || directionsPhase !== null) return;

    if (mode === "practice") {
      const interval = setInterval(() => {
        setPracticeTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }

    if (examSection === "listening") {
      if (listeningTimeLeft <= 0) {
        // Listening time is up -> switch to Reading
        switchToReadingSection();
        return;
      }
      const interval = setInterval(() => {
        setListeningTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            switchToReadingSection();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      // Reading section (75 mins)
      if (readingTimeLeft <= 0) {
        handleSubmitTest();
        return;
      }
      const interval = setInterval(() => {
        setReadingTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTimerPaused, directionsPhase, mode, examSection, listeningTimeLeft, readingTimeLeft]);

  const switchToReadingSection = () => {
    setExamSection("reading");
    setDirectionsPhase("reading_intro");
    soundManager.stopSpeaking();
    setIsPlayingAudio(false);

    // Jump to question 101 (start of Reading)
    const q101Idx = activeQuestions.findIndex((q) => q.part >= 5);
    if (q101Idx !== -1) {
      setCurrentQuestionIndex(q101Idx);
    }
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Continuous Audio playback for Listening (Part 1-4)
  const isAudioPlayingRef = useRef(false);

  const playQuestionAudio = async (q: ToeicQuestion) => {
    if (isAudioPlayingRef.current || directionsPhase !== null) return;
    isAudioPlayingRef.current = true;
    setIsPlayingAudio(true);

    let textToSpeak = "";
    if (q.part === 1) {
      textToSpeak = `Number ${q.questionNumber}. Look at the photograph in your test book. Statement A: ${q.options.A}. Statement B: ${q.options.B}. Statement C: ${q.options.C}. Statement D: ${q.options.D}.`;
    } else if (q.part === 2) {
      textToSpeak = `Number ${q.questionNumber}. ${q.questionText || ""}. Option A: ${q.options.A}. Option B: ${q.options.B}. Option C: ${q.options.C}.`;
    } else {
      if (q.passage) textToSpeak += `Questions refer to the following talk. ${q.passage}. `;
      textToSpeak += `Question ${q.questionNumber}. ${q.questionText || ""}.`;
    }

    try {
      await soundManager.speakEnglish(textToSpeak || "Listening question audio");
    } finally {
      isAudioPlayingRef.current = false;
      setIsPlayingAudio(false);
    }
  };

  // Auto-play when moving to next Listening question
  useEffect(() => {
    if (
      autoPlayAudio &&
      currentQuestion &&
      currentQuestion.part <= 4 &&
      !isTimerPaused &&
      directionsPhase === null
    ) {
      playQuestionAudio(currentQuestion);
    }
  }, [currentQuestion?.id, autoPlayAudio, isTimerPaused, directionsPhase]);

  const handleSelectAnswer = (questionId: number, option: "A" | "B" | "C" | "D") => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
    soundManager.playCorrect();
  };

  const handleToggleFlag = (questionId: number) => {
    soundManager.playClick();
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Navigation
  const goToNext = () => {
    soundManager.playClick();
    if (currentClusterQuestions.length > 1) {
      const lastInCluster = currentClusterQuestions[currentClusterQuestions.length - 1];
      const nextIdx = activeQuestions.findIndex((q) => q.id === lastInCluster.id) + 1;
      if (nextIdx < activeQuestions.length) {
        // Check if crossing from Part 4 to Part 5
        const nextQ = activeQuestions[nextIdx];
        if (currentQuestion.part <= 4 && nextQ.part >= 5 && examSection === "listening") {
          switchToReadingSection();
          return;
        }
        setCurrentQuestionIndex(nextIdx);
      }
    } else {
      if (currentQuestionIndex < activeQuestions.length - 1) {
        const nextQ = activeQuestions[currentQuestionIndex + 1];
        if (currentQuestion.part <= 4 && nextQ.part >= 5 && examSection === "listening") {
          switchToReadingSection();
          return;
        }
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }
  };

  const goToPrev = () => {
    soundManager.playClick();
    if (currentClusterQuestions.length > 1) {
      const firstInCluster = currentClusterQuestions[0];
      const prevIdx = activeQuestions.findIndex((q) => q.id === firstInCluster.id) - 1;
      if (prevIdx >= 0) {
        const targetQ = activeQuestions[prevIdx];
        if (targetQ.passage) {
          const prevClusterStart = activeQuestions.findIndex(
            (q) => q.part === targetQ.part && q.passage === targetQ.passage
          );
          setCurrentQuestionIndex(prevClusterStart >= 0 ? prevClusterStart : prevIdx);
        } else {
          setCurrentQuestionIndex(prevIdx);
        }
      }
    } else {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prev) => prev - 1);
      }
    }
  };

  const jumpToQuestion = (questionId: number) => {
    const idx = activeQuestions.findIndex((q) => q.id === questionId);
    if (idx !== -1) {
      const targetQ = activeQuestions[idx];
      if (targetQ.part >= 5 && examSection === "listening") {
        setExamSection("reading");
      }
      setCurrentQuestionIndex(idx);
    }
  };

  const answeredCount = Object.keys(userAnswers).length;

  const handleSubmitTest = () => {
    soundManager.stopSpeaking();
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

    const totalSecondsSpent =
      mode === "practice"
        ? practiceTimeElapsed
        : (45 * 60 - listeningTimeLeft) + (75 * 60 - readingTimeLeft);

    const testSummary = {
      testId: test.id,
      testTitle: test.title,
      completedAt: new Date().toISOString(),
      listeningCorrect,
      readingCorrect,
      totalCorrect: listeningCorrect + readingCorrect,
      ...scoreData,
      timeSpentSeconds: totalSecondsSpent,
      answers: userAnswers,
    };

    localStorage.setItem(`dau_test_result_${test.id}`, JSON.stringify(testSummary));
    localStorage.setItem("dau_last_test_result", JSON.stringify(testSummary));

    const currentXp = parseInt(localStorage.getItem("dau_xp") || "50", 10);
    localStorage.setItem("dau_xp", String(currentXp + 35));

    soundManager.playFanfare();
    router.push(`/mock-test/${test.id}/result`);
  };

  const isCurrentFlagged = Boolean(flaggedQuestions[currentQuestion?.id]);
  const isSplitLayout = currentQuestion && (currentQuestion.part === 3 || currentQuestion.part === 4 || currentQuestion.part === 6 || currentQuestion.part === 7);

  // If currently showing a Directions Screen
  if (directionsPhase !== null) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-[#070b13]">
        {/* Simple Header */}
        <header className="h-14 sm:h-16 bg-[#0891b2] text-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 shadow-md">
          <div className="flex items-center gap-3">
            <Link
              href={`/mock-test/${test.id}/intro`}
              className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-white hover:bg-white/25"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-black text-sm sm:text-base tracking-tight truncate">
              {test.title} — Hướng Dẫn Thi
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (directionsPhase === "intro") {
                  setDirectionsPhase(1);
                } else {
                  setDirectionsPhase(null);
                }
              }}
              className="h-9 px-4 rounded-xl bg-white text-[#0891b2] hover:bg-slate-50 font-black text-xs shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <span>Vào Làm Bài Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <ExamDirectionsView
            phase={directionsPhase}
            onStart={() => {
              if (directionsPhase === "intro") {
                setDirectionsPhase(1);
              } else {
                setDirectionsPhase(null);
              }
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-[#070b13] pb-16">
      {/* 1. Header (bg-[#0891b2] - Cyan chuẩn Đậu TOEIC) */}
      <header className="h-14 sm:h-16 bg-[#0891b2] text-white flex items-center justify-between px-3 sm:px-6 sticky top-0 z-40 shadow-md shrink-0">
        {/* Left: Back button + Title */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href={`/mock-test/${test.id}/intro`}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
            title="Thoát phòng thi"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="font-black text-xs sm:text-sm tracking-tight truncate max-w-[150px] sm:max-w-xs md:max-w-md">
              {test.title}
            </div>
            <div className="text-[10px] text-cyan-100 font-bold flex items-center gap-1.5">
              <span>Part {currentQuestion?.part || 1}</span>
              <span>·</span>
              <span>Câu {currentQuestion?.questionNumber || 1}/200</span>
              <span>·</span>
              <span className="capitalize">{examSection === "listening" ? "Listening (45')" : "Reading (75')"}</span>
            </div>
          </div>
        </div>

        {/* Center: Listening Controls / Switch to Reading button */}
        <div className="hidden md:flex items-center gap-2">
          {currentQuestion?.part <= 4 ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/15 text-white text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  if (isPlayingAudio) {
                    soundManager.stopSpeaking();
                    setIsPlayingAudio(false);
                  } else {
                    playQuestionAudio(currentQuestion);
                  }
                }}
                className="flex items-center gap-1.5 hover:text-cyan-200 transition-colors"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "animate-bounce text-amber-300" : ""}`} />
                <span>{isPlayingAudio ? "Audio đang phát..." : "Phát Audio"}</span>
              </button>

              <span className="text-white/40">|</span>

              {/* Toggle script helper */}
              <button
                type="button"
                onClick={() => setShowListeningTextHelper(!showListeningTextHelper)}
                className="text-[11px] text-cyan-100 hover:text-white flex items-center gap-1"
                title="Bật/tắt văn bản trợ giúp khi nghe"
              >
                {showListeningTextHelper ? <Eye className="w-3.5 h-3.5 text-amber-300" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{showListeningTextHelper ? "Chữ: BẬT" : "Chữ: ẨN (Thi thật)"}</span>
              </button>
            </div>
          ) : null}

          {/* If in listening section: button to switch to reading early */}
          {examSection === "listening" && (
            <button
              type="button"
              onClick={() => setShowSwitchToReadingModal(true)}
              className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-black text-cyan-100 transition-colors flex items-center gap-1"
            >
              <span>Sang phần Đọc →</span>
            </button>
          )}
        </div>

        {/* Right: Section Timer + Pause + White Submit Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Timer box */}
          <div className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-white/15 text-white font-mono flex items-center gap-1.5 text-xs sm:text-sm font-black">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-200" />
            <span>
              {mode === "practice"
                ? formatTime(practiceTimeElapsed)
                : formatTime(examSection === "listening" ? listeningTimeLeft : readingTimeLeft)}
            </span>
          </div>

          {/* Pause button */}
          <button
            type="button"
            onClick={() => setIsTimerPaused(!isTimerPaused)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
            title={isTimerPaused ? "Tiếp tục làm bài" : "Tạm dừng"}
          >
            {isTimerPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* White Submit Button */}
          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="h-8 sm:h-9 px-3 sm:px-4 rounded-xl bg-white text-[#0891b2] hover:bg-slate-50 font-black text-xs sm:text-sm shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Nộp bài</span>
          </button>
        </div>
      </header>

      {/* 2. Main Exam Canvas */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-6">
        {isSplitLayout ? (
          /* Split View 2 cột cho Part 3, 4, 6, 7 */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Cột Trái: Văn bản bài đọc / Email / Hình ảnh / Đoạn hội thoại */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm max-h-[calc(100vh-140px)] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                  Part {currentQuestion.part}: {currentQuestion.part >= 5 ? "Bài đọc hiểu" : "Đoạn hội thoại"}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Chùm câu: {currentClusterQuestions.map((q) => q.questionNumber).join(", ")}
                </span>
              </div>

              {/* Part 3 & 4 Real Exam Notice: Hidden transcript during test unless helper turned ON */}
              {currentQuestion.part <= 4 && !showListeningTextHelper ? (
                <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-950 text-[#0891b2] flex items-center justify-center mx-auto">
                    <Headphones className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="font-black text-sm text-slate-800 dark:text-slate-100">
                    Đang Nghe Đoạn Đối Thoại / Bài Nói
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Theo quy chuẩn thi thật tại IIG, transcript không được in trên đề thi.
                    Bạn hãy tập trung lắng nghe và trả lời các câu hỏi ở cột bên phải.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowListeningTextHelper(true)}
                    className="text-xs font-bold text-[#0891b2] hover:underline inline-flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Hiện transcript trợ giúp</span>
                  </button>
                </div>
              ) : (
                /* Passage Content */
                currentQuestion.passage && (
                  <div className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line font-sans select-text">
                    {currentQuestion.passage}
                  </div>
                )
              )}

              {/* Image if any */}
              {currentQuestion.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 mt-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Diagram/Chart for reading passage"
                    className="object-contain max-h-72 w-full"
                  />
                </div>
              )}
            </div>

            {/* Cột Phải: Hiển thị đồng thời toàn bộ chùm câu hỏi thuộc bài đọc đó */}
            <div className="lg:col-span-6 space-y-5 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
              {currentClusterQuestions.map((q) => {
                const isSelectedAnswer = userAnswers[q.id];

                return (
                  <div
                    key={q.id}
                    id={`question-${q.id}`}
                    className={`p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 transition-all space-y-4 shadow-sm ${
                      q.id === currentQuestion.id
                        ? "border-[#0891b2] dark:border-cyan-500"
                        : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {/* Question Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-[#0891b2] text-white flex items-center justify-center font-black text-sm shadow-sm">
                          {q.questionNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          Câu {q.questionNumber} / 200
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleFlag(q.id)}
                        className={`p-1.5 rounded-xl border transition-colors ${
                          flaggedQuestions[q.id]
                            ? "bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/60"
                            : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800"
                        }`}
                        title="Đánh dấu câu hỏi"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${flaggedQuestions[q.id] ? "fill-amber-500 text-amber-500" : ""}`}
                        />
                      </button>
                    </div>

                    {/* Question Text */}
                    {q.questionText && (
                      <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-snug">
                        {q.questionText}
                      </div>
                    )}

                    {/* Options list */}
                    <div className="space-y-2.5 pt-1">
                      {(["A", "B", "C", "D"] as const).map((opt) => {
                        const optText = q.options[opt];
                        if (!optText && opt === "D" && q.part === 2) return null;
                        const isChosen = isSelectedAnswer === opt;

                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleSelectAnswer(q.id, opt)}
                            className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 group ${
                              isChosen
                                ? "bg-cyan-50 dark:bg-cyan-950/60 border-[#0891b2] text-cyan-950 dark:text-cyan-100 shadow-sm"
                                : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-cyan-300 text-slate-800 dark:text-slate-200"
                            }`}
                          >
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 transition-colors border ${
                                isChosen
                                  ? "bg-[#0891b2] text-white border-[#0891b2]"
                                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 group-hover:border-cyan-400"
                              }`}
                            >
                              {opt}
                            </span>
                            <span className="text-xs sm:text-sm font-medium">{optText}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Single Column Layout cho Part 1 & 2 (100% Real Exam OMR Bubbles) */
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-xl bg-[#0891b2] text-white flex items-center justify-center font-black text-sm shadow-sm">
                    {currentQuestion.questionNumber}
                  </span>
                  <div>
                    <span className="text-xs font-black text-[#0891b2]">
                      Part {currentQuestion.part}: {currentQuestion.part === 1 ? "Mô tả tranh" : "Hỏi – đáp"}
                    </span>
                    <div className="text-[11px] text-slate-400">
                      Câu {currentQuestion.questionNumber} / 200
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => playQuestionAudio(currentQuestion)}
                    disabled={isPlayingAudio}
                    className="px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-[#0891b2] dark:text-cyan-400 text-xs font-bold border border-cyan-200 dark:border-cyan-800 flex items-center gap-1.5 hover:bg-cyan-100 transition-colors"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "animate-bounce text-cyan-600" : ""}`} />
                    <span>{isPlayingAudio ? "Đang phát..." : "Nghe lại"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleFlag(currentQuestion.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      flaggedQuestions[currentQuestion.id]
                        ? "bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/60"
                        : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800"
                    }`}
                    title="Đánh dấu câu hỏi"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${flaggedQuestions[currentQuestion.id] ? "fill-amber-500 text-amber-500" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* Part 1 Photograph Display */}
              {currentQuestion.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 max-h-80 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Part 1 Photograph"
                    className="object-contain max-h-80 w-full"
                  />
                </div>
              )}

              {/* Question Text: If in Real Exam Mode and Part 2 -> Hidden like real test! */}
              {currentQuestion.part === 2 ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                  <div className="font-bold text-sm sm:text-base text-slate-700 dark:text-slate-200 italic">
                    &quot;Mark your answer on your answer sheet&quot;
                  </div>
                  {showListeningTextHelper && currentQuestion.questionText && (
                    <div className="pt-2 text-xs text-amber-600 dark:text-amber-400 font-semibold border-t border-slate-200 dark:border-slate-700">
                      Script trợ giúp: {currentQuestion.questionText}
                    </div>
                  )}
                </div>
              ) : null}

              {/* OMR Options: If in Real Exam Mode -> Show OMR Bubbles A, B, C, (D) */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider">
                  Chọn đáp án trắc nghiệm OMR:
                </div>

                <div className={`grid gap-3 ${currentQuestion.part === 2 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}>
                  {(["A", "B", "C", "D"] as const).map((opt) => {
                    if (opt === "D" && currentQuestion.part === 2) return null;
                    const isChosen = userAnswers[currentQuestion.id] === opt;
                    const optText = currentQuestion.options[opt];

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelectAnswer(currentQuestion.id, opt)}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 group ${
                          isChosen
                            ? "bg-cyan-50 dark:bg-cyan-950/70 border-[#0891b2] text-[#0891b2] shadow-md ring-2 ring-[#0891b2]"
                            : "bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-cyan-400 text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        <span
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-base transition-colors border-2 ${
                            isChosen
                              ? "bg-[#0891b2] text-white border-[#0891b2]"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 group-hover:border-cyan-500"
                          }`}
                        >
                          {opt}
                        </span>

                        {showListeningTextHelper && optText ? (
                          <span className="text-[11px] font-medium text-center line-clamp-2">
                            {optText}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Đáp án {opt}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. Fixed Bottom Bar (Chuẩn Đậu TOEIC) */}
      <footer className="h-14 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-3 sm:px-6 fixed bottom-0 left-0 right-0 z-30 shadow-lg">
        {/* Left: Checkbox "Đánh dấu xem lại" */}
        <label
          onClick={() => handleToggleFlag(currentQuestion.id)}
          className="flex items-center gap-2 cursor-pointer select-none text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#0891b2] transition-colors"
        >
          {isCurrentFlagged ? (
            <CheckSquare className="w-5 h-5 text-[#0891b2]" />
          ) : (
            <Square className="w-5 h-5 text-slate-300 dark:text-slate-600" />
          )}
          <span className="hidden sm:inline">Đánh dấu xem lại</span>
          <span className="sm:hidden">Đánh dấu</span>
        </label>

        {/* Center: Prev / Next Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPrev}
            disabled={currentQuestionIndex === 0}
            className="px-3 sm:px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Câu trước</span>
          </button>

          <span className="text-xs font-black text-slate-600 dark:text-slate-300 px-1">
            Câu {currentQuestion?.questionNumber || 1} / {activeQuestions.length}
          </span>

          <button
            type="button"
            onClick={goToNext}
            disabled={currentQuestionIndex >= activeQuestions.length - 1}
            className="px-3 sm:px-4 py-2 rounded-xl bg-[#0891b2] hover:bg-cyan-600 text-white font-bold text-xs flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors"
          >
            <span className="hidden sm:inline">Câu sau</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: "Bảng câu hỏi" Drawer Trigger */}
        <button
          type="button"
          onClick={() => {
            soundManager.playClick();
            setIsPaletteOpen(true);
          }}
          className="px-3 sm:px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-black text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
        >
          <Layers className="w-4 h-4 text-[#0891b2]" />
          <span>Bảng câu hỏi ({answeredCount}/{activeQuestions.length})</span>
        </button>
      </footer>

      {/* 4. Question Palette Drawer (Bottom Sheet) */}
      <QuestionPaletteDrawer
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        questions={activeQuestions}
        currentQuestionId={currentQuestion?.id || 1}
        userAnswers={userAnswers}
        flaggedQuestions={flaggedQuestions}
        onSelectQuestion={jumpToQuestion}
        onSubmitTest={() => setShowSubmitModal(true)}
      />

      {/* 5. Switch to Reading Section Modal */}
      {showSwitchToReadingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-[#0891b2] flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Chuyển Sang Phần Đọc (Reading)?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Bạn sẽ chuyển sang phần thi Đọc hiểu (Part 5, 6, 7 — Câu 101 đến 200).
                Thời gian làm bài phần Đọc là <strong>75 phút</strong>. Bạn có chắc chắn muốn chuyển ngay?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSwitchToReadingModal(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Tiếp tục nghe
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSwitchToReadingModal(false);
                  switchToReadingSection();
                }}
                className="btn-duo flex-1 py-3 rounded-2xl bg-[#0891b2] hover:bg-cyan-600 text-white font-black text-xs shadow-duo-cyan transition-all"
              >
                Vào Phần Đọc (75&apos;)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Confirmation Modal before Submit */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Xác Nhận Nộp Bài?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Sau khi nộp bài, bạn sẽ không thể thay đổi câu trả lời. Bạn có chắc chắn muốn nộp bài?
              </p>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                Đã trả lời: <span className="text-emerald-600 font-black">{answeredCount}</span> / {activeQuestions.length} câu
                {activeQuestions.length - answeredCount > 0 && (
                  <span className="block mt-1 text-rose-500 font-semibold">
                    Còn {activeQuestions.length - answeredCount} câu chưa điền đáp án!
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Tiếp tục làm bài
              </button>
              <button
                type="button"
                onClick={handleSubmitTest}
                className="btn-duo flex-1 py-3 rounded-2xl bg-[#0891b2] hover:bg-cyan-600 text-white font-black text-xs shadow-duo-cyan transition-all"
              >
                Nộp Bài Ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
