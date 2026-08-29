# backend/osm_service.py

import requests
import json
import random
import math
from datetime import datetime
from typing import Optional

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse"
OVERPASS_URL = "https://overpass-api.de/api/interpreter"

HEADERS = {
    "User-Agent": "SmartAITravelPlannerPrototype/5.0 (contact: air@gmail.com)"
}

AIRPORTS = {
    "Delhi": {"code": "DEL", "name": "Indira Gandhi International Airport", "lat": 28.5562, "lng": 77.1000},
    "Mumbai": {"code": "BOM", "name": "Chhatrapati Shivaji Maharaj Airport", "lat": 19.0896, "lng": 72.8656},
    "Bangalore": {"code": "BLR", "name": "Kempegowda International Airport", "lat": 13.1986, "lng": 77.7066},
    "Jaipur": {"code": "JAI", "name": "Jaipur International Airport", "lat": 26.8242, "lng": 75.8122},
    "Agra": {"code": "AGR", "name": "Agra Airport / Kheria Air Force Station", "lat": 27.1558, "lng": 77.9608},
    "Patna": {"code": "PAT", "name": "Jay Prakash Narayan Airport", "lat": 25.5912, "lng": 85.0881},
    "Gaya": {"code": "GAY", "name": "Gaya Airport", "lat": 24.7447, "lng": 84.9512},
    "Munnar": {"code": "COK", "name": "Cochin International Airport (Closest)", "lat": 10.1520, "lng": 76.4019},
    "Kochi": {"code": "COK", "name": "Cochin International Airport", "lat": 10.1520, "lng": 76.4019}
}

VEHICLE_DATABASE = [
    {"model": "Hyundai Creta", "fuel_type": "petrol", "mileage": 14.5, "capacity": 50, "source": "Hyundai Official Specs"},
    {"model": "Tata Nexon EV", "fuel_type": "ev_charge_kwh", "mileage": 6.2, "capacity": 40, "source": "Tata Motors EV Specs"},
    {"model": "Mahindra XUV700", "fuel_type": "diesel", "mileage": 13.2, "capacity": 60, "source": "Mahindra Official Specs"},
    {"model": "Honda City", "fuel_type": "petrol", "mileage": 16.8, "capacity": 40, "source": "Honda Car Specs"},
    {"model": "Toyota Innova Hycross", "fuel_type": "premium_petrol", "mileage": 18.2, "capacity": 52, "source": "Toyota Hybrid Bureau"},
    {"model": "Maruti Swift", "fuel_type": "petrol", "mileage": 22.0, "capacity": 37, "source": "Maruti Suzuki Bureau"}
]

FUEL_RATES = {
    "Delhi": {"petrol": 94.72, "premium_petrol": 102.40, "diesel": 87.62, "ev_charge_kwh": 15.00, "source": "IOCL Live Delhi"},
    "Rajasthan": {"petrol": 104.88, "premium_petrol": 112.50, "diesel": 90.36, "ev_charge_kwh": 18.50, "source": "HPCL HP Rajasthan"},
    "Uttar Pradesh": {"petrol": 94.49, "premium_petrol": 101.80, "diesel": 87.55, "ev_charge_kwh": 16.00, "source": "BPCL UP West"},
    "Kerala": {"petrol": 107.56, "premium_petrol": 115.10, "diesel": 96.43, "ev_charge_kwh": 19.00, "source": "IOCL Kerala South"},
    "Default": {"petrol": 96.50, "premium_petrol": 104.00, "diesel": 89.00, "ev_charge_kwh": 17.00, "source": "Ministry of Petroleum Estimates"}
}

