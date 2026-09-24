"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Headphones,
  CheckCircle2,
  Bookmark,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Flame,
  Settings,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ShieldCheck
} from "lucide-react";
import { soundManager } from "@/lib/soundEffects";
import { useAuth } from "@/context/AuthContext";
import { AvatarIcon } from "@/types/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [isDark, setIsDark] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [streak, setStreak] = useState(3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatarMap: Record<AvatarIcon, string> = {
    seed: "🌱",
    owl: "🦉",
    crown: "👑",
    rocket: "🚀",
    star: "⭐",
  };

  useEffect(() => {
    // Check saved theme
    const savedTheme = localStorage.getItem("dautoeic-theme");
    const sysDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const activeDark = savedTheme === "dark" || ((!savedTheme || savedTheme === "system") && sysDark);
    setIsDark(activeDark);
    if (activeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Check sound
    setSoundOn(soundManager.isEnabled());

    // Check streak
    const savedStreak = localStorage.getItem("dau_streak_days");
    if (savedStreak) setStreak(parseInt(savedStreak, 10));

    // Click outside to close user dropdown
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dautoeic-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dautoeic-theme", "light");
    }
  };

  const toggleSound = () => {
    const enabled = soundManager.toggleSound();
    setSoundOn(enabled);
  };

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    await logout();
    router.push("/");
  };

  const navLinks = [
    { href: "/", label: "Trang chủ", icon: Sparkles },
    { href: "/mock-test", label: "Thi thử (ETS 990)", icon: GraduationCap },
    { href: "/listening", label: "Luyện nghe 4 chế độ", icon: Headphones },
    { href: "/vocabulary", label: "Từ vựng SRS", icon: BookOpen },
    { href: "/grammar", label: "Ngữ pháp Part 5", icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-11 w-11 rounded-2xl bg-white dark:bg-slate-800 p-1 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform">
              <img
                src="/images/logo.png"
                alt="LET'S English Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                  <span className="text-brand-600 dark:text-brand-400">LET&apos;S</span>{" "}
                  <span className="text-earth-600 dark:text-earth-400">English</span>
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block font-medium">
                Chất lượng là ưu tiên hàng đầu
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-400"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Gamification & Tool Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Streak Badge */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 text-xs font-black shadow-sm"
            title="Chuỗi ngày học liên tiếp!"
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{user?.streak || streak} ngày</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all ${
              soundOn
                ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400"
                : "bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
            }`}
            title={soundOn ? "Âm thanh đang bật (Web Audio SFX)" : "Âm thanh đang tắt"}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title={isDark ? "Chuyển sang Chế độ Sáng" : "Chuyển sang Chế độ Tối"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Auth State: User Menu or Login/Register */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-2xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900 border border-brand-200 dark:border-brand-800 transition-all text-left"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                ) : (
                  <span className="text-xl">{avatarMap[user.avatar || "seed"] || "🌱"}</span>
                )}
                <div className="hidden sm:block">
                  <div className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                    {user.name.split(" ")[0]}
                  </div>
                  <div className="text-[10px] font-bold text-brand-600 dark:text-brand-400">
                    {user.targetScore}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-brand-600" />
                    <span>Hồ sơ học tập</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Cài đặt & AI</span>
                  </Link>

                  <Link
                    href="/admin/mock-tests"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-500" />
                    <span>Quản trị đề thi</span>
                  </Link>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-2 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="btn-duo px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-duo-green transition-all"
              >
                Đăng ký
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-1">
          {user && (
            <div className="p-3 mb-2 rounded-2xl bg-brand-50 dark:bg-brand-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{avatarMap[user.avatar || "seed"] || "🌱"}</span>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</div>
                  <div className="text-[10px] text-brand-600 font-semibold">{user.targetScore}</div>
                </div>
              </div>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-bold text-brand-600 hover:underline"
              >
                Hồ sơ →
              </Link>
            </div>
          )}

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold ${
                  isActive
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                {link.label}
              </Link>
            );
          })}

          {!user && (
            <div className="pt-2 flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-center text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-center text-xs font-bold text-white shadow-duo-green"
              >
                Đăng ký
              </Link>
            </div>
          )}

          <Link
            href="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Settings className="w-5 h-5 text-slate-500" />
            Cài đặt & Gemini AI
          </Link>
        </div>
      )}
    </header>
  );
}
