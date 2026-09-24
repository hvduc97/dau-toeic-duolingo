"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  GraduationCap
} from "lucide-react";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { GoogleOnboardingModal } from "@/components/auth/GoogleOnboardingModal";
import { User } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login, loginDemo } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [onboardingUser, setOnboardingUser] = useState<User | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login({ email, password });
    setLoading(false);

    if (res.success) {
      router.push("/profile");
    } else {
      setError(res.error || "Đăng nhập thất bại");
    }
  };

  const handleQuickDemoLogin = async () => {
    setError(null);
    setLoading(true);
    const res = await loginDemo();
    setLoading(false);
    if (res.success) {
      router.push("/profile");
    } else {
      setError(res.error || "Không thể đăng nhập tài khoản mẫu");
    }
  };

  const handleGoogleSuccess = (user: User, isNewUser: boolean) => {
    if (isNewUser) {
      setOnboardingUser(user);
      setShowOnboarding(true);
    } else {
      router.push("/profile");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-slate-50 dark:bg-[#070b13]">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="h-16 w-16 rounded-3xl bg-white dark:bg-slate-800 p-2 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-md group-hover:scale-105 transition-transform mx-auto">
              <img src="/images/logo.png" alt="LET'S English" className="h-full w-full object-contain" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Đăng Nhập LET&apos;S English
          </h1>
          <p className="text-xs sm:text-sm text-brand-600 dark:text-brand-400 font-bold">
            Chất lượng là ưu tiên hàng đầu
          </p>
        </div>

        {/* Card Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Đăng nhập với Google */}
          <GoogleButton
            mode="login"
            onSuccess={handleGoogleSuccess}
          />

          {/* Divider Phân Cách */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Hoặc dùng Email & Mật khẩu
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Địa Chỉ Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-500 transition-colors font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Mật Khẩu
                </label>
                <span className="text-[11px] text-slate-400 hover:text-brand-600 cursor-pointer">
                  Quên mật khẩu?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn..."
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-500 transition-colors font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-duo w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-black text-sm shadow-duo-cyan flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? "Đang xác thực..." : "Đăng Nhập"}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-bold text-slate-400 uppercase">
              Tài khoản mẫu
            </span>
          </div>

          {/* Quick Demo Login */}
          <div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="btn-duo w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs shadow-duo-yellow flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4 fill-slate-900" />
              <span>Vào nhanh bằng Tài Khoản Mẫu (1-Click)</span>
            </button>
          </div>
        </div>

        {/* Footer Link to Register */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Chưa có tài khoản LET&apos;S English?{" "}
          <Link
            href="/register"
            className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Đăng ký ngay miễn phí
          </Link>
        </div>

        {/* Modal Onboarding cho Google New User */}
        <GoogleOnboardingModal
          isOpen={showOnboarding}
          user={onboardingUser}
          onClose={() => setShowOnboarding(false)}
        />
      </div>
    </div>
  );
}