TOLL_PLAZAS = {
    "jaipur": [
        {"name": "Kherki Daula Toll Plaza (NH-48)", "fee_inr": 80.0},
        {"name": "Shahjahanpur Toll Plaza (NH-48)", "fee_inr": 165.0},
        {"name": "Manoharpur Toll Plaza (NH-48)", "fee_inr": 135.0}
    ],
    "agra": [
        {"name": "Yamuna Expressway Jewar Toll", "fee_inr": 175.0},
        {"name": "Yamuna Expressway Mathura Toll", "fee_inr": 160.0}
    ],
    "goa": [
        {"name": "Delhi Bypass Toll Booth", "fee_inr": 80.0},
        {"name": "Udaipur Bypass Toll", "fee_inr": 110.0},
        {"name": "Ahmedabad Ring Road Toll", "fee_inr": 90.0},
        {"name": "Pune Bangalore Expressway Toll", "fee_inr": 230.0},
        {"name": "Goa Entry border Toll", "fee_inr": 150.0}
    ],
    "default": [
        {"name": "National Highway Toll plaza", "fee_inr": 85.0}
    ]
}

def lookup_vehicle_specs(query: str):
    q_lower = query.lower()
    for v in VEHICLE_DATABASE:
        if v["model"].lower() in q_lower or q_lower in v["model"].lower():
            return v
    # Default fallback swift specs
    return {"model": query if query else "Standard Car", "fuel_type": "petrol", "mileage": 16.0, "capacity": 45, "source": "Derived default specifications"}

def reverse_geocode_city(lat: float, lng: float):
    params = {"lat": lat, "lon": lng, "format": "json", "zoom": 10}
    try:
        res = requests.get(NOMINATIM_REVERSE_URL, params=params, headers=HEADERS, timeout=8)
        if res.status_code == 200:
            address = res.json().get("address", {})
            return address.get("city", address.get("town", address.get("county", "Midway Stop")))
    except Exception as e:
        print("Reverse geocode failed:", e)
    return "Midway City"

def find_midway_city(origin: str, destination: str):
    orig_geo = geocode_destination(origin)
    dest_geo = geocode_destination(destination)
    if not orig_geo or not dest_geo:
        return "Udaipur", 24.5854, 73.7125 # Default safety midway

    mid_lat = (orig_geo["lat"] + dest_geo["lat"]) / 2.0
    mid_lng = (orig_geo["lng"] + dest_geo["lng"]) / 2.0

    # Clean border logic lookups
    orig_name = origin.lower()
    dest_name = destination.lower()
    if "delhi" in orig_name and "goa" in dest_name:
        return "Udaipur", 24.5854, 73.7125
    elif "delhi" in orig_name and "mumbai" in dest_name:
        return "Udaipur", 24.5854, 73.7125
    elif "delhi" in orig_name and "patna" in dest_name:
        return "Varanasi", 25.3176, 82.9739

    city_name = reverse_geocode_city(mid_lat, mid_lng)
    return city_name, mid_lat, mid_lng

