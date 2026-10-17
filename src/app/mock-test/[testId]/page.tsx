"use client";

import { useEffect, use, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function MockTestRedirectPageWrapper({ params }: { params: Promise<{ testId: string }> }) {
  const resolvedParams = use(params);
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070b13]">
          <div className="p-8 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#0891b2] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-black text-slate-700 dark:text-slate-300">
              Đang chuyển hướng vào phòng thi chuẩn ETS...
            </p>
          </div>
        </div>
      }
    >
      <MockTestRedirectContent testId={resolvedParams.testId} />
    </Suspense>
  );
}

function MockTestRedirectContent({ testId }: { testId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get("mode") || "full";
    const parts = searchParams.get("parts");
    const query = new URLSearchParams();
    query.set("mode", mode);
    if (parts) query.set("parts", parts);

    router.replace(`/mock-test/${testId}/play?${query.toString()}`);
  }, [testId, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070b13]">
      <div className="p-8 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-[#0891b2] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-black text-slate-700 dark:text-slate-300">
          Đang chuyển hướng vào phòng thi chuẩn ETS...
        </p>
      </div>
    </div>
  );
}
