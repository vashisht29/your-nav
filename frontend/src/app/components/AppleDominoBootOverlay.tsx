"use client";

import React, { useEffect, useState, useRef } from "react";

interface AppleDominoBootOverlayProps {
  isOpen: boolean;
  onComplete: () => void;
  userName?: string;
  provider?: string;
}

export default function AppleDominoBootOverlay({
  isOpen,
  onComplete,
  userName = "Harsh",
  provider = "email",
}: AppleDominoBootOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Calibrating Agentic Navigators...");
  const onCompleteRef = useRef(onComplete);

  const providerLabel =
    provider === "google"
      ? "Google OAuth 2.0"
      : provider === "apple"
      ? "Apple ID Biometric"
      : "Secure Credentials";

  const BOOT_STEPS = [
    { pct: 18, text: `Verifying ${providerLabel} Token...` },
    { pct: 45, text: "Connecting RoadGuard AI Satellite Mesh..." },
    { pct: 75, text: "Synchronizing Multimodal Travel Corridor..." },
    { pct: 92, text: `Welcome to YourNav, ${userName?.split(" ")[0] || "Traveler"}.` },
    { pct: 100, text: "YourNav OS Ready." },
  ];

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setStatusText("Calibrating Agentic Navigators...");
      return;
    }

    let currentProgress = 0;
    const interval = setInterval(() => {
      const delta = Math.max(0.7, Math.random() * 2.8);
      currentProgress = Math.min(100, currentProgress + delta);
      setProgress(currentProgress);

      for (const step of BOOT_STEPS) {
        if (currentProgress >= step.pct) {
          setStatusText(step.text);
        }
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onCompleteRef.current?.();
        }, 500);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center transition-opacity duration-500 animate-fadeIn select-none">
      <div className="perspective-[1000px] flex flex-col items-center">
        {/* 3D Apple Cursive Domino Wave "hello" */}
        <div className="apple-cursive-wave text-7xl sm:text-8xl md:text-9xl font-bold flex items-center justify-center text-white cursor-default mb-6">
          <span className="letter-box">h</span>
          <span className="letter-box">e</span>
          <span className="letter-box">l</span>
          <span className="letter-box">l</span>
          <span className="letter-box">o</span>
        </div>

        {/* High-Precision Progress Bar with Leading Spark */}
        <div className="w-[280px] sm:w-[340px] md:w-[380px] h-1 bg-white/[0.12] rounded-full relative overflow-visible mt-4">
          <div
            className="h-full rounded-full bg-gradient-to-r from-white/50 via-white to-sky-400 relative shadow-[0_0_15px_rgba(255,255,255,0.8),0_0_25px_rgba(56,189,248,0.5)] transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          >
            {/* Leading Spark Particle */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff,0_0_18px_#38bdf8,0_0_30px_#0ea5e9]" />
          </div>
        </div>

        {/* Telemetry Status Feedback */}
        <div className="mt-5 flex flex-col items-center gap-1.5 font-mono">
          <span className="text-xs font-bold tracking-widest text-slate-200">
            {Math.floor(progress)}%
          </span>
          <span className="text-[11px] font-medium tracking-widest uppercase text-slate-400 animate-pulse">
            {statusText}
          </span>
        </div>
      </div>
    </div>
  );
}
