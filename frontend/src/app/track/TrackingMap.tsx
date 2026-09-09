"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

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
  lat?: number;
  lng?: number;
}

interface TrackingMapProps {
  milestones: Milestone[];
  currentMilestone?: Milestone;
  origin: string;
  destination: string;
  travelerName: string;
}

function MapViewController({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      try {
        const bounds = L.latLngBounds(coords);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      } catch (e) {
        console.error("Bounds fit error", e);
      }
    }
  }, [coords, map]);
  return null;
}

export default function TrackingMap({
  milestones,
  currentMilestone,
  origin,
  destination,
  travelerName
}: TrackingMapProps) {
  // Extract all valid coordinates
  const validPoints = milestones
    .filter((m) => typeof m.lat === "number" && typeof m.lng === "number")
    .map((m) => [m.lat as number, m.lng as number] as [number, number]);

  const defaultCenter: [number, number] = validPoints.length > 0 ? validPoints[0] : [28.6139, 77.2090];

  // Current milestone position
  const currentPos: [number, number] = currentMilestone?.lat && currentMilestone?.lng
    ? [currentMilestone.lat, currentMilestone.lng]
    : defaultCenter;

  // Split route into completed vs remaining
  const currentIdx = milestones.findIndex((m) => m.id === currentMilestone?.id);
  const safeIdx = currentIdx >= 0 ? currentIdx : 0;
  
  const completedRoute = validPoints.slice(0, safeIdx + 1);
  const remainingRoute = validPoints.slice(safeIdx);

  // Custom DivIcons
  const createStartIcon = () =>
    L.divIcon({
      className: "bg-transparent",
      html: `
        <div style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background-color:#10b981;color:white;box-shadow:0 4px 6px -1px rgba(0,0,0,0.2);border:2px solid white;font-size:12px;font-weight:bold;">
          🟢
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14]
    });

  const createLiveTravelerIcon = () =>
    L.divIcon({
      className: "bg-transparent",
      html: `
        <div style="position:relative;display:flex;align-items:center;justify-content:center;">
          <div style="position:absolute;width:40px;height:40px;border-radius:9999px;background-color:rgba(79,70,229,0.35);animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="position:relative;display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:9999px;background-color:#4f46e5;color:white;box-shadow:0 10px 15px -3px rgba(79,70,229,0.4);border:2.5px solid white;font-size:14px;">
            🚗
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });

  const createDestIcon = () =>
    L.divIcon({
      className: "bg-transparent",
      html: `
        <div style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background-color:#0f172a;color:white;box-shadow:0 4px 6px -1px rgba(0,0,0,0.2);border:2px solid white;font-size:12px;font-weight:bold;">
          🏁
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14]
    });

  const createWaypointIcon = (idx: number, isCompleted: boolean) =>
    L.divIcon({
      className: "bg-transparent",
      html: `
        <div style="display:flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:9999px;background-color:${isCompleted ? "#10b981" : "#ffffff"};border:2px solid ${isCompleted ? "#10b981" : "#94a3b8"};color:${isCompleted ? "#ffffff" : "#475569"};box-shadow:0 1px 3px rgba(0,0,0,0.1);font-size:8.5px;font-weight:bold;">
          ${isCompleted ? "✓" : idx + 1}
        </div>
      `,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -9]
    });

  return (
    <div className="w-full h-full min-h-[340px] sm:min-h-[380px] rounded-3xl overflow-hidden relative border border-slate-200/90 shadow-md z-0 group">
      {/* Floating HUD Top Overlay */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex items-center justify-between pointer-events-none gap-2">
        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-sm flex items-center gap-2 pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[11px] font-extrabold text-slate-900">
            LIVE GPS: 78 km/h
          </span>
          <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
            • NH44 Highway Corridor
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-sm flex items-center gap-2.5 pointer-events-auto font-mono text-[10px] font-bold text-slate-700">
          <span className="flex items-center gap-1 text-emerald-700">
            <span>🔋</span> 88%
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1 text-indigo-700">
            <span>🛰️</span> 9 Sats
          </span>
        </div>
      </div>

      {/* Floating HUD Bottom Overlay */}
      <div className="absolute bottom-3 left-3 right-3 z-[400] flex items-center justify-between pointer-events-none gap-2">
        <div className="bg-slate-900/85 text-white backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 shadow-lg flex items-center gap-2 pointer-events-auto text-[11px]">
          <span className="text-emerald-400">📍</span>
          <span className="font-semibold text-slate-200">
            {currentMilestone?.title ? `Current: ${currentMilestone.title}` : `En Route to ${destination}`}
          </span>
        </div>

        <div className="bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-200/90 shadow-sm text-[10px] font-bold text-indigo-700 pointer-events-auto flex items-center gap-1">
          <span>{origin}</span>
          <span>➔</span>
          <span className="text-slate-900">{destination}</span>
        </div>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={7}
        scrollWheelZoom={false}
        className="w-full h-full"
        style={{ minHeight: "340px", background: "#f8fafc" }}
      >
        {/* OpenStreetMap Clean High-Detail Map Tiles — 100% Watermark Free */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Traveled Route Polyline (Glowing Solid Emerald) */}
        {completedRoute.length > 1 && (
          <Polyline
            positions={completedRoute}
            color="#10b981"
            weight={6}
            opacity={0.9}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Remaining Route Polyline (Dashed Indigo/Slate) */}
        {remainingRoute.length > 1 && (
          <Polyline
            positions={remainingRoute}
            color="#6366f1"
            weight={4}
            opacity={0.7}
            dashArray="8, 8"
            lineCap="round"
          />
        )}

        {/* Render Milestone Pins */}
        {milestones.map((m, idx) => {
          if (!m.lat || !m.lng) return null;
          const isCurrent = m.id === currentMilestone?.id;
          const isCompleted = m.status === "COMPLETED";
          const isStart = idx === 0;
          const isEnd = idx === milestones.length - 1;

          let icon = createWaypointIcon(idx, isCompleted);
          if (isCurrent) {
            icon = createLiveTravelerIcon();
          } else if (isStart) {
            icon = createStartIcon();
          } else if (isEnd) {
            icon = createDestIcon();
          }

          return (
            <Marker key={m.id} position={[m.lat, m.lng]} icon={icon}>
              <Popup>
                <div className="p-1 font-sans text-xs min-w-[170px]">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>{m.icon}</span>
                    <span>{m.title}</span>
                  </div>
                  <div className="text-[10.5px] text-slate-500 font-mono mt-0.5">
                    📍 {m.location_name} • 🕒 {m.relative_time}
                  </div>
                  {isCurrent && (
                    <div className="mt-1.5 p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      <span>Live Current Position of {travelerName}</span>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapViewController coords={validPoints} />
      </MapContainer>
    </div>
  );
}
