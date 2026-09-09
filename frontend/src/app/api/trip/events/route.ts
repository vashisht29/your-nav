import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const days = body?.current_days || [];
  return NextResponse.json({
    status: "simulated",
    itinerary: { days },
    agent_logs: [
      {
        title: "Delay Re-calibration Applied",
        detail: "Pushed subsequent sightseeing buffers by 180 mins; hotel check-in preserved.",
        timestamp: "0.03s",
      },
    ],
  });
}
