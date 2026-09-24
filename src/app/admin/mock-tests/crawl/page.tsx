"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Globe,
  Download,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCode,
  Layers,
  HelpCircle,
  ExternalLink,
  Zap,
} from "lucide-react";
import { ToeicTest, ToeicQuestion } from "@/types/toeic";
import { soundManager } from "@/lib/soundEffects";
import { CRAWL_PRESETS, CrawlPreset } from "@/lib/crawler/toeicCrawler";
import AdminPinModal from "@/components/admin/AdminPinModal";

export default function AutoCrawlerPage() {
  const router = useRouter();

  const [customUrl, setCustomUrl] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [crawledTest, setCrawledTest] = useState<ToeicTest | null>(null);
  const [selectedPartFilter, setSelectedPartFilter] = useState<string>("all");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);

  useEffect(() => {
    const authState = sessionStorage.getItem("dau_admin_authorized");
    if (authState !== "true") {
      setShowPinModal(true);
    }
  }, []);

  // Crawl from Preset
  const handleCrawlPreset = async (preset: CrawlPreset) => {
    setIsCrawling(true);
    setStatusMessage(null);
    setCrawledTest(null);

    try {
      const pin = sessionStorage.getItem("dau_admin_pin") || "";
      const res = await fetch("/api/admin/crawl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": pin,
        },
        body: JSON.stringify({ presetId: preset.id }),
      });

      const data = await res.json();
      if (res.ok && data.test) {
        soundManager.playCorrect();
        setCrawledTest(data.test);
        setStatusMessage({
          type: "success",
          text: `Đã cào tự động thành công bộ đề: "${data.test.title}" (${data.test.questions.length} câu hỏi)!`,
        });
      } else {
        soundManager.playWrong();
        setStatusMessage({ type: "error", text: data.error || "Không thể cào dữ liệu bộ đề này." });
      }
    } catch {
      soundManager.playWrong();
      setStatusMessage({ type: "error", text: "Lỗi kết nối tới máy chủ khi cào dữ liệu." });
    } finally {
      setIsCrawling(false);
    }
  };

  // Crawl from Custom URL
  const handleCrawlCustomUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) {
      setStatusMessage({ type: "error", text: "Vui lòng nhập đường dẫn URL website cần cào." });
      return;
    }

    setIsCrawling(true);
    setStatusMessage(null);
    setCrawledTest(null);

    try {
      const pin = sessionStorage.getItem("dau_admin_pin") || "";
      const res = await fetch("/api/admin/crawl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": pin,
        },
        body: JSON.stringify({ url: customUrl.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.test) {
        soundManager.playCorrect();
        setCrawledTest(data.test);
        setStatusMessage({
          type: "success",
          text: `Đã cào và bóc tách thành công ${data.test.questions.length} câu hỏi từ URL nguồn!`,
        });
      } else {
        soundManager.playWrong();
        setStatusMessage({ type: "error", text: data.error || "Không thể bóc tách từ URL này." });
      }
    } catch {
      soundManager.playWrong();
      setStatusMessage({ type: "error", text: "Lỗi kết nối khi cào dữ liệu từ URL." });
    } finally {
      setIsCrawling(false);
    }
  };

  // Save Crawled Test to Database / System
  const handleSaveCrawledTest = async () => {
    if (!crawledTest) return;

    setIsSaving(true);
    try {
      const pin = sessionStorage.getItem("dau_admin_pin") || "";
      const res = await fetch("/api/admin/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-pin": pin,
        },
        body: JSON.stringify({ test: crawledTest }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Also save to localStorage for client-side instant access
        try {
          const localCustom = JSON.parse(localStorage.getItem("dau_custom_tests") || "[]") as ToeicTest[];
          localCustom.unshift(crawledTest);
          localStorage.setItem("dau_custom_tests", JSON.stringify(localCustom));
        } catch {}

        soundManager.playFanfare();
        setStatusMessage({
          type: "success",
          text: "Đã lưu bộ đề cào được vào kho đề thi của học viên thành công! Đang chuyển hướng...",
        });
        setTimeout(() => router.push("/admin/mock-tests"), 1200);
      } else {
        soundManager.playWrong();
        setStatusMessage({ type: "error", text: data.error || "Không thể lưu đề thi." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Lỗi máy chủ khi lưu đề thi." });
    } finally {
      setIsSaving(false);
    }
  };

  // Export JSON
  const handleDownloadJson = () => {
    if (!crawledTest) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(crawledTest, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${crawledTest.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    soundManager.playCorrect();
  };

  const filteredQuestions = crawledTest?.questions.filter((q) => {
    if (selectedPartFilter === "all") return true;
    return q.part === Number(selectedPartFilter);
  }) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/mock-tests"
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-black mb-1">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Auto-Crawler AI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Cào Dữ Liệu Đề Thi Tự Động
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Tự động cào và bóc tách đề thi từ internet chỉ với 1 cú click, hoàn toàn không cần nhập thủ công.
            </p>
          </div>
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

      {/* Method 1: 1-Click Preset Exams */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Cách 1: Chọn Đề Thi Mẫu Hot Nhất (1-Click Cào Tự Động)
          </h2>
          <span className="text-xs text-slate-400 font-bold">Khuyên dùng</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CRAWL_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-all flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider">
                    {preset.badge}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">{preset.source}</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {preset.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {preset.description}
                </p>
              </div>

              <button
                type="button"
                disabled={isCrawling}
                onClick={() => handleCrawlPreset(preset)}
                className="btn-duo w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs shadow-duo-cyan flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCrawling ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5 fill-current" />
                )}
                <span>⚡ Cào Ngay Đề Này (1-Click)</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Method 2: Custom URL Web Scraper */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-brand-600" />
          Cách 2: Cào Từ Địa Chỉ Website Bất Kỳ (Custom URL)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Dán đường dẫn trang web đề thi (ví dụ Study4, Tienganhmoingay, Zenlish hoặc tài liệu online), hệ thống AI sẽ tự động phân tích và trích xuất câu hỏi:
        </p>

        <form onSubmit={handleCrawlCustomUrl} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="url"
              placeholder="https://study4.com/tests/... hoặc https://..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>
          <button
            type="submit"
            disabled={isCrawling}
            className="btn-duo w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-black text-xs shrink-0 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isCrawling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            <span>Bắt Đầu Cào Từ URL</span>
          </button>
        </form>
      </div>

      {/* Crawled Results Live Preview */}
      {crawledTest && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-700 shadow-lg space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-black mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Bóc tách thành công ({crawledTest.questions.length} câu)</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {crawledTest.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {crawledTest.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleDownloadJson}
                className="btn-duo px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5"
                title="Tải về file JSON đề thi này"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Tải JSON</span>
              </button>

              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveCrawledTest}
                className="btn-duo px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-duo-green flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Lưu Đề Thi Vào Hệ Thống</span>
              </button>
            </div>
          </div>

          {/* Part Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedPartFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedPartFilter === "all"
                  ? "bg-brand-600 text-white shadow-duo-cyan"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              Tất cả ({crawledTest.questions.length})
            </button>
            {[1, 2, 3, 4, 5, 6, 7].map((p) => {
              const count = crawledTest.questions.filter((q) => q.part === p).length;
              if (count === 0) return null;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPartFilter(String(p))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedPartFilter === String(p)
                      ? "bg-brand-600 text-white shadow-duo-cyan"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  Part {p} ({count})
                </button>
              );
            })}
          </div>

          {/* Questions Preview List */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-brand-600 text-white flex items-center justify-center font-black text-[11px]">
                      {q.questionNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-extrabold text-[10px]">
                      Part {q.part}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {q.questionText}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black text-[11px]">
                    Đáp án: {q.correctAnswer}
                  </span>
                </div>

                {q.passage && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 italic bg-white dark:bg-slate-900 p-2 rounded-lg">
                    {q.passage}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <div>A. {q.options.A}</div>
                  <div>B. {q.options.B}</div>
                  <div>C. {q.options.C}</div>
                  {q.options.D && <div>D. {q.options.D}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security PIN Modal */}
      <AdminPinModal
        isOpen={showPinModal}
        onSuccess={() => setShowPinModal(false)}
        onCancel={() => router.push("/admin/mock-tests")}
      />
    </div>
  );
}
