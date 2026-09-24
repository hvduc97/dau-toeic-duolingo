"use client";

import React, { useState } from "react";
import { ShieldCheck, Lock, AlertCircle, KeyRound, ArrowRight } from "lucide-react";
import { soundManager } from "@/lib/soundEffects";

interface AdminPinModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function AdminPinModal({ isOpen, onSuccess, onCancel }: AdminPinModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError("Vui lòng nhập mã PIN");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pin.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        soundManager.playCorrect();
        sessionStorage.setItem("dau_admin_pin", pin.trim());
        sessionStorage.setItem("dau_admin_authorized", "true");
        onSuccess();
      } else {
        soundManager.playWrong();
        setError(data.error || "Mã PIN không chính xác");
      }
    } catch {
      setError("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-duo-yellow">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Khu Vực Quản Trị Viên
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Vui lòng nhập mã PIN bảo mật để truy cập bảng điều khiển tạo & quản lý đề thi.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-brand-600" />
              Mã PIN Quản Trị (Mặc định: 123456)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                maxLength={20}
                placeholder="Nhập 123456..."
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-center font-mono text-lg tracking-widest font-black focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="btn-duo flex-1 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Hủy bỏ
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-duo flex-1 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs shadow-duo-cyan flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? "Đang xác thực..." : "Mở Khóa Quản Trị"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-400 text-center">
          💡 Gợi ý: Mã PIN mặc định là <span className="font-mono font-bold text-slate-600 dark:text-slate-200">123456</span>. Có thể cấu hình lại qua biến môi trường <code className="text-brand-500">ADMIN_PIN</code>.
        </div>
      </div>
    </div>
  );
}
