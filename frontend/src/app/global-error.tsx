"use client";

import React, { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global client error:", error);
  }, [error]);

  const handleClear = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {}
      window.location.href = "/";
    } else {
      reset();
    }
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0b0c10] text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-[#161821] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto text-2xl">
            ✦
          </div>
          <h2 className="text-xl font-black text-white">YourNav System Reset</h2>
          <p className="text-xs text-slate-400">
            A client-side initialization issue occurred. Click below to clear stored state and reload cleanly.
          </p>
          <button
            type="button"
            onClick={handleClear}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg transition"
          >
            Clear Stored State & Reload
          </button>
        </div>
      </body>
    </html>
  );
}
