"use client";

import React, { useEffect } from "react";

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Client error caught by ErrorBoundary:", error);
  }, [error]);

  const handleClearCacheAndReset = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("smart_ai_trip_state");
        localStorage.removeItem("yournav_user");
        localStorage.removeItem("safar_current_user");
        sessionStorage.clear();
      } catch (e) {}
      window.location.href = "/";
    } else {
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-sky-500/20 font-sans">
      <div className="max-w-md w-full bg-[#161821] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto text-2xl shadow-inner">
          ✦
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            Navigation Interrupted
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            YourNav encountered an unexpected client state. You can restore default state or reload your session below.
          </p>
        </div>

        {error?.message && (
          <div className="p-3 bg-black/50 rounded-2xl border border-white/10 text-[11px] font-mono text-rose-300/90 text-left overflow-x-auto max-h-24">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleClearCacheAndReset}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-500/20 active:scale-98 transition cursor-pointer"
          >
            Clear Cache & Restart
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs rounded-xl border border-white/10 transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
