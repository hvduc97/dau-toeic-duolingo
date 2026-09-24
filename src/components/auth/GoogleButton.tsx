"use client";

import React, { useState } from "react";
import { User } from "@/types/auth";
import { useAuth } from "@/context/AuthContext";
import { soundEffects } from "@/lib/soundEffects";

interface GoogleButtonProps {
  mode?: "login" | "register";
  onSuccess?: (user: User, isNewUser: boolean) => void;
  className?: string;
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({
  mode = "login",
  onSuccess,
  className = "",
}) => {
  const { setUser, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  // Xử lý đăng nhập Google thực tế (OAuth 2.0)
  const handleRealGoogleClick = () => {
    soundEffects.playClick();
    setLoading(true);
    // Chuyển hướng sang Google OAuth endpoint
    window.location.href = `/api/auth/google?returnTo=/profile`;
  };

  // Xử lý đăng nhập thử nghiệm Google Demo 1-click
  const handleDemoGoogleClick = async (isNew: boolean) => {
    soundEffects.playClick();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/google/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isNew }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        soundEffects.playCorrect();
        setUser(data.user);
        await refreshUser();
        if (onSuccess) {
          onSuccess(data.user, data.isNewUser);
        } else {
          window.location.href = data.isNewUser ? "/profile?google_onboarding=1" : "/profile";
        }
      } else {
        soundEffects.playIncorrect();
        alert(data.error || "Đăng nhập Google thất bại");
      }
    } catch {
      soundEffects.playIncorrect();
      alert("Đã xảy ra lỗi kết nối");
    } finally {
      setLoading(false);
      setDemoMenuOpen(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Nút Đăng nhập Google Chính */}
      <div className="relative flex items-center">
        <button
          type="button"
          disabled={loading}
          onClick={handleRealGoogleClick}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-extrabold text-sm shadow-sm transition-all active:scale-[0.99] disabled:opacity-60"
        >
          {/* Logo Google Chuẩn 4 Màu */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>
            {loading
              ? "Đang kết nối..."
              : mode === "register"
              ? "Đăng ký với Google"
              : "Tiếp tục với Google"}
          </span>
        </button>
      </div>

      {/* Tùy chọn Test Nhanh Google 1-Click (Dành cho việc kiểm thử ngay mà không cần cấu hình GCP) */}
      <div className="flex items-center justify-between px-1 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Thử nghiệm nhanh không cần GCP:
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleDemoGoogleClick(true)}
            className="font-bold text-brand-600 dark:text-brand-400 hover:underline hover:text-brand-700 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-md"
            title="Đăng ký tài khoản Google mới và kiểm tra màn hình Onboarding"
          >
            + Tạo tài khoản mới
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleDemoGoogleClick(false)}
            className="font-bold text-slate-600 dark:text-slate-300 hover:underline hover:text-slate-800 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md"
            title="Đăng nhập tài khoản Google đã có sẵn"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    </div>
  );
};
