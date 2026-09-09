"use client";

import React from "react";

interface AppleSubNavProps {
  onOpenAuth: (mode: "signin" | "cockpit") => void;
}

export default function AppleSubNav({ onOpenAuth }: AppleSubNavProps) {
  return (
    <div className="sticky top-[52px] w-full h-[48px] flex items-center justify-between px-6 md:px-12 bg-black/70 backdrop-blur-2xl border-b border-white/[0.06] z-40">
      <div className="flex items-center gap-3">
        <span className="text-white text-sm font-semibold tracking-tight">
          YourNav Pro
        </span>
        <span className="text-[10px] text-[#86868b] font-mono border border-white/10 px-2 py-0.5 rounded-full uppercase">
          MIP Engine v2
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:inline text-xs text-[#86868b] font-sans">
          Zero-Conflict Guarantee
        </span>
        <button
          onClick={() => onOpenAuth("cockpit")}
          className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 hover:scale-105 flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-500/20"
        >
          <span>Launch Cockpit</span>
          <span className="text-[11px]">✦</span>
        </button>
      </div>
    </div>
  );
}
