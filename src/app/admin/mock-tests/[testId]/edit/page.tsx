"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Sparkles,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ToeicTest, ToeicQuestion, ToeicPart } from "@/types/toeic";
import { soundManager } from "@/lib/soundEffects";
import { generateQuestionTemplate, generateSampleMockTestQuestions } from "@/lib/testTemplates";
import AdminPinModal from "@/components/admin/AdminPinModal";

export default function EditMockTestPage({ params }: { params: Promise<{ testId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  // Test General Info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [difficulty, setDifficulty] = useState<"Dễ" | "Trung bình" | "Khó">("Trung bình");
  const [durationMinutes, setDurationMinutes] = useState<number>(120);
  const [authorName, setAuthorName] = useState("");

  // Questions
  const [questions, setQuestions] = useState<ToeicQuestion[]>([]);
  const [selectedPartFilter, setSelectedPartFilter] = useState<string>("all");
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);

  // Status & Modal states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);

  // Load existing test
  useEffect(() => {
    const authState = sessionStorage.getItem("dau_admin_authorized");
    if (authState !== "true") {
      setShowPinModal(true);
      setIsLoading(false);
      return;
    }

    const loadTest = async () => {
      try {
        const pin = sessionStorage.getItem("dau_admin_pin") || "";
        const res = await fetch(`/api/admin/tests/${resolvedParams.testId}`, {
          headers: { "x-admin-pin": pin },
        });
        const data = await res.json();

        if (res.ok && data.test) {
          const t: ToeicTest = data.test;
          setTitle(t.title);
          setDescription(t.description || "");
          setYear(t.year || 2024);
          setDifficulty(t.difficulty || "Trung bình");
          setDurationMinutes(t.durationMinutes || 120);
          setAuthorName(t.authorName || "Ban Quản Trị");
          setQuestions(t.questions || []);
        } else {
          // Check in localStorage if not found on server
          try {
            const localCustom = JSON.parse(localStorage.getItem("dau_custom_tests") || "[]") as ToeicTest[];
            const localTest = localCustom.find((item) => item.id === resolvedParams.testId);
            if (localTest) {
              setTitle(localTest.title);
              setDescription(localTest.description || "");
              setYear(localTest.year || 2024);
              setDifficulty(localTest.difficulty || "Trung bình");
              setDurationMinutes(localTest.durationMinutes || 120);
              setAuthorName(localTest.authorName || "Ban Quản Trị");
              setQuestions(localTest.questions || []);
            } else {
              setStatusMessage({ type: "error", text: "Không tìm thấy thông tin đề thi cần chỉnh sửa." });
            }
          } catch {}
        }
      } catch (err) {
        console.error("Lỗi tải đề thi:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTest();
  }, [resolvedParams.testId]);

  // Add question
  const handleAddQuestion = (part: ToeicPart) => {
    const nextNumber = questions.length + 1;
    const template = generateQuestionTemplate(part, nextNumber);
    setQuestions((prev) => [...prev, template]);
    setActiveQuestionId(nextNumber);
    soundManager.playCorrect();
  };

  // Delete question
  const handleDeleteQuestion = (index: number) => {
    setQuestions((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((q, idx) => ({ ...q, id: idx + 1, questionNumber: idx + 1 }));
    });
  };

  // Update question field
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

  // Update option
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

  // Save changes
  const handleSaveTest = async () => {
    if (!title.trim()) {
      setStatusMessage({ type: "error", text: "Vui lòng nhập Tiêu đề cho bộ đề thi." });
      return;
    }

    if (questions.length === 0) {
      setStatusMessage({ type: "error", text: "Vui lòng có ít nhất một câu hỏi trong đề." });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    const updatedTest: ToeicTest = {
      id: resolvedParams.testId,
      title: title.trim(),
      description: description.trim(),
      year,
      difficulty,
      durationMinutes,
      totalQuestions: questions.length,
      questions,
      isCustom: true,
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
        body: JSON.stringify({ test: updatedTest }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Sync with localStorage
        try {
          const localCustom = JSON.parse(localStorage.getItem("dau_custom_tests") || "[]") as ToeicTest[];
          const idx = localCustom.findIndex((t) => t.id === resolvedParams.testId);
          if (idx >= 0) {
            localCustom[idx] = updatedTest;
          } else {
            localCustom.unshift(updatedTest);
          }
          localStorage.setItem("dau_custom_tests", JSON.stringify(localCustom));
        } catch {}

        soundManager.playCorrect();
        setStatusMessage({ type: "success", text: "Đã lưu cập nhật đề thi thành công!" });
        setTimeout(() => router.push("/admin/mock-tests"), 1200);
      } else {
        soundManager.playWrong();
        setStatusMessage({ type: "error", text: data.error || "Không thể cập nhật đề thi." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Lỗi kết nối tới máy chủ khi lưu đề thi." });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (selectedPartFilter === "all") return true;
    return q.part === Number(selectedPartFilter);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 animate-fade-in">
      {/* Top Bar */}
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
              Chỉnh Sửa Đề Thi: {title || "..."}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cập nhật thông tin và chỉnh sửa chi tiết các câu hỏi.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveTest}
          disabled={isSaving}
          className="btn-duo px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-duo-green flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Đang lưu thay đổi..." : "Lưu Thay Đổi"}</span>
        </button>
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

      {/* Section 1: General Info */}
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">Mô Tả</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
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
            <label className="text-xs font-black text-slate-700 dark:text-slate-300">Thời Lượng (Phút)</label>
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
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            2. Danh Sách Câu Hỏi ({questions.length} câu)
          </h2>

          {/* Add Part buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {([1, 2, 3, 4, 5, 6, 7] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleAddQuestion(p)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                + Part {p}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Part */}
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

        {/* Questions Cards List */}
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const realIndex = questions.findIndex((item) => item.id === q.id);
            const isExpanded = activeQuestionId === q.id || activeQuestionId === null;

            return (
              <div
                key={q.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4"
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
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(realIndex)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                {isExpanded && (
                  <div className="space-y-4 pt-1">
                    {(q.part === 1 || q.part === 7) && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-brand-600" />
                          Đường Dẫn Hình Ảnh (URL Image)
                        </label>
                        <input
                          type="text"
                          value={q.imageUrl || ""}
                          onChange={(e) => handleUpdateQuestion(realIndex, "imageUrl", e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                        />
                      </div>
                    )}

                    {(q.part === 3 || q.part === 4 || q.part === 6 || q.part === 7) && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-brand-600" />
                          Bài Đọc / Kịch Bản Hội Thoại (Passage or Script)
                        </label>
                        <textarea
                          rows={3}
                          value={q.passage || ""}
                          onChange={(e) => handleUpdateQuestion(realIndex, "passage", e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Nội Dung Câu Hỏi (Question Text)
                      </label>
                      <input
                        type="text"
                        value={q.questionText || ""}
                        onChange={(e) => handleUpdateQuestion(realIndex, "questionText", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {(["A", "B", "C", "D"] as const).map((opt) => {
                        if (q.part === 2 && opt === "D") return null;
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
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                                isCorrect
                                  ? "bg-emerald-600 text-white"
                                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                              }`}
                            >
                              {opt}
                            </button>
                            <input
                              type="text"
                              value={q.options[opt] || ""}
                              onChange={(e) => handleUpdateOption(realIndex, opt, e.target.value)}
                              className="w-full bg-transparent border-none text-xs font-medium focus:outline-none"
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500">Bản Dịch Nghĩa</label>
                        <textarea
                          rows={2}
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
                        <label className="text-[11px] font-bold text-slate-500">Phân Tích Chi Tiết</label>
                        <textarea
                          rows={2}
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
      </div>

      <AdminPinModal
        isOpen={showPinModal}
        onSuccess={() => {
          setShowPinModal(false);
          window.location.reload();
        }}
        onCancel={() => router.push("/admin/mock-tests")}
      />
    </div>
  );
}
