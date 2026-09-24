"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, LoginPayload, RegisterPayload, UpdateProfilePayload } from "@/types/auth";
import { soundManager } from "@/lib/soundEffects";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<{ success: boolean; error?: string }>;
  loginDemo: () => Promise<{ success: boolean; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          if (data.user.streak) localStorage.setItem("dau_streak_days", String(data.user.streak));
          if (data.user.xp) localStorage.setItem("dau_xp", String(data.user.xp));
        }
      }
    } catch (err) {
      console.warn("Lỗi tải thông tin phiên đăng nhập:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch current user on mount
  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (payload: LoginPayload) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        soundManager.playCorrect();
        return { success: true };
      } else {
        soundManager.playIncorrect();
        return { success: false, error: data.error || "Đăng nhập thất bại" };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi kết nối máy chủ";
      return { success: false, error: msg };
    }
  };

  const loginDemo = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDemo: true }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        soundManager.playCorrect();
        return { success: true };
      } else {
        return { success: false, error: data.error || "Không thể đăng nhập tài khoản demo" };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi kết nối máy chủ";
      return { success: false, error: msg };
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        soundManager.playFanfare();
        return { success: true };
      } else {
        soundManager.playIncorrect();
        return { success: false, error: data.error || "Đăng ký thất bại" };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi kết nối máy chủ";
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (_) {}
    setUser(null);
  };

  const updateProfile = async (payload: UpdateProfilePayload) => {
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        soundManager.playCorrect();
        return { success: true };
      } else {
        return { success: false, error: data.error || "Không thể cập nhật hồ sơ" };
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi kết nối máy chủ";
      return { success: false, error: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginDemo,
        register,
        logout,
        updateProfile,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
