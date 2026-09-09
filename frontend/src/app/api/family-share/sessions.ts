// Shared in-memory session store & authentic Indian route coordinates engine

export interface Milestone {
  id: string;
  order: number;
  category: string;
  icon: string;
  title: string;
  description: string;
  location_name: string;
  relative_time: string;
  status: "COMPLETED" | "CURRENT" | "PENDING";
  notification_template: string;
  lat: number;
  lng: number;
}

export interface SafarSession {
  track_id: string;
  traveler_name: string;
  origin: string;
  destination: string;
  transport_mode: string;
  tracking_url: string;
  created_at: string;
  status: string;
  current_milestone_index: number;
  current_milestone: Milestone;
  milestones: Milestone[];
  contacts: Array<{
    id: string;
    name: string;
    phone: string;
    relationship: string;
    relation?: string;
    access_status: string;
    status?: string;
    device: string;
    last_seen: string;
    lastSeen?: string;
    permission: string;
  }>;
  live_telemetry: {
    battery_percent: number;
    speed_kmh: number;
    transit_status: string;
    last_ping_time: string;
    emergency_system: string;
    altitude_m: number;
    satellites_locked: number;
  };
}

// Global in-memory cache to ensure session persistence across all API routes & tabs
declare global {
  var _safarSessionRegistry: Map<string, SafarSession> | undefined;
}

if (!globalThis._safarSessionRegistry) {
  globalThis._safarSessionRegistry = new Map<string, SafarSession>();
}

export const safarSessionStore = globalThis._safarSessionRegistry;

export const INDIAN_CITY_COORDS: Record<string, [number, number]> = {
  mumbai: [19.0760, 72.8777],
  goa: [15.2993, 74.1240],
  panaji: [15.4909, 73.8278],
  pune: [18.5204, 73.8567],
  delhi: [28.6139, 77.2090],
  manali: [32.2396, 77.1887],
  jaipur: [26.9124, 75.7873],
  udaipur: [24.5854, 73.7125],
  bengaluru: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  hyderabad: [17.3850, 78.4867],
  chennai: [13.0827, 80.2707],
  kolkata: [22.5726, 88.3639],
  ahmedabad: [23.0225, 72.5714],
  shimla: [31.1048, 77.1734],
  rishikesh: [30.0869, 78.2676],
  leh: [34.1526, 77.5771],
  srinagar: [34.0837, 74.7973],
  amritsar: [31.6340, 74.8723],
  agra: [27.1767, 78.0081],
  varanasi: [25.3176, 82.9739],
  ooty: [11.4102, 76.6950],
  munnar: [10.0889, 77.0595],
  kochi: [9.9312, 76.2673],
  cochin: [9.9312, 76.2673],
  chandigarh: [30.7333, 76.7794],
  kasol: [32.0100, 77.3150],
  lonavala: [18.7546, 73.4062],
  kolhapur: [16.7050, 74.2433],
  darjeeling: [27.0410, 88.2663],
  mysore: [12.2958, 76.6394],
  coorg: [12.3375, 75.8069],
};

export function getCityCoords(name: string): [number, number] {
  if (!name) return [19.0760, 72.8777]; // default Mumbai
  const clean = name.toLowerCase().trim();
  for (const [city, coords] of Object.entries(INDIAN_CITY_COORDS)) {
    if (clean.includes(city) || city.includes(clean)) {
      return coords;
    }
  }
  return [19.0760, 72.8777];
}

