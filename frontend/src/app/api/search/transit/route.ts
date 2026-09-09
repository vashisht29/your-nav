import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      origin = "Delhi",
      destination = "Manali",
      travelers = 2,
      mode = "flight",
      travel_class = "economy",
    } = body;

    const tCount = Math.max(1, Number(travelers) || 1);
    const origClean = String(origin || "Delhi").trim();
    const destClean = String(destination || "Manali").trim();

    let transits: any[] = [];

    if (mode === "flight") {
      transits = [
        {
          id: `flight-6e-${Date.now()}-1`,
          airline: "IndiGo",
          flight_number: "6E-2041",
          rating: 4.4,
          otp_rate: "94.2% On-Time",
          departure_time: "06:15",
          arrival_time: "08:35",
          duration_hrs: 2.3,
          cost_inr: 4450,
          total_price_inr: 4450 * tCount,
          origin_iata: origClean.slice(0, 3).toUpperCase(),
          destination_iata: destClean.slice(0, 3).toUpperCase(),
          origin_airport: `${origClean} Domestic Terminal`,
          destination_airport: `${destClean} Airport Hub`,
          travel_class: travel_class === "business" ? "Business Class" : "Saver Economy",
          baggage_allowance: "15 kg Check-in + 7 kg Cabin",
          cancellation_policy: "Free cancellation within 24 hours of booking",
          dual_airport_advice: {
            badge: "Primary Recommended Gateway",
            travel_time: "35m express highway transfer to city center",
          },
          ground_transfer_intelligence: {
            has_ground_transfer: true,
            transfer_type: "Scenic Highway Cab",
            transfer_duration: "35 mins",
            transfer_cost_inr: 950,
          },
          class_options: [
            {
              class_name: "Saver Economy",
              cost_inr: 4450,
              total_price_inr: 4450 * tCount,
              baggage_allowance: "15 kg Check-in + 7 kg Cabin",
              cancellation_policy: "Standard Airline Refund Policy",
            },
            {
              class_name: "Flexi Plus",
              cost_inr: 5800,
              total_price_inr: 5800 * tCount,
              baggage_allowance: "15 kg + Free Seat Selection & Warm Meal",
              cancellation_policy: "Zero Date Change Fee",
            },
          ],
        },
        {
          id: `flight-uk-${Date.now()}-2`,
          airline: "Vistara",
          flight_number: "UK-983",
          rating: 4.7,
          otp_rate: "96.1% On-Time",
          departure_time: "10:30",
          arrival_time: "12:50",
          duration_hrs: 2.3,
          cost_inr: 5600,
          total_price_inr: 5600 * tCount,
          origin_iata: origClean.slice(0, 3).toUpperCase(),
          destination_iata: destClean.slice(0, 3).toUpperCase(),
          origin_airport: `${origClean} Domestic Terminal`,
          destination_airport: `${destClean} Airport Hub`,
          travel_class: travel_class === "business" ? "Business Class" : "Standard Economy",
          baggage_allowance: "15 kg Check-in + 7 kg Cabin",
          cancellation_policy: "Instant full refund with Flexi Shield",
          dual_airport_advice: {
            badge: "Full Service Luxury",
            travel_time: "Complimentary lounge access included",
          },
          ground_transfer_intelligence: {
            has_ground_transfer: true,
            transfer_type: "Chauffeured Sedan",
            transfer_duration: "35 mins",
            transfer_cost_inr: 1400,
          },
          class_options: [
            {
              class_name: "Standard Economy",
              cost_inr: 5600,
              total_price_inr: 5600 * tCount,
              baggage_allowance: "15 kg Check-in + 7 kg Cabin",
              cancellation_policy: "Standard Airline Refund Policy",
            },
            {
              class_name: "Premium Economy",
              cost_inr: 8200,
              total_price_inr: 8200 * tCount,
              baggage_allowance: "20 kg + Extra Legroom + Hot Meals",
              cancellation_policy: "Priority Refund Processing",
            },
          ],
        },
      ];
    } else if (mode === "train") {
      transits = [
        {
          id: `train-vb-${Date.now()}-1`,
          train_name: "Vande Bharat Express",
          train_number: "22436",
          otp_rate: "96.8% On-Time",
          departure_time: "06:00",
          arrival_time: "13:30",
          duration_hrs: 7.5,
          cost_inr: 1750,
          total_price_inr: 1750 * tCount,
          travel_class: travel_class || "Chair Car (CC)",
          origin_station: `${origClean} Central Jn`,
          destination_station: `${destClean} Junction`,
          frequency: "Runs 6 days a week (Except Wednesday)",
          class_options: [
            {
              class_name: "Chair Car (CC)",
              cost_inr: 1750,
              total_price_inr: 1750 * tCount,
              baggage_allowance: "40 kg",
              cancellation_policy: "IRCTC Standard Refund Rules",
            },
            {
              class_name: "Executive Class (EC)",
              cost_inr: 3200,
              total_price_inr: 3200 * tCount,
              baggage_allowance: "50 kg + 180° Rotating Seats & Catering",
              cancellation_policy: "IRCTC Full Refund Slabs",
            },
          ],
        },
        {
          id: `train-raj-${Date.now()}-2`,
          train_name: "Superfast Rajdhani Express",
          train_number: "12424",
          otp_rate: "94.0% On-Time",
          departure_time: "16:50",
          arrival_time: "07:15",
          duration_hrs: 14.4,
          cost_inr: 2450,
          total_price_inr: 2450 * tCount,
          travel_class: travel_class || "3rd AC (3A)",
          origin_station: `${origClean} Railway Station`,
          destination_station: `${destClean} Cantt`,
          frequency: "Daily Service",
          class_options: [
            {
              class_name: "3rd AC (3A)",
              cost_inr: 2450,
              total_price_inr: 2450 * tCount,
              baggage_allowance: "40 kg + Bedroll + Meals",
              cancellation_policy: "IRCTC Standard Rules",
            },
          ],
        },
      ];
    } else if (mode === "bus") {
      transits = [
        {
          id: `bus-zing-${Date.now()}-1`,
          bus_operator: "Zingbus Electric & Volvo Luxe",
          bus_type: "Volvo 9600 Multi-Axle AC Sleeper (2+1)",
          departure_time: "20:30",
          arrival_time: "07:30",
          duration_hrs: 11.0,
          cost_inr: 1350,
          total_price_inr: 1350 * tCount,
          rating: 4.6,
          amenities: [
            "Live GPS Tracking",
            "Personal USB Charging",
            "Sanitized Blanket & Pillow",
            "Mineral Water Bottle",
          ],
          boarding_point: `${origClean} ISBT Kashmere Gate`,
          dropoff_point: `${destClean} Private Bus Stand`,
          class_options: [
            {
              class_name: "Upper Sleeper",
              cost_inr: 1350,
              total_price_inr: 1350 * tCount,
              baggage_allowance: "20 kg",
              cancellation_policy: "Free cancellation up to 6 hours before departure",
            },
            {
              class_name: "Single Luxury Sleeper",
              cost_inr: 1750,
              total_price_inr: 1750 * tCount,
              baggage_allowance: "25 kg",
              cancellation_policy: "100% Instant Refund to Wallet",
            },
          ],
        },
      ];
    } else {
      // self-drive
      const estimatedFuelCost = 4200;
      const estimatedTolls = 550;
      const totalCarCost = estimatedFuelCost + estimatedTolls;
      transits = [
        {
          id: `car-direct-${Date.now()}-1`,
          route_name: "Direct National Highway & Expressway Corridor",
          duration_hrs: 9.0,
          distance_km: 480,
          fuel_cost_inr: estimatedFuelCost,
          toll_cost_inr: estimatedTolls,
          total_price_inr: totalCarCost,
          cost_inr: Math.round(totalCarCost / tCount),
          road_condition: "Smooth 4-lane Highway with 24x7 RoadGuard Sentinel",
          highway_dhabas: [
            {
              name: "Murthal Grand Haveli",
              rating: 4.8,
              specialty: "Tandoori Stuffed Paranthas with Cultured White Butter",
              km_marker: "KM 52 (Expressway Hub)",
              hygiene_score: "Grade A+ (Certified)",
              price_for_two: 450,
            },
            {
              name: "Sethi Da Highway Dhaba",
              rating: 4.6,
              specialty: "Dal Makhani & Crisp Butter Naan",
              km_marker: "KM 148 (Mid-Corridor)",
              hygiene_score: "Grade A",
              price_for_two: 380,
            },
            {
              name: "Pine Vista Hillside Retreat Dhaba",
              rating: 4.7,
              specialty: "Hot Ginger Kulhad Chai & Mountain Pakoras",
              km_marker: "KM 290 (Ghat Ascent)",
              hygiene_score: "Grade A",
              price_for_two: 220,
            },
          ],
          fuel_stations: [
            {
              name: "HP Highway Retail Oasis (24x7 Clean Restrooms)",
              fuel_types: ["Petrol", "Diesel", "EV 60kW DC Fast Charging"],
              km_marker: "KM 75",
            },
            {
              name: "IndianOil Swagat Highway Hub & Supercharger",
              fuel_types: ["Petrol", "Diesel", "EV Fast Charger", "Air Pump"],
              km_marker: "KM 215",
            },
          ],
          mechanics: [
            {
              name: "Highway 24x7 Emergency Patrol & Tyre Care",
              contact: "+91 98110 22345",
              km_marker: "KM 110",
            },
            {
              name: "All-Car Mechanical Bay & Engine Diagnostics",
              contact: "+91 98765 43210",
              km_marker: "KM 260",
            },
          ],
        },
      ];
    }

    return NextResponse.json({ transits });
  } catch (error: any) {
    return NextResponse.json({ transits: [] }, { status: 200 });
  }
}
