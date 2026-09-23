import fs from "fs";
import path from "path";
import crypto from "crypto";
import { User, RegisterPayload, LoginPayload, AvatarIcon, TargetScore } from "@/types/auth";

interface StoredUser extends User {
  passwordHash: string;
}

const isVercel = process.env.VERCEL === "1" || Boolean(process.env.VERCEL);
const DATA_DIR = isVercel ? path.join("/tmp", ".data") : path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// In-memory fallback cho Serverless khi filesystem gặp hạn chế
let inMemoryUsers: StoredUser[] | null = null;

// Đảm bảo thư mục lưu trữ dữ liệu tài khoản tồn tại
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      // Seed tài khoản học viên mẫu ban đầu
      const defaultUsers: StoredUser[] = [
        {
          id: "user-demo-1",
          name: "Học Viên Đậu Đậu",
          email: "demo@dautoeic.com",
          passwordHash: hashPassword("123456"),
          avatar: "seed",
          targetScore: "800+",
          createdAt: new Date().toISOString(),
          streak: 5,
          xp: 120,
        },
      ];
      fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2), "utf-8");
      inMemoryUsers = defaultUsers;
    }
  } catch (err) {
    if (!inMemoryUsers) {
      inMemoryUsers = [
        {
          id: "user-demo-1",
          name: "Học Viên Đậu Đậu",
          email: "demo@dautoeic.com",
          passwordHash: hashPassword("123456"),
          avatar: "seed",
          targetScore: "800+",
          createdAt: new Date().toISOString(),
          streak: 5,
          xp: 120,
        },
      ];
    }
  }
}

// Băm mật khẩu bảo mật bằng SHA-256 kèm salt cố định
export function hashPassword(password: string): string {
  const salt = "dau_toeic_duolingo_secret_salt_2024";
  return crypto.createHash("sha256").update(password + salt).digest("hex");
}

export function getAllUsers(): StoredUser[] {
  ensureDataDir();
  try {
    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, "utf-8");
      return JSON.parse(raw) as StoredUser[];
    }
  } catch {}
  return inMemoryUsers || [];
}

export function saveUsers(users: StoredUser[]) {
  ensureDataDir();
  inMemoryUsers = users;
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch {}
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const users = getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
}

export function findUserById(id: string): StoredUser | undefined {
  const users = getAllUsers();
  return users.find((u) => u.id === id);
}

export function sanitizeUser(user: StoredUser): User {
  const { passwordHash, ...rest } = user;
  return rest;
}

// Tạo Session Token đơn giản và an toàn
export function createSessionToken(user: User): string {
  const payload = {
    userId: user.id,
    email: user.email,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 ngày
  };
  const json = JSON.stringify(payload);
  const base64 = Buffer.from(json).toString("base64");
  const signature = crypto.createHmac("sha256", "dau_session_secret_key").update(base64).digest("hex");
  return `${base64}.${signature}`;
}

export function verifySessionToken(token: string): { userId: string; email: string } | null {
  try {
    const [base64, signature] = token.split(".");
    if (!base64 || !signature) return null;

    const expectedSig = crypto.createHmac("sha256", "dau_session_secret_key").update(base64).digest("hex");
    if (signature !== expectedSig) return null;

    const json = Buffer.from(base64, "base64").toString("utf-8");
    const payload = JSON.parse(json);

    if (payload.exp < Date.now()) return null; // Hết hạn
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}
