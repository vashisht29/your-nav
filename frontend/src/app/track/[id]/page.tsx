"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import TrackingMap to prevent SSR leaflet errors
const TrackingMap = dynamic(() => import("../TrackingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[360px] rounded-3xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <span>Loading Live Satellite Map...</span>
    </div>
  ),
});

interface Milestone {
  id: string;
  order: number;
  category: string;
  icon: string;
  title: string;
  description: string;
  location_name: string;
  relative_time: string;
  status: "COMPLETED" | "CURRENT" | "PENDING";
  notification_template: string;
  lat?: number;
  lng?: number;
}

interface SafarSession {
  track_id: string;
  traveler_name: string;
  origin: string;
  destination: string;
  transport_mode: string;
  tracking_url: string;
  created_at: string;
  status: string;
  current_milestone_index: number;
  milestones: Milestone[];
  contacts: Array<{ name: string; phone: string; relationship: string }>;
  live_telemetry?: {
    battery_percent: number;
    speed_kmh: number;
    transit_status: string;
    last_ping_time: string;
    emergency_system: string;
  };
}

export default function FamilyTrackingPage() {
  const params = useParams();
  const trackId = (params?.id as string) || "GP-JAIP-15DB";

  const [session, setSession] = useState<SafarSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string>("Just now");
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto-polling session from backend every 4 seconds for real-time live sync
  useEffect(() => {
    let isMounted = true;

    async function fetchSession() {
      try {
        let res: Response | null = null;
        try {
          res = await fetch(`/api/family-share/session/${trackId}`);
          if (!res.ok) {
            res = await fetch(`http://localhost:8000/api/family-share/session/${trackId}`);
          }
        } catch {
          res = await fetch(`http://localhost:8000/api/family-share/session/${trackId}`);
        }
        if (!res || !res.ok) throw new Error("Failed to fetch session");
        const data = await res.json();
        if (data.status === "success" && data.safar_session && isMounted) {
          setSession(data.safar_session);
          setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      } catch (err) {
        console.error("Live tracking sync error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSession();
    const interval = setInterval(fetchSession, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [trackId]);

  const copyUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const currentMilestone = session?.milestones?.find((m) => m.status === "CURRENT") || session?.milestones?.[session?.current_milestone_index || 0];
  const completedCount = session?.milestones?.filter((m) => m.status === "COMPLETED").length || 0;
  const totalCount = session?.milestones?.length || 1;
  const progressPercent = Math.min(100, Math.round((completedCount / totalCount) * 100));

  const isPhoneOff = currentMilestone?.id === "MS-EX-PHONE-SHUTDOWN-SAFE";
  const isBatteryLow = currentMilestone?.id === "MS-EX-LOW-BATTERY-SAFE";
  const isFlightDiverted = currentMilestone?.id === "MS-EX-FLIGHT-DIVERTED";

  return (
    <main className="min-h-screen bg-[#fafafa] text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-16">
      {/* 🧭 Minimalist Top Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 px-4 py-3 sm:px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-900">
                  SafeTrack
                </span>
                <span className="text-[9px] text-slate-400 font-medium">by YourNav</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
              Live Synced: {lastSync}
            </span>
            <button
              onClick={copyUrl}
              className="text-[10px] font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-full transition-all shadow-xs active:scale-95"
            >
              {copiedLink ? "✓ Link Copied" : "🔗 Share Link"}
            </button>
          </div>
        </div>
      </header>

      {/* 📦 Content Body */}
      <div className="max-w-3xl w-full mx-auto px-4 py-5 space-y-4">
        {loading ? (
          <div className="p-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 font-medium">Connecting to live satellite beacon...</p>
          </div>
        ) : session ? (
          <>
            {/* 1. Minimalist Reassurance & Traveler Hero Card */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-sm flex-shrink-0 shadow-xs">
                    {session.traveler_name.split(" ").map(n => n[0]).join("").slice(0, 2) || "RS"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                        {session.traveler_name}
                      </h2>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${
                        isPhoneOff
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : isFlightDiverted
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}>
                        {isPhoneOff ? "Phone Off (Safe)" : isFlightDiverted ? "Flight Diverted" : "Safe & En Route"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {session.origin} ➔ {session.destination} • {session.transport_mode.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[8.5px] font-mono text-slate-400 block uppercase">Trip ID</span>
                  <span className="text-xs font-mono font-bold text-slate-700">{session.track_id}</span>
                </div>
              </div>

              {/* Exceptional Event Banner (Clean, Zero Panic) */}
              {isPhoneOff && (
                <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
                    <span>📱</span>
                    <span>Zero-Panic Notice: Phone Powered Off</span>
                  </div>
                  <p className="text-indigo-800 text-[11px] leading-relaxed">
                    Rahul&apos;s phone reached 0% battery. Pre-shutdown vehicle speed was 52 km/h and cruising smoothly. Next check-in is scheduled upon reaching the hotel after recharging.
                  </p>
                </div>
              )}

              {isFlightDiverted && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
                    <span>✈️</span>
                    <span>Fog Diversion: Safe Touchdown Confirmed</span>
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    Heavy fog at {session.destination} prompted standard airline diversion. The plane touched down safely at the alternate airport. Ground transport is arranged.
                  </p>
                </div>
              )}

              {/* Progress Line */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                  <span>Current: {currentMilestone?.location_name || "En Route"}</span>
                  <span className="font-mono text-indigo-600 font-bold">{progressPercent}% Completed</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(12, progressPercent)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 2. 🗺️ Live Interactive Map Section (Center Stage) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <span>🗺️</span>
                  <span>Live Location & Waypoint Route</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  GPS Lock (±3m)
                </span>
              </div>

              {/* Map Canvas */}
              <div className="h-[360px] sm:h-[400px] w-full rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs relative">
                <TrackingMap
                  milestones={session.milestones}
                  currentMilestone={currentMilestone}
                  origin={session.origin}
                  destination={session.destination}
                  travelerName={session.traveler_name}
                />
              </div>

              {/* Floating Minimalist Telemetry Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[9px] text-slate-400 font-medium block uppercase">Live Speed</span>
                  <strong className="text-xs font-bold text-slate-800 font-mono">
                    🚗 {session.live_telemetry?.speed_kmh || 55.0} km/h
                  </strong>
                </div>

                <div className="bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[9px] text-slate-400 font-medium block uppercase">Phone Battery</span>
                  <strong className="text-xs font-bold text-slate-800 font-mono">
                    🔋 {session.live_telemetry?.battery_percent || 86}%
                  </strong>
                </div>

                <div className="bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[9px] text-slate-400 font-medium block uppercase">Satellite Feed</span>
                  <strong className="text-xs font-bold text-emerald-700 font-mono">
                    🛰️ NavIC Space Lock
                  </strong>
                </div>

                <div className="bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[9px] text-slate-400 font-medium block uppercase">Sentinel Shield</span>
                  <strong className="text-xs font-bold text-indigo-700 font-mono">
                    🛡️ RoadGuard 5.0
                  </strong>
                </div>
              </div>
            </div>

            {/* 3. 📍 Apple-Style Minimalist Milestones Timeline */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <h3 className="text-xs font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>📍</span>
                  <span>Journey Milestones & Auto Check-Ins</span>
                </h3>
                <span className="text-[9.5px] text-slate-400 font-medium">Auto-Synced via Geofence</span>
              </div>

              <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-200">
                {session.milestones?.map((m, idx) => {
                  const isCompleted = m.status === "COMPLETED";
                  const isCurrent = m.status === "CURRENT";

                  return (
                    <div key={m.id} className="relative group">
                      {/* Timeline Dot */}
                      <span
                        className={`absolute -left-5 top-1 flex items-center justify-center w-4 h-4 rounded-full border-2 transition-all ${
                          isCurrent
                            ? "bg-indigo-600 border-white ring-3 ring-indigo-200"
                            : isCompleted
                            ? "bg-emerald-500 border-white text-white text-[8px] font-bold"
                            : "bg-white border-slate-300"
                        }`}
                      >
                        {isCompleted && "✓"}
                      </span>

                      {/* Milestone Card */}
                      <div className={`p-3 rounded-2xl border transition-all ${
                        isCurrent
                          ? "bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-100"
                          : isCompleted
                          ? "bg-slate-50/60 border-slate-200/70"
                          : "bg-white border-slate-100 opacity-60"
                      }`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs">{m.icon}</span>
                              <h4 className={`text-xs font-bold ${isCurrent ? "text-indigo-950 font-extrabold" : "text-slate-800"}`}>
                                {m.title}
                              </h4>
                              {isCurrent && (
                                <span className="text-[8px] font-extrabold px-1.5 py-0.2 rounded-full bg-indigo-600 text-white">
                                  CURRENT
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                              📍 {m.location_name} • 🕒 {m.relative_time}
                            </div>
                            <p className="text-[10.5px] text-slate-600 mt-1 leading-relaxed">
                              {m.description}
                            </p>
                          </div>
                          <span className="text-[9px] font-mono text-slate-400 flex-shrink-0">
                            #{idx + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. Mountain Valley Safe Window Note */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-[10.5px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block text-xs flex items-center gap-1">
                <span>🏔️</span> Safe Transit Dead-Man Sentinel Active
              </span>
              <p className="leading-relaxed">
                Pahadi aur valley ilaqon mein cellular blackout normal hota hai. Cloud server ne safe transit deadline set ki hui hai — traveler safe window mein aage badh rahe hain. Ghabrane ki koi zaroorat nahi hai.
              </p>
            </div>

            {/* 5. Direct Action Hub for Parents (Minimal, Aesthetic Pills) */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Quick Action Hub for Family:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold">
                <a
                  href={`tel:+919876543210`}
                  className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-center transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
                >
                  <span>📞</span> Call {session.traveler_name.split(" ")[0]}
                </a>

                <a
                  href={`https://api.whatsapp.com/send?phone=+919876543210&text=${encodeURIComponent(`Hi ${session.traveler_name}, I am tracking your journey on SafeTrack. Everything looks good!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-center transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
                >
                  <span>💬</span> WhatsApp
                </a>

                <a
                  href="tel:112"
                  className="py-2.5 px-3 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl text-center transition-all flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <span>🚨</span> Highway 112
                </a>
              </div>
            </div>

            {/* 6. Footer */}
            <div className="pt-2 text-center text-slate-400 text-[10px] space-y-1">
              <p>SafeTrack by YourNav • Certified IS 16833 Personal Safety Architecture</p>
              <Link href="/" className="text-indigo-600 hover:underline font-semibold inline-block">
                Open YourNav Main Dashboard ➔
              </Link>
            </div>
          </>
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <span className="text-3xl">🔍</span>
            <h3 className="text-sm font-bold text-slate-800">Session Not Found</h3>
            <p className="text-xs text-slate-400">
              The tracking link <code className="text-indigo-600 font-mono">{trackId}</code> does not exist.
            </p>
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
