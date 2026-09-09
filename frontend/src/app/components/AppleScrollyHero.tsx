"use client";

import React, { useState } from "react";
import Image from "next/image";

interface AppleScrollyHeroProps {
  onOpenAuth: (mode: "signin" | "cockpit") => void;
}

interface BiomeItem {
  name: string;
  pillLabel: string;
  imageSrc: string;
}

const BIOMES: BiomeItem[] = [
  {
    name: "EXPEDITION 01 • GLACIAL ALPINE CORRIDOR",
    pillLabel: "Glacier",
    imageSrc: "/images/expeditions/ladakh.jpg",
  },
  {
    name: "EXPEDITION 02 • MISTY CANOPY WATERWAYS",
    pillLabel: "Rainforest",
    imageSrc: "/images/expeditions/kerala.jpg",
  },
  {
    name: "EXPEDITION 03 • COSMIC DESERT DUNES",
    pillLabel: "Cosmos",
    imageSrc: "/images/expeditions/thar.jpg",
  },
];

export default function AppleScrollyHero({ onOpenAuth }: AppleScrollyHeroProps) {
  const [currentBiomeIdx, setCurrentBiomeIdx] = useState<number>(0);

  const activeBiome = BIOMES[currentBiomeIdx];

  return (
    <header
      id="overview"
      className="pt-20 pb-16 px-4 sm:px-8 md:px-12 flex flex-col items-center justify-center text-center max-w-[1720px] w-full mx-auto"
    >
      <div className="text-[12px] font-bold tracking-[0.25em] uppercase text-[#86868b] mb-3 font-mono">
        YourNav Pro
      </div>

      <h1 className="font-['Plus_Jakarta_Sans'] text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.92] text-center mb-6 bg-gradient-to-b from-white via-[#f5f5f7] to-[#86868b] bg-clip-text text-transparent">
        Mind-blowing horizons.
        <br />
        Zero friction.
      </h1>

      <p className="text-base sm:text-xl md:text-2xl font-normal tracking-tight leading-snug text-[#86868b] max-w-2xl mx-auto mb-10">
        Autonomous travel intelligence. Fluid itineraries, zero friction, infinite horizons.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
        <button
          onClick={() => onOpenAuth("cockpit")}
          className="bg-[#0071e3] hover:bg-[#0077ed] text-white text-sm font-semibold px-7 py-3.5 rounded-full transition-all duration-200 hover:scale-105 flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/25"
        >
          <span>Plan Your Journey</span>
          <span>✦</span>
        </button>
        <a
          href="#journey"
          className="text-[#2997ff] hover:underline text-sm sm:text-base font-medium flex items-center gap-1 transition-opacity hover:opacity-80"
        >
          <span>Explore Expeditions</span>
          <span>↓</span>
        </a>
      </div>

      {/* Clean Immersive Borderless Cinematic Portal (Fills screen width & corners!) */}
      <div className="w-full max-w-[1720px] h-[420px] sm:h-[540px] md:h-[640px] rounded-[28px] sm:rounded-[40px] lg:rounded-[48px] overflow-hidden relative bg-[#090a0f] border border-white/[0.14] shadow-[0_35px_100px_rgba(0,0,0,0.95)]">
        {BIOMES.map((biome, idx) => (
          <div
            key={biome.pillLabel}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentBiomeIdx ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <Image
              src={biome.imageSrc}
              alt={biome.name}
              fill
              priority={idx === 0}
              className="object-cover"
              sizes="(max-width: 1400px) 100vw, 1400px"
            />
          </div>
        ))}

        {/* Top Telemetry Tag */}
        <div className="absolute top-5 left-5 sm:top-7 sm:left-7 z-20 flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/15 text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase text-white shadow-lg pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span>{activeBiome.name}</span>
        </div>

        {/* Floating Apple Biome Dock */}
        <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-full bg-black/70 backdrop-blur-2xl border border-white/20 z-30 shadow-2xl">
          {BIOMES.map((biome, idx) => {
            const isActive = idx === currentBiomeIdx;
            return (
              <button
                key={biome.pillLabel}
                onClick={() => setCurrentBiomeIdx(idx)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white text-black font-bold shadow-[0_0_18px_rgba(255,255,255,0.4)]"
                    : "text-[#86868b] hover:text-white"
                }`}
              >
                {biome.pillLabel}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
