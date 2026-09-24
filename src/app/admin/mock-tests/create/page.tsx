"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Sparkles,
  HelpCircle,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Volume2,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ToeicTest, ToeicQuestion, ToeicPart } from "@/types/toeic";
import { soundManager } from "@/lib/soundEffects";
import { generateQuestionTemplate, generateSampleMockTestQuestions } from "@/lib/testTemplates";
import AdminPinModal from "@/components/admin/AdminPinModal";

export default function CreateMockTestPage() {
  const router = useRouter();

  // Test General Info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [difficulty, setDifficulty] = useState<"Dễ" | "Trung bình" | "Khó">("Trung bình");
  const [durationMinutes, setDurationMinutes] = useState<number>(120);
  const [authorName, setAuthorName] = useState("Ban Quản Trị LET'S English");

  // Questions
  const [questions, setQuestions] = useState<ToeicQuestion[]>([]);
  const [selectedPartFilter, setSelectedPartFilter] = useState<string>("all");
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);

  // Status & Modal states
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteJsonText, setPasteJsonText] = useState("");

  // Check auth on mount
  useEffect(() => {
    const authState = sessionStorage.getItem("dau_admin_authorized");
    if (authState !== "true") {
      setShowPinModal(true);
    } else {
      // Seed initial 10 questions template for convenience
      setQuestions(generateSampleMockTestQuestions(10));
    }
  }, []);

  // Quick 1-click generation
  const handleGenerateSampleQuestions = (count: 10 | 20) => {
    const samples = generateSampleMockTestQuestions(count);
    setQuestions(samples);
    soundManager.playCorrect();
    setStatusMessage({
      type: "success",
      text: `Đã tự động tạo bộ khung mẫu ${count} câu hỏi hoàn chỉnh trải đều từ Part 1 đến Part 7!`,
    });
  };

  // Add a new question
  const handleAddQuestion = (part: ToeicPart) => {
    const nextNumber = questions.length + 1;
    const template = generateQuestionTemplate(part, nextNumber);
    setQuestions((prev) => [...prev, template]);
    setActiveQuestionId(nextNumber);
    soundManager.playCorrect();
  };

  // Delete a question
  const handleDeleteQuestion = (index: number) => {
    setQuestions((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      // Re-index questionNumber
      return updated.map((q, idx) => ({ ...q, id: idx + 1, questionNumber: idx + 1 }));
    });
  };

  // Update specific question field
  const handleUpdateQuestion = <K extends keyof ToeicQuestion>(
    index: number,
    field: K,
    value: ToeicQuestion[K]
  ) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Update specific option
  const handleUpdateOption = (index: number, optionKey: "A" | "B" | "C" | "D", text: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        options: {
          ...copy[index].options,
          [optionKey]: text,
        },
      };
      return copy;
    });
  };

  // Paste JSON Questions
  const handleApplyPastedQuestions = () => {
    try {
      const parsed = JSON.parse(pasteJsonText);
      const list: ToeicQuestion[] = Array.isArray(parsed) ? parsed : [parsed];

      const formatted: ToeicQuestion[] = list.map((item, idx) => ({
        id: idx + 1,
        part: (item.part || 5) as ToeicPart,
        questionNumber: idx + 1,
        questionText: item.questionText || "",
        imageUrl: item.imageUrl,
        passage: item.passage,
        audioUrl: item.audioUrl,
        options: item.options || { A: "", B: "", C: "", D: "" },
        correctAnswer: item.correctAnswer || "A",
        explanation: item.explanation || { translation: "", analysis: "" },
      }));

      setQuestions(formatted);
      setShowPasteModal(false);
      setPasteJsonText("");
      soundManager.playCorrect();
      setStatusMessage({ type: "success", text: `Đã dán thành công ${formatted.length} câu hỏi vào đề!` });
    } catch {
      soundManager.playWrong();
      alert("Định dạng JSON câu hỏi không hợp lệ. Vui lòng kiểm tra lại cấu trúc.");
    }
  };

  // Save Test
  const handleSaveTest = async () => {
    if (!title.trim()) {
      setStatusMessage({ type: "error", text: "Vui lòng nhập Tiêu đề cho bộ đề thi." });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (questions.length === 0) {
      setStatusMessage({ type: "error", text: "Vui lòng thêm ít nhất một câu hỏi vào đề thi." });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    const testId = `custom-test-${Date.now()}`;
    const newTest: ToeicTest = {
      id: testId,
      title: title.trim(),
      description: description.trim() || `Đề thi thử TOEIC do ${authorName} tạo.`,
      year,
      difficulty,
      durationMinutes,
      totalQuestions: questions.length,
      questions,
      isCustom: true,
      createdAt: new Date().toISOString(),
      authorName,
    };

    try {
      const pin = sessionStorage.getItem("dau_admin_pin") || "";
      const res = await fetch("/api/admin/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": pin,
        },
        body: JSON.stringify({ test: newTest }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Also sync with localStorage
        try {
          const localCustom = JSON.parse(localStorage.getItem("dau_custom_tests") || "[]") as ToeicTest[];
          localCustom.unshift(newTest);
          localStorage.setItem("dau_custom_tests", JSON.stringify(localCustom));
        } catch {}

        soundManager.playFanfare();
        router.push("/admin/mock-tests");
      } else {
        soundManager.playWrong();
        setStatusMessage({ type: "error", text: data.error || "Không thể lưu đề thi." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Lỗi kết nối tới máy chủ khi lưu đề thi." });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (selectedPartFilter === "all") return true;
    return q.part === Number(selectedPartFilter);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 animate-fade-in">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/mock-tests"
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Tạo Đề Thi Thử TOEIC Mới
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Thiết lập thông tin chung và biên soạn các câu hỏi theo 7 phần chuẩn ETS.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowPasteModal(true)}
            className="btn-duo px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
          >
            <FileCode className="w-4 h-4 text-brand-600" />
            <span>Dán JSON / Text</span>
          </button>

          <button
            type="button"
            onClick={handleSaveTest}
            disabled={isLoading}
            className="btn-duo px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-duo-green flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? "Đang lưu đề..." : "Lưu & Xuất Bản Đề Thi"}</span>
          </button>
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>
      )}

      {/* Section 1: General Test Info */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand-600" />
          1. Thông Tin Chung Đề Thi
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">
              Tiêu Đề Đề Thi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="VD: ETS TOEIC 2024 — Test 02 (Format Chuẩn)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">
              Mô Tả Đề Thi
            </label>
            <textarea
              rows={2}
              placeholder="Mô tả cấu trúc đề thi, mục tiêu điểm số hoặc lưu ý cho thí sinh..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">Năm Biên Soạn</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">Độ Khó</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as "Dễ" | "Trung bình" | "Khó")}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
            >
              <option value="Dễ">Dễ (Mục tiêu 450 - 600)</option>
              <option value="Trung bình">Trung bình (Mục tiêu 650 - 800)</option>
              <option value="Khó">Khó (Mục tiêu 850 - 990)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">
              Thời Lượng (Phút)
            </label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">Tác Giả / Nguồn</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Questions Builder */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              2. Danh Sách Câu Hỏi ({questions.length} câu)
            </h2>
          </div>

          {/* Quick Generators */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleGenerateSampleQuestions(10)}
              className="btn-duo px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-extrabold border border-amber-200 dark:border-amber-800 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ Tạo Khung Mẫu 10 Câu (Full 7 Part)</span>
            </button>
            <button
              type="button"
              onClick={() => handleGenerateSampleQuestions(20)}
              className="btn-duo px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-extrabold border border-amber-200 dark:border-amber-800 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ Tạo Khung Mẫu 20 Câu</span>
            </button>
          </div>
        </div>

        {/* Add Question Buttons by Part */}
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-slate-500 mr-1">+ Thêm câu theo Part:</span>
          {([1, 2, 3, 4, 5, 6, 7] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleAddQuestion(p)}
              className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
            >
              Part {p}
            </button>
          ))}
        </div>

        {/* Filter questions by Part */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedPartFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedPartFilter === "all"
                ? "bg-brand-600 text-white shadow-duo-cyan"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            }`}
          >
            Tất cả ({questions.length})
          </button>
          {[1, 2, 3, 4, 5, 6, 7].map((p) => {
            const count = questions.filter((q) => q.part === p).length;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPartFilter(String(p))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedPartFilter === String(p)
                    ? "bg-brand-600 text-white shadow-duo-cyan"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                }`}
              >
                Part {p} ({count})
              </button>
            );
          })}
        </div>

        {/* Question Cards List */}
        {filteredQuestions.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <p className="text-xs font-bold text-slate-500">Chưa có câu hỏi nào trong phần này.</p>
            <button
              type="button"
              onClick={() => handleAddQuestion((Number(selectedPartFilter) || 5) as ToeicPart)}
              className="btn-duo px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
            >
              + Thêm Câu Hỏi Ngay
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const realIndex = questions.findIndex((item) => item.id === q.id);
              const isExpanded = activeQuestionId === q.id || activeQuestionId === null;

              return (
                <div
                  key={q.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 transition-all"
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-black text-xs shadow-duo-cyan">
                        {q.questionNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 font-extrabold text-[11px]">
                        Part {q.part}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1 max-w-md">
                        {q.questionText || "Chưa có nội dung câu hỏi"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveQuestionId(isExpanded ? -1 : q.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                        title={isExpanded ? "Thu gọn" : "Mở rộng"}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(realIndex)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60"
                        title="Xóa câu hỏi này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Form fields (if expanded) */}
                  {isExpanded && (
                    <div className="space-y-4 pt-1">
                      {/* Part 1/7 Image URL */}
                      {(q.part === 1 || q.part === 7) && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-brand-600" />
                            Đường Dẫn Hình Ảnh (URL Image cho Part 1 hoặc biểu đồ Part 7)
                          </label>
                          <input
                            type="text"
                            placeholder="https://example.com/image.jpg"
                            value={q.imageUrl || ""}
                            onChange={(e) => handleUpdateQuestion(realIndex, "imageUrl", e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                          />
                        </div>
                      )}

                      {/* Part 3, 4, 6, 7 Passage / Transcript */}
                      {(q.part === 3 || q.part === 4 || q.part === 6 || q.part === 7) && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-brand-600" />
                            Bài Đọc / Đoạn Hội Thoại / Độc Thoại (Passage or Script)
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Dán đoạn văn bản bài đọc hoặc kịch bản hội thoại vào đây..."
                            value={q.passage || ""}
                            onChange={(e) => handleUpdateQuestion(realIndex, "passage", e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                          />
                        </div>
                      )}

                      {/* Question Text */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                          Nội Dung Câu Hỏi (Question Text)
                        </label>
                        <input
                          type="text"
                          placeholder="VD: What is the main purpose of the notice?"
                          value={q.questionText || ""}
                          onChange={(e) => handleUpdateQuestion(realIndex, "questionText", e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                        />
                      </div>

                      {/* Options A, B, C, D */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {(["A", "B", "C", "D"] as const).map((opt) => {
                          if (q.part === 2 && opt === "D") return null; // Part 2 doesn't have D
                          const isCorrect = q.correctAnswer === opt;

                          return (
                            <div
                              key={opt}
                              className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-2.5 ${
                                isCorrect
                                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500"
                                  : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => handleUpdateQuestion(realIndex, "correctAnswer", opt)}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                                  isCorrect
                                    ? "bg-emerald-600 text-white"
                                    : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                }`}
                                title="Bấm vào để chọn đáp án ĐÚNG"
                              >
                                {opt}
                              </button>
                              <input
                                type="text"
                                placeholder={`Lựa chọn ${opt}...`}
                                value={q.options[opt] || ""}
                                onChange={(e) => handleUpdateOption(realIndex, opt, e.target.value)}
                                className="w-full bg-transparent border-none text-xs font-medium focus:outline-none"
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation & Translation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500">
                            Bản Dịch Nghĩa (Tiếng Việt)
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Dịch nghĩa câu hỏi và đáp án..."
                            value={q.explanation.translation || ""}
                            onChange={(e) =>
                              handleUpdateQuestion(realIndex, "explanation", {
                                ...q.explanation,
                                translation: e.target.value,
                              })
                            }
                            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-500">
                            Phân Tích Chi Tiết & Mẹo Chọn Đáp Án
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Giải thích lý do tại sao chọn đáp án này..."
                            value={q.explanation.analysis || ""}
                            onChange={(e) =>
                              handleUpdateQuestion(realIndex, "explanation", {
                                ...q.explanation,
                                analysis: e.target.value,
                              })
                            }
                            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Paste JSON Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Dán Dữ Liệu Câu Hỏi JSON
            </h3>
            <p className="text-xs text-slate-500">
              Dán một mảng câu hỏi JSON theo định dạng ToeicQuestion[] để cập nhật nhanh toàn bộ đề:
            </p>
            <textarea
              rows={8}
              placeholder={`[\n  {\n    "part": 5,\n    "questionText": "...",\n    "options": { "A": "...", "B": "...", "C": "...", "D": "..." },\n    "correctAnswer": "A",\n    "explanation": { "translation": "...", "analysis": "..." }\n  }\n]`}
              value={pasteJsonText}
              onChange={(e) => setPasteJsonText(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 font-mono text-xs border border-slate-200 dark:border-slate-700"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="btn-duo px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleApplyPastedQuestions}
                className="btn-duo px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
              >
                Áp Dụng Câu Hỏi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN Security Modal */}
      <AdminPinModal
        isOpen={showPinModal}
        onSuccess={() => {
          setShowPinModal(false);
          setQuestions(generateSampleMockTestQuestions(10));
        }}
        onCancel={() => router.push("/mock-test")}
      />
    </div>
  );
}
