"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

export interface ExpeditionData {
  id: number;
  name: string;
  pillLabel: string;
  icon: string;
  altitude: string;
  safety: string;
  highlight: string;
  details: string;
  imageSrc: string;
  ambientGlow: string;
  tickerText: string;
}

export const EXPEDITION_MODES: ExpeditionData[] = [
  {
    id: 0,
    name: "EXPEDITION 01 • KHARDUNG LA PASS",
    pillLabel: "High-Alpine Pass (Ladakh)",
    icon: "🏔️",
    altitude: "Elevation: 17,982 FT",
    safety: "RoadGuard AI: 99.8% Safe",
    highlight: "TURQUOISE LAKES • SNOW PASSES • 4X4 EXPEDITION",
    details:
      "Synchronized Leh flights, high-altitude acclimatization buffers, and real-time offline trauma corridor fallback.",
    imageSrc: "/images/expeditions/ladakh.jpg",
    ambientGlow:
      "radial-gradient(ellipse at center, rgba(56, 189, 248, 0.22) 0%, rgba(99, 102, 241, 0.08) 45%, transparent 75%)",
    tickerText: "Ladakh High Pass Corridor: Active & Verified",
  },
  {
    id: 1,
    name: "EXPEDITION 02 • MISTY ALLEPPEY LAGOONS",
    pillLabel: "Misty Backwaters (Kerala)",
    icon: "🌴",
    altitude: "Sea Level: 3 FT",
    safety: "Monsoon Radar: 100% Calm",
    highlight: "EMERALD CANALS • LUXURY CHALET HOUSEBOATS",
    details:
      "Private catamaran synchronization, Cochin airport transfers, and automated weather-safe riverway navigation.",
    imageSrc: "/images/expeditions/kerala.jpg",
    ambientGlow:
      "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.08) 45%, transparent 75%)",
    tickerText: "Kerala Coastal Corridor: Calm Waters & Verified Ferries",
  },
  {
    id: 2,
    name: "EXPEDITION 03 • THAR COSMIC DUNES",
    pillLabel: "Cosmic Dunes (Thar Desert)",
    icon: "🌌",
    altitude: "Elevation: 740 FT",
    safety: "Satellite Mesh: Active",
    highlight: "STARGAZING PODS • MILKY WAY RADAR • CAMEL TRAILS",
    details:
      "All-terrain AWD vehicles, Jaisalmer rail corridors, and night heat-map telemetry with private camp check-in.",
    imageSrc: "/images/expeditions/thar.jpg",
    ambientGlow:
      "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.22) 0%, rgba(139, 92, 246, 0.1) 45%, transparent 75%)",
    tickerText: "Thar Desert Stargazer Radar: Night Visibility Optimal",
  },
];

interface CinematicHeroViewportProps {
  onOpenAuth: (mode: string) => void;
  onModeChange?: (ticker: string) => void;
}