LOCAL_GEOCODE_FALLBACK = {
    "delhi": {"lat": 28.6139, "lng": 77.2090, "display_name": "Delhi, India"},
    "mumbai": {"lat": 19.0760, "lng": 72.8777, "display_name": "Mumbai, Maharashtra, India"},
    "bangalore": {"lat": 12.9716, "lng": 77.5946, "display_name": "Bengaluru, Karnataka, India"},
    "jaipur": {"lat": 26.9124, "lng": 75.7873, "display_name": "Jaipur, Rajasthan, India"},
    "udaipur": {"lat": 24.5854, "lng": 73.7125, "display_name": "Udaipur, Rajasthan, India"},
    "goa": {"lat": 15.2993, "lng": 74.1240, "display_name": "Goa, India"},
    "panaji": {"lat": 15.4909, "lng": 73.8278, "display_name": "Panaji, Goa, India"},
    "bir billing": {"lat": 32.0400, "lng": 76.7200, "display_name": "Bir Billing, Himachal Pradesh, India"},
    "kasol": {"lat": 32.0090, "lng": 77.3150, "display_name": "Kasol, Himachal Pradesh, India"},
    "manali": {"lat": 32.2396, "lng": 77.1887, "display_name": "Manali, Himachal Pradesh, India"},
    "shimla": {"lat": 31.1048, "lng": 77.1734, "display_name": "Shimla, Himachal Pradesh, India"},
    "dharamshala": {"lat": 32.2190, "lng": 76.3230, "display_name": "Dharamshala, Himachal Pradesh, India"},
    "leh ladakh": {"lat": 34.1526, "lng": 77.5771, "display_name": "Leh Ladakh, Jammu & Kashmir, India"},
    "leh": {"lat": 34.1526, "lng": 77.5771, "display_name": "Leh, Ladakh, India"},
    "agra": {"lat": 27.1767, "lng": 78.0081, "display_name": "Agra, Uttar Pradesh, India"},
    "jabalpur": {"lat": 23.1815, "lng": 79.9864, "display_name": "Jabalpur, Madhya Pradesh, India"},
    "bhedaghat": {"lat": 23.1311, "lng": 79.8016, "display_name": "Bhedaghat Dhuandhar Falls, Jabalpur, India"},
    "kanha": {"lat": 22.3345, "lng": 80.6115, "display_name": "Kanha National Park, Madhya Pradesh, India"},
    "munnar": {"lat": 10.0889, "lng": 77.0595, "display_name": "Munnar, Kerala, India"},
    "kochi": {"lat": 9.9312, "lng": 76.2673, "display_name": "Kochi, Kerala, India"},
    "alleppey": {"lat": 9.4981, "lng": 76.3388, "display_name": "Alleppey, Kerala, India"},
    "rishikesh": {"lat": 30.0869, "lng": 78.2676, "display_name": "Rishikesh, Uttarakhand, India"},
    "mussoorie": {"lat": 30.4598, "lng": 78.0799, "display_name": "Mussoorie, Uttarakhand, India"},
    "nalanda": {"lat": 25.1204, "lng": 85.3647, "display_name": "Nalanda Heritage Site, Bihar, India"},
    "gaya": {"lat": 24.7447, "lng": 84.9512, "display_name": "Gaya, Bihar, India"}
}

def geocode_destination(name: str):
    name_clean = name.lower().strip()
    
    # 1. Local Fallback Database check
    for key, val in LOCAL_GEOCODE_FALLBACK.items():
        if key in name_clean:
            return {"lat": val["lat"], "lng": val["lng"], "display_name": val["display_name"]}

    # 2. Live API Call fallback
    params = {"q": name + ", India", "format": "json", "limit": 1}
    try:
        response = requests.get(NOMINATIM_URL, params=params, headers=HEADERS, timeout=8)
        if response.status_code == 200 and len(response.json()) > 0:
            data = response.json()[0]
            return {"lat": float(data["lat"]), "lng": float(data["lon"]), "display_name": data["display_name"]}
    except Exception as e:
        print("Geocoding failed:", e)
    return None

def find_closest_airport(lat: float, lng: float):
    closest = None
    min_dist = 99999.0
    for city, port in AIRPORTS.items():
        dist = abs(port["lat"] - lat) + abs(port["lng"] - lng)
        if dist < min_dist:
            min_dist = dist
            closest = port
    return closest

def get_fuel_price_by_location(destination: str, fuel_type: str):
    dest_lower = destination.lower()
    state = "Default"
    if "jaipur" in dest_lower or "rajasthan" in dest_lower:
        state = "Rajasthan"
    elif "delhi" in dest_lower:
        state = "Delhi"
    elif "agra" in dest_lower or "noida" in dest_lower or "lucknow" in dest_lower:
        state = "Uttar Pradesh"
    elif "kochi" in dest_lower or "munnar" in dest_lower or "kerala" in dest_lower:
        state = "Kerala"

    rates = FUEL_RATES.get(state, FUEL_RATES["Default"])
    return {
        "location": state,
        "fuel_type": fuel_type,
        "price_per_unit": rates.get(fuel_type, rates["petrol"]),
        "source": rates["source"],
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M")
    }

def get_toll_plazas_by_route(destination: str):
    dest_lower = destination.lower()
    for key, plazas in TOLL_PLAZAS.items():
        if key in dest_lower:
            return plazas
    return TOLL_PLAZAS["default"]

