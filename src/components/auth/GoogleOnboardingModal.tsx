"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TargetScore, User } from "@/types/auth";
import { useAuth } from "@/context/AuthContext";
import { soundEffects } from "@/lib/soundEffects";
import confetti from "canvas-confetti";
import { CheckCircle2, Sparkles, Trophy, ArrowRight } from "lucide-react";

interface GoogleOnboardingModalProps {
  isOpen: boolean;
  user: User | null;
  onClose?: () => void;
}

export const GoogleOnboardingModal: React.FC<GoogleOnboardingModalProps> = ({
  isOpen,
  user,
  onClose,
}) => {
  const router = useRouter();
  const { updateProfile } = useAuth();
  const [selectedScore, setSelectedScore] = useState<TargetScore>("650+");
  const [saving, setSaving] = useState(false);

  if (!isOpen || !user) return null;

  const targetOptions: {
    score: TargetScore;
    label: string;
    description: string;
    icon: string;
    color: string;
  }[] = [
    {
      score: "450+",
      label: "Chuẩn Tốt Nghiệp",
      description: "Đạt chuẩn đầu ra Đại học & giao tiếp cơ bản",
      icon: "🌿",
      color: "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20",
    },
    {
      score: "650+",
      label: "Giao Tiếp Công Sở",
      description: "Tự tin phỏng vấn & làm việc môi trường công sở",
      icon: "🚀",
      color: "border-sky-300 dark:border-sky-700 bg-sky-50/50 dark:bg-sky-950/20",
    },
    {
      score: "800+",
      label: "Doanh Nghiệp Đa Quốc Gia",
      description: "Thành thạo đàm phán, thuyết trình chuyên nghiệp",
      icon: "⭐",
      color: "border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20",
    },
    {
      score: "900+",
      label: "Bậc Thầy TOEIC 990",
      description: "Đạt trình độ cận bản ngữ & chứng chỉ xuất sắc",
      icon: "👑",
      color: "border-purple-300 dark:border-purple-700 bg-purple-50/50 dark:bg-purple-950/20",
    },
  ];

  const handleConfirm = async () => {
    setSaving(true);
    soundEffects.playVictory();

    // Bắn pháo hoa chào đón thành viên mới
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    // Cập nhật mục tiêu điểm số qua API
    await updateProfile({ targetScore: selectedScore });

    setSaving(false);
    if (onClose) onClose();
    router.push("/profile");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-brand-500/30 overflow-hidden">
        {/* Họa tiết trang trí */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 bg-brand-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header Chào Mừng */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            Gia Nhập Thành Công Với Google
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Chào mừng {user.name}! 🌱
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Hãy chọn mục tiêu điểm TOEIC mong muốn để LET&apos;S English tùy biến lộ trình học phù hợp nhất cho bạn:
          </p>
        </div>

        {/* Danh sách 4 Lựa chọn Điểm số */}
        <div className="space-y-2.5 mb-6">
          {targetOptions.map((opt) => {
            const isSelected = selectedScore === opt.score;
            return (
              <button
                key={opt.score}
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedScore(opt.score);
                }}
                className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  isSelected
                    ? "border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 shadow-sm scale-[1.01]"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-850"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl shrink-0 p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700">
                    {opt.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {opt.score}
                      </span>
                      <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                        {opt.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {opt.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-brand-500 bg-brand-500 text-white"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Nút Hoàn Tất */}
        <button
          type="button"
          disabled={saving}
          onClick={handleConfirm}
          className="btn-duo w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm shadow-duo-cyan flex items-center justify-center gap-2 transition-all disabled:opacity-60"
        >
          {saving ? (
            "Đang thiết lập..."
          ) : (
            <>
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Bắt Đầu Hành Trình (Nhận +25 XP)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
