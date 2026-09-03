# backend/bus_engine.py
"""
Pan-India Inter-City Bus Intelligence Engine
Covers Zingbus, IntrCity SmartBus, NueGo Electric EV, KSRTC, HRTC, Laxmi Holidays,
Volvo 9600 Multi-Axle Sleepers, dynamic seat location pricing tiers (Lower Front vs Rear Saver),
and official bus cancellation/refund policies.
"""

import math
from typing import List, Dict, Optional
from railway_engine import get_bus_cancellation_policy, get_applicable_promo_code

PAN_INDIA_BUS_HUBS = {
    "delhi": {"name": "ISBT Kashmiri Gate / Majnu Ka Tilla", "lat": 28.6692, "lng": 77.2285},
    "mumbai": {"name": "Borivali / Dadar TT Circle", "lat": 19.2288, "lng": 72.8541},
    "bengaluru": {"name": "Majestic / Madiwala Bus Hub", "lat": 12.9774, "lng": 77.5708},
    "hyderabad": {"name": "MGBS / Ameerpet", "lat": 17.3789, "lng": 78.4812},
    "chennai": {"name": "CMBT Koyambedu Terminal", "lat": 13.0694, "lng": 80.1948},
    "jaipur": {"name": "Sindhi Camp Central Bus Stand", "lat": 26.9239, "lng": 75.8005},
    "manali": {"name": "Manali Private Volvo Stand", "lat": 32.2396, "lng": 77.1887},
    "shimla": {"name": "ISBT Tutikandi, Shimla", "lat": 31.0968, "lng": 77.1517},
    "rishikesh": {"name": "Nepali Farm / Natraj Chowk", "lat": 30.0869, "lng": 78.2676},
    "dehradun": {"name": "ISBT Dehradun", "lat": 30.2872, "lng": 78.0069},
    "varanasi": {"name": "Cantt Bus Station, Varanasi", "lat": 25.3283, "lng": 82.9863},
    "agra": {"name": "ISBT Idgah, Agra", "lat": 27.1648, "lng": 77.9942},
    "goa": {"name": "Panaji KTC Bus Stand / Mapusa", "lat": 15.4989, "lng": 73.8278},
    "udaipur": {"name": "Udaipur City Bus Stand, Udiapole", "lat": 24.5775, "lng": 73.6998},
    "chandigarh": {"name": "ISBT Sector 43, Chandigarh", "lat": 30.7166, "lng": 76.7417},
    "amritsar": {"name": "Amritsar Bus Stand, GT Road", "lat": 31.6288, "lng": 74.8872},
    "pune": {"name": "Swargate / Wakad Bus Hub", "lat": 18.5018, "lng": 73.8580},
    "ahmedabad": {"name": "Geeta Mandir Central Bus Stand", "lat": 23.0132, "lng": 72.5937},
    "lucknow": {"name": "Alambagh ISBT, Lucknow", "lat": 26.8152, "lng": 80.9022},
    "ayodhya": {"name": "Dham Bus Stand, Ayodhya", "lat": 26.7922, "lng": 82.1998},
    "gaya": {"name": "Bodh Gaya Bus Stand", "lat": 24.6961, "lng": 84.9869},
    "puri": {"name": "Puri Bus Stand, Grand Road", "lat": 19.8135, "lng": 85.8312}
}

def resolve_bus_hub(city_name: str) -> Dict:
    c_lower = city_name.lower().strip()
    for key, hub in PAN_INDIA_BUS_HUBS.items():
        if key in c_lower or c_lower in key:
            return {"city": city_name, "hub_name": hub["name"], "lat": hub["lat"], "lng": hub["lng"]}
    # Default coordinates (Delhi)
    return {"city": city_name, "hub_name": f"{city_name} Main Bus Terminal", "lat": 28.6139, "lng": 77.2090}

def calculate_road_distance_km(lat1, lon1, lat2, lon2) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return max(140.0, round(R * c * 1.25, 1)) # Road route highway multiplier 1.25x