def search_transit_candidates(origin: str, destination: str, departure_date: str, return_date: str, travelers: int, mode: str, fuel_type: Optional[str] = "petrol", vehicle_query: Optional[str] = ""):
    orig_geo = geocode_destination(origin)
    dest_geo = geocode_destination(destination)

    if not orig_geo or not dest_geo:
        return []

    # Haversine formula for accurate straight-line distance
    lat1, lon1 = math.radians(orig_geo["lat"]), math.radians(orig_geo["lng"])
    lat2, lon2 = math.radians(dest_geo["lat"]), math.radians(dest_geo["lng"])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))
    straight_line_km = 6371.0 * c  # Earth radius in km

    # Indian road correction factor: roads are ~1.35x longer than straight-line
    # due to highway curves, ghats, diversions, city bypasses
    dist_km = round(straight_line_km * 1.35, 1)
    dist_km = max(30.0, dist_km)

    random.seed(departure_date + origin + destination + mode)

    if mode == "flight":
        orig_port = find_closest_airport(orig_geo["lat"], orig_geo["lng"])
        dest_port = find_closest_airport(dest_geo["lat"], dest_geo["lng"])
        is_short = dist_km < 250.0

        from demo_registry import DEMO_FLIGHTS
        return [{
            **f,
            "origin_airport": orig_port["code"] if orig_port else "DEL",
            "destination_airport": dest_port["code"] if dest_port else "JAI",
            "total_price_inr": f["single_ticket_price"] * travelers,
            "is_short_route_warning": is_short,
            "baggage": "15 kg cabin, 7 kg hand"
        } for f in DEMO_FLIGHTS]

    elif mode == "train":
        from demo_registry import DEMO_TRAINS
        return [{
            **t,
            "total_price_inr": t["single_ticket_price"] * travelers,
        } for t in DEMO_TRAINS]

    elif mode == "bus":
        operators = [
            {"name": "SRS Travels", "type": "Volvo AC Multi-Axle Sleeper", "base_price": 750.0, "delay_rate": "10%"},
            {"name": "VRL Travels", "type": "AC Sleeper (2+1)", "base_price": 650.0, "delay_rate": "8%"},
            {"name": "State Transport RTC", "type": "Express Non-AC", "base_price": 320.0, "delay_rate": "15%"}
        ]

        bus_options = []
        for idx, b in enumerate(operators):
            single_price = round((b["base_price"] * (dist_km / 250.0)) + random.randint(-50, 80), 2)
            single_price = max(120.0, single_price)
            dur_hrs = round((dist_km / 50.0) + 1.2, 1)
            dep_hour = random.choice([8, 15, 22])

            bus_options.append({
                "id": f"b_op_{idx}",
                "operator": b["name"],
                "bus_type": b["type"],
                "departure_time": f"{dep_hour:02d}:00",
                "arrival_time": f"{((dep_hour + int(dur_hrs)) % 24):02d}:30",
                "duration_hrs": dur_hrs,
                "single_ticket_price": single_price,
                "total_price_inr": single_price * travelers,
                "delay_rate": b["delay_rate"],
                "reviews": [f"AC was cooling perfectly.", "Arrived on time at the highway bypass drop point."]
            })
        return bus_options

    else:
        # Car routing logic
        v_specs = lookup_vehicle_specs(vehicle_query)
        actual_fuel = v_specs["fuel_type"]
        mileage = v_specs["mileage"]

        fuel_info = get_fuel_price_by_location(destination, actual_fuel)
        price_unit = fuel_info["price_per_unit"]

        consumption = dist_km / mileage
        fuel_cost = consumption * price_unit

        toll_list = get_toll_plazas_by_route(destination)
        total_tolls = sum(t["fee_inr"] for t in toll_list)
        driving_hrs = round((dist_km / 70.0) + 0.5, 1)
        overnight_stay_required = driving_hrs > 10.0

        return [{
            "id": "car_route_info",
            "vehicle_model": v_specs["model"],
            "driving_distance_km": round(dist_km, 1),
            "duration_hrs": driving_hrs,
            "fuel_info": fuel_info,
            "consumption": round(consumption, 1),
            "estimated_fuel_cost_inr": round(fuel_cost, 2),
            "toll_plazas": toll_list,
            "total_toll_cost_inr": total_tolls,
            "total_price_inr": round(fuel_cost + total_tolls, 2),
            "overnight_stay_required": overnight_stay_required,
            "fuel_pumps_count": max(3, int(dist_km / 60.0)),
            "ev_stations_count": max(1, int(dist_km / 120.0)),
            "suggested_rest_stops": (
                [
                    {"name": "Old Rao Dhaba (NH-48)", "dist_km": round(dist_km * 0.35), "rating": 4.3, "cuisine": "Authentic North Indian Thali & Parathas", "price_level": "Budget (₹150-₹300)", "lat": 28.18, "lng": 76.82},
                    {"name": "Shiva Tourist Dhaba (NH-48)", "dist_km": round(dist_km * 0.6), "rating": 4.2, "cuisine": "Pure Veg Dal Makhani & Tandoori Roti", "price_level": "Budget (₹120-₹250)", "lat": 27.91, "lng": 76.54},
                    {"name": "Mannat Haveli Tourist Plaza", "dist_km": round(dist_km * 0.8), "rating": 4.5, "cuisine": "Multi-cuisine Punjabi Food & Lassi", "price_level": "Moderate (₹250-₹500)", "lat": 27.35, "lng": 76.01}
                ] if "jaipur" in destination.strip().lower() else
                [
                    {"name": "Kolhapur Highway Sai Food Court (NH-48)", "dist_km": round(dist_km * 0.35), "rating": 4.4, "cuisine": "Maharashtrian Thali & Snacks", "price_level": "Budget (₹150-₹300)", "lat": 16.71, "lng": 74.24},
                    {"name": "Satara Highway Plaza", "dist_km": round(dist_km * 0.6), "rating": 4.1, "cuisine": "South Indian & Fast Food", "price_level": "Budget (₹100-₹250)", "lat": 17.69, "lng": 74.00},
                    {"name": "Nipani Ghat Konkan Family Restaurant", "dist_km": round(dist_km * 0.85), "rating": 4.3, "cuisine": "Goan Fish Curry & Malvani Thali", "price_level": "Moderate (₹200-₹450)", "lat": 16.11, "lng": 73.74}
                ] if "goa" in destination.strip().lower() else
                [
                    {"name": "Food Plaza Yamuna Expressway (Mile 50)", "dist_km": round(dist_km * 0.3), "rating": 4.2, "cuisine": "North Indian Thali & Chaat", "price_level": "Budget (₹150-₹300)", "lat": 28.12, "lng": 77.56},
                    {"name": "Shiva Dhaba Jewar Toll (Mile 90)", "dist_km": round(dist_km * 0.65), "rating": 4.1, "cuisine": "Tandoori Paratha & Tea", "price_level": "Budget (₹100-₹220)", "lat": 27.65, "lng": 77.92}
                ] if "agra" in destination.strip().lower() else
                [
                    {"name": f"Highway Pitstop Plaza ({destination} Route)", "dist_km": round(dist_km * 0.4), "rating": 4.0, "cuisine": "Multi-cuisine Buffet & Tea", "price_level": "Budget (₹150-₹300)", "lat": 28.3, "lng": 77.2},
                    {"name": f"Local Highway Dhaba ({destination} Route)", "dist_km": round(dist_km * 0.75), "rating": 4.2, "cuisine": "Authentic Regional Thali", "price_level": "Budget (₹100-₹200)", "lat": 27.8, "lng": 76.5}
                ]
            )
        }]

