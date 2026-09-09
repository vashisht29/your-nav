"use client";

import React from "react";

interface AppleBentoArchitectureProps {
  onOpenAuth: (mode: "signin" | "cockpit") => void;
}

export default function AppleBentoArchitecture({
  onOpenAuth,
}: AppleBentoArchitectureProps) {
  return (
    <>
      {/* 1. "TAKE A CLOSER LOOK" - APPLE BENTO METRIC ARCHITECTURE */}
      <section id="intelligence" className="max-w-[1720px] w-full mx-auto px-4 sm:px-8 md:px-12 py-28 relative">
        <div className="mb-16">
          <span className="text-[12px] font-bold tracking-[0.25em] uppercase text-[#86868b] block mb-2">
            Intelligence Architecture
          </span>
          <h2 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Engineered for the extremes.
          </h2>
          <p className="text-base sm:text-lg text-[#86868b] max-w-2xl mt-4 font-normal leading-relaxed">
            From sub-second mathematical route optimization to proactive incident mitigation, every capability is tuned for zero traveler friction.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 0.8s Autonomous Recalculation (2 Cols) */}
          <div className="md:col-span-2 rounded-[32px] bg-[#0c0c0e] border border-white/[0.08] hover:border-white/20 p-8 sm:p-12 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
            <div>
              <div className="text-[11px] font-mono font-bold tracking-widest text-[#86868b] uppercase mb-4">
                MIP SOLVER ENGINE
              </div>
              <div className="font-['Plus_Jakarta_Sans'] text-6xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none bg-gradient-to-b from-white via-[#f5f5f7] to-[#6e6e73] bg-clip-text text-transparent mb-4">
                0.8s
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Instant Autonomous Recalculation.
              </h3>
              <p className="text-sm sm:text-base text-[#86868b] max-w-xl leading-relaxed">
                When mountain passes close or delays occur, the Mixed-Integer Programming solver evaluates millions of flight, rail, and road combinations, re-routing you before disruption cascades.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#86868b] font-mono">
              <span>Mathematical Constraint Solver</span>
              <span className="text-emerald-400 font-semibold">Zero Layover Deadlocks</span>
            </div>
          </div>

          {/* Card 2: 24/7 RoadGuard Sentinel */}
          <div className="rounded-[32px] bg-[#0c0c0e] border border-white/[0.08] hover:border-white/20 p-8 sm:p-12 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
            <div>
              <div className="text-[11px] font-mono font-bold tracking-widest text-[#86868b] uppercase mb-4">
                SAFETY SENTINEL
              </div>
              <div className="font-['Plus_Jakarta_Sans'] text-6xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none bg-gradient-to-b from-white via-[#f5f5f7] to-[#6e6e73] bg-clip-text text-transparent mb-4">
                24/7
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Proactive Corridor Shield.
              </h3>
              <p className="text-sm text-[#86868b] leading-relaxed">
                Live telemetry monitoring with blackspot alerts, medical trauma corridor dispatch, and direct SOS mesh.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/[0.08] text-xs text-sky-400 font-semibold font-mono">
              Active Satellite Guard
            </div>
          </div>

          {/* Card 3: 100% Cellular-Independent */}
          <div className="rounded-[32px] bg-[#0c0c0e] border border-white/[0.08] hover:border-white/20 p-8 sm:p-12 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1">
            <div>
              <div className="text-[11px] font-mono font-bold tracking-widest text-[#86868b] uppercase mb-4">
                OFFLINE SURVIVABILITY
              </div>
              <div className="font-['Plus_Jakarta_Sans'] text-6xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none bg-gradient-to-b from-white via-[#f5f5f7] to-[#6e6e73] bg-clip-text text-transparent mb-4">
                100%
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Cellular-Independent Mesh.
              </h3>
              <p className="text-sm text-[#86868b] leading-relaxed">
                Full navigation, offline maps, and family beacon updates work even in zero-reception Himalayan deadzones.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/[0.08] text-xs text-emerald-400 font-semibold font-mono">
              NavIC + Dual-Band GNSS
            </div>
          </div>

          {/* Card 4: Multi-Modal Sync (2 Cols) */}
          <div
            id="roadguard"
            className="md:col-span-2 rounded-[32px] bg-[#0c0c0e] border border-white/[0.08] hover:border-white/20 p-8 sm:p-12 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
          >
            <div>
              <div className="text-[11px] font-mono font-bold tracking-widest text-[#86868b] uppercase mb-4">
                TRANSIT ORCHESTRATION
              </div>
              <div className="font-['Plus_Jakarta_Sans'] text-6xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none bg-gradient-to-b from-white via-[#f5f5f7] to-[#6e6e73] bg-clip-text text-transparent mb-4">
                3-Way
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Air. Rail. Road. Unified.
              </h3>
              <p className="text-sm sm:text-base text-[#86868b] max-w-xl leading-relaxed">
                Direct synchronization with DGCA flight tracking, IRCTC Vande Bharat reservations, and verified AWD road escorts in a single synchronized timeline.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#86868b] font-mono">
              <span>Full Transit Ecosystem</span>
              <span className="text-white font-semibold">One Tap Execution</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. APPLE CALL TO ACTION FINALE */}
      <section className="py-28 text-center px-6 border-t border-white/[0.08] bg-[#050507]">
        <div className="max-w-2xl mx-auto">
          <span className="text-[12px] font-bold tracking-[0.25em] uppercase text-[#86868b] block mb-3">
            Ready for Uncompromising Travel?
          </span>
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
            Take control of your journey.
          </h2>
          <p className="text-base sm:text-lg text-[#86868b] mb-8 font-normal leading-relaxed">
            Experience autonomous constraint-free planning, verified safety corridors, and live satellite protection today.
          </p>
          <button
            onClick={() => onOpenAuth("cockpit")}
            className="bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-200 hover:scale-105 shadow-xl shadow-blue-500/25 cursor-pointer inline-flex items-center gap-2"
          >
            <span>Launch Cockpit</span>
            <span>✦</span>
          </button>
        </div>
      </section>

      {/* 3. MINIMAL APPLE FOOTER */}
      <footer className="py-12 px-6 md:px-12 border-t border-white/[0.06] bg-black text-[#86868b] text-xs font-sans">
        <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-8 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>🧭</span>
            <span className="text-white font-semibold">YourNav Pro</span>
            <span className="text-white/20">|</span>
            <span>Autonomous Multi-Modal Travel & Safety OS</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] font-mono">
            <span>DGCA & IRCTC Real-Time Linked</span>
            <span>RoadGuard AI Active</span>
            <span>© 2026 YourNav Inc.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
