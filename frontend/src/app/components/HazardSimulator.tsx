"use client";

import React, { useState } from "react";

export default function HazardSimulator() {
  const [simState, setSimState] = useState<"idle" | "simulating" | "rerouted">("idle");

  const runHazardSimulation = () => {
    setSimState("simulating");

    setTimeout(() => {
      setSimState("rerouted");
    }, 1200);
  };

  const resetSimulation = () => {
    setSimState("idle");
  };

  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 pb-24 relative">
      <div className="rounded-[32px] bg-gradient-to-br from-[#0c0e18] via-[#08090f] to-[#040507] border border-white/[0.12] p-8 md:p-14 relative overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.85)]">
        {/* Subtle background ambient pulse */}
        <div
          className={`absolute -right-20 -top-20 w-96 h-96 rounded-full blur-[90px] transition-colors duration-700 pointer-events-none ${
            simState === "simulating"
              ? "bg-red-600/20"
              : simState === "rerouted"
              ? "bg-sky-500/20"
              : "bg-emerald-500/10"
          }`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Column: Explanation & Trigger */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/40 border border-red-500/30 text-[11px] font-mono font-bold tracking-widest text-red-400 uppercase mb-4">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              Live Incident Mitigation Engine
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-4 font-['Space_Grotesk'] leading-tight">
              Experience Autonomous Hazard Recalculation
            </h2>

            <p className="text-xs md:text-sm text-slate-400 leading-relaxed mb-8">
              When high-altitude corridors encounter flash mudslides or bridge washouts, RoadGuard AI does not leave travelers stranded. Click below to simulate an active roadblock and witness sub-second graph recalculation.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {simState === "idle" && (
                <button
                  onClick={runHazardSimulation}
                  className="px-6 py-3.5 rounded-full bg-red-500/15 border border-red-500/40 text-red-300 hover:bg-red-600 hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2.5 shadow-lg shadow-red-950/50 cursor-pointer hover:scale-105"
                >
                  <span>⚡</span>
                  <span>Simulate Landslide on NH-3</span>
                </button>
              )}

              {simState === "simulating" && (
                <button
                  disabled
                  className="px-6 py-3.5 rounded-full bg-red-600/30 border border-red-500 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2.5 cursor-wait animate-pulse"
                >
                  <span className="animate-spin">🌀</span>
                  <span>Analyzing Satellite & Traffic Mesh...</span>
                </button>
              )}

              {simState === "rerouted" && (
                <button
                  onClick={resetSimulation}
                  className="px-6 py-3.5 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-200 hover:bg-sky-500 hover:text-black text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer hover:scale-105"
                >
                  <span>↺</span>
                  <span>Reset & Test Another Event</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Live Telemetry Terminal */}
          <div className="lg:col-span-6">
            <div className="p-6 md:p-8 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-xl font-mono text-xs shadow-2xl">
              {/* Terminal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-bold ml-2">
                    ROADGUARD SENTINEL HUD
                  </span>
                </div>

                <div>
                  {simState === "idle" && (
                    <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      SAFETY 99.4%
                    </span>
                  )}
                  {simState === "simulating" && (
                    <span className="text-amber-400 font-bold text-[11px] animate-pulse">
                      RECALCULATING...
                    </span>
                  )}
                  {simState === "rerouted" && (
                    <span className="text-sky-400 font-bold text-[11px] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      SAFETY 99.8% (OPTIMAL)
                    </span>
                  )}
                </div>
              </div>

              {/* Status Box */}
              <div className="space-y-3">
                <div
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                    simState === "simulating"
                      ? "bg-red-950/40 border-red-500/40 text-red-300"
                      : simState === "rerouted"
                      ? "bg-sky-950/30 border-sky-500/30 text-sky-200"
                      : "bg-white/[0.04] border-white/[0.08] text-slate-300"
                  }`}
                >
                  <span className="text-[11px] text-slate-400">STATUS:</span>
                  <span className="font-bold">
                    {simState === "idle" && "CORRIDOR CLEAR (NH-3 MANDI PASS)"}
                    {simState === "simulating" && "⚠️ CRITICAL: LANDSLIDE AT KM 142"}
                    {simState === "rerouted" && "✓ AUTONOMOUS BYPASS ENGAGED (0.8s)"}
                  </span>
                </div>

                <div
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                    simState === "simulating"
                      ? "bg-red-950/30 border-red-500/30"
                      : "bg-white/[0.03] border-white/[0.06]"
                  }`}
                >
                  <span className="text-[11px] text-slate-400">Primary Corridor:</span>
                  <span
                    className={`font-semibold ${
                      simState === "simulating"
                        ? "text-red-400 line-through"
                        : "text-slate-200"
                    }`}
                  >
                    NH-3 Mandi to Manali Expressway
                  </span>
                </div>

                <div
                  className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                    simState === "rerouted"
                      ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
                      : "bg-white/[0.03] border-white/[0.06] text-slate-400"
                  }`}
                >
                  <span className="text-[11px] text-slate-400">AI Sentinel Response:</span>
                  <span className="font-semibold text-right">
                    {simState === "idle" && "Real-time Telemetry Polling"}
                    {simState === "simulating" && "Evaluating Alternative Passes..."}
                    {simState === "rerouted" && "NH-154 via Kataula Pass (+12 min, Zero Risk)"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-[10px] text-slate-400">
                  <span>Emergency Offline Trauma Grid:</span>
                  <span className="text-slate-300 font-semibold">Leh-Manali Satellite Mesh Connected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
