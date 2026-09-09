import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({
    status: "dispatched",
    ticket_id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
    eta_minutes: 12,
    responder: "Highway Patrol Sentinel Rapid Response Unit 04",
    instructions: [
      "Keep hazard warning flashers on.",
      "Stay inside vehicle with seatbelts securely fastened.",
      "Live GPS beacon transmitted to state highway emergency command.",
    ],
  });
}
