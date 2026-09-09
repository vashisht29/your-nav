import { NextResponse } from "next/server";
import { safarSessionStore, createOrGetSession } from "../../sessions";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const trackId = params?.id || "GP-GOA-2026";

  // Check shared in-memory session registry first
  let session = safarSessionStore.get(trackId);

  if (!session) {
    // Attempt to fetch from FastAPI backend
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/family-share/session/${trackId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === "success" && data.safar_session) {
          session = data.safar_session;
          safarSessionStore.set(trackId, session);
        }
      }
    } catch (e) {}
  }

  // If still not found, generate dynamically based on trackId slug (e.g. GP-GOA-... -> Goa)
  if (!session) {
    const parts = trackId.split("-");
    let dest = "Goa";
    let orig = "Mumbai";
    if (parts.length > 1) {
      const slug = parts[1].toUpperCase();
      if (slug.includes("MANA")) {
        dest = "Manali";
        orig = "Delhi";
      } else if (slug.includes("JAIP")) {
        dest = "Jaipur";
        orig = "Delhi";
      } else if (slug.includes("GOA")) {
        dest = "Goa";
        orig = "Mumbai";
      } else if (slug.includes("OOTY")) {
        dest = "Ooty";
        orig = "Bengaluru";
      }
    }
    session = createOrGetSession(orig, dest, "Rahul Sharma", "self-drive", undefined, trackId);
  }

  return NextResponse.json({
    status: "success",
    safar_session: session,
  });
}
