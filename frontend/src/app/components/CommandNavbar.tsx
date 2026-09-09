"use client";

import React from "react";

interface CommandNavbarProps {
  onOpenAuth: (mode: "signin" | "cockpit") => void;
  activeTicker?: string;
}

export default function CommandNavbar({
  onOpenAuth,
  activeTicker = "RoadGuard Sentinel: 52,400+ Corridors Active",
}: CommandNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-[74px] flex items-center justify-between px-6 md:px-12 bg-[#030305]/85 backdrop-blur-2xl border-b border-white/[0.08] z-50">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/20 flex items-center justify-center text-sky-400 font-bold shadow-lg shadow-sky-500/10 text-base">
          🧭
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-extrabold tracking-tight text-white uppercase font-mono">
            YourNav
          </span>
          <span className="hidden sm:inline-block text-[10px] text-slate-400 font-semibold tracking-widest uppercase bg-white/5 px-2 py-0.5 rounded border border-white/10">
            Expedition OS
          </span>
        </div>
      </div>

      {/* Live Telemetry Status Ticker */}
      <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono tracking-wider text-slate-300">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-slate-300">{activeTicker}</span>
        <span className="text-white/20">|</span>
        <span className="text-sky-300 font-semibold">MIP Solver: Zero Conflicts</span>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onOpenAuth("signin")}
          className="text-xs font-semibold tracking-wide text-slate-300 hover:text-white px-4 py-2 rounded-full hover:bg-white/[0.08] transition-all"
        >
          Sign In
        </button>
        <button
          onClick={() => onOpenAuth("cockpit")}
          className="text-xs font-extrabold text-[#030305] bg-white hover:bg-slate-200 px-5 py-2.5 rounded-full shadow-[0_0_25px_rgba(255,255,255,0.35)] hover:shadow-[0_0_40px_rgba(255,255,255,0.65)] hover:-translate-y-0.5 transition-all flex items-center gap-2 tracking-wider uppercase cursor-pointer"
        >
          <span>Launch Cockpit</span>
          <span className="text-sky-600 font-bold">✦</span>
        </button>
      </div>
    </nav>
  );
}
