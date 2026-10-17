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
  Volume2,
  Image as ImageIcon,
  ClipboardPaste,
  KeyRound,
  Edit3,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ToeicTest, ToeicQuestion } from "@/types/toeic";
import { soundManager } from "@/lib/soundEffects";
import { CRAWL_PRESETS, CrawlPreset } from "@/lib/crawler/toeicCrawler";
import AdminPinModal from "@/components/admin/AdminPinModal";

type ActiveTab = "link" | "json" | "presets";

export default function AutoCrawlerPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ActiveTab>("link");
  const [customUrl, setCustomUrl] = useState("");
  const [bearerToken, setBearerToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [rawJsonText, setRawJsonText] = useState("");

  const [isCrawling, setIsCrawling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [crawledTest, setCrawledTest] = useState<ToeicTest | null>(null);
  const [selectedPartFilter, setSelectedPartFilter] = useState<string>("all");
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "warning";
    text: string;
  } | null>(null);
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
          text: `Đã nạp thành công bộ đề: "${data.test.title}" (${data.test.questions.length} câu hỏi)!`,
        });
      } else {
        soundManager.playWrong();
        setStatusMessage({ type: "error", text: data.error || "Không thể nạp dữ liệu bộ đề này." });
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
        body: JSON.stringify({
          url: customUrl.trim(),
          token: bearerToken.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.test) {
        soundManager.playCorrect();
        setCrawledTest(data.test);
        setStatusMessage({
          type: "success",
          text: `Đã cào và bóc tách thành công ${data.test.questions.length} câu hỏi từ link nguồn!`,
        });
      } else if (data.authRequired) {
        soundManager.playWrong();
        setStatusMessage({
          type: "warning",
          text: "Trang web nguồn yêu cầu đăng nhập để xem câu hỏi. Hệ thống đã tự động chuyển sang Tab 'Dán F12 / JSON' để bạn copy dữ liệu nhanh!",
        });
        setActiveTab("json");
      } else {
        soundManager.playWrong();
        setStatusMessage({
          type: "error",
          text: data.error || "Không thể bóc tách câu hỏi từ URL này.",
        });
      }
    } catch {
      soundManager.playWrong();
      setStatusMessage({ type: "error", text: "Lỗi kết nối khi cào dữ liệu từ URL." });
    } finally {
      setIsCrawling(false);
    }
  };

  // Parse Raw JSON from F12 paste
  const handleParseRawJson = async () => {
    if (!rawJsonText.trim()) {
      setStatusMessage({ type: "error", text: "Vui lòng dán dữ liệu JSON hoặc payload từ F12 vào khung." });
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
        body: JSON.stringify({
          rawJson: rawJsonText.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.test) {
        soundManager.playFanfare();
        setCrawledTest(data.test);
        setStatusMessage({
          type: "success",
          text: `Đã bóc tách xuất sắc ${data.test.questions.length} câu hỏi hoàn chỉnh kèm đáp án, audio và ảnh!`,
        });
      } else {
        soundManager.playWrong();
        setStatusMessage({
          type: "error",
          text: data.error || "Không thể phân tích dữ liệu JSON này. Hãy chắc chắn bạn đã copy toàn bộ tab Response trong F12.",
        });
      }
    } catch {
      soundManager.playWrong();
      setStatusMessage({ type: "error", text: "Lỗi kết nối khi bóc tách JSON." });
    } finally {
      setIsCrawling(false);
    }
  };

  // Paste from clipboard helper
  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setRawJsonText(text);
        soundManager.playCorrect();
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Trình duyệt không cho phép đọc clipboard tự động. Vui lòng bấm Ctrl + V vào ô bên dưới.",
      });
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
          const filtered = localCustom.filter((t) => t.id !== crawledTest.id);
          filtered.unshift(crawledTest);
          localStorage.setItem("dau_custom_tests", JSON.stringify(filtered));
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

  const filteredQuestions =
    crawledTest?.questions.filter((q) => {
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
              <span>Auto-Crawler AI Pro</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Cào & Bóc Tách Đề Thi Tự Động
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Bóc tách toàn bộ 200 câu hỏi, audio, hình ảnh và giải thích từ link web hoặc dữ liệu F12 chỉ trong vài giây.
            </p>
          </div>
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
              : statusMessage.type === "warning"
              ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
              : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : statusMessage.type === "warning" ? (
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
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

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("link")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all ${
            activeTab === "link"
              ? "bg-brand-600 text-white shadow-duo-cyan"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Tab 1: Cào Qua Link Web</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("json")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all ${
            activeTab === "json"
              ? "bg-brand-600 text-white shadow-duo-cyan"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Tab 2: Dán F12 / JSON (Chuẩn 100%)</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase">
            Khuyên dùng
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("presets")}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all ${
            activeTab === "presets"
              ? "bg-brand-600 text-white shadow-duo-cyan"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Tab 3: Đề Mẫu ETS 2024</span>
        </button>
      </div>

      {/* TAB 1: CRAWL VIA LINK */}
      {activeTab === "link" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 animate-fade-in">
          <div className="space-y-1">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-600" />
              Cào Đề Thi Bằng Đường Dẫn (Link URL)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dán đường link bài thi từ Đậu TOEIC (ví dụ: <code className="text-brand-600 font-mono">https://dauenglish.com/mock-test/b7f26702.../play?mode=full</code>) hoặc các trang web luyện thi khác.
            </p>
          </div>

          <form onSubmit={handleCrawlCustomUrl} className="space-y-4">
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="url"
                required
                placeholder="https://dauenglish.com/mock-test/b7f26702-bd44-489f-987e-e6f093b69895/play?mode=full"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Token Option Toggle */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowTokenInput(!showTokenInput)}
                className="text-xs font-bold text-slate-500 hover:text-brand-600 flex items-center gap-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{showTokenInput ? "Ẩn Bearer Token xác thực" : "Nhập Bearer Token nếu đề thi yêu cầu đăng nhập (Tùy chọn)"}</span>
                {showTokenInput ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showTokenInput && (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5 animate-fade-in">
                  <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    Bearer Token / Supabase Auth Token:
                  </label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={bearerToken}
                    onChange={(e) => setBearerToken(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                  />
                  <p className="text-[10px] text-slate-400">
                    Mẹo: Mở F12 $\rightarrow$ tab Network $\rightarrow$ tìm request bất kỳ $\rightarrow$ copy giá trị sau chữ <code>Bearer</code> trong header <code>authorization</code>. Hoặc sử dụng <strong>Tab 2</strong> để không cần nhập token.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isCrawling}
                className="btn-duo px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs shadow-duo-cyan flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCrawling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
                <span>Bắt Đầu Cào Đề Thi</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCustomUrl("https://dauenglish.com/mock-test/b7f26702-bd44-489f-987e-e6f093b69895/play?mode=full");
                }}
                className="text-xs font-bold text-brand-600 hover:underline"
              >
                Điền link Đậu TOEIC mẫu
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: PASTE F12 / JSON DATA */}
      {activeTab === "json" && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fade-in">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase mb-1">
              Đảm bảo 100% bóc tách đủ 200 câu hỏi, audio và ảnh
            </div>
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-600" />
              Dán Dữ Liệu F12 / JSON Từ Trang Đề Thi (3 Bước Đơn Giản)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Do các trang web hiện đại bảo vệ câu hỏi sau lớp đăng nhập, bạn có thể copy trực tiếp dữ liệu câu hỏi từ tab Network của trình duyệt:
            </p>
          </div>

          {/* 3 Visual Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
              <div className="w-6 h-6 rounded-lg bg-brand-600 text-white font-black text-xs flex items-center justify-center">
                1
              </div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white">Mở F12 & Tab Network</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tại trang làm bài Đậu TOEIC (hoặc đề web bất kỳ), nhấn phím <strong>F12</strong> $\rightarrow$ chọn tab <strong>Network</strong> (Mạng).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
              <div className="w-6 h-6 rounded-lg bg-brand-600 text-white font-black text-xs flex items-center justify-center">
                2
              </div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white">Tìm & Chọn Response</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Gõ <code className="text-brand-600 bg-brand-50 px-1 rounded">get_mock</code> hoặc <code className="text-brand-600 bg-brand-50 px-1 rounded">questions</code> vào ô Filter $\rightarrow$ click vào request $\rightarrow$ chọn tab <strong>Response</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
              <div className="w-6 h-6 rounded-lg bg-brand-600 text-white font-black text-xs flex items-center justify-center">
                3
              </div>
              <h4 className="text-xs font-black text-slate-900 dark:text-white">Copy & Dán Vào Đây</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Nhấn <strong>Ctrl + A</strong> $\rightarrow$ <strong>Ctrl + C</strong> toàn bộ nội dung $\rightarrow$ dán vào khung bên dưới và bấm <strong>Bóc Tách</strong>.
              </p>
            </div>
          </div>

          {/* JSON Textarea */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span>Dán nội dung JSON / Dữ liệu mạng vào đây:</span>
              </label>

              <button
                type="button"
                onClick={handlePasteClipboard}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <ClipboardPaste className="w-3.5 h-3.5 text-brand-600" />
                <span>Dán từ bộ nhớ tạm (Clipboard)</span>
              </button>
            </div>

            <textarea
              rows={8}
              value={rawJsonText}
              onChange={(e) => setRawJsonText(e.target.value)}
              placeholder="Dán chuỗi JSON dạng [ { ... }, { ... } ] hoặc { questions: [...], passages: [...] } từ F12 Response vào đây..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isCrawling || !rawJsonText.trim()}
                onClick={handleParseRawJson}
                className="btn-duo px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-duo-green flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isCrawling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 fill-current" />}
                <span>Bóc Tách Dữ Liệu & Xem Trước (200 Câu)</span>
              </button>

              {rawJsonText && (
                <button
                  type="button"
                  onClick={() => setRawJsonText("")}
                  className="px-4 py-3 rounded-2xl text-xs font-bold text-slate-500 hover:text-slate-700"
                >
                  Xóa nội dung đã nhập
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 1-CLICK PRESETS */}
      {activeTab === "presets" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Bộ Đề Mẫu ETS 2024 Hot Nhất (Format Chuẩn IIG)
            </h2>
            <span className="text-xs text-slate-400 font-bold">1-Click nạp ngay 200 câu</span>
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
                  <span>⚡ Nạp Ngay Đề Này (1-Click)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPREHENSIVE PREVIEW SCREEN */}
      {crawledTest && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500 dark:border-emerald-600 shadow-xl space-y-6 animate-fade-in">
          {/* Top Status & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Bóc Tách Thành Công ({crawledTest.questions.length} câu hỏi)</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Màn Hình Xem Trước & Tùy Chỉnh Đề Thi
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Kiểm tra danh sách câu hỏi, nghe thử audio, xem ảnh và chỉnh sửa tiêu đề trước khi lưu vào hệ thống:
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
                <span>💾 Lưu Đề Thi Vào Hệ Thống</span>
              </button>
            </div>
          </div>

          {/* Metadata Quick Editor */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Chỉnh Sửa Thông Tin Chung Của Đề Thi</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                  Tiêu đề đề thi:
                </label>
                <input
                  type="text"
                  value={crawledTest.title}
                  onChange={(e) => setCrawledTest({ ...crawledTest, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                  Bộ đề:
                </label>
                <select
                  value={crawledTest.series || "Đậu TOEIC"}
                  onChange={(e) => setCrawledTest({ ...crawledTest, series: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="Đậu TOEIC">Đậu TOEIC</option>
                  <option value="Pass TOEIC">Pass TOEIC</option>
                  <option value="Crack TOEIC Vol 1">Crack TOEIC Vol 1</option>
                  <option value="Crack TOEIC Vol 2">Crack TOEIC Vol 2</option>
                  <option value="ETS Series">ETS Series</option>
                  <option value="Đề Tự Tạo & Cào">Đề Tự Tạo & Cào</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                  Độ khó:
                </label>
                <select
                  value={crawledTest.difficulty}
                  onChange={(e) =>
                    setCrawledTest({
                      ...crawledTest,
                      difficulty: e.target.value as "Dễ" | "Trung bình" | "Khó",
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="Dễ">Dễ</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Khó">Khó</option>
                </select>
              </div>
            </div>
          </div>

          {/* Part Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedPartFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
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
          <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs"
              >
                {/* Question Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center font-black text-xs">
                      {q.questionNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 font-extrabold text-[10px]">
                      Part {q.part}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white line-clamp-1">
                      {q.questionText}
                    </span>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black text-xs shrink-0 self-start sm:self-auto">
                    ✓ Đáp án: {q.correctAnswer}
                  </span>
                </div>

                {/* Media: Image & Audio */}
                {(q.imageUrl || q.audioUrl) && (
                  <div className="flex flex-wrap items-center gap-4 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    {q.imageUrl && (
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-brand-600" />
                        <a
                          href={q.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                        >
                          <span>Xem ảnh Part {q.part}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {q.audioUrl && (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Volume2 className="w-4 h-4 text-brand-600 shrink-0" />
                        <audio controls src={q.audioUrl} className="h-8 max-w-xs" preload="none" />
                      </div>
                    )}
                  </div>
                )}

                {/* Passage */}
                {q.passage && (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400">Đoạn văn / Transcript:</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 whitespace-pre-line line-clamp-4">
                      {q.passage}
                    </p>
                  </div>
                )}

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {(["A", "B", "C", "D"] as const).map((optKey) => {
                    const optVal = q.options[optKey];
                    if (!optVal && q.part === 2 && optKey === "D") return null;
                    const isCorrect = q.correctAnswer === optKey;
                    return (
                      <div
                        key={optKey}
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          isCorrect
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700 font-black"
                            : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <span>
                          <strong>{optKey}.</strong> {optVal || "(Chưa có nội dung)"}
                        </span>
                        {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation preview if available */}
                {(q.explanation?.translation || q.explanation?.analysis) && (
                  <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 space-y-1 text-[11px]">
                    {q.explanation.translation && (
                      <p className="text-amber-900 dark:text-amber-200">
                        <strong>Dịch nghĩa:</strong> {q.explanation.translation}
                      </p>
                    )}
                    {q.explanation.analysis && (
                      <p className="text-slate-600 dark:text-slate-400">
                        <strong>Giải thích:</strong> {q.explanation.analysis}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sticky Bottom Save Action Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCrawledTest(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              ✕ Hủy / Cào đề khác
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSaveCrawledTest}
              className="btn-duo px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-duo-green flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Lưu Đề Thi ({crawledTest.questions.length} Câu) Vào Hệ Thống</span>
            </button>
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
