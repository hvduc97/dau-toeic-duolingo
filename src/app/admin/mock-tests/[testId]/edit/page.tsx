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
  Search,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  FileText,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Volume2,
  Check,
  RefreshCw,
  ExternalLink,
  Layers,
  HelpCircle
} from "lucide-react";
import { ToeicTest, ToeicQuestion, ToeicPart } from "@/types/toeic";
import { sampleToeicTests } from "@/data/toeicTests";
import { soundManager } from "@/lib/soundEffects";
import { generateQuestionTemplate } from "@/lib/testTemplates";
import AdminPinModal from "@/components/admin/AdminPinModal";

export default function EditMockTestPage({ params }: { params: Promise<{ testId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  // Test General Info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [series, setSeries] = useState<string>("ETS Series");
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [difficulty, setDifficulty] = useState<"Dễ" | "Trung bình" | "Khó">("Trung bình");
  const [durationMinutes, setDurationMinutes] = useState<number>(120);
  const [authorName, setAuthorName] = useState("");

  // Questions
  const [questions, setQuestions] = useState<ToeicQuestion[]>([]);
  const [selectedPartFilter, setSelectedPartFilter] = useState<string>("all");
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Record<number, boolean>>({});
  const [searchQuestionNumber, setSearchQuestionNumber] = useState<string>("");

  // Status & Modal states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);

  // Load existing test (API -> LocalStorage -> sampleToeicTests fallback)
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
        let loadedTest: ToeicTest | null = null;

        // 1. Try fetching from server API
        try {
          const res = await fetch(`/api/admin/tests/${resolvedParams.testId}`, {
            headers: { "x-admin-pin": pin },
          });
          const data = await res.json();
          if (res.ok && data.test) {
            loadedTest = data.test;
          }
        } catch (_) {}

        // 2. Fallback to localStorage custom tests
        if (!loadedTest) {
          try {
            const localCustom = JSON.parse(localStorage.getItem("dau_custom_tests") || "[]") as ToeicTest[];
            const foundInLocal = localCustom.find((item) => item.id === resolvedParams.testId);
            if (foundInLocal) {
              loadedTest = foundInLocal;
            }
          } catch (_) {}
        }

        // 3. Fallback to sampleToeicTests seed data
        if (!loadedTest) {
          const defaultTest = sampleToeicTests.find((item) => item.id === resolvedParams.testId);
          if (defaultTest) {
            loadedTest = defaultTest;
          }
        }

        if (loadedTest) {
          setTitle(loadedTest.title);
          setDescription(loadedTest.description || "");
          setSeries(loadedTest.series || "ETS Series");
          setYear(loadedTest.year || 2024);
          setDifficulty(loadedTest.difficulty || "Trung bình");
          setDurationMinutes(loadedTest.durationMinutes || 120);
          setAuthorName(loadedTest.authorName || "Đậu TOEIC — LET'S English");
          setQuestions(loadedTest.questions || []);

          // Expand the first 5 questions by default
          const initialExpanded: Record<number, boolean> = {};
          (loadedTest.questions || []).slice(0, 5).forEach((q) => {
            initialExpanded[q.id] = true;
          });
          setExpandedQuestionIds(initialExpanded);
        } else {
          setStatusMessage({
            type: "error",
            text: `Không tìm thấy thông tin đề thi có mã "${resolvedParams.testId}".`,
          });
        }
      } catch (err) {
        console.error("Lỗi tải đề thi:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTest();
  }, [resolvedParams.testId]);

  // Expand / Collapse toggles
  const toggleExpand = (questionId: number) => {
    setExpandedQuestionIds((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleExpandAll = () => {
    const allExp: Record<number, boolean> = {};
    questions.forEach((q) => {
      allExp[q.id] = true;
    });
    setExpandedQuestionIds(allExp);
  };

  const handleCollapseAll = () => {
    setExpandedQuestionIds({});
  };

  // Quick Search for question number
  const handleSearchQuestion = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const num = parseInt(searchQuestionNumber.trim(), 10);
    if (isNaN(num)) return;

    const targetQ = questions.find((q) => q.questionNumber === num || q.id === num);
    if (targetQ) {
      // Set part filter to match
      setSelectedPartFilter(String(targetQ.part));
      // Expand question
      setExpandedQuestionIds((prev) => ({ ...prev, [targetQ.id]: true }));
      // Scroll to question
      setTimeout(() => {
        const el = document.getElementById(`edit-q-${targetQ.id}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    } else {
      alert(`Không tìm thấy câu số ${num} trong đề thi.`);
    }
  };

  // Add question
  const handleAddQuestion = (part: ToeicPart) => {
    const nextNumber = questions.length + 1;
    const template = generateQuestionTemplate(part, nextNumber);
    setQuestions((prev) => [...prev, template]);
    setExpandedQuestionIds((prev) => ({ ...prev, [template.id]: true }));
    soundManager.playCorrect();

    setTimeout(() => {
      const el = document.getElementById(`edit-q-${template.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  // Delete question
  const handleDeleteQuestion = (index: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) return;
    setQuestions((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((q, idx) => ({ ...q, id: idx + 1, questionNumber: idx + 1 }));
    });
  };

  // Auto-renumber questions
  const handleAutoRenumber = () => {
    setQuestions((prev) =>
      prev.map((q, idx) => ({
        ...q,
        id: idx + 1,
        questionNumber: idx + 1,
      }))
    );
    soundManager.playCorrect();
    setStatusMessage({ type: "success", text: "Đã đánh lại số thứ tự từ 1 đến " + questions.length + " thành công!" });
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

  // Update explanation
  const handleUpdateExplanation = (
    index: number,
    subField: "translation" | "analysis",
    value: string
  ) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        explanation: {
          ...copy[index].explanation,
          [subField]: value,
        },
      };
      return copy;
    });
  };

  // Vocabulary handlers
  const handleAddVocab = (qIndex: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const existingVocab = copy[qIndex].explanation?.vocabulary || [];
      copy[qIndex] = {
        ...copy[qIndex],
        explanation: {
          ...copy[qIndex].explanation,
          vocabulary: [...existingVocab, { word: "", meaning: "" }],
        },
      };
      return copy;
    });
  };

  const handleUpdateVocab = (
    qIndex: number,
    vIndex: number,
    key: "word" | "meaning",
    val: string
  ) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const vocabs = [...(copy[qIndex].explanation?.vocabulary || [])];
      vocabs[vIndex] = { ...vocabs[vIndex], [key]: val };
      copy[qIndex] = {
        ...copy[qIndex],
        explanation: {
          ...copy[qIndex].explanation,
          vocabulary: vocabs,
        },
      };
      return copy;
    });
  };

  const handleDeleteVocab = (qIndex: number, vIndex: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const vocabs = (copy[qIndex].explanation?.vocabulary || []).filter((_, i) => i !== vIndex);
      copy[qIndex] = {
        ...copy[qIndex],
        explanation: {
          ...copy[qIndex].explanation,
          vocabulary: vocabs,
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
      series,
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
        } catch (_) {}

        soundManager.playCorrect();
        setStatusMessage({ type: "success", text: "Đã lưu cập nhật đề thi thành công vào hệ thống!" });
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 animate-fade-in pb-20">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/mock-tests"
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                {series}
              </span>
              <span className="text-xs text-slate-400 font-bold">
                ID: {resolvedParams.testId}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              Chỉnh Sửa Đề Thi: {title || "..."}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/mock-test/${resolvedParams.testId}/play?mode=full`}
            target="_blank"
            className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Xem phòng thi</span>
          </Link>

          <button
            type="button"
            onClick={handleSaveTest}
            disabled={isSaving}
            className="btn-duo px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-duo-green flex items-center gap-2 disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Đang lưu..." : "Lưu Thay Đổi"}</span>
          </button>
        </div>
      </div>

      {/* Alert Status */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* SECTION 1: General Info */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#0891b2]" />
          <span>1. Thông Tin Chung Bộ Đề Thi</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Tiêu đề đề thi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Pass TOEIC Test 1, ETS 2024 Test 01..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0891b2]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Bộ đề (Series)
            </label>
            <select
              value={series}
              onChange={(e) => setSeries(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0891b2]"
            >
              <option value="Pass TOEIC">Pass TOEIC</option>
              <option value="Crack TOEIC Vol 1">Crack TOEIC Vol 1</option>
              <option value="Crack TOEIC Vol 2">Crack TOEIC Vol 2</option>
              <option value="ETS Series">ETS Series</option>
              <option value="Khác">Khác / Đề Tự Tạo</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Độ khó
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0891b2]"
            >
              <option value="Dễ">Dễ (Mục tiêu 450 - 600)</option>
              <option value="Trung bình">Trung bình (Mục tiêu 650 - 750)</option>
              <option value="Khó">Khó (Mục tiêu 800 - 990)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Năm phát hành
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0891b2]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Thời gian làm bài (phút)
            </label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0891b2]"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Mô tả bài thi
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Lời khuyên, hướng dẫn và thông tin đối tượng phù hợp..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0891b2]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Questions Management Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4 sticky top-16 z-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0891b2]" />
              <span>2. Danh Sách Câu Hỏi ({questions.length} câu)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Đề thi trọn vẹn 200 câu hỏi liên tục không ngắt quãng (1–200).
            </p>
          </div>

          {/* Quick Search & Accordion Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <form onSubmit={handleSearchQuestion} className="flex items-center gap-1.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="number"
                  placeholder="Tìm câu số..."
                  value={searchQuestionNumber}
                  onChange={(e) => setSearchQuestionNumber(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white w-28 focus:outline-none focus:ring-2 focus:ring-[#0891b2]"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-[#0891b2] hover:bg-cyan-600 text-white font-bold text-xs"
              >
                Tìm
              </button>
            </form>

            <button
              type="button"
              onClick={handleExpandAll}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Mở hết
            </button>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Thu gọn
            </button>
            <button
              type="button"
              onClick={handleAutoRenumber}
              className="px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1"
              title="Đánh lại số thứ tự từ 1 đến N liên tục"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Đánh lại số câu</span>
            </button>
          </div>
        </div>

        {/* Part Tabs Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 dark:border-slate-800 pt-3">
          <button
            type="button"
            onClick={() => setSelectedPartFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedPartFilter === "all"
                ? "bg-[#0891b2] text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedPartFilter === String(p)
                    ? "bg-[#0891b2] text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                }`}
              >
                Part {p} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Questions List Cards */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const index = questions.findIndex((item) => item.id === q.id);
          const isExpanded = Boolean(expandedQuestionIds[q.id]);

          return (
            <div
              key={q.id}
              id={`edit-q-${q.id}`}
              className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
            >
              {/* Question Summary Header */}
              <div
                onClick={() => toggleExpand(q.id)}
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-[#0891b2] text-white flex items-center justify-center font-black text-xs shrink-0">
                    {q.questionNumber}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                        Part {q.part}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 max-w-xl">
                        {q.questionText || q.passage?.slice(0, 80) || "(Chưa có nội dung câu hỏi)"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Đáp án: {q.correctAnswer}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQuestion(index);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Xóa câu hỏi này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Question Detailed Form (Shown when expanded) */}
              {isExpanded && (
                <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800 space-y-5 bg-slate-50/50 dark:bg-slate-800/20">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Phần thi (Part)
                      </label>
                      <select
                        value={q.part}
                        onChange={(e) => handleUpdateQuestion(index, "part", Number(e.target.value) as ToeicPart)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                      >
                        {[1, 2, 3, 4, 5, 6, 7].map((p) => (
                          <option key={p} value={p}>
                            Part {p}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Số thứ tự câu hỏi
                      </label>
                      <input
                        type="number"
                        value={q.questionNumber}
                        onChange={(e) => handleUpdateQuestion(index, "questionNumber", Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                      >
                      </input>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Đáp án đúng
                      </label>
                      <div className="flex items-center gap-2 pt-1">
                        {(["A", "B", "C", "D"] as const).map((opt) => {
                          if (opt === "D" && q.part === 2) return null;
                          const isCorrect = q.correctAnswer === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleUpdateQuestion(index, "correctAnswer", opt)}
                              className={`w-9 h-8 rounded-lg font-black text-xs transition-colors border ${
                                isCorrect
                                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-300"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Image URL (Part 1 or diagrams) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#0891b2]" />
                      <span>Đường dẫn hình ảnh (Image URL)</span>
                    </label>
                    <input
                      type="text"
                      value={q.imageUrl || ""}
                      onChange={(e) => handleUpdateQuestion(index, "imageUrl", e.target.value)}
                      placeholder="https://images.unsplash.com/... hoặc link ảnh"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                    {q.imageUrl && (
                      <div className="w-36 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={q.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Passage Text (Part 3, 4, 6, 7) */}
                  {(q.part === 3 || q.part === 4 || q.part === 6 || q.part === 7) && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Đoạn văn bản bài đọc / Transcript đối thoại (Passage)</span>
                      </label>
                      <textarea
                        rows={4}
                        value={q.passage || ""}
                        onChange={(e) => handleUpdateQuestion(index, "passage", e.target.value)}
                        placeholder="Nội dung bài đọc, email, bài báo hoặc transcript đàm thoại..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-sans"
                      />
                    </div>
                  )}

                  {/* Question Text */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Nội dung câu hỏi (Question Text)
                    </label>
                    <input
                      type="text"
                      value={q.questionText || ""}
                      onChange={(e) => handleUpdateQuestion(index, "questionText", e.target.value)}
                      placeholder="VD: What is the main purpose of the email?"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                    />
                  </div>

                  {/* Options A, B, C, D */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Các phương án trả lời:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(["A", "B", "C", "D"] as const).map((opt) => {
                        if (opt === "D" && q.part === 2) return null;
                        const isCorrect = q.correctAnswer === opt;

                        return (
                          <div key={opt} className="flex items-center gap-2">
                            <span
                              className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                                isCorrect ? "bg-emerald-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              {opt}
                            </span>
                            <input
                              type="text"
                              value={q.options[opt] || ""}
                              onChange={(e) => handleUpdateOption(index, opt, e.target.value)}
                              placeholder={`Nội dung lựa chọn ${opt}...`}
                              className={`flex-1 px-3 py-1.5 rounded-xl border text-xs ${
                                isCorrect
                                  ? "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
                                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Detailed Explanation */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-4">
                    <div className="text-xs font-black uppercase text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Lời giải thích chi tiết &amp; Từ vựng</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Bản dịch nghĩa tiếng Việt:
                      </label>
                      <textarea
                        rows={2}
                        value={q.explanation?.translation || ""}
                        onChange={(e) => handleUpdateExplanation(index, "translation", e.target.value)}
                        placeholder="Dịch nghĩa câu hỏi và bài đọc..."
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Phân tích ngữ pháp / Lý do chọn đáp án:
                      </label>
                      <textarea
                        rows={2}
                        value={q.explanation?.analysis || ""}
                        onChange={(e) => handleUpdateExplanation(index, "analysis", e.target.value)}
                        placeholder="Phân tích cấu trúc ngữ pháp, liên từ, bẫy từ vựng..."
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      />
                    </div>

                    {/* Vocabulary */}
                    <div className="space-y-2 pt-2 border-t border-amber-200/50 dark:border-amber-900/40">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          Từ vựng trọng tâm ({q.explanation?.vocabulary?.length || 0}):
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddVocab(index)}
                          className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-900 dark:hover:bg-amber-800 text-amber-900 dark:text-amber-200 text-[11px] font-bold flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Thêm từ</span>
                        </button>
                      </div>

                      {q.explanation?.vocabulary && q.explanation.vocabulary.length > 0 && (
                        <div className="space-y-2">
                          {q.explanation.vocabulary.map((voc, vIdx) => (
                            <div key={vIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Từ tiếng Anh"
                                value={voc.word}
                                onChange={(e) => handleUpdateVocab(index, vIdx, "word", e.target.value)}
                                className="w-1/3 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                              />
                              <input
                                type="text"
                                placeholder="Nghĩa tiếng Việt"
                                value={voc.meaning}
                                onChange={(e) => handleUpdateVocab(index, vIdx, "meaning", e.target.value)}
                                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteVocab(index, vIdx)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Question Bar */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
        <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">
          Thêm câu hỏi mới vào đề thi
        </h3>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleAddQuestion(p as ToeicPart)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#0891b2] text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#0891b2]" />
              <span>Thêm Part {p}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Fixed Bottom Save Floating Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-between max-w-6xl mx-auto px-6 z-30 shadow-2xl">
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Đề thi: <span className="text-slate-900 dark:text-white font-black">{title || "..."}</span> ({questions.length} câu)
        </div>

        <button
          type="button"
          onClick={handleSaveTest}
          disabled={isSaving}
          className="btn-duo px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-duo-green flex items-center gap-2 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Đang lưu thay đổi..." : "Lưu Thay Đổi"}</span>
        </button>
      </div>

      {/* Admin Pin Modal if unauthorized */}
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
