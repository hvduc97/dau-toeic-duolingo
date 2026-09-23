"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { sampleListeningLessons } from "@/data/listeningLessons";
import { soundManager } from "@/lib/soundEffects";
import {
  Volume2,
  Headphones,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Eye,
  Play,
  Pause,
  FastForward,
  Rewind
} from "lucide-react";

export default function ListeningPracticePage({ params }: { params: Promise<{ lessonId: string }> }) {
  const resolvedParams = use(params);
  const lesson = sampleListeningLessons.find((l) => l.id === resolvedParams.lessonId) || sampleListeningLessons[0];

  // Active Mode: 1: Fill Blanks, 2: Dictation, 3: Listen & Check, 4: Full Player
  const [activeMode, setActiveMode] = useState<1 | 2 | 3 | 4>(1);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.9);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const currentSentence = lesson.sentences[currentSentenceIndex] || lesson.sentences[0];

  // State for Mode 1: Fill Blanks
  const [userBlanks, setUserBlanks] = useState<Record<string, string>>({});
  const [blankChecked, setBlankChecked] = useState<boolean>(false);
  const [blankIsCorrect, setBlankIsCorrect] = useState<boolean>(false);

  // State for Mode 2: Dictation
  const [dictationText, setDictationText] = useState<string>("");
  const [dictationResult, setDictationResult] = useState<{
    accuracy: number;
    diffWords: { word: string; status: "correct" | "incorrect" | "missing" }[];
  } | null>(null);

  // State for Mode 3: Listen & Check
  const [showTranscriptCheck, setShowTranscriptCheck] = useState<boolean>(false);

  // State for Mode 4: Full Player
  const [activeFullSentenceId, setActiveFullSentenceId] = useState<string>(lesson.sentences[0].id);

  // Play sentence audio via SpeechSynthesis
  const playAudio = async (text: string, speed: number = playbackSpeed) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    await soundManager.speakEnglish(text, speed);
    setIsPlayingAudio(false);
  };

  const handleNextSentence = () => {
    if (currentSentenceIndex < lesson.sentences.length - 1) {
      setCurrentSentenceIndex((prev) => prev + 1);
      // Reset inputs
      setUserBlanks({});
      setBlankChecked(false);
      setDictationText("");
      setDictationResult(null);
      setShowTranscriptCheck(false);
    } else {
      // Completed all sentences in lesson!
      soundManager.playFanfare();
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch (_) {}
    }
  };

  // Mode 1: Check Blanks
  const handleCheckBlanks = () => {
    let allCorrect = true;
    currentSentence.keywordsToFill.forEach((kw) => {
      const userVal = (userBlanks[kw] || "").trim().toLowerCase();
      if (userVal !== kw.toLowerCase()) {
        allCorrect = false;
      }
    });

    setBlankChecked(true);
    setBlankIsCorrect(allCorrect);

    if (allCorrect) {
      soundManager.playCorrect();
    } else {
      soundManager.playIncorrect();
    }
  };

  // Mode 2: Check Dictation
  const handleCheckDictation = () => {
    const targetWords = currentSentence.audioText.toLowerCase().replace(/[.,!?;:'"]/g, "").split(/\s+/);
    const userWords = dictationText.toLowerCase().replace(/[.,!?;:'"]/g, "").split(/\s+/).filter(Boolean);

    let matchCount = 0;
    const diff = targetWords.map((tw, idx) => {
      const uw = userWords[idx];
      if (uw === tw) {
        matchCount++;
        return { word: tw, status: "correct" as const };
      }
      return { word: tw, status: "incorrect" as const };
    });

    const accuracy = Math.round((matchCount / targetWords.length) * 100);
    setDictationResult({ accuracy, diffWords: diff });

    if (accuracy >= 80) {
      soundManager.playCorrect();
      if (accuracy === 100) {
        try {
          confetti({ particleCount: 50, spread: 50 });
        } catch (_) {}
      }
    } else {
      soundManager.playIncorrect();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/listening"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về danh sách bài nghe</span>
        </Link>
        <span className="text-xs font-bold text-slate-400">
          Câu {currentSentenceIndex + 1} / {lesson.sentences.length}
        </span>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <span className="text-[11px] font-black uppercase text-sky-600 dark:text-sky-400 tracking-wider">
            {lesson.category}
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {lesson.title}
          </h1>
        </div>

        {/* 4 Mode Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {[
            { id: 1 as const, name: "1. Nghe Điền Từ" },
            { id: 2 as const, name: "2. Chép Chính Tả" },
            { id: 3 as const, name: "3. Nghe Check" },
            { id: 4 as const, name: "4. Nghe Full" },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setActiveMode(mode.id);
                soundManager.playCorrect();
              }}
              className={`py-2.5 px-3 rounded-2xl text-xs font-extrabold transition-all text-center ${
                activeMode === mode.id
                  ? "bg-sky-600 text-white shadow-duo-blue"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {mode.name}
            </button>
          ))}
        </div>
      </div>

      {/* MODE 1: NGHE ĐIỀN TỪ (FILL IN BLANKS) */}
      {activeMode === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-sky-600 uppercase">
              Chế độ 1: Nghe bắt âm & điền từ khóa
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => playAudio(currentSentence.audioText, 0.75)}
                disabled={isPlayingAudio}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200"
              >
                0.75x Chậm
              </button>
              <button
                onClick={() => playAudio(currentSentence.audioText, 1.0)}
                disabled={isPlayingAudio}
                className="btn-duo px-4 py-2 rounded-xl bg-sky-600 text-white font-extrabold text-xs shadow-duo-blue flex items-center gap-1.5"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "animate-bounce" : ""}`} />
                <span>{isPlayingAudio ? "Đang phát..." : "Phát Audio"}</span>
              </button>
            </div>
          </div>

          {/* Fill In Sentence Area */}
          <div className="p-6 rounded-2xl bg-sky-50/60 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700 text-base sm:text-lg font-medium leading-loose text-slate-800 dark:text-slate-200">
            {currentSentence.audioText.split(" ").map((word, idx) => {
              const cleanWord = word.replace(/[.,!?;:'"]/g, "");
              const isKeyword = currentSentence.keywordsToFill.some(
                (kw) => kw.toLowerCase() === cleanWord.toLowerCase()
              );

              if (isKeyword) {
                const targetKw = currentSentence.keywordsToFill.find(
                  (kw) => kw.toLowerCase() === cleanWord.toLowerCase()
                ) || cleanWord;

                const userVal = userBlanks[targetKw] || "";
                const isCorrect = userVal.trim().toLowerCase() === targetKw.toLowerCase();

                return (
                  <span key={idx} className="inline-block mx-1">
                    <input
                      type="text"
                      value={userVal}
                      onChange={(e) =>
                        setUserBlanks((prev) => ({ ...prev, [targetKw]: e.target.value }))
                      }
                      placeholder=" điền từ... "
                      className={`px-2.5 py-1 text-sm font-bold rounded-lg border-2 text-center outline-none transition-all w-28 ${
                        blankChecked
                          ? isCorrect
                            ? "bg-emerald-100 border-emerald-500 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-rose-100 border-rose-500 text-rose-900 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-white dark:bg-slate-700 border-sky-300 dark:border-slate-600 text-slate-900 dark:text-white focus:border-sky-500"
                      }`}
                    />
                  </span>
                );
              }
              return <span key={idx} className="mx-0.5">{word}</span>;
            })}
          </div>

          {/* Action & Feedback */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            {!blankChecked ? (
              <button
                onClick={handleCheckBlanks}
                className="btn-duo w-full sm:w-auto px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm shadow-duo-blue"
              >
                Kiểm Tra Đáp Án
              </button>
            ) : (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {blankIsCorrect ? (
                    <div className="flex items-center gap-2 text-emerald-600 font-black text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Tuyệt vời! Bạn nghe chính xác toàn bộ từ khóa.</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-rose-600 font-black text-sm">
                      <XCircle className="w-5 h-5" />
                      <span>Chưa chính xác, từ khóa đúng: {currentSentence.keywordsToFill.join(", ")}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNextSentence}
                  className="btn-duo px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-duo-green flex items-center gap-1.5"
                >
                  <span>Câu tiếp theo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Translation and grammar hint */}
          {blankChecked && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
              <div className="font-bold text-slate-800 dark:text-slate-200">
                Dịch nghĩa: {currentSentence.vietnameseTranslation}
              </div>
              {currentSentence.grammarNote && (
                <div className="text-slate-500 dark:text-slate-400">
                  💡 Điểm ngữ pháp: {currentSentence.grammarNote}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODE 2: CHÉP CHÍNH TẢ (DICTATION) */}
      {activeMode === 2 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-sky-600 uppercase">
              Chế độ 2: Nghe và gõ lại toàn bộ câu
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => playAudio(currentSentence.audioText, 0.75)}
                disabled={isPlayingAudio}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                0.75x Chậm
              </button>
              <button
                onClick={() => playAudio(currentSentence.audioText, 1.0)}
                disabled={isPlayingAudio}
                className="btn-duo px-4 py-2 rounded-xl bg-sky-600 text-white font-extrabold text-xs shadow-duo-blue flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" />
                <span>Phát Audio</span>
              </button>
            </div>
          </div>

          {/* Typing Area */}
          <textarea
            rows={3}
            value={dictationText}
            onChange={(e) => setDictationText(e.target.value)}
            placeholder="Gõ lại toàn bộ câu bạn nghe được tại đây..."
            className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium focus:border-sky-500 outline-none"
          />

          {/* Results Diff */}
          {dictationResult && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Độ chính xác:</span>
                <span className="text-base font-black text-brand-600 dark:text-brand-400">
                  {dictationResult.accuracy}%
                </span>
              </div>

              <div className="text-sm font-mono flex flex-wrap gap-1.5 leading-relaxed">
                {dictationResult.diffWords.map((item, i) => (
                  <span
                    key={i}
                    className={`px-1.5 py-0.5 rounded font-bold ${
                      item.status === "correct"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 line-through"
                    }`}
                  >
                    {item.word}
                  </span>
                ))}
              </div>

              <div className="pt-2 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
                <span className="font-bold">Bản gốc:</span> {currentSentence.audioText}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleCheckDictation}
              className="btn-duo px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-duo-blue"
            >
              Chấm Điểm Chính Tả
            </button>

            {dictationResult && (
              <button
                onClick={handleNextSentence}
                className="btn-duo px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-duo-green flex items-center gap-1.5"
              >
                <span>Câu tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODE 3: NGHE CHECK (LISTEN & CONFIRM) */}
      {activeMode === 3 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-center">
          <span className="text-xs font-extrabold text-sky-600 uppercase">
            Chế độ 3: Nghe nhẩm và lật thẻ kiểm tra
          </span>

          <div className="py-8 space-y-4">
            <button
              onClick={() => playAudio(currentSentence.audioText)}
              className="w-20 h-20 rounded-full bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-300 mx-auto flex items-center justify-center hover:scale-105 transition-transform shadow-duo-blue"
            >
              <Volume2 className="w-10 h-10" />
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bấm để nghe âm thanh câu văn, nhẩm nghĩa trong đầu rồi bấm lật xem transcript
            </p>
          </div>

          {showTranscriptCheck ? (
            <div className="p-6 rounded-2xl bg-sky-50 dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700 text-left space-y-2 animate-in fade-in">
              <div className="text-base font-bold text-slate-900 dark:text-white">
                {currentSentence.audioText}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300">
                {currentSentence.vietnameseTranslation}
              </div>
              {currentSentence.grammarNote && (
                <div className="text-[11px] text-sky-600 dark:text-sky-400 font-medium pt-1">
                  💡 {currentSentence.grammarNote}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setShowTranscriptCheck(true);
                soundManager.playCorrect();
              }}
              className="px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200"
            >
              <Eye className="w-4 h-4 inline mr-1.5" />
              Lật xem Transcript & Dịch nghĩa
            </button>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={handleNextSentence}
              className="btn-duo px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-duo-green flex items-center gap-1.5"
            >
              <span>Tiếp tục câu sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODE 4: NGHE FULL (FULL TRANSCRIPT & PLAYER) */}
      {activeMode === 4 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-extrabold text-sky-600 uppercase">
                Chế độ 4: Trình phát Audio Full & Transcript Song Ngữ
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Tất cả các câu trong bài
              </h3>
            </div>

            {/* Playback speed controls */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {[0.75, 0.9, 1.0, 1.25].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                    playbackSpeed === spd
                      ? "bg-sky-600 text-white"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Sentences List */}
          <div className="space-y-3">
            {lesson.sentences.map((s, idx) => {
              const isSelected = s.id === activeFullSentenceId;

              return (
                <div
                  key={s.id}
                  onClick={() => {
                    setActiveFullSentenceId(s.id);
                    playAudio(s.audioText);
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? "bg-sky-50 dark:bg-sky-950/60 border-sky-400"
                      : "bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:border-sky-300"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 font-bold text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {s.audioText}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 ml-7">
                      {s.vietnameseTranslation}
                    </p>
                  </div>

                  <button className="p-2 rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300 group-hover:scale-110 transition-transform">
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
