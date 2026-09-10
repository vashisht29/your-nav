import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      destination = "Manali",
      travelers = 2,
      budget = 30000,
      departure_date = "2026-09-10",
      return_date = "2026-09-13",
    } = body;

    const tCount = Math.max(1, Number(travelers) || 1);
    const destClean = String(destination || "Manali").trim();

    let nights = 3;
    try {
      const dep = new Date(departure_date);
      const ret = new Date(return_date);
      const diff = Math.round((ret.getTime() - dep.getTime()) / (1000 * 60 * 60 * 24));
      if (diff > 0) nights = diff;
    } catch {}

    const DEST_COORDS: Record<string, [number, number]> = {
      manali: [32.2396, 77.1887],
      delhi: [28.6139, 77.2090],
      jaipur: [26.9124, 75.7873],
      udaipur: [24.5854, 73.7125],
      goa: [15.2993, 74.1240],
      mumbai: [19.0760, 72.8777],
      bengaluru: [12.9716, 77.5946],
      shimla: [31.1048, 77.1734],
      rishikesh: [30.0869, 78.2676],
      agra: [27.1767, 78.0081]
    };
    const baseCoord = DEST_COORDS[destClean.toLowerCase()] || [32.2396, 77.1887];

    const hotels = [
      {
        id: `stay-${destClean.toLowerCase()}-1`,
        name: `${destClean} Grand Vista Boutique Resort`,
        lat: Number((baseCoord[0] + 0.005).toFixed(4)),
        lng: Number((baseCoord[1] + 0.004).toFixed(4)),
        category: "4-Star Luxury Mountain Resort",
        star_rating: 4.8,
        proximity_km: 0.8,
        proximity_tag: "0.8 km from City Center & Promenade",
        check_in: "12:00 PM",
        check_out: "11:00 AM",
        staff_nature_rating: "4.9/5 (Exceptional Concierge, Warm Hospitality)",
        food_plan: "Free Gourmet Buffet Breakfast Included",
        amenities: [
          "High-speed WiFi (150 Mbps)",
          "Heated Swimming Pool",
          "Spa & Wellness Center",
          "Mountain View Balcony",
          "Free Valet Parking",
        ],
        cost_per_night: 3800,
        total_stay_cost_inr: 3800 * nights,
        image_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop",
        rooms: [
          {
            name: "Deluxe Mountain View Room",
            type: "Deluxe",
            desc: "King Bed with Panoramic Valley Balcony & Heated Flooring",
            cost_per_night: 3800,
            meals: "Free Buffet Breakfast Included",
          },
          {
            name: "Luxury Alpine Suite",
            type: "Master Suite",
            desc: "Private Fireplace, Cedar Wood Interiors & High-floor View",
            cost_per_night: 5400,
            meals: "Breakfast + Dinner (Half Board)",
          },
        ],
      },
      {
        id: `stay-${destClean.toLowerCase()}-2`,
        name: `${destClean} Pine Riverside Homestay & Chalet`,
        lat: Number((baseCoord[0] - 0.006).toFixed(4)),
        lng: Number((baseCoord[1] - 0.003).toFixed(4)),
        category: "Authentic Local Heritage Homestay",
        star_rating: 4.7,
        proximity_km: 1.2,
        proximity_tag: "Direct Access to Riverbank Trail",
        check_in: "01:00 PM (24x7 Self Check-in)",
        check_out: "11:00 AM",
        staff_nature_rating: "4.9/5 (Superhost Family, Caring & Local Guides)",
        food_plan: "Homecooked Traditional Meals & Garden Barbecue",
        amenities: [
          "Garden Courtyard & Bonfire Pit",
          "High-speed Starlink WiFi",
          "Pet-Friendly",
          "In-House Café",
        ],
        cost_per_night: 2400,
        total_stay_cost_inr: 2400 * nights,
        image_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop",
        rooms: [
          {
            name: "Standard Heritage Room",
            type: "Standard",
            desc: "Cozy Double Bed with Forest Windows",
            cost_per_night: 2400,
            meals: "Homecooked Breakfast Included",
          },
        ],
      },
      {
        id: `stay-${destClean.toLowerCase()}-3`,
        name: `The Whispering Peaks Luxury Retreat`,
        lat: Number((baseCoord[0] + 0.012).toFixed(4)),
        lng: Number((baseCoord[1] + 0.008).toFixed(4)),
        category: "5-Star Ultra-Luxury Sanctuary",
        star_rating: 4.9,
        proximity_km: 2.1,
        proximity_tag: "Private Hilltop Vista & Forest Trails",
        check_in: "02:00 PM",
        check_out: "12:00 PM",
        staff_nature_rating: "5.0/5 (Dedicated Butler Service & Chauffeur)",
        food_plan: "Signature Fine Dining Multi-Course Cuisine",
        amenities: [
          "Infinity Panorama Deck",
          "Ayurvedic Spa & Jacuzzi",
          "Gourmet Restaurant",
          "Helipad Access",
        ],
        cost_per_night: 6500,
        total_stay_cost_inr: 6500 * nights,
        image_url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop",
        rooms: [
          {
            name: "Executive Royal Chalet",
            type: "Chalet",
            desc: "Glass-fronted Bedroom with Uninterrupted Vista",
            cost_per_night: 6500,
            meals: "All-Inclusive Dining & High Tea",
          },
        ],
      },
    ];

    const midway_hotels = [
      {
        id: "midway-rest-1",
        name: "Highway Oasis Grand Midway Resort",
        category: "Expressway Rest Resort",
        star_rating: 4.5,
        proximity_tag: "Expressway Interchange Rest Stop",
        check_in: "24x7 Express Check-in",
        check_out: "12:00 PM",
        cost_per_night: 2200,
        total_stay_cost_inr: 2200,
        amenities: ["Safe Parking", "24x7 Food Court", "Clean Showers", "Electric Car Charger"],
      },
    ];

    return NextResponse.json({
      hotels,
      midway_hotels,
      midway_city_name: "Midway Rest Town",
      requires_overnight: false,
    });
  } catch (error: any) {
    return NextResponse.json({ hotels: [], midway_hotels: [] }, { status: 200 });
  }
}
