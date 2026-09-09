import { NextResponse } from "next/server";
import { createOrGetSession, safarSessionStore } from "../sessions";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      origin = "Mumbai",
      destination = "Goa",
      traveler_name = "Rahul Sharma",
      transport_mode = "self-drive",
      stay_name,
    } = body;

    const session = createOrGetSession(origin, destination, traveler_name, transport_mode, stay_name);

    // Optional background sync with backend engine if running
    try {
      fetch("http://127.0.0.1:8000/api/family-share/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).catch(() => {});
    } catch (e) {}

    return NextResponse.json({
      status: "success",
      safar_session: session,
    });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