export default function CinematicHeroViewport({
  onOpenAuth,
  onModeChange,
}: CinematicHeroViewportProps) {
  const [currentMode, setCurrentMode] = useState<number>(0);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({
    transform: "rotateY(0deg) rotateX(0deg) scale(1)",
  });
  const portalRef = useRef<HTMLDivElement>(null);

  const activeExpedition = EXPEDITION_MODES[currentMode];

  const handleModeSwitch = (idx: number) => {
    setCurrentMode(idx);
    if (onModeChange) {
      onModeChange(EXPEDITION_MODES[idx].tickerText);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!portalRef.current) return;
    const rect = portalRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTiltStyle({
      transform: `rotateY(${x * 7}deg) rotateX(${-y * 5}deg) scale(1.01)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "rotateY(0deg) rotateX(0deg) scale(1)",
    });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start pt-28 pb-16 px-4 md:px-8 overflow-hidden">
      {/* Dynamic Ambient Spot Glow */}
      <div
        className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[920px] h-[520px] blur-[100px] pointer-events-none transition-all duration-1000 ease-out -z-10"
        style={{ background: activeExpedition.ambientGlow }}
      />

      {/* Eyebrow */}
      <div className="flex items-center gap-2.5 text-xs font-extrabold tracking-[0.3em] uppercase text-sky-400 mb-4 bg-sky-950/30 px-3.5 py-1.5 rounded-full border border-sky-500/20 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
        Autonomous Multi-Modal Travel Engine
      </div>

      {/* Title */}
      <h1 className="font-['Space_Grotesk'] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-center uppercase leading-[0.95] max-w-5xl mb-6 bg-gradient-to-b from-white via-slate-100 to-white/40 bg-clip-text text-transparent">
        The Uncharted Awaits.
        <br />
        Zero Friction.
      </h1>

      {/* Subtext */}
      <p className="max-w-2xl text-center text-sm md:text-base text-slate-400 leading-relaxed mb-8">
        From high-altitude Himalayan passes to misty coastal lagoons — YourNav
        calculates constraint-aware flight, train, and cab timelines while
        shielding every kilometer with 24/7 RoadGuard AI.
      </p>

      {/* 3-Way Mode Switcher Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] backdrop-blur-2xl mb-8 z-20 shadow-2xl">
        {EXPEDITION_MODES.map((mode, idx) => {
          const isActive = idx === currentMode;
          return (
            <button
              key={mode.id}
              onClick={() => handleModeSwitch(idx)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-white text-[#030305] shadow-[0_0_25px_rgba(255,255,255,0.4)] font-extrabold"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              <span>{mode.icon}</span>
              <span>{mode.pillLabel}</span>
            </button>
          );
        })}
      </div>

      {/* 3D EXPEDITION VIEWPORT PORTAL */}
      <div className="w-full max-w-6xl h-[460px] sm:h-[540px] md:h-[600px] perspective-[1200px] relative mb-12">
        <div
          ref={portalRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={tiltStyle}
          className="w-full h-full rounded-[28px] md:rounded-[36px] overflow-hidden relative border border-white/[0.14] shadow-[0_35px_100px_rgba(0,0,0,0.95)] bg-[#050608] transform-gpu transition-transform duration-150 ease-out"
        >
          {/* Expedition Scenery Layers */}
          {EXPEDITION_MODES.map((mode, idx) => (
            <div
              key={mode.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentMode ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            >
              <Image
                src={mode.imageSrc}
                alt={mode.name}
                fill
                priority={idx === 0}
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          ))}

          {/* Holographic HUD Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030305]/95 via-black/20 to-black/30 p-6 md:p-10 flex flex-col justify-between pointer-events-none z-10">
            {/* Top HUD Row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="px-4 py-2 rounded-full bg-black/65 border border-white/15 backdrop-blur-xl text-xs font-mono font-bold tracking-wider uppercase text-white flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span>{activeExpedition.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3.5 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-xl text-[11px] font-mono font-semibold tracking-wider text-slate-300">
                  {activeExpedition.altitude}
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-black/60 border border-emerald-500/30 backdrop-blur-xl text-[11px] font-mono font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {activeExpedition.safety}
                </div>
              </div>
            </div>

            {/* Bottom HUD Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pointer-events-auto">
              <div className="max-w-xl">
                <span className="text-xs text-sky-300 font-bold uppercase tracking-widest block mb-1 font-mono">
                  {activeExpedition.highlight}
                </span>
                <p className="text-xs text-slate-300/80 leading-relaxed font-sans">
                  {activeExpedition.details}
                </p>
              </div>

              <button
                onClick={() => onOpenAuth("plan")}
                className="px-6 py-3 rounded-full bg-white text-[#030305] font-extrabold text-xs uppercase tracking-wider hover:bg-slate-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:shadow-[0_0_45px_rgba(255,255,255,0.7)] flex items-center gap-2 whitespace-nowrap cursor-pointer hover:scale-[1.02]"
              >
                <span>Initialize MIP Solver</span>
                <span className="text-sky-600 font-bold text-sm">✦</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
