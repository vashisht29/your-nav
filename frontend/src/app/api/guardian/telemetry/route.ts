import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    status: "ok",
    sentinel_status: "active",
    risk_index: 0.04,
    weather_condition: "Clear / Favorable",
  });
}
