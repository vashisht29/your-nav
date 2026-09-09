"use client";

import React, { useState } from "react";

export default function RoadGuardSOSCockpit() {
  const [activeSOS, setActiveSOS] = useState<"none" | "medical" | "police" | "mechanical">("none");

  return (
    <section id="sos" className="max-w-[1720px] w-full mx-auto px-3 sm:px-6 md:px-8 my-20 relative">
      <div className="rounded-[36px] sm:rounded-[44px] bg-white/[0.03] backdrop-blur-3xl border border-white/[0.12] p-8 sm:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.18)] relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/[0.07] rounded-full blur-[120px] pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#86868b] font-mono text-[11px] font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span>EMERGENCY SATELLITE RADAR • ROADGUARD OS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-['Space_Grotesk']">
              Autonomous Sentinel Cockpit
            </h2>
            <p className="text-sm sm:text-base text-[#86868b] max-w-xl mt-2 leading-relaxed">
              Zero-reception satellite mesh, instant trauma dispatch, and autonomous family reassurance when unforeseen incidents occur.
            </p>
          </div>

          {/* NavIC Satellite Mesh Telemetry Card */}
          <div className="p-5 rounded-2xl bg-black/50 backdrop-blur-2xl border border-white/[0.1] font-mono text-xs space-y-2.5 min-w-[280px] shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-slate-400">NavIC Constellation:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                14 Sats Locked
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Coordinates:</span>
              <span className="text-white font-medium">34.2787° N, 77.6047° E</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Cellular Fallback:</span>
              <span className="text-blue-400 font-bold">Mesh Relay Active</span>
            </div>
          </div>
        </div>

        {/* 3 Translucent Frosted Glass Emergency Trigger Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setActiveSOS("medical")}
            className={`p-5 rounded-2xl text-left transition-all duration-300 cursor-pointer border flex items-center gap-4 backdrop-blur-2xl ${
              activeSOS === "medical"
                ? "bg-white/[0.1] border-white/40 text-white shadow-[0_0_30px_rgba(255,255,255,0.15)] scale-[1.02]"
                : "bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.08] text-slate-300"
            }`}
          >
            <span className="text-2xl p-2.5 rounded-xl bg-white/[0.06] border border-white/10">🚑</span>
            <div>
              <span className="block font-bold text-sm text-white tracking-tight">Medical Evacuation</span>
              <span className="text-xs text-[#86868b] font-normal">Air ambulance & trauma bed dispatch</span>
            </div>
          </button>

          <button
            onClick={() => setActiveSOS("police")}
            className={`p-5 rounded-2xl text-left transition-all duration-300 cursor-pointer border flex items-center gap-4 backdrop-blur-2xl ${
              activeSOS === "police"
                ? "bg-white/[0.1] border-white/40 text-white shadow-[0_0_30px_rgba(255,255,255,0.15)] scale-[1.02]"
                : "bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.08] text-slate-300"
            }`}
          >
            <span className="text-2xl p-2.5 rounded-xl bg-white/[0.06] border border-white/10">🚓</span>
            <div>
              <span className="block font-bold text-sm text-white tracking-tight">PCR Patrol 112</span>
              <span className="text-xs text-[#86868b] font-normal">Highway intercept on alpine pass</span>
            </div>
          </button>

          <button
            onClick={() => setActiveSOS("mechanical")}
            className={`p-5 rounded-2xl text-left transition-all duration-300 cursor-pointer border flex items-center gap-4 backdrop-blur-2xl ${
              activeSOS === "mechanical"
                ? "bg-white/[0.1] border-white/40 text-white shadow-[0_0_30px_rgba(255,255,255,0.15)] scale-[1.02]"
                : "bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.08] text-slate-300"
            }`}
          >
            <span className="text-2xl p-2.5 rounded-xl bg-white/[0.06] border border-white/10">🔧</span>
            <div>
              <span className="block font-bold text-sm text-white tracking-tight">Mountain Winch / Tow</span>
              <span className="text-xs text-[#86868b] font-normal">Heavy all-terrain recovery unit</span>
            </div>
          </button>
        </div>

        {/* Live Frosted Glass Terminal Output */}
        <div className="p-6 rounded-2xl bg-black/60 backdrop-blur-3xl border border-white/[0.08] font-mono text-xs shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${activeSOS === "none" ? "bg-emerald-400 animate-pulse" : "bg-blue-400 animate-ping"}`} />
              <span className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                {activeSOS === "none" && "SENTINEL RADAR: ACTIVE AUTONOMOUS SCAN"}
                {activeSOS === "medical" && "CRITICAL DISPATCH: MEDICAL AIR EVACUATION DEPLOYED"}
                {activeSOS === "police" && "SAFETY INTERCEPT: PCR HIGHWAY PATROL ASSIGNED"}
                {activeSOS === "mechanical" && "RECOVERY DISPATCH: HEAVY ALL-TERRAIN WINCH UNIT EN ROUTE"}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest hidden sm:inline">
              ENCRYPTED SATELLITE RELAY
            </span>
          </div>

          <div className="text-slate-300 leading-relaxed text-xs font-sans">
            {activeSOS === "none" && (
              <p className="text-[#86868b]">
                Select any response tier above to test the autonomous RoadGuard SOS telemetry flow with zero cellular reception.
              </p>
            )}
            {activeSOS === "medical" && (
              <p className="text-slate-200">
                <strong className="text-white font-bold">Emergency Trauma Alert:</strong> Satellite beacon confirmed at 34.2787° N, 77.6047° E. SNM Hospital Leh Heli-unit airborne (ETA 14 min). Oxygen kit verified on board. Family emergency radar alert transmitted.
              </p>
            )}
            {activeSOS === "police" && (
              <p className="text-slate-200">
                <strong className="text-white font-bold">Highway Patrol Alert:</strong> Nearest PCR vehicle #HP-12-G-4091 dispatched on Kataula Pass. Live encrypted telemetry beacon transmitting. Traveler speed and corridor position locked.
              </p>
            )}
            {activeSOS === "mechanical" && (
              <p className="text-slate-200">
                <strong className="text-white font-bold">Mechanical Dispatch:</strong> BRO-registered 4x4 recovery truck dispatched from Keylong depot. Expected arrival 28 min. Offline mesh beacon active with emergency warming shelter coordinates.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