export function buildRealisticMilestones(
  origin: string,
  destination: string,
  travelerName: string,
  stayName?: string
): Milestone[] {
  const origClean = (origin || "Mumbai").trim();
  const destClean = (destination || "Goa").trim();
  const hotel = stayName || `The Heritage Resort, ${destClean}`;

  const origCoord = getCityCoords(origClean);
  const destCoord = getCityCoords(destClean);

  const isMumbaiToGoa =
    (origClean.toLowerCase().includes("mumbai") && destClean.toLowerCase().includes("goa")) ||
    (destClean.toLowerCase().includes("mumbai") && origClean.toLowerCase().includes("goa"));

  const isDelhiToManali =
    (origClean.toLowerCase().includes("delhi") && destClean.toLowerCase().includes("manali")) ||
    (destClean.toLowerCase().includes("delhi") && origClean.toLowerCase().includes("manali"));

  const isDelhiToJaipur =
    (origClean.toLowerCase().includes("delhi") && destClean.toLowerCase().includes("jaipur")) ||
    (destClean.toLowerCase().includes("delhi") && origClean.toLowerCase().includes("jaipur"));

  // 1. Mumbai to Goa Route
  if (isMumbaiToGoa) {
    return [
      {
        id: "MS-01-DEPARTURE",
        order: 1,
        category: "departure",
        icon: "🚗",
        title: `Departed ${origClean} (Trip Commenced)`,
        description: `Left residence in ${origClean}. Baggage packed, vehicle inspection complete, GPS route locked.`,
        location_name: "Mumbai Eastern Freeway Gateway",
        relative_time: "07:30 AM (Day 1)",
        status: "COMPLETED",
        lat: 19.0760,
        lng: 72.8777,
        notification_template: `🚗 Family Share: ${travelerName} has departed Mumbai heading to Goa.`,
      },
      {
        id: "MS-02-EXPRESSWAY-TOLL",
        order: 2,
        category: "highway_toll",
        icon: "🛣️",
        title: "Mumbai-Pune Expressway Toll Cleared",
        description: "Cleared Khalapur Fastag Toll. Cruising smoothly on 6-lane Yashwantrao Chavan Expressway.",
        location_name: "Khalapur Expressway Toll Plaza",
        relative_time: "09:15 AM (Day 1)",
        status: "COMPLETED",
        lat: 18.8950,
        lng: 73.1750,
        notification_template: `🛣️ Family Share: Passed Khalapur Expressway Toll at 84 km/h. Traffic smooth.`,
      },
      {
        id: "MS-03-MIDWAY-REST",
        order: 3,
        category: "rest_halt",
        icon: "☕",
        title: "Lonavala Ghat Gourmet Food Oasis Halt",
        description: "Comfort halt for tea and breakfast. Verified clean washrooms, vehicle fuel check completed.",
        location_name: "Lonavala Expressway Rest Plaza (KM 92)",
        relative_time: "11:30 AM (Day 1)",
        status: "CURRENT",
        lat: 18.7546,
        lng: 73.4062,
        notification_template: `☕ Family Share: At Lonavala Rest Stop for refreshments. Resuming drive towards Goa in 20 mins.`,
      },
      {
        id: "MS-04-VALLEY-INGRESS",
        order: 4,
        category: "valley_ingress",
        icon: "🌴",
        title: "Konkan Ghats & Goa Border Checkpost",
        description: "Descending picturesque Sawantwadi ghats into coastal Konkan belt. Scenic highway cruise.",
        location_name: "Sawantwadi Ghat & Goa State Gateway",
        relative_time: "03:45 PM (Day 1)",
        status: "PENDING",
        lat: 16.2150,
        lng: 73.7420,
        notification_template: `🌴 Family Share: Entering Goa coastal corridor. Beautiful weather, smooth transit.`,
      },
      {
        id: "MS-05-HOTEL-ARRIVAL",
        order: 5,
        category: "hotel_checkin",
        icon: "🏖️",
        title: `Safely Arrived in Goa at ${hotel}`,
        description: `Check-in complete, luggage settled in room. Traveler safe and sound in Goa.`,
        location_name: hotel,
        relative_time: "06:15 PM (Day 1)",
        status: "PENDING",
        lat: 15.2993,
        lng: 74.1240,
        notification_template: `🏖️ Family Share: Safely arrived at ${hotel} in Goa! Journey completed smoothly.`,
      },
    ];
  }

  // 2. Delhi to Manali Route
  if (isDelhiToManali) {
    return [
      {
        id: "MS-01-DEPARTURE",
        order: 1,
        category: "departure",
        icon: "🚗",
        title: "Departed Delhi (Trip Commenced)",
        description: "Left residence in Delhi. Vehicle checked, bags packed, route active.",
        location_name: "Delhi City Gateway (Mukarba Chowk)",
        relative_time: "07:30 AM (Day 1)",
        status: "COMPLETED",
        lat: 28.6139,
        lng: 77.2090,
        notification_template: `🚗 Family Share: ${travelerName} has departed Delhi heading to Manali.`,
      },
      {
        id: "MS-02-EXPRESSWAY-TOLL",
        order: 2,
        category: "highway_toll",
        icon: "🛣️",
        title: "Karnal Express Bypass Toll Cleared",
        description: "Cleared Karnal Fastag plaza. Cruising on multi-lane national expressway corridor.",
        location_name: "Karnal Express Bypass Toll Plaza",
        relative_time: "09:45 AM (Day 1)",
        status: "COMPLETED",
        lat: 29.6857,
        lng: 76.9905,
        notification_template: "🛣️ Family Share: Passed Karnal Toll Plaza at 82 km/h. Everything smooth and on schedule.",
      },
      {
        id: "MS-03-MIDWAY-REST",
        order: 3,
        category: "rest_halt",
        icon: "☕",
        title: "Ambala Midway Food Plaza & Tea Halt",
        description: "Comfort halt for refreshments and vehicle check. Verified clean washrooms & security.",
        location_name: "Midway Express Oasis (KM 185)",
        relative_time: "12:30 PM (Day 1)",
        status: "CURRENT",
        lat: 30.3752,
        lng: 76.7821,
        notification_template: "☕ Family Share: At Midway Rest Stop for lunch & tea. Resuming drive in 20 mins.",
      },
      {
        id: "MS-04-VALLEY-INGRESS",
        order: 4,
        category: "valley_ingress",
        icon: "🏔️",
        title: "Valley Ascent & Entry into Manali Foothills",
        description: "Entering picturesque mountain highway corridor. Speed moderated for scenic ghat section.",
        location_name: "Manali Highway Gateway (Aut Tunnel)",
        relative_time: "03:15 PM (Day 1)",
        status: "PENDING",
        lat: 31.6834,
        lng: 77.0123,
        notification_template: "🏔️ Family Share: Entering Manali Valley. Beautiful weather, smooth traffic.",
      },
      {
        id: "MS-05-HOTEL-ARRIVAL",
        order: 5,
        category: "hotel_checkin",
        icon: "🏨",
        title: `Safely Arrived & Checked In at ${hotel}`,
        description: "Check-in complete, luggage settled in room. Traveler safe and sound in Manali.",
        location_name: hotel,
        relative_time: "05:45 PM (Day 1)",
        status: "PENDING",
        lat: 32.2396,
        lng: 77.1887,
        notification_template: `🏨 Family Share: Safely arrived at ${hotel} in Manali! Journey complete.`,
      },
    ];
  }

  // 3. Dynamic Interpolated Route for ANY other city pair (Jaipur, Bangalore, etc.)
  const steps = [
    { frac: 0.00, title: `Departed ${origClean} (Trip Commenced)`, loc: `${origClean} City Gateway`, icon: "🚗", cat: "departure", status: "COMPLETED", time: "07:30 AM" },
    { frac: 0.28, title: `${origClean} State Expressway Fastag Toll`, loc: `${origClean} Highway Corridor Toll`, icon: "🛣️", cat: "highway_toll", status: "COMPLETED", time: "09:30 AM" },
    { frac: 0.55, title: `Midway Highway Oasis & Meal Halt`, loc: `Interstate Rest Plaza (KM 165)`, icon: "☕", cat: "rest_halt", status: "CURRENT", time: "12:15 PM" },
    { frac: 0.82, title: `Ingress Gateway into ${destClean} Region`, loc: `${destClean} Highway Gateway`, icon: "📍", cat: "valley_ingress", status: "PENDING", time: "03:30 PM" },
    { frac: 1.00, title: `Safely Arrived & Checked In at ${hotel}`, loc: hotel, icon: "🏨", cat: "hotel_checkin", status: "PENDING", time: "05:45 PM" },
  ];

  return steps.map((s, idx) => {
    const arc = Math.sin(s.frac * Math.PI) * 0.08;
    const lat = Number((origCoord[0] + (destCoord[0] - origCoord[0]) * s.frac + arc).toFixed(4));
    const lng = Number((origCoord[1] + (destCoord[1] - origCoord[1]) * s.frac + (arc * 0.5)).toFixed(4));

    return {
      id: `MS-0${idx + 1}-AUTO`,
      order: idx + 1,
      category: s.cat,
      icon: s.icon,
      title: s.title,
      description: idx === 0
        ? `Commenced trip from ${origClean}. Baggage secured, vehicle pre-checked, GPS lock active.`
        : idx === 4
        ? `Check-in complete, luggage settled in room. Traveler safe and sound in ${destClean}.`
        : `Cruising along designated national highway corridor towards ${destClean}. Speed steady, road clear.`,
      location_name: s.loc,
      relative_time: `${s.time} (Day 1)`,
      status: s.status as "COMPLETED" | "CURRENT" | "PENDING",
      lat,
      lng,
      notification_template: `📍 Family Share: ${s.title} (${s.loc}). Traveler safe and on schedule.`,
    };
  });
}

