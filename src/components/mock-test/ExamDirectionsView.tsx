"use client";

import React, { useEffect } from "react";
import { soundManager } from "@/lib/soundEffects";
import { Play, Volume2, BookOpen, Clock, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

interface ExamDirectionsViewProps {
  phase: "intro" | 1 | 2 | 3 | 4 | "reading_intro";
  onStart: () => void;
}

export default function ExamDirectionsView({ phase, onStart }: ExamDirectionsViewProps) {
  useEffect(() => {
    soundManager.playCorrect();
  }, [phase]);

  const handleStart = () => {
    soundManager.playClick();
    onStart();
  };

  return (
    <div className="max-w-3xl mx-auto w-full p-4 sm:p-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#0891b2] to-cyan-600 text-white space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 text-white backdrop-blur-sm">
              Chuẩn Khảo Thí ETS / IIG
            </span>
            <span className="text-xs font-bold text-cyan-100 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Directions &amp; Instructions
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {phase === "intro" && "LISTENING TEST — HƯỚNG DẪN TỔNG QUAN"}
            {phase === 1 && "PART 1: PHOTOGRAPHS (MÔ TẢ TRANH)"}
            {phase === 2 && "PART 2: QUESTION & RESPONSE (HỎI – ĐÁP)"}
            {phase === 3 && "PART 3: SHORT CONVERSATIONS (HỘI THOẠI NGẮN)"}
            {phase === 4 && "PART 4: SHORT TALKS (BÀI NÓI NGẮN)"}
            {phase === "reading_intro" && "READING TEST — HƯỚNG DẪN PHẦN ĐỌC (75 PHÚT)"}
          </h2>

          <p className="text-xs sm:text-sm text-cyan-50 leading-relaxed max-w-2xl">
            {phase === "intro" && "Phần thi Nghe gồm 100 câu hỏi trong 45 phút, chia thành 4 Part. Hãy đọc kỹ hướng dẫn trước khi bắt đầu."}
            {phase === 1 && "6 câu hỏi mô tả hình ảnh. Thí sinh quan sát tranh, nghe 4 câu phát biểu và chọn phương án đúng nhất."}
            {phase === 2 && "25 câu hỏi phản xạ. Thí sinh nghe 1 câu hỏi/phát biểu và 3 phương án trả lời, chọn câu phù hợp nhất."}
            {phase === 3 && "39 câu hỏi hội thoại. Mỗi đoạn đối thoại giữa 2 hoặc 3 người kèm theo 3 câu hỏi liên quan."}
            {phase === 4 && "30 câu hỏi bài nói ngắn. Mỗi bài phát biểu, thông báo hoặc tin nhắn thoại kèm 3 câu hỏi."}
            {phase === "reading_intro" && "100 câu hỏi đọc hiểu (Câu 101 – 200) trong 75 phút. Bạn được tự do quản lý thời gian giữa Part 5, 6, 7."}
          </p>
        </div>

        {/* Body content with examples */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-200">
          {/* General Directions */}
          {phase === "intro" && (
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 space-y-2">
                <div className="font-black text-[#0891b2] dark:text-cyan-400">General Directions:</div>
                <p>
                  In the Listening test, you will be asked to demonstrate how well you understand spoken English.
                  The entire Listening test will last approximately <strong>45 minutes</strong>. There are four parts, and directions are given for each part.
                  You must mark your answers on the separate answer sheet. <strong>Do not write your answers in your test book.</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                  <div className="font-black text-sm text-[#0891b2]">Part 1</div>
                  <div className="text-[11px] text-slate-500">6 câu tranh</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                  <div className="font-black text-sm text-[#0891b2]">Part 2</div>
                  <div className="text-[11px] text-slate-500">25 câu hỏi đáp</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                  <div className="font-black text-sm text-[#0891b2]">Part 3</div>
                  <div className="text-[11px] text-slate-500">39 câu hội thoại</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                  <div className="font-black text-sm text-[#0891b2]">Part 4</div>
                  <div className="text-[11px] text-slate-500">30 câu bài nói</div>
                </div>
              </div>
            </div>
          )}

          {/* Part 1 Directions */}
          {phase === 1 && (
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              <p>
                <strong>Directions:</strong> For each question in this part, you will hear four statements about a picture in your test book.
                When you hear the statements, you must select the one statement that best describes what you see in the picture.
                Then choose your answer <strong>(A), (B), (C), or (D)</strong>.
                The statements will not be printed in your test book and will be spoken only one time.
              </p>

              {/* Sample Photo & Example */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="text-xs font-black uppercase text-[#0891b2]">Ví Dụ Mẫu (Sample Question):</div>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
                      alt="Sample conference room"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <p className="italic text-slate-500 dark:text-slate-400">Bạn sẽ nghe 4 câu phát biểu:</p>
                    <p>(A) They&apos;re leaving the building.</p>
                    <p>(B) The room is completely dark.</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                      (C) Several people are seated around a conference table.
                    </p>
                    <p>(D) The chairs are stacked against the wall.</p>
                    <div className="pt-1 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                      👉 Câu (C) miêu tả chính xác nhất bức tranh. Vì vậy bạn chọn đáp án <strong>(C)</strong>.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Part 2 Directions */}
          {phase === 2 && (
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              <p>
                <strong>Directions:</strong> You will hear a question or statement and three responses spoken in English.
                They will not be printed in your test book and will be spoken only one time.
                Select the best response to the question or statement and mark the letter <strong>(A), (B), or (C)</strong> on your answer sheet.
              </p>

              {/* Sample Question & Response */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-black uppercase text-[#0891b2]">Ví Dụ Mẫu (Sample Question):</div>
                <div className="space-y-1 text-xs">
                  <p><strong>Bạn nghe câu hỏi:</strong> <em>&quot;Where is the meeting room?&quot;</em></p>
                  <p><strong>Bạn nghe 3 phản hồi:</strong></p>
                  <p>(A) Yes, at two o&apos;clock.</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">(B) In Room 204.</p>
                  <p>(C) No, I haven&apos;t met him.</p>
                  <div className="pt-1 text-[11px] text-slate-600 dark:text-slate-300">
                    👉 Phương án (B) <em>&quot;In Room 204&quot;</em> là câu trả lời đúng nhất cho câu hỏi vị trí. Bạn chọn <strong>(B)</strong>.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Part 3 Directions */}
          {phase === 3 && (
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              <p>
                <strong>Directions:</strong> You will hear some conversations between two or more people.
                You will be asked to answer three questions about what the speakers say in each conversation.
                Select the best response to each question and mark the letter <strong>(A), (B), (C), or (D)</strong>.
                The conversations will not be printed in your test book and will be spoken only one time.
              </p>
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                💡 <strong>Mẹo làm bài thi thật:</strong> Tranh thủ đọc lướt câu hỏi và các phương án trước khi đoạn băng đối thoại bắt đầu phát để nắm bắt từ khóa chính xác.
              </div>
            </div>
          )}

          {/* Part 4 Directions */}
          {phase === 4 && (
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              <p>
                <strong>Directions:</strong> You will hear some talks given by a single speaker.
                You will be asked to answer three questions about what the speaker says in each talk.
                Select the best response to each question and mark the letter <strong>(A), (B), (C), or (D)</strong>.
                The talks will not be printed in your test book and will be spoken only one time.
              </p>
              <div className="p-3.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-xs text-cyan-900 dark:text-cyan-200">
                🎙️ Các bài nói thường gồm: Thông báo tại sân bay/nhà ga, tin nhắn thoại hộp thư, bài phát biểu giới thiệu nhân sự, hoặc hướng dẫn tham quan.
              </div>
            </div>
          )}

          {/* Reading Test Transition */}
          {phase === "reading_intro" && (
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Hoàn thành phần thi Nghe (Listening Test)!</span>
                </div>
                <p className="text-emerald-900 dark:text-emerald-200">
                  Bây giờ bạn sẽ bắt đầu phần thi <strong>Đọc (Reading Test)</strong> gồm 100 câu hỏi (từ Câu 101 đến Câu 200).
                  Tổng thời gian làm bài là <strong>75 phút</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <p><strong>Cấu trúc phần thi Đọc:</strong></p>
                <ul className="space-y-1.5 pl-4 list-disc text-slate-700 dark:text-slate-300">
                  <li><strong>Part 5 (Câu 101 – 130)</strong>: Hoàn thành câu (Incomplete Sentences) — kiểm tra từ loại, thì, liên từ, ngữ pháp.</li>
                  <li><strong>Part 6 (Câu 131 – 146)</strong>: Điền đoạn văn (Text Completion) — điền từ hoặc cả câu vào chỗ trống trong thư từ/thông báo.</li>
                  <li><strong>Part 7 (Câu 147 – 200)</strong>: Đọc hiểu văn bản (Reading Comprehension) — đoạn đơn, đoạn kép và đoạn ba đa văn bản.</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                ⏱️ <strong>Phân bổ thời gian khuyến nghị:</strong> Part 5 (~12 phút) · Part 6 (~8 phút) · Part 7 (~55 phút).
              </div>
            </div>
          )}
        </div>

        {/* Footer with Big Action Button */}
        <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-semibold hidden sm:block">
            Sẵn sàng làm bài thi thật
          </div>

          <button
            type="button"
            onClick={handleStart}
            className="btn-duo w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-[#0891b2] hover:bg-cyan-600 text-white font-black text-sm shadow-duo-cyan flex items-center justify-center gap-2 transition-all ml-auto"
          >
            <span>Bắt Đầu Làm Bài / Bỏ Qua Hướng Dẫn</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
