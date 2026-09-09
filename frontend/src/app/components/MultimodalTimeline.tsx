"use client";

import React from "react";

interface TimelineStage {
  step: string;
  time: string;
  title: string;
  desc: string;
  badge: string;
  status: string;
  statusColor: string;
  accentColor: string;
  icon: string;
}

const TIMELINE_STAGES: TimelineStage[] = [
  {
    step: "STAGE 01",
    time: "06:15 AM",
    title: "Air Corridor Sync",
    desc: "DGCA live tracking with dynamic turbulence & arrival prediction, auto-dispatching ground pickup ahead of terminal exit.",
    badge: "Flight 6E-204",
    status: "On Schedule",
    statusColor: "text-emerald-400",
    accentColor: "from-sky-500/20 via-sky-500/5 to-transparent",
    icon: "✈️",
  },
  {
    step: "STAGE 02",
    time: "09:30 AM",
    title: "High-Speed Rail",
    desc: "Vande Bharat seat confirmation matched with zero layover clash, avoiding manual platform sprints or missed gates.",
    badge: "Vande Bharat 22439",
    status: "Zero Layover Clash",
    statusColor: "text-sky-400",
    accentColor: "from-indigo-500/20 via-indigo-500/5 to-transparent",
    icon: "🚄",
  },
  {
    step: "STAGE 03",
    time: "02:00 PM",
    title: "RoadGuard Cab Escort",
    desc: "Verified mountain drivers, vehicle telemetry heartbeat, and automatic blackspot speed radar shielding high-altitude hairpin roads.",
    badge: "AWD Vehicle",
    status: "Mesh Protected",
    statusColor: "text-emerald-400",
    accentColor: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    icon: "🚙",
  },
  {
    step: "STAGE 04",
    time: "06:30 PM",
    title: "Chalet & Stay Arrival",
    desc: "Automated digital check-in voucher, medical oxygen kit verification, and instant push check-in beacon to designated family contacts.",
    badge: "Destination Checkpoint",
    status: "Family Alerted",
    statusColor: "text-amber-300",
    accentColor: "from-amber-500/20 via-amber-500/5 to-transparent",
    icon: "🏔️",
  },
];

export default function MultimodalTimeline() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 py-20 relative">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-extrabold text-sky-400 tracking-[0.3em] uppercase block mb-3 font-mono">
          Continuous Synchronization
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4 font-['Space_Grotesk']">
          How The Multimodal Engine Executes
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          The Mixed-Integer Programming (MIP) Solver reconciles flights, high-speed rail, verified cabs, and stays into one unbroken, conflict-free journey.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative">
        {TIMELINE_STAGES.map((stage, idx) => (
          <div
            key={stage.step}
            className="group relative rounded-3xl bg-[#08090f] border border-white/[0.08] hover:border-sky-500/30 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(0,0,0,0.8),0_0_30px_rgba(56,189,248,0.1)] flex flex-col justify-between overflow-hidden"
          >
            {/* Top Glow Highlight */}
            <div
              className={`absolute -top-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br ${stage.accentColor} blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none`}
            />

            <div>
              {/* Step & Time Header */}
              <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-3 pb-3 border-b border-white/[0.06]">
                <span className="font-bold text-sky-400">{stage.step}</span>
                <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                  <span>{stage.icon}</span>
                  <span>{stage.time}</span>
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="text-base font-bold text-white mb-2 tracking-tight">
                {stage.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6 font-sans">
                {stage.desc}
              </p>
            </div>

            {/* Bottom Status Pill */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 truncate max-w-[120px]">
                {stage.badge}
              </span>
              <span className={`font-semibold flex items-center gap-1 ${stage.statusColor}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {stage.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
