import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const days = body?.current_days || [];
  return NextResponse.json({
    status: "simulated",
    itinerary: { days },
    agent_logs: [
      {
        step: "Delay Re-calibration Applied",
        title: "Delay Re-calibration Applied",
        thought: "Adjusting timeline buffers to absorb travel delay while protecting check-in.",
        action: "recalibrate_schedule(offset=180)",
        observation: "Pushed subsequent sightseeing buffers by 180 mins; hotel check-in preserved.",
        detail: "Pushed subsequent sightseeing buffers by 180 mins; hotel check-in preserved.",
        timestamp: "0.03s",
      },
    ],
  });
}
