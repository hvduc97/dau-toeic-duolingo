"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Plus,
  FileDown,
  FileUp,
  Trash2,
  Edit3,
  Copy,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { ToeicTest } from "@/types/toeic";
import { soundManager } from "@/lib/soundEffects";
import AdminPinModal from "@/components/admin/AdminPinModal";

export default function AdminMockTestsPage() {
  const router = useRouter();

  const [tests, setTests] = useState<ToeicTest[]>([]);
  const [customTests, setCustomTests] = useState<ToeicTest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Import JSON modal state
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importJsonText, setImportJsonText] = useState<string>("");
  const [importError, setImportError] = useState<string>("");

  // Check auth & load data
  useEffect(() => {
    const authState = sessionStorage.getItem("dau_admin_authorized");
    if (authState === "true") {
      setIsAuthorized(true);
      fetchTests();
    } else {
      setShowPinModal(true);
      setIsLoading(false);
    }
  }, []);

  const fetchTests = async () => {
    setIsLoading(true);
    try {
      const pin = sessionStorage.getItem("dau_admin_pin") || "";
      const res = await fetch("/api/admin/tests", {
        headers: { "x-admin-pin": pin },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTests(data.tests || []);
        setCustomTests(data.customTests || []);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách đề thi:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthorized(true);
    setShowPinModal(false);
    fetchTests();
  };

  // Delete test
  const handleDeleteTest = async (testId: string, testTitle: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa đề thi: "${testTitle}"? Thao tác này không thể hoàn tác.`)) {
      return;
    }

    try {
      const pin = sessionStorage.getItem("dau_admin_pin") || "";
      const res = await fetch(`/api/admin/tests?id=${encodeURIComponent(testId)}`, {
        method: "DELETE",
        headers: { "x-admin-pin": pin },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        soundManager.playCorrect();
        setStatusMessage({ type: "success", text: `Đã xóa đề thi "${testTitle}" thành công!` });
        // Also remove from localStorage if present
        try {
          const localCustom = JSON.parse(localStorage.getItem("dau_custom_tests") || "[]") as ToeicTest[];
          const updatedLocal = localCustom.filter((t) => t.id !== testId);
          localStorage.setItem("dau_custom_tests", JSON.stringify(updatedLocal));
        } catch {}

        fetchTests();
      } else {
        soundManager.playWrong();
        setStatusMessage({ type: "error", text: data.error || "Không thể xóa đề thi." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Lỗi kết nối khi xóa đề thi." });
    }
  };

  // Clone test
  const handleCloneTest = async (test: ToeicTest) => {
    try {
      const clonedTest: ToeicTest = {
        ...test,
        id: `cloned-${Date.now()}`,
        title: `${test.title} (Bản sao)`,
        createdAt: new Date().toISOString(),
        isCustom: true,
      };

      const pin = sessionStorage.getItem("dau_admin_pin") || "";
      const res = await fetch("/api/admin/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": pin,
        },
        body: JSON.stringify({ test: clonedTest }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        soundManager.playCorrect();
        setStatusMessage({ type: "success", text: `Đã nhân bản đề thi thành công!` });
        fetchTests();
      } else {
        soundManager.playWrong();
        setStatusMessage({ type: "error", text: data.error || "Không thể nhân bản đề thi." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Lỗi kết nối khi nhân bản đề thi." });
    }
  };

  // Export all tests as JSON
  const handleExportAll = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tests, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lets_english_all_mock_tests_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    soundManager.playCorrect();
  };

  // Export single test as JSON
  const handleExportSingle = (test: ToeicTest) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(test, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${test.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    soundManager.playCorrect();
  };

  // Import JSON Handler
  const handleImportSubmit = async () => {
    setImportError("");
    if (!importJsonText.trim()) {
      setImportError("Vui lòng dán nội dung JSON đề thi.");
      return;
    }

    try {
      const parsed = JSON.parse(importJsonText);
      const testList: ToeicTest[] = Array.isArray(parsed) ? parsed : [parsed];

      const pin = sessionStorage.getItem("dau_admin_pin") || "";
      let importedCount = 0;

      for (const t of testList) {
        if (!t.title || !t.questions) {
          throw new Error("Mỗi đề thi cần có ít nhất 'title' và mảng 'questions'.");
        }
        const res = await fetch("/api/admin/tests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-pin": pin,
          },
          body: JSON.stringify({ test: t }),
        });
        if (res.ok) importedCount++;
      }

      soundManager.playCorrect();
      setShowImportModal(false);
      setImportJsonText("");
      setStatusMessage({ type: "success", text: `Đã nhập thành công ${importedCount} đề thi vào hệ thống!` });
      fetchTests();
    } catch (err: unknown) {
      soundManager.playWrong();
      const message = err instanceof Error ? err.message : "Định dạng JSON không hợp lệ.";
      setImportError(`Lỗi phân tích JSON: ${message}`);
    }
  };

  const filteredTests = tests.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/mock-test"
              className="text-xs font-bold text-slate-500 hover:text-brand-600 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Về phòng thi thử</span>
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-black">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Quản Trị Đề Thi Thử TOEIC
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Tạo mới, chỉnh sửa, nhân bản và quản lý toàn bộ đề thi thử ETS trên hệ thống LET'S English.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowImportModal(true)}
            className="btn-duo px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
          >
            <FileUp className="w-4 h-4 text-brand-600" />
            <span>Import JSON</span>
          </button>

          <button
            onClick={handleExportAll}
            className="btn-duo px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5"
          >
            <FileDown className="w-4 h-4 text-emerald-600" />
            <span>Export Tất Cả</span>
          </button>

          <Link
            href="/admin/mock-tests/create"
            className="btn-duo px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs shadow-duo-cyan flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Tạo Đề Thi Mới</span>
          </Link>
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
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-slate-600 text-sm ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center font-black">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{tests.length}</div>
            <div className="text-xs font-bold text-slate-400">Tổng Số Đề Thi</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {customTests.length}
            </div>
            <div className="text-xs font-bold text-slate-400">Đề Do Admin Tạo</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center font-black">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-sky-600 dark:text-sky-400">
              {tests.reduce((acc, curr) => acc + (curr.questions?.length || 0), 0)}
            </div>
            <div className="text-xs font-bold text-slate-400">Tổng Số Câu Hỏi</div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên đề thi hoặc mô tả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-brand-500"
          />
        </div>
        <button
          onClick={fetchTests}
          className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-brand-600 transition-colors"
          title="Tải lại danh sách"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-brand-600" : ""}`} />
        </button>
      </div>

      {/* Tests Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {filteredTests.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <GraduationCap className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold text-slate-500">
              Chưa tìm thấy đề thi nào phù hợp với từ khóa.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTests.map((test) => {
              const isCustom = test.isCustom;

              return (
                <div
                  key={test.id}
                  className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                          isCustom
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                        }`}
                      >
                        {isCustom ? "Đề Admin Tạo" : "Đề Mẫu ETS"}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        Năm {test.year}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {test.difficulty}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {test.questions.length} câu hỏi • {test.durationMinutes} phút
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {test.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 max-w-3xl">
                      {test.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                    <Link
                      href={`/mock-test/${test.id}`}
                      target="_blank"
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5"
                      title="Xem trước chế độ thi thật"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Xem trước</span>
                    </Link>

                    {isCustom ? (
                      <Link
                        href={`/admin/mock-tests/${test.id}/edit`}
                        className="p-2.5 rounded-xl border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/60 text-xs font-bold flex items-center gap-1.5"
                        title="Chỉnh sửa câu hỏi & thông tin đề"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Sửa</span>
                      </Link>
                    ) : null}

                    <button
                      onClick={() => handleCloneTest(test)}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5"
                      title="Nhân bản đề này thành đề mới"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Nhân bản</span>
                    </button>

                    <button
                      onClick={() => handleExportSingle(test)}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold"
                      title="Xuất file JSON đề này"
                    >
                      <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                    </button>

                    {isCustom && (
                      <button
                        onClick={() => handleDeleteTest(test.id, test.title)}
                        className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-xs font-bold"
                        title="Xóa đề thi này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Import JSON Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileUp className="w-5 h-5 text-brand-600" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Nhập Đề Thi Từ Dữ Liệu JSON
                </h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            {importError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Dán chuỗi JSON của một đề thi hoặc mảng danh sách các đề thi:
              </label>
              <textarea
                rows={10}
                placeholder={`{\n  "title": "ETS TOEIC 2024 - Test Mới",\n  "description": "Mô tả đề thi...",\n  "year": 2024,\n  "difficulty": "Trung bình",\n  "durationMinutes": 120,\n  "questions": [\n    {\n      "id": 1,\n      "part": 1,\n      "questionNumber": 1,\n      "questionText": "...",\n      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },\n      "correctAnswer": "A",\n      "explanation": { "translation": "...", "analysis": "..." }\n    }\n  ]\n}`}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="btn-duo px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleImportSubmit}
                className="btn-duo px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs shadow-duo-cyan"
              >
                Nhập Đề Thi Vào Hệ Thống
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN Security Modal */}
      <AdminPinModal
        isOpen={showPinModal}
        onSuccess={handleAuthSuccess}
        onCancel={() => router.push("/mock-test")}
      />
    </div>
  );
}
