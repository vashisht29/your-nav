"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface ChapterData {
  id: string;
  stepNum: string;
  label: string;
  kicker: string;
  title: string;
  distanceKm: number;
  altitudeM: number;
  ambient: string;
  description: string;
  chips: string[];
  imageSrc: string;
}

const CHAPTERS: ChapterData[] = [
  {
    id: "departure",
    stepNum: "01",
    label: "The Departure",
    kicker: "STAGE 01 • LEAVING THE GRID",
    title: "Dawn on the Open Highway",
    distanceKm: 0,
    altitudeM: 740,
    ambient: "22°C • Cool Dawn",
    description: "The city dissolves in the rearview mirror. Airport terminals give way to endless tarmac and the anticipation of uncharted mountain horizons.",
    chips: ["Quiet Corridors", "Open Highway Ahead", "Grid Fading"],
    imageSrc: "/images/milestones/stop1_t3.jpg",
  },
  {
    id: "refuel",
    stepNum: "02",
    label: "Midnight Hearth",
    kicker: "STAGE 02 • THE MIDNIGHT PAUSE",
    title: "Roadside Warmth & Chai",
    distanceKm: 142,
    altitudeM: 820,
    ambient: "18°C • Midnight Mist",
    description: "A midnight sanctuary under glowing string lights. Steaming terracotta cups of cardamom tea, warm conversation, and quiet comfort before the climb.",
    chips: ["Steaming Kulhad Chai", "Warm String Lights", "Midnight Rest"],
    imageSrc: "/images/milestones/stop2_dhaba.jpg",
  },
  {
    id: "altitude",
    stepNum: "03",
    label: "Alpine Ascent",
    kicker: "STAGE 03 • INTO THE CLOUDS",
    title: "Above the Himalayan Ridges",
    distanceKm: 310,
    altitudeM: 2280,
    ambient: "4°C • Mountain Breeze",
    description: "Switchbacks climb through swirling alpine mist into crystalline skies. Jagged snow peaks emerge in pure, breathless stillness.",
    chips: ["Snow Crest Panorama", "Crisp Alpine Air", "Silent Heights"],
    imageSrc: "/images/milestones/stop3_snow.jpg",
  },
  {
    id: "sanctuary",
    stepNum: "04",
    label: "The Haven",
    kicker: "STAGE 04 • SUMMIT SANCTUARY",
    title: "Starlight Under the Cosmos",
    distanceKm: 460,
    altitudeM: 3200,
    ambient: "-2°C • Clear Cosmos",
    description: "Perched over the sleeping valley. Heated glass walls look upward into the arch of the Milky Way galaxy, warm hearth flickering in absolute peace.",
    chips: ["Milky Way Canopy", "Heated Glass Retreat", "Absolute Peace"],
    imageSrc: "/images/milestones/stop4_chalet.jpg",
  },
];

export default function ScrollJourneyRunner() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const activeChapter = CHAPTERS[activeIdx];

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackHeight = trackRef.current.offsetHeight - window.innerHeight;

      if (trackHeight <= 0) return;

      let rawProgress = -rect.top / trackHeight;
      const progress = Math.max(0, Math.min(1, rawProgress));
      setScrollProgress(progress);

      // Smooth thresholding with plenty of breathing room for each chapter
      let nextIdx = 0;
      if (progress < 0.28) {
        nextIdx = 0;
      } else if (progress < 0.54) {
        nextIdx = 1;
      } else if (progress < 0.78) {
        nextIdx = 2;
      } else {
        nextIdx = 3;
      }

      setActiveIdx(nextIdx);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="journey"
      ref={trackRef}
      className="relative min-h-[420vh] py-4"
    >
      {/* 100% Viewport-Fitting Sticky Container - Stretches Corner-to-Corner */}
      <div className="sticky top-[64px] w-full h-[calc(100vh-74px)] flex flex-col justify-center max-w-[1720px] mx-auto px-3 sm:px-6 md:px-8">
        
        {/* Minimalist Top Horizon Header Bar */}
        <div className="flex items-end justify-between mb-2.5 px-2">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono tracking-widest text-[#86868b] uppercase mb-1 backdrop-blur-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span>THE EXPEDITION ODYSSEY</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight font-['Space_Grotesk']">
              Four chapters of wanderlust.
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-[#86868b]">
            <span>Scroll gently to traverse</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="text-white">{Math.floor(scrollProgress * 460)} / 460 KM</span>
          </div>
        </div>

        {/* Masterpiece Panoramic Container (Full-Bleed Liquid Glass Substrate) */}
        <div className="relative w-full flex-1 max-h-[calc(100vh-170px)] min-h-[460px] rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] overflow-hidden border border-white/[0.14] shadow-[0_35px_100px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.25)] backdrop-blur-3xl bg-black">
          
          {/* Full-Bleed Panoramic Images with Smooth Cross-Dissolve */}
          {CHAPTERS.map((ch, idx) => (
            <div
              key={ch.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                idx === activeIdx
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105 pointer-events-none"
              }`}
            >
              <Image
                src={ch.imageSrc}
                alt={ch.title}
                fill
                priority={idx === 0}
                className="object-cover"
                sizes="(max-width: 1800px) 100vw, 1800px"
              />
              {/* Cinematic Vignette Layers */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/20 to-transparent" />
            </div>
          ))}

          {/* Hairline Scroll Progress Ribbon along Top Rim */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.08] z-40">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-400 transition-all duration-200"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>

          {/* Floating Apple Liquid Glass Waypoint Dock (Top Center) */}
          <div className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 p-1.5 rounded-full bg-black/50 backdrop-blur-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)]">
            {CHAPTERS.map((ch, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.35)] scale-[1.02]"
                      : "text-[#86868b] hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-60">
                    {ch.stepNum}
                  </span>
                  <span>{ch.label}</span>
                </button>
              );
            })}
          </div>

          {/* Floating VisionOS Translucent Frosted Glass Detail Card (Bottom-Left) */}
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 sm:right-auto sm:max-w-xl z-20 p-5 sm:p-7 rounded-[24px] sm:rounded-[32px] bg-black/55 sm:bg-white/[0.05] backdrop-blur-3xl border border-white/[0.15] shadow-[0_25px_60px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.25)] transition-all duration-500">
            {/* Stage Indicator & Elevation Pill */}
            <div className="flex items-center justify-between gap-3 pb-2.5 mb-2.5 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-300 uppercase">
                  {activeChapter.kicker}
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-white">
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10">
                  {activeChapter.distanceKm} KM
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-slate-300">
                  {activeChapter.altitudeM} M
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk'] mb-2">
              {activeChapter.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mb-3.5">
              {activeChapter.description}
            </p>

            {/* Ambient & Emotion Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <div className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] font-mono text-slate-200">
                ☁️ {activeChapter.ambient}
              </div>
              {activeChapter.chips.map((chip) => (
                <div
                  key={chip}
                  className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-[10px] font-medium text-blue-200"
                >
                  ✦ {chip}
                </div>
              ))}
            </div>
          </div>

          {/* Minimalist Liquid Glass Status Capsule (Bottom-Right) */}
          <div className="hidden md:flex absolute bottom-6 right-6 z-20 items-center gap-3 px-4 py-2 rounded-full bg-black/45 backdrop-blur-3xl border border-white/[0.12] font-mono text-xs shadow-2xl text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              NavIC Mesh Active
            </span>
            <span className="w-px h-3 bg-white/20" />
            <span>Telemetry Synchronized</span>
          </div>
        </div>
      </div>
    </section>
  );
}
