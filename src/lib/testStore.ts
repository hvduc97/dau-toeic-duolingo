import fs from "fs";
import path from "path";
import { ToeicTest } from "@/types/toeic";
import { sampleToeicTests } from "@/data/toeicTests";

const isVercel = process.env.VERCEL === "1" || Boolean(process.env.VERCEL);
const DATA_DIR = isVercel ? path.join("/tmp", ".data") : path.join(process.cwd(), ".data");
const TESTS_FILE = path.join(DATA_DIR, "custom_tests.json");

// In-memory cache cho môi trường Serverless
let inMemoryCustomTests: ToeicTest[] | null = null;

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(TESTS_FILE)) {
      fs.writeFileSync(TESTS_FILE, JSON.stringify([], null, 2), "utf-8");
      inMemoryCustomTests = [];
    }
  } catch (err) {
    if (!inMemoryCustomTests) {
      inMemoryCustomTests = [];
    }
  }
}

/**
 * Lấy danh sách các đề thi do Admin tạo
 */
export function getAllCustomTests(): ToeicTest[] {
  ensureDataDir();
  try {
    if (fs.existsSync(TESTS_FILE)) {
      const raw = fs.readFileSync(TESTS_FILE, "utf-8");
      const parsed = JSON.parse(raw) as ToeicTest[];
      inMemoryCustomTests = parsed;
      return parsed;
    }
  } catch (err) {
    console.error("Lỗi đọc file custom_tests.json:", err);
  }
  return inMemoryCustomTests || [];
}

/**
 * Lưu danh sách đề thi tự tạo
 */
export function saveAllCustomTests(tests: ToeicTest[]): void {
  ensureDataDir();
  inMemoryCustomTests = tests;
  try {
    fs.writeFileSync(TESTS_FILE, JSON.stringify(tests, null, 2), "utf-8");
  } catch (err) {
    console.error("Lỗi ghi file custom_tests.json:", err);
  }
}

/**
 * Lấy toàn bộ đề thi (gồm cả đề mặc định ETS 2024 và đề tự tạo của Admin)
 */
export function getAllTests(): ToeicTest[] {
  const customTests = getAllCustomTests();
  // Tránh trùng lặp ID
  const customIds = new Set(customTests.map((t) => t.id));
  const baseTests = sampleToeicTests.filter((t) => !customIds.has(t.id));
  return [...customTests, ...baseTests];
}

/**
 * Lấy chi tiết đề thi theo ID
 */
export function getTestById(id: string): ToeicTest | undefined {
  const all = getAllTests();
  return all.find((t) => t.id === id);
}

/**
 * Thêm hoặc Cập nhật đề thi do Admin tạo
 */
export function saveOrUpdateTest(test: ToeicTest): ToeicTest {
  const current = getAllCustomTests();
  const existingIdx = current.findIndex((t) => t.id === test.id);

  const updatedTest: ToeicTest = {
    ...test,
    isCustom: true,
    createdAt: test.createdAt || new Date().toISOString(),
    totalQuestions: test.questions.length,
  };

  if (existingIdx >= 0) {
    current[existingIdx] = updatedTest;
  } else {
    current.unshift(updatedTest);
  }

  saveAllCustomTests(current);
  return updatedTest;
}

/**
 * Xóa đề thi tự tạo theo ID
 */
export function deleteCustomTest(id: string): boolean {
  const current = getAllCustomTests();
  const filtered = current.filter((t) => t.id !== id);
  if (filtered.length !== current.length) {
    saveAllCustomTests(filtered);
    return true;
  }
  return false;
}

/**
 * Kiểm tra mã PIN bảo mật Admin
 */
export function verifyAdminPin(pin: string): boolean {
  const validPin = process.env.ADMIN_PIN || "123456";
  return String(pin).trim() === validPin.trim();
}
