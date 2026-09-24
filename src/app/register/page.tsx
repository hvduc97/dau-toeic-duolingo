"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { TargetScore } from "@/types/auth";
import {
  UserPlus,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Target
} from "lucide-react";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { GoogleOnboardingModal } from "@/components/auth/GoogleOnboardingModal";
import { User } from "@/types/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetScore, setTargetScore] = useState<TargetScore>("650+");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [onboardingUser, setOnboardingUser] = useState<User | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await register({
      name,
      email,
      password,
      targetScore,
    });
    setLoading(false);

    if (res.success) {
      router.push("/profile");
    } else {
      setError(res.error || "Đăng ký thất bại");
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

  const targetOptions: { score: TargetScore; label: string; icon: string }[] = [
    { score: "450+", label: "Chuẩn tốt nghiệp ĐH", icon: "🌿" },
    { score: "650+", label: "Giao tiếp công sở tự tin", icon: "🚀" },
    { score: "800+", label: "Doanh nghiệp đa quốc gia", icon: "⭐" },
    { score: "900+", label: "Bậc thầy TOEIC 990", icon: "👑" },
  ];

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
            Gia Nhập LET&apos;S English
          </h1>
          <p className="text-xs sm:text-sm text-brand-600 dark:text-brand-400 font-bold">
            Chất lượng là ưu tiên hàng đầu
          </p>
        </div>

        {/* Card Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Nút Đăng ký nhanh với Google */}
          <GoogleButton
            mode="register"
            onSuccess={handleGoogleSuccess}
          />

          {/* Divider Phân Cách */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Hoặc đăng ký bằng Email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Họ Và Tên
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:border-brand-500 transition-colors font-medium"
                />
              </div>
            </div>

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
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Mật Khẩu (Ít nhất 6 ký tự)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tạo mật khẩu an toàn..."
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

            {/* Target TOEIC Score Selection */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-brand-600" />
                <span>Mục Tiêu Điểm TOEIC Của Bạn</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {targetOptions.map((item) => {
                  const isSelected = targetScore === item.score;
                  return (
                    <button
                      key={item.score}
                      type="button"
                      onClick={() => setTargetScore(item.score)}
                      className={`p-2.5 rounded-2xl border-2 text-left transition-all flex items-center gap-2 ${
                        isSelected
                          ? "bg-brand-50 dark:bg-brand-950/70 border-brand-500 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <div className="font-black text-xs text-slate-900 dark:text-white">
                          {item.score}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {item.label}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-duo w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-duo-green flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? "Đang tạo tài khoản..." : "Đăng Ký Tài Khoản"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer Link to Login */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Đã có tài khoản rồi?{" "}
          <Link
            href="/login"
            className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Đăng nhập ngay
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
