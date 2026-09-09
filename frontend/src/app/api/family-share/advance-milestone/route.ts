import { NextResponse } from "next/server";
import { safarSessionStore } from "../sessions";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { track_id, target_milestone_id } = body;

    const session = safarSessionStore.get(track_id);
    if (!session) {
      return NextResponse.json({
        status: "success",
        update: {
          current_milestone: { title: "Cruising on highway corridor", id: "MS-03" },
          milestones: [],
        },
      });
    }

    const mList = session.milestones;
    let currIdx = session.current_milestone_index ?? 0;

    if (target_milestone_id) {
      const foundIdx = mList.findIndex((m: any) => m.id === target_milestone_id);
      if (foundIdx !== -1) {
        currIdx = foundIdx;
      }
    } else {
      currIdx = Math.min(currIdx + 1, mList.length - 1);
    }

    // Update milestones status
    mList.forEach((m: any, idx: number) => {
      if (idx < currIdx) m.status = "COMPLETED";
      else if (idx === currIdx) m.status = "CURRENT";
      else m.status = "PENDING";
    });

    session.current_milestone_index = currIdx;
    session.current_milestone = mList[currIdx];
    session.live_telemetry.transit_status = mList[currIdx].title;
    safarSessionStore.set(track_id, session);

    return NextResponse.json({
      status: "success",
      update: {
        current_milestone: session.current_milestone,
        milestones: session.milestones,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ status: "error", message: e.message }, { status: 500 });
  }
}
