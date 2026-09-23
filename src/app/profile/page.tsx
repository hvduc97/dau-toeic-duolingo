"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AvatarIcon, TargetScore } from "@/types/auth";
import {
  User as UserIcon,
  Trophy,
  Flame,
  BookOpen,
  Bookmark,
  LogOut,
  Target,
  Sparkles,
  CheckCircle2,
  Calendar,
  GraduationCap,
  Headphones,
  Edit3,
  Check
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, logout, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAvatar, setEditAvatar] = useState<AvatarIcon>("seed");
  const [editTarget, setEditTarget] = useState<TargetScore>("650+");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Stats from localStorage
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [masteredVocabCount, setMasteredVocabCount] = useState<number>(0);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      setEditName(user.name);
      setEditAvatar(user.avatar || "seed");
      setEditTarget(user.targetScore || "650+");
    }

    // Load recent stats
    const lastResult = localStorage.getItem("dau_last_test_result");
    if (lastResult) {
      try {
        const parsed = JSON.parse(lastResult);
        setLastScore(parsed.totalScore || 750);
      } catch (_) {}
    }

    const wrongIds = localStorage.getItem("dau_wrong_grammar_ids");
    if (wrongIds) {
      try {
        setWrongCount(JSON.parse(wrongIds).length);
      } catch (_) {}
    }

    const vocab = localStorage.getItem("dau_vocab_list");
    if (vocab) {
      try {
        const list = JSON.parse(vocab);
        setMasteredVocabCount(list.filter((w: { masteryLevel: string }) => w.masteryLevel === "mastered").length);
      } catch (_) {}
    }
  }, [user, isLoading, router]);

  const avatarMap: Record<AvatarIcon, { emoji: string; label: string }> = {
    seed: { emoji: "🌱", label: "Bé Đậu Nảy Mầm" },
    owl: { emoji: "🦉", label: "Cú Thông Thái" },
    crown: { emoji: "👑", label: "Bậc Thầy TOEIC" },
    rocket: { emoji: "🚀", label: "Bứt Phá Mục Tiêu" },
    star: { emoji: "⭐", label: "Ngôi Sao Học Tập" },
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateProfile({
      name: editName,
      avatar: editAvatar,
      targetScore: editTarget,
    });
    setIsSaving(false);

    if (res.success) {
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleLogout = async () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất tài khoản?")) {
      await logout();
      router.push("/");
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 text-slate-400">
        <span className="text-sm font-bold">Đang tải hồ sơ...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* Header Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar Icon */}
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-brand-600 via-teal-500 to-emerald-500 flex items-center justify-center text-5xl shadow-duo-cyan">
            {avatarMap[user.avatar || "seed"]?.emoji || "🌱"}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {user.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 text-xs font-black">
                Mục tiêu: {user.targetScore}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {user.email}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-1 text-[11px] text-slate-400 pt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Tham gia từ {new Date(user.createdAt).toLocaleDateString("vi-VN")}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-duo px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 hover:bg-slate-200 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa hồ sơ"}</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 font-bold text-xs border border-rose-200 dark:border-rose-900 flex items-center gap-1.5 hover:bg-rose-100 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Cập nhật hồ sơ học viên thành công!</span>
        </div>
      )}

      {/* Edit Form Modal/Section */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border-2 border-brand-300 dark:border-brand-700 space-y-4 animate-in fade-in"
        >
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Cập Nhật Thông Tin Học Viên
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Tên hiển thị
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Mục tiêu điểm TOEIC
              </label>
              <select
                value={editTarget}
                onChange={(e) => setEditTarget(e.target.value as TargetScore)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-700 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-brand-500"
              >
                <option value="450+">🌿 450+ (Tốt nghiệp ĐH)</option>
                <option value="650+">🚀 650+ (Giao tiếp công sở)</option>
                <option value="800+">⭐ 800+ (Đa quốc gia)</option>
                <option value="900+">👑 900+ (Bậc thầy TOEIC)</option>
              </select>
            </div>
          </div>

          {/* Avatar selector */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Chọn Avatar Bé Đậu
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(avatarMap) as AvatarIcon[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setEditAvatar(key)}
                  className={`px-3 py-2 rounded-2xl border-2 flex items-center gap-1.5 transition-all ${
                    editAvatar === key
                      ? "bg-brand-50 dark:bg-brand-950 border-brand-500 font-bold"
                      : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <span className="text-xl">{avatarMap[key].emoji}</span>
                  <span className="text-xs">{avatarMap[key].label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-duo px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs shadow-duo-cyan"
            >
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      )}

      {/* Stats & Achievements Dashboard */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span>Thành Tích & Chỉ Số Học Tập</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Card 1: Score */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1 text-center">
            <div className="text-[11px] font-bold uppercase text-slate-400">Điểm Thi Gần Nhất</div>
            <div className="text-3xl font-black text-amber-500">
              {lastScore ? `${lastScore}` : "--"}
            </div>
            <div className="text-[10px] text-slate-400">/ 990 Thang ETS</div>
          </div>

          {/* Card 2: Streak */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1 text-center">
            <div className="text-[11px] font-bold uppercase text-slate-400">Chuỗi Ngày Học</div>
            <div className="text-3xl font-black text-amber-500 flex items-center justify-center gap-1">
              <Flame className="w-7 h-7 fill-amber-500" />
              <span>{user.streak || 1}</span>
            </div>
            <div className="text-[10px] text-slate-400">Ngày liên tiếp</div>
          </div>

          {/* Card 3: Vocab Mastered */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1 text-center">
            <div className="text-[11px] font-bold uppercase text-slate-400">Từ Vựng Đã Nhớ</div>
            <div className="text-3xl font-black text-emerald-500">
              {masteredVocabCount}
            </div>
            <div className="text-[10px] text-slate-400">Thẻ SRS đã thuộc</div>
          </div>

          {/* Card 4: Wrong Questions */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1 text-center">
            <div className="text-[11px] font-bold uppercase text-slate-400">Sổ Tay Câu Sai</div>
            <div className="text-3xl font-black text-rose-500">
              {wrongCount}
            </div>
            <div className="text-[10px] text-slate-400">Câu cần ôn tập lại</div>
          </div>
        </div>
      </div>

      {/* Quick Launch Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Link
          href="/mock-test"
          className="btn-duo p-5 rounded-3xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm shadow-duo-cyan flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6" />
            <span>Vào Thi Thử 120p</span>
          </div>
          <span className="text-xs">→</span>
        </Link>

        <Link
          href="/listening"
          className="btn-duo p-5 rounded-3xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-sm shadow-duo-blue flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Headphones className="w-6 h-6" />
            <span>Luyện Nghe 4 Chế Độ</span>
          </div>
          <span className="text-xs">→</span>
        </Link>

        <Link
          href="/grammar"
          className="btn-duo p-5 rounded-3xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm shadow-duo flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Bookmark className="w-6 h-6" />
            <span>Ôn Sổ Tay Câu Sai</span>
          </div>
          <span className="text-xs">→</span>
        </Link>
      </div>
    </div>
  );
}