export function createOrGetSession(
  origin: string = "Mumbai",
  destination: string = "Goa",
  travelerName: string = "Rahul Sharma",
  transportMode: string = "self-drive",
  stayName?: string,
  existingTrackId?: string
): SafarSession {
  const origClean = (origin || "Mumbai").trim();
  const destClean = (destination || "Goa").trim();
  const destSlug = destClean.slice(0, 4).toUpperCase();
  const trackId = existingTrackId || `GP-${destSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

  const milestones = buildRealisticMilestones(origClean, destClean, travelerName, stayName);
  const currentMilestone = milestones[2] || milestones[0];

  const session: SafarSession = {
    track_id: trackId,
    traveler_name: travelerName,
    origin: origClean,
    destination: destClean,
    transport_mode: transportMode,
    tracking_url: `http://localhost:3000/track/${trackId}`,
    created_at: new Date().toISOString(),
    status: "ACTIVE_TRACKING",
    current_milestone_index: 2,
    current_milestone: currentMilestone,
    milestones,
    contacts: [
      {
        id: "c1",
        name: "Papa (Suresh Sharma)",
        phone: "+91-9876543210",
        relationship: "Father",
        relation: "Father",
        access_status: "VIEWING_NOW",
        status: "viewing",
        device: "iPhone 15 Pro",
        last_seen: "Just now",
        lastSeen: "Just now",
        permission: "Full Live GPS + Notifications",
      },
      {
        id: "c2",
        name: "Mummy (Sunita Sharma)",
        phone: "+91-9876543211",
        relationship: "Mother",
        relation: "Mother",
        access_status: "ALERT_DELIVERED",
        status: "whatsapp",
        device: "Samsung Galaxy S23",
        last_seen: "4m ago",
        lastSeen: "4m ago",
        permission: "Milestone Checkpoints",
      },
      {
        id: "c3",
        name: "Pooja Sharma (Sister)",
        phone: "+91-9876543212",
        relationship: "Sister",
        relation: "Sister",
        access_status: "LINK_ACTIVE",
        status: "active",
        device: "MacBook Air",
        last_seen: "16m ago",
        lastSeen: "16m ago",
        permission: "Full Live GPS",
      },
    ],
    live_telemetry: {
      battery_percent: 88,
      speed_kmh: 78,
      transit_status: `Cruising en route to ${destClean} (${currentMilestone.location_name})`,
      last_ping_time: "Just now",
      emergency_system: "RoadGuard AI Active (Risk Index: 0.04)",
      altitude_m: 640,
      satellites_locked: 9,
    },
  };

  safarSessionStore.set(trackId, session);
  return session;
}
