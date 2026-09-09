import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const dest = url.searchParams.get("destination") || "Manali";

  return NextResponse.json({
    data: {
      region_name: `${dest} Valley Circuit`,
      recommended_sub_region: {
        id: "sub-1",
        name: `${dest} Central & Old Quarter`,
        vibe: "Riverside Cafes, Forest Trails & Apple Orchards",
        airport_name: `${dest} Regional Airport`,
        persona_match: ["relaxation", "nature", "scenic"],
        savings_rationale: "Zero detour travel corridor with direct cab transfers.",
      },
      all_sub_regions: [
        {
          id: "sub-1",
          name: `${dest} Central & Old Quarter`,
          vibe: "Riverside Cafes & Forest Trails",
        },
      ],
      ai_rationale: `AI matched your profile to ${dest} Central for optimum accessibility and scenic views.`,
    },
  });
}