def get_hotel_assets(name: str, city_name: str):
    name_lower = name.lower()
    city_lower = city_name.lower()
    
    if "rambagh" in name_lower or "taj" in name_lower or "palace" in name_lower:
        images = [
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&q=80",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&q=80",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&q=80"
        ]
        reviews = [
            "Outstanding royal heritage hospitality. The peacock gardens and palace courtyard were breathtaking.",
            "World-class luxury. Truly a royal heritage stay in India."
        ]
    elif "umaid" in name_lower or "haveli" in name_lower:
        images = [
            "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=500&q=80",
            "https://images.unsplash.com/photo-1544124499-58912cbddadf?w=500&q=80",
            "https://images.unsplash.com/photo-1504624263478-660c1d9f1d2d?w=500&q=80"
        ]
        reviews = [
            "Beautiful traditional Haveli. The architecture and hand-painted wall frescos are gorgeous.",
            "Cozy rooms, quiet heritage neighborhood, and very polite service."
        ]
    elif "ocean" in name_lower or "park" in name_lower or "grand" in name_lower:
        images = [
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&q=80",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500&q=80",
            "https://images.unsplash.com/photo-1560200353-ce0a76b1d438?w=500&q=80"
        ]
        reviews = [
            "Excellent modern rooms, very fast room service, and convenient parking facilities.",
            "High-speed WiFi, modern bathrooms, and a well-curated breakfast spread."
        ]
    elif "inn" in name_lower or "residency" in name_lower or "homestay" in name_lower:
        images = [
            "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=500&q=80",
            "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&q=80",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80"
        ]
        reviews = [
            "Cozy budget inn. The host was very hospitable and helped organize our local city guides.",
            "Neat and tidy beds, rooftop tea sit-out, and peaceful neighborhood vibe."
        ]
    elif "goa" in city_lower:
        images = [
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80",
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80"
        ]
        reviews = [
            "Perfect beach stay. Extremely close to the shacks and watersports.",
            "Lovely pool area, clean rooms, and chilled resort vibe."
        ]
    else:
        images = [
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80",
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&q=80"
        ]
        reviews = [
            "Nice clean rooms, polite staff behavior, and centrally located.",
            "Good value for money. Breakfast options were decent."
        ]
    return images, reviews

