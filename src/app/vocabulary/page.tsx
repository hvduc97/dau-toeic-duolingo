"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { initialVocabList, vocabCategories } from "@/data/vocabularyData";
import { VocabWord } from "@/types/toeic";
import { soundManager } from "@/lib/soundEffects";
import {
  BookOpen,
  Volume2,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Filter,
  Layers
} from "lucide-react";

export default function VocabularyPage() {
  const [vocabList, setVocabList] = useState<VocabWord[]>(initialVocabList);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Load saved SRS mastery states from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dau_vocab_list");
    if (saved) {
      try {
        setVocabList(JSON.parse(saved));
      } catch (_) {}
    }
  }, []);

  const filteredWords = vocabList.filter((w) => {
    if (selectedCategory === "Tất cả") return true;
    return w.category === selectedCategory;
  });

  const currentWord = filteredWords[currentIndex] || filteredWords[0];

  const handleSpeak = async (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    await soundManager.speakEnglish(text, 0.85);
    setIsPlayingAudio(false);
  };

  const handleSrsRating = (level: "new" | "learning" | "mastered") => {
    const updatedList = vocabList.map((w) => {
      if (w.id === currentWord.id) {
        return { ...w, masteryLevel: level };
      }
      return w;
    });

    setVocabList(updatedList);
    localStorage.setItem("dau_vocab_list", JSON.stringify(updatedList));

    if (level === "mastered") {
      soundManager.playCorrect();
    } else {
      soundManager.playIncorrect();
    }

    setIsFlipped(false);
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
      soundManager.playFanfare();
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch (_) {}
    }
  };

  // Stats
  const masteredCount = vocabList.filter((w) => w.masteryLevel === "mastered").length;
  const learningCount = vocabList.filter((w) => w.masteryLevel === "learning").length;
  const newCount = vocabList.filter((w) => w.masteryLevel === "new").length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-black mb-2">
            <BookOpen className="w-4 h-4" />
            Spaced Repetition System (SRS)
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            600 Từ Vựng TOEIC Cốt Lõi
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Ghi nhớ sâu từ vựng qua phương pháp lặp lại ngắt quãng và ngữ cảnh câu hỏi TOEIC thực tế.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {vocabCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-duo-green"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SRS Mastery Progress Bar */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-xs font-black">
          <span className="text-slate-700 dark:text-slate-200">Tiến Độ Ghi Nhớ Từ Vựng</span>
          <div className="flex items-center gap-4">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              🟢 Đã nhớ: {masteredCount}
            </span>
            <span className="text-amber-500 font-bold">
              🟡 Đang học: {learningCount}
            </span>
            <span className="text-rose-500 font-bold">
              🔴 Chưa nhớ: {newCount}
            </span>
          </div>
        </div>

        {/* 3-Color Segmented Progress Bar */}
        <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(masteredCount / vocabList.length) * 100}%` }}
          />
          <div
            className="bg-amber-400 h-full transition-all duration-300"
            style={{ width: `${(learningCount / vocabList.length) * 100}%` }}
          />
          <div
            className="bg-rose-400 h-full transition-all duration-300"
            style={{ width: `${(newCount / vocabList.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 3D Flashcard Section */}
      {currentWord && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-2">
            <span>
              Thẻ {currentIndex + 1} / {filteredWords.length}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {currentWord.category}
            </span>
          </div>

          {/* Flashcard Box */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative cursor-pointer min-h-[320px] rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-400 shadow-md p-8 flex flex-col justify-between transition-all select-none group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 uppercase tracking-wide">
                {currentWord.partOfSpeech}
              </span>
              <button
                onClick={(e) => handleSpeak(currentWord.word, e)}
                className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 hover:scale-110 transition-transform"
                title="Phát âm từ này"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Content Front vs Back */}
            {!isFlipped ? (
              <div className="my-auto text-center space-y-3 py-6">
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                  {currentWord.word}
                </h2>
                <div className="text-base font-mono text-emerald-600 dark:text-emerald-400">
                  {currentWord.phonetic}
                </div>
                <div className="text-xs text-slate-400 pt-4 flex items-center justify-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Bấm vào thẻ để xem nghĩa tiếng Việt & câu ví dụ</span>
                </div>
              </div>
            ) : (
              <div className="my-auto space-y-4 py-4 animate-in fade-in">
                <div className="text-center">
                  <span className="text-xs text-slate-400 font-bold uppercase">Nghĩa tiếng Việt</span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {currentWord.meaningVi}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Ví dụ thực tế TOEIC</span>
                    <button
                      onClick={(e) => handleSpeak(currentWord.exampleEn, e)}
                      className="text-emerald-600 dark:text-emerald-400 hover:underline text-xs flex items-center gap-1"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Nghe ví dụ</span>
                    </button>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    "{currentWord.exampleEn}"
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    "{currentWord.exampleVi}"
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center text-[11px] text-slate-400 font-medium pt-2">
              <span>{isFlipped ? "Bấm để quay lại mặt trước" : "Lật thẻ để tự kiểm tra"}</span>
            </div>
          </div>

          {/* SRS Grading Buttons (Duolingo Style) */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => handleSrsRating("new")}
              className="btn-duo py-3 sm:py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs sm:text-sm shadow-duo-red flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all"
            >
              <span>🔴</span>
              <span>Chưa thuộc</span>
            </button>

            <button
              onClick={() => handleSrsRating("learning")}
              className="btn-duo py-3 sm:py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs sm:text-sm shadow-duo-yellow flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all"
            >
              <span>🟡</span>
              <span>Đang học</span>
            </button>

            <button
              onClick={() => handleSrsRating("mastered")}
              className="btn-duo py-3 sm:py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs sm:text-sm shadow-duo-green flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all"
            >
              <span>🟢</span>
              <span>Đã nhớ kỹ</span>
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex((prev) => Math.max(0, prev - 1));
              }}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4 inline mr-1" />
              Từ trước
            </button>

            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex((prev) => Math.min(filteredWords.length - 1, prev + 1));
              }}
              disabled={currentIndex === filteredWords.length - 1}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
            >
              Từ tiếp theo
              <ArrowRight className="w-4 h-4 inline ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
