"use client";

import React from "react";

interface AppleGlobalNavProps {
  onOpenAuth: (mode: "signin" | "cockpit") => void;
  currentUser?: { name: string; email: string; provider: string } | null;
  onLogout?: () => void;
  onOpenUserHub?: () => void;
}

export default function AppleGlobalNav({ onOpenAuth, currentUser, onLogout, onOpenUserHub }: AppleGlobalNavProps) {
  return (
    <nav className="sticky top-0 w-full h-[60px] flex items-center justify-between px-5 sm:px-8 md:px-12 bg-black/80 backdrop-blur-2xl border-b border-white/[0.08] z-50 transition-all">
      {/* Brand & System Status */}
      <div className="flex items-center gap-3">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/25 group-hover:scale-105 transition-transform">
            <span className="text-sm font-black">✦</span>
          </div>
          <span className="text-white text-base font-extrabold tracking-tight font-['Plus_Jakarta_Sans']">
            YourNav
          </span>
        </a>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] text-slate-400 font-mono border border-white/10 px-2.5 py-0.5 rounded-full uppercase bg-white/[0.03]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          MIP Engine v2.4
        </span>
      </div>

      {/* Center Nav Links */}
      <div className="hidden lg:flex items-center gap-8 text-xs text-[#86868b] font-medium font-sans">
        <a href="#overview" className="hover:text-white transition-colors duration-200">
          Horizons
        </a>
        <a href="#journey" className="hover:text-white transition-colors duration-200">
          Live Expedition
        </a>
        <a href="#sos" className="hover:text-white transition-colors duration-200">
          RoadGuard OS
        </a>
        <a href="#intelligence" className="hover:text-white transition-colors duration-200">
          Architecture
        </a>
      </div>

      {/* Action Cluster: User Profile / Sign In & Launch Planner Together */}
      <div className="flex items-center gap-2 sm:gap-3">
        {currentUser ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => (onOpenUserHub ? onOpenUserHub() : onOpenAuth("signin"))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-xs font-semibold text-white transition cursor-pointer"
              title="Open Traveler Hub (User Details, Past Trips, Recommendations)"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-extrabold text-[10px] flex items-center justify-center">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[90px] truncate">{currentUser.name}</span>
              <span className="text-[10px] text-slate-400 capitalize">({currentUser.provider})</span>
            </button>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="text-[10px] font-bold text-slate-400 hover:text-rose-400 px-2.5 py-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
                title="Log Out"
              >
                Sign Out
              </button>
            )}
            <button
              onClick={() => onOpenAuth("cockpit")}
              className="bg-gradient-to-r from-[#0071e3] to-[#2563eb] hover:from-[#0077ed] text-white text-xs font-bold px-4 py-2 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/25 border border-blue-400/30"
            >
              <span>Plan Trip</span>
              <span className="text-[10px] text-blue-200">✦</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onOpenAuth("signin")}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 sm:px-4 py-2 rounded-full hover:bg-white/[0.08] transition-all duration-200 cursor-pointer border border-transparent hover:border-white/10"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth("cockpit")}
              className="bg-gradient-to-r from-[#0071e3] to-[#2563eb] hover:from-[#0077ed] text-white text-xs font-bold px-4 sm:px-5 py-2 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/25 border border-blue-400/30"
            >
              <span>Plan Trip</span>
              <span className="text-[10px] text-blue-200">✦</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