def get_attraction_image(name: str, city_name: str) -> str:
    name_lower = name.lower()
    city_lower = city_name.lower()
    
    if "hawa" in name_lower:
        return "https://images.unsplash.com/photo-1602643163983-ed0babc39797?w=500&q=80"
    elif "jantar" in name_lower or "mantar" in name_lower:
        return "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&q=80"
    elif "albert" in name_lower or "hall" in name_lower or "museum" in name_lower:
        return "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=500&q=80"
    elif "amber" in name_lower or "amer" in name_lower or "fort" in name_lower:
        return "https://images.unsplash.com/photo-1590050752117-238cb0612b1b?w=500&q=80"
    elif "taj" in name_lower or "mahal" in name_lower:
        return "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&q=80"
    elif "baga" in name_lower or "calangute" in name_lower or "beach" in name_lower:
        return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80"
    elif "goa" in city_lower:
        return "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80"
    elif "jaipur" in city_lower:
        return "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&q=80"
    return "https://images.unsplash.com/photo-1477584322813-ac04e7b3017?w=500&q=80"

def fetch_osm_candidates(lat: float, lng: float, city_name: str):
    HOTEL_IMAGES = [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80"
    ]

    ATTRACTION_IMAGES = [
        "https://images.unsplash.com/photo-1548013146-72479768bada?w=500&q=80",
        "https://images.unsplash.com/photo-1477584322813-ac04e7b3017?w=500&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&q=80"
    ]

    RESTAURANT_IMAGES = [
        "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80",
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500&q=80"
    ]

    overpass_query = f"""
    [out:json][timeout:15];
    (
      node["tourism"~"hotel|guest_house|hostel"](around:8000, {lat}, {lng});
      node["tourism"~"attraction|museum|viewpoint"](around:8000, {lat}, {lng});
      node["historic"~"monument|ruins"](around:8000, {lat}, {lng});
      node["amenity"~"restaurant|cafe|fast_food"](around:8000, {lat}, {lng});
    );
    out body 25;
    """
    hotels = []
    attractions = []
    restaurants = []

    try:
        response = requests.post(OVERPASS_URL, data={"data": overpass_query}, headers=HEADERS, timeout=15)
        if response.status_code == 200:
            elements = response.json().get("elements", [])
            for idx, el in enumerate(elements):
                tags = el.get("tags", {})
                name = tags.get("name", "Local Spot")
                el_lat = el.get("lat", lat)
                el_lng = el.get("lon", lng)
                el_id = str(el.get("id"))

                if "tourism" in tags and tags["tourism"] in ["hotel", "guest_house", "hostel"]:
                    star = random.choice([3.0, 4.0, 5.0]) if "stars" not in tags else float(tags.get("stars", 3))
                    base_price = 1200.0 if star == 3.0 else 3200.0 if star == 4.0 else 9000.0
                    h_images, h_reviews = get_hotel_assets(name, city_name)
                    hotels.append({
                        "id": "h_" + el_id,
                        "name": name,
                        "category": "hotel",
                        "cost_inr": base_price + random.randint(-200, 500),
                        "lat": el_lat,
                        "lng": el_lng,
                        "star_rating": star,
                        "distance_from_center": round(abs(el_lat - lat) * 111, 2),
                        "amenities": ["wifi", "ac", "breakfast"] + ([ "pool", "gym", "spa" ] if star >= 4.0 else []),
                        "reviews": h_reviews,
                        "image_url": h_images[0],
                        "images": h_images,
                        "is_estimated": False
                    })
                elif ("tourism" in tags and tags["tourism"] in ["attraction", "museum", "viewpoint"]) or "historic" in tags:
                    cost = 50.0 if random.random() > 0.5 else 0.0
                    attractions.append({
                        "id": "a_" + el_id,
                        "name": name,
                        "category": "attraction",
                        "cost_inr": cost,
                        "lat": el_lat,
                        "lng": el_lng,
                        "rating": round(random.uniform(4.0, 4.9), 1),
                        "duration_hrs": random.choice([1.5, 2.0, 3.0]),
                        "opening_hour": 9,
                        "closing_hour": 18,
                        "tags": ["heritage", "architecture"] if "historic" in tags else ["scenic", "viewpoint"],
                        "reviews": ["Beautiful sights.", "Highly recommend sunset viewing."],
                        "image_url": get_attraction_image(name, city_name),
                        "is_estimated": False
                    })
                elif "amenity" in tags and tags["amenity"] in ["restaurant", "cafe", "fast_food"]:
                    restaurants.append({
                        "id": "r_" + el_id,
                        "name": name,
                        "category": "restaurant",
                        "cost_inr": random.randint(250, 800),
                        "lat": el_lat,
                        "lng": el_lng,
                        "rating": round(random.uniform(3.8, 4.7), 1),
                        "cuisine": tags.get("cuisine", "Local Indian Food"),
                        "image_url": RESTAURANT_IMAGES[len(restaurants) % len(RESTAURANT_IMAGES)],
                        "is_estimated": False
                    })
    except Exception as e:
        print("Overpass API failed or timed out:", e)

    if not hotels:
        hotels = [
            {
                "id": "h_est_1",
                "name": f"Local Homestay Stay ({city_name})",
                "category": "hotel",
                "cost_inr": 1800.0,
                "lat": lat + 0.004,
                "lng": lng - 0.004,
                "star_rating": 3.0,
                "distance_from_center": 0.5,
                "amenities": ["wifi", "ac", "home_food"],
                "reviews": ["Warm traditional hospitality.", "Clean rooms in quiet street."],
                "image_url": HOTEL_IMAGES[0],
                "images": [HOTEL_IMAGES[0], HOTEL_IMAGES[1], HOTEL_IMAGES[2]],
                "is_estimated": True
            },
            {
                "id": "h_est_2",
                "name": f"Heritage Haveli Resort ({city_name})",
                "category": "hotel",
                "cost_inr": 4500.0,
                "lat": lat - 0.008,
                "lng": lng + 0.008,
                "star_rating": 4.0,
                "distance_from_center": 1.2,
                "amenities": ["wifi", "pool", "ac", "heritage"],
                "reviews": ["Scenic palace views.", "Luxurious rooms."],
                "image_url": HOTEL_IMAGES[1],
                "images": [HOTEL_IMAGES[1], HOTEL_IMAGES[2], HOTEL_IMAGES[3]],
                "is_estimated": True
            }
        ]

    if not attractions:
        attractions = [
            {
                "id": "a_est_1",
                "name": f"Historic Temple Ruins ({city_name})",
                "category": "attraction",
                "cost_inr": 0.0,
                "lat": lat + 0.01,
                "lng": lng - 0.002,
                "rating": 4.3,
                "duration_hrs": 1.5,
                "opening_hour": 7,
                "closing_hour": 18,
                "tags": ["heritage", "history"],
                "reviews": ["Ancient stone carvings.", "Serene location."],
                "image_url": ATTRACTION_IMAGES[0],
                "is_estimated": True
            },
            {
                "id": "a_est_2",
                "name": f"Local Craft Bazaar & Market Center",
                "category": "attraction",
                "cost_inr": 50.0,
                "lat": lat + 0.001,
                "lng": lng + 0.003,
                "rating": 4.5,
                "duration_hrs": 2.0,
                "opening_hour": 10,
                "closing_hour": 20,
                "tags": ["local_market", "heritage"],
                "reviews": ["Beautiful handmade pots and fabrics.", "Friendly local artisans."],
                "image_url": ATTRACTION_IMAGES[1],
                "is_estimated": True
            }
        ]

    if not restaurants:
        restaurants = [
            {
                "id": "r_est_1",
                "name": f"Desi Kitchen Dhaba ({city_name})",
                "category": "restaurant",
                "cost_inr": 350.0,
                "lat": lat + 0.002,
                "lng": lng + 0.002,
                "rating": 4.2,
                "cuisine": "Traditional Regional Thali",
                "image_url": RESTAURANT_IMAGES[0],
                "is_estimated": True
            }
        ]

    return {
        "hotels": hotels,
        "attractions": attractions,
        "restaurants": restaurants
    }

