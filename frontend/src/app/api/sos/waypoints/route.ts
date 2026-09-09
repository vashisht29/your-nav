import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    waypoints: [
      { name: "Expressway Highway Patrol Station", type: "police", lat: 28.9, lng: 77.1, distance_km: 8.5 },
      { name: "Fortis LifeCare Highway Trauma Clinic", type: "medical", lat: 29.3, lng: 76.9, distance_km: 14.2 },
      { name: "Highway 24x7 Mechanical Crane Recovery", type: "mechanic", lat: 29.8, lng: 76.8, distance_km: 6.1 },
    ],
  });
}