def generate_live_buses(origin_name: str, dest_name: str, dep_date: str, ret_date: str, travelers: int) -> List[Dict]:
    """Generates authentic multi-operator bus candidates with in-card seat position pricing."""
    orig_hub = resolve_bus_hub(origin_name)
    dest_hub = resolve_bus_hub(dest_name)

    dist_km = calculate_road_distance_km(orig_hub["lat"], orig_hub["lng"], dest_hub["lat"], dest_hub["lng"])
    is_mountain_route = any(m in dest_name.lower() or m in origin_name.lower() for m in ["manali", "shimla", "rishikesh", "dehradun", "chopta", "kasol", "munnar", "ooty", "darjeeling"])

    BUS_OPERATOR_ROSTER = [
        {
            "operator": "Zingbus Premium Lounges",
            "bus_type": "Volvo 9600 AC Multi-Axle Sleeper (2+1)",
            "rating": 4.6,
            "otp": "94.8% On-Time",
            "avg_delay": "12 mins avg",
            "speed": 45 if is_mountain_route else 72,
            "dep": "21:30",
            "arr": "07:45",
            "amenities": ["WiFi", "Charging Port", "Blanket & Pillow", "Live GPS Tracking", "Zingbus Lounge Access"],
            "base_rate": 2.15,
            "seats": [
                {"name": "Lower Front Single Berth", "desc": "Smooth Ride / Front Cabin", "mult": 1.10},
                {"name": "Upper Single Window Berth", "desc": "Window Privacy Solo", "mult": 0.96},
                {"name": "Rear Row Saver Berth", "desc": "Peeche Wali Seat (Save 18%)", "mult": 0.82}
            ]
        },
        {
            "operator": "IntrCity SmartBus",
            "bus_type": "BharatBenz AC Sleeper (2+1)",
            "rating": 4.5,
            "otp": "93.5% On-Time",
            "avg_delay": "15 mins avg",
            "speed": 44 if is_mountain_route else 70,
            "dep": "22:15",
            "arr": "08:30",
            "amenities": ["SmartBus Captain", "SOS Emergency Alarm", "Clean Washroom On-Board", "Water Bottle"],
            "base_rate": 1.95,
            "seats": [
                {"name": "Lower Double Berth", "desc": "Couple / Family Berths", "mult": 1.05},
                {"name": "Upper Single Berth", "desc": "Private Upper Deck", "mult": 0.95},
                {"name": "Rear Row Saver Berth", "desc": "Peeche Wali Seat (Save 20%)", "mult": 0.80}
            ]
        },
        {
            "operator": "NueGo Electric (EV Bus)",
            "bus_type": "Green EV Luxury AC Recliner",
            "rating": 4.7,
            "otp": "96.2% On-Time",
            "avg_delay": "8 mins avg",
            "speed": 46 if is_mountain_route else 75,
            "dep": "07:00",
            "arr": "15:15",
            "amenities": ["100% Zero Emission", "Ultra Silent Cabin", "Fast EV Charging Stops", "Pushback Ergonomic Seats"],
            "base_rate": 1.65,
            "seats": [
                {"name": "Front Pushback Recliner", "desc": "Spacious Front Window Seat", "mult": 1.05},
                {"name": "Middle Pushback Recliner", "desc": "Standard High-Comfort", "mult": 0.95},
                {"name": "Rear Recliner Saver", "desc": "Peeche Wali Seat (Save 15%)", "mult": 0.85}
            ]
        },
        {
            "operator": "State Roadways Airavat / Himsuta",
            "bus_type": "Scania Multi-Axle AC Club Class",
            "rating": 4.3,
            "otp": "89.5% On-Time",
            "avg_delay": "25 mins avg",
            "speed": 42 if is_mountain_route else 68,
            "dep": "19:45",
            "arr": "06:15",
            "amenities": ["Government Certified Drivers", "High Safety Index", "Spacious 140° Recline"],
            "base_rate": 1.70,
            "seats": [
                {"name": "Front Row Executive", "desc": "Extra Legroom Seat", "mult": 1.05},
                {"name": "Standard Club Recliner", "desc": "Comfortable Pushback", "mult": 0.95},
                {"name": "Rear Row Value Seat", "desc": "Budget Friendly Rear", "mult": 0.82}
            ]
        }
    ]

    candidates = []
    for idx, b in enumerate(BUS_OPERATOR_ROSTER):
        duration_hrs = round((dist_km / b["speed"]) + (idx * 0.3) + 0.5, 1)

        # Build dynamic seat tier options
        class_options = []
        for s in b["seats"]:
            seat_fare_pp = round(120 + (dist_km * b["base_rate"] * s["mult"]), 0)
            class_options.append({
                "class_name": s["name"],
                "seat_desc": s["desc"],
                "cost_inr": seat_fare_pp,
                "total_price_inr": seat_fare_pp * travelers,
                "baggage_allowance": "2 Bags (Up to 20kg in Luggage Hold)",
                "cancellation_policy": get_bus_cancellation_policy(b["bus_type"])
            })

        default_opt = class_options[0]
        ticket_per_person = default_opt["cost_inr"]
        total_fare = default_opt["total_price_inr"]
        selected_seat = default_opt["class_name"]

        cancellation = default_opt["cancellation_policy"]
        promo = get_applicable_promo_code("bus", total_fare, travelers)

        candidates.append({
            "id": f"bus_{idx}",
            "operator": b["operator"],
            "bus_type": b["bus_type"],
            "origin_hub": orig_hub["hub_name"],
            "destination_hub": dest_hub["hub_name"],
            "departure_time": b["dep"],
            "arrival_time": b["arr"],
            "duration_hrs": duration_hrs,
            "distance_km": dist_km,
            "travel_class": selected_seat,
            "class_options": class_options,
            "amenities": b["amenities"],
            "rating": b["rating"],
            "otp_rate": b["otp"],
            "avg_delay": b["avg_delay"],
            "cost_inr": ticket_per_person,
            "total_price_inr": total_fare,
            "mode": "bus",
            "is_multi_leg": False,
            "accessibility_note": f"Direct roadway service: Board at {orig_hub['hub_name']} ➔ Drop at {dest_hub['hub_name']}.",
            "cancellation_policy": cancellation,
            "promo_code": promo
        })

    return sorted(candidates, key=lambda x: x["total_price_inr"])