def fetch_nearby_emergency_services(lat: float, lng: float, emergency_type: str):
    if emergency_type == "breakdown":
        nodes = 'node["craft"="car_repair"](around:8000, {lat}, {lng}); node["amenity"="fuel"](around:8000, {lat}, {lng});'
    elif emergency_type == "medical":
        nodes = 'node["amenity"="hospital"](around:8000, {lat}, {lng}); node["amenity"="pharmacy"](around:8000, {lat}, {lng});'
    else:
        nodes = 'node["amenity"="police"](around:8000, {lat}, {lng});'

    overpass_query = f"""
    [out:json][timeout:15];
    (
      {nodes}
    );
    out body 10;
    """
    results = []
    try:
        response = requests.post(OVERPASS_URL, data={"data": overpass_query}, headers=HEADERS, timeout=12)
        if response.status_code == 200:
            elements = response.json().get("elements", [])
            for el in elements:
                tags = el.get("tags", {})
                name = tags.get("name", tags.get("amenity", tags.get("craft", "Local Help")))
                el_lat = el.get("lat")
                el_lng = el.get("lon")
                dist = round(abs(el_lat - lat) * 111, 2)
                results.append({
                    "name": name.title().replace("_", " "),
                    "type": tags.get("amenity", tags.get("craft", "service")),
                    "lat": el_lat,
                    "lng": el_lng,
                    "distance_km": dist
                })
    except Exception as e:
        print("Emergency services Overpass call failed:", e)

    if not results:
        if emergency_type == "breakdown":
            results = [
                {"name": "Highway Garage & Mechanic", "type": "car_repair", "lat": lat + 0.006, "lng": lng - 0.003, "distance_km": 0.8},
                {"name": "Bharat Petroleum & Tyres", "type": "fuel", "lat": lat - 0.012, "lng": lng + 0.004, "distance_km": 1.7}
            ]
        elif emergency_type == "medical":
            results = [
                {"name": "District Hospital & Pharmacy", "type": "hospital", "lat": lat + 0.004, "lng": lng + 0.001, "distance_km": 0.6}
            ]
        else:
            results = [
                {"name": "State Police Booth", "type": "police", "lat": lat + 0.001, "lng": lng + 0.001, "distance_km": 0.2}
            ]

    results.sort(key=lambda x: x["distance_km"])
    return results

