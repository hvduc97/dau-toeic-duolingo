"use client";

import React, { useState, useEffect } from "react";
import { soundManager } from "@/lib/soundEffects";
import {
  Settings,
  Key,
  Volume2,
  Trash2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Bot,
  Sparkles
} from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [testingKey, setTestingKey] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem("dau_gemini_api_key") || "";
    setApiKey(savedKey);
    setSoundEnabled(soundManager.isEnabled());
  }, []);

  const handleSaveApiKey = () => {
    localStorage.setItem("dau_gemini_api_key", apiKey.trim());
    setIsSaved(true);
    soundManager.playCorrect();
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleTestApiKey = async () => {
    if (!apiKey.trim()) {
      setTestResult("Vui lòng nhập API Key trước khi kiểm tra!");
      return;
    }
    setTestingKey(true);
    setTestResult(null);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Hello, reply with 'OK'" }] }],
          }),
        }
      );

      if (res.ok) {
        setTestResult("✅ Kết nối Google Gemini API thành công! API Key hợp lệ.");
        soundManager.playCorrect();
      } else {
        const data = await res.json().catch(() => ({}));
        setTestResult(`❌ Lỗi: ${data.error?.message || "API Key không hợp lệ hoặc đã bị khóa"}`);
        soundManager.playIncorrect();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể kết nối đến máy chủ Google";
      setTestResult(`❌ Lỗi mạng: ${msg}`);
      soundManager.playIncorrect();
    } finally {
      setTestingKey(false);
    }
  };

  const handleToggleSound = () => {
    const nextState = soundManager.toggleSound();
    setSoundEnabled(nextState);
  };

  const handleTestSound = () => {
    soundManager.playFanfare();
  };

  const handleResetData = () => {
    if (confirm("Bạn có chắc chắn muốn đặt lại toàn bộ điểm số, streak và sổ tay câu sai?")) {
      localStorage.removeItem("dau_xp");
      localStorage.removeItem("dau_streak_days");
      localStorage.removeItem("dau_wrong_grammar_ids");
      localStorage.removeItem("dau_starred_grammar_ids");
      localStorage.removeItem("dau_vocab_list");
      localStorage.removeItem("dau_last_test_result");
      alert("Đã làm mới dữ liệu học tập thành công!");
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-xs font-black mb-2">
          <Settings className="w-4 h-4" />
          Hệ Thống
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Cài Đặt & Cấu Hình AI
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Quản lý khóa Google Gemini API, hiệu ứng âm thanh tương tác và dữ liệu học tập cá nhân.
        </p>
      </div>

      {/* Google Gemini API Key Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Google Gemini API Key
              </h2>
              <p className="text-xs text-slate-400">
                Dùng để giải thích chi tiết cấu trúc đề thi và phân tích bẫy ngữ pháp theo thời gian thực
              </p>
            </div>
          </div>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            <span>Lấy key miễn phí</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Nhập khóa API (ví dụ: AIzaSy...)"
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:border-purple-500 font-mono"
            />
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Khóa API được lưu cục bộ trên trình duyệt của bạn (LocalStorage), bảo mật tuyệt đối.</span>
          </p>
        </div>

        {testResult && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold ${
              testResult.startsWith("✅")
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
            }`}
          >
            {testResult}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSaveApiKey}
            className="btn-duo px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-duo flex items-center gap-1.5"
          >
            <Key className="w-4 h-4" />
            <span>{isSaved ? "Đã lưu thành công!" : "Lưu API Key"}</span>
          </button>

          <button
            onClick={handleTestApiKey}
            disabled={testingKey}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {testingKey ? "Đang kiểm tra..." : "Kiểm tra kết nối"}
          </button>
        </div>
      </div>

      {/* Sound FX Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Âm Thanh Tương Tác Web Audio SFX
              </h2>
              <p className="text-xs text-slate-400">
                Âm thanh vui tươi phong cách Duolingo khi trả lời đúng / sai và nhạc mừng chiến thắng
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleSound}
            className={`w-12 h-7 rounded-full p-1 transition-colors ${
              soundEnabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                soundEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={handleTestSound}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            🔊 Nghe thử nhạc chúc mừng
          </button>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              Dữ Liệu Học Tập Cá Nhân
            </h2>
            <p className="text-xs text-slate-400">
              Điểm thi thử, streak ngày học, tiến độ flashcard và sổ tay câu sai
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleResetData}
            className="px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            Đặt lại toàn bộ dữ liệu học tập
          </button>
        </div>
      </div>
    </div>
  );
}
