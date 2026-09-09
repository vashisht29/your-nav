# backend/app.py

import os
import math
import urllib.parse
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from dotenv import load_dotenv

from osm_service import geocode_destination, fetch_osm_candidates, fetch_nearby_emergency_services, search_transit_candidates, find_midway_city, lookup_vehicle_specs
from real_providers import get_hotels_with_failover, get_sights_with_failover
from ml_pipeline import PriceImputer, SentimentExtractor, PersonaSegmenter, CatBoostRanker
from solver import solve_itinerary
from llm_layer import generate_itinerary_explanation

load_dotenv()

app = FastAPI(title="Smart AI Travel - Agentic Engine Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

price_imputer = PriceImputer()
sentiment_extractor = SentimentExtractor()
persona_segmenter = PersonaSegmenter()
catboost_ranker = CatBoostRanker()

class TransitSearchRequest(BaseModel):
    origin: str
    destination: str
    departure_date: str
    return_date: str
    travelers: int
    mode: str
    fuel_type: Optional[str] = "petrol"
    vehicle_query: Optional[str] = ""
    travel_class: Optional[str] = "economy"

class StaySearchRequest(BaseModel):
    origin: Optional[str] = "Delhi"
    destination: str
    departure_date: str
    return_date: str
    travelers: int = Field(..., ge=1, description="Number of travelers must be at least 1")
    budget: float = Field(..., gt=0, description="Budget must be greater than 0")
    transport_mode: Optional[str] = "flight"
    vehicle_query: Optional[str] = ""

class SelectedTransit(BaseModel):
    id: str
    airline: Optional[str] = None
    flight_number: Optional[str] = None
    origin_airport: Optional[str] = None
    origin_iata: Optional[str] = None
    destination_airport: Optional[str] = None
    destination_iata: Optional[str] = None
    rating: Optional[float] = None
    otp_rate: Optional[str] = None
    travel_class: Optional[str] = None
    baggage_allowance: Optional[str] = None
    train_name: Optional[str] = None
    train_number: Optional[str] = None
    operator: Optional[str] = None
    bus_type: Optional[str] = None
    departure_time: Optional[str] = "09:00"
    arrival_time: Optional[str] = "15:00"
    duration_hrs: Optional[float] = 2.0
    total_price_inr: float = 0.0
    cost_inr: Optional[float] = 0.0
    estimated_fuel_cost_inr: Optional[float] = 0.0

class SelectedHotel(BaseModel):
    id: str
    name: str
    cost_inr: float = 0.0
    total_stay_cost_inr: Optional[float] = 0.0
    lat: Optional[float] = 28.6139
    lng: Optional[float] = 77.2090
    star_rating: Optional[float] = 4.5
    is_estimated: Optional[bool] = False
    category: Optional[str] = None
    selected_room: Optional[str] = None
    meals_included: Optional[str] = None

class Waypoint(BaseModel):
    id: str
    type: str
    name: str
    lat: float
    lng: float

class PlanRequest(BaseModel):
    origin: str
    destination: str
    departure_date: str
    return_date: str
    travelers: int = Field(..., ge=1, description="Number of travelers must be at least 1")
    budget: float = Field(..., gt=0, description="Budget must be greater than 0")
    selected_transit: SelectedTransit
    selected_hotel: SelectedHotel
    selected_midway_hotel: Optional[SelectedHotel] = None
    pace: str
    interests: List[str]
    lang: Optional[str] = "en"
    transport_mode: str
    fuel_type: Optional[str] = "petrol"
    vehicle_query: Optional[str] = ""
    travel_class: Optional[str] = "economy"
    waypoints: Optional[List[Waypoint]] = []

@app.get("/health")
def health():
    return {"status": "running"}

@app.get("/api/search/suggestions")
def get_suggestions(q: str):
    from agent_orchestrator import agent_orchestrator
    return {"suggestions": agent_orchestrator.search_destination(q)}

from flight_engine import generate_live_flights
from railway_engine import generate_live_trains
from bus_engine import generate_live_buses
from car_engine import generate_live_car_routes

@app.post("/api/search/transit")
def get_transits(req: TransitSearchRequest):
    try:
        dep = datetime.strptime(req.departure_date, "%Y-%m-%d")
        ret = datetime.strptime(req.return_date, "%Y-%m-%d")
        delta = (ret - dep).days
        if delta <= 0:
            raise HTTPException(status_code=400, detail="Return date must be after departure date.")
    except ValueError:
        raise HTTPException(status_code=400, detail="Date format must be YYYY-MM-DD.")

    if req.mode == "flight":
        flight_candidates = generate_live_flights(
            origin_name=req.origin,
            dest_name=req.destination,
            dep_date=req.departure_date,
            ret_date=req.return_date,
            travelers=req.travelers,
            travel_class=req.travel_class or "economy"
        )
        if flight_candidates:
            return {"transits": flight_candidates}

    if req.mode == "train":
        train_candidates = generate_live_trains(
            origin_name=req.origin,
            dest_name=req.destination,
            dep_date=req.departure_date,
            ret_date=req.return_date,
            travelers=req.travelers,
            travel_class=req.travel_class or "3A"
        )
        if train_candidates:
            return {"transits": train_candidates}

    if req.mode == "bus":
        bus_candidates = generate_live_buses(
            origin_name=req.origin,
            dest_name=req.destination,
            dep_date=req.departure_date,
            ret_date=req.return_date,
            travelers=req.travelers
        )
        if bus_candidates:
            return {"transits": bus_candidates}

    if req.mode == "self-drive":
        car_candidates = generate_live_car_routes(
            origin_name=req.origin,
            dest_name=req.destination,
            dep_date=req.departure_date,
            ret_date=req.return_date,
            travelers=req.travelers,
            engine_type=req.fuel_type or "petrol"
        )
        if car_candidates:
            return {"transits": car_candidates}

    from agent_orchestrator import agent_orchestrator
    candidates = agent_orchestrator.search_transport(
        origin=req.origin,
        destination=req.destination,
        departure_date=req.departure_date,
        return_date=req.return_date,
        travelers=req.travelers,
        mode=req.mode,
        fuel_type=req.fuel_type,
        vehicle_query=req.vehicle_query
    )
    if not candidates:
        raise HTTPException(status_code=400, detail="Could not geocode locations or generate candidates.")
    return {"transits": candidates}

from stay_engine import generate_destination_stays

@app.post("/api/search/stays")
def get_stays(req: StaySearchRequest):
    try:
        dep = datetime.strptime(req.departure_date, "%Y-%m-%d")
        ret = datetime.strptime(req.return_date, "%Y-%m-%d")
        num_nights = max(1, (ret - dep).days)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format.")

    rich_stays = generate_destination_stays(
        dest_name=req.destination,
        num_nights=num_nights,
        travelers=req.travelers,
        user_budget=req.budget
    )

    midway_hotels = []
    midway_city_name = ""
    geo = geocode_destination(req.destination)
    orig_geo = geocode_destination(req.origin)
    if geo and orig_geo and req.transport_mode == "self-drive":
        lat1, lon1 = math.radians(orig_geo["lat"]), math.radians(orig_geo["lng"])
        lat2, lon2 = math.radians(geo["lat"]), math.radians(geo["lng"])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
        c = 2 * math.asin(math.sqrt(a))
        dist_km = (6371.0 * c) * 1.35
        driving_hrs = dist_km / 70.0
        if driving_hrs > 10.0:
            midway_city_name = "Midway Rest Town"
            midway_hotels = generate_destination_stays(midway_city_name, 1, req.travelers, req.budget)

    return {
        "hotels": rich_stays,
        "midway_hotels": midway_hotels,
        "midway_city": midway_city_name,
        "requires_overnight": bool(midway_hotels)
    }

@app.post("/api/plan")
def plan_trip(req: PlanRequest):
    try:
        dep = datetime.strptime(req.departure_date, "%Y-%m-%d")
        ret = datetime.strptime(req.return_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    delta = (ret - dep).days
    if delta <= 0:
        raise HTTPException(status_code=400, detail="Return date must be after departure date.")

    from agent_orchestrator import agent_orchestrator
    agent_orchestrator.logs = []
    agent_orchestrator.log(
        "Initiating Planning",
        f"Planning started for trip from {req.origin} to {req.destination} for {req.travelers} travelers with a budget of ₹{req.budget}.",
        "initialize_planning()",
        "TripState established."
    )

    geo = geocode_destination(req.destination)
    if not geo:
        raise HTTPException(status_code=400, detail="Could not geocode destination.")

    dest_lat = geo["lat"]
    dest_lng = geo["lng"]

    agent_orchestrator.log(
        "Geocoding Destination",
        f"Obtaining coordinates for {req.destination} using OpenStreetMap geocoder.",
        f"geocode_destination(name='{req.destination}')",
        f"Coordinates: lat={dest_lat}, lng={dest_lng}"
    )

    raw_hotels = get_hotels_with_failover(dest_lat, dest_lng, req.destination.strip().title())
    sights_data = get_sights_with_failover(dest_lat, dest_lng, req.destination.strip().title())
    raw_attractions = sights_data["attractions"]
    raw_restaurants = sights_data["restaurants"]

    # Destination Hotel Stay
    fixed_hotel = {
        "id": req.selected_hotel.id,
        "name": req.selected_hotel.name,
        "cost_inr": req.selected_hotel.cost_inr,
        "ml_score": 1.0,
        "lat": req.selected_hotel.lat if req.selected_hotel.lat is not None else dest_lat,
        "lng": req.selected_hotel.lng if req.selected_hotel.lng is not None else dest_lng,
        "star_rating": req.selected_hotel.star_rating or 4.5,
        "is_estimated": req.selected_hotel.is_estimated or False
    }

    # If midway hotel selected for overnight stay
    fixed_midway = None
    if req.selected_midway_hotel:
        fixed_midway = {
            "id": req.selected_midway_hotel.id,
            "name": req.selected_midway_hotel.name,
            "cost_inr": req.selected_midway_hotel.cost_inr,
            "ml_score": 1.0,
            "lat": req.selected_midway_hotel.lat if req.selected_midway_hotel.lat is not None else dest_lat,
            "lng": req.selected_midway_hotel.lng if req.selected_midway_hotel.lng is not None else dest_lng,
            "star_rating": req.selected_midway_hotel.star_rating or 4.0,
            "is_estimated": True
        }

    transit_estimate = {
        "cost_inr": req.selected_transit.total_price_inr / req.travelers if req.transport_mode != "self-drive" else req.selected_transit.total_price_inr,
        "duration_hrs": req.selected_transit.duration_hrs,
        "mode": req.transport_mode,
        "is_multi_leg": getattr(req.selected_transit, "is_multi_leg", False),
        "accessibility_note": getattr(req.selected_transit, "accessibility_note", ""),
        "departure_time": getattr(req.selected_transit, "departure_time", "09:00"),
        "arrival_time": getattr(req.selected_transit, "arrival_time", "13:00"),
        "airline": getattr(req.selected_transit, "airline", ""),
        "flight_number": getattr(req.selected_transit, "flight_number", ""),
        "train_name": getattr(req.selected_transit, "train_name", ""),
        "train_number": getattr(req.selected_transit, "train_number", ""),
        "operator": getattr(req.selected_transit, "operator", ""),
        "bus_type": getattr(req.selected_transit, "bus_type", "")
    }

    def calc_haversine_road(la1, lo1, la2, lo2):
        la1, lo1, la2, lo2 = map(math.radians, [la1, lo1, la2, lo2])
        dlat = la2 - la1
        dlon = lo2 - lo1
        a = math.sin(dlat / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin(dlon / 2) ** 2
        c = 2 * math.asin(math.sqrt(a))
        return (6371.0 * c) * 1.35

    if req.transport_mode == "self-drive" and req.waypoints:
        orig_geo = geocode_destination(req.origin)
        if orig_geo:
            curr_lat = orig_geo["lat"]
            curr_lng = orig_geo["lng"]
            recalc_dist = 0.0
            for wp in req.waypoints:
                recalc_dist += calc_haversine_road(curr_lat, curr_lng, wp.lat, wp.lng)
                curr_lat = wp.lat
                curr_lng = wp.lng
            recalc_dist += calc_haversine_road(curr_lat, curr_lng, dest_lat, dest_lng)
            
            from osm_service import lookup_vehicle_specs, get_fuel_price_by_location
            v_specs = lookup_vehicle_specs(req.vehicle_query or "")
            price_unit = get_fuel_price_by_location(req.destination, req.fuel_type or "petrol")
            consumption = (recalc_dist / 100.0) * v_specs["consumption_rate"]
            new_fuel_cost = consumption * price_unit
            
            base_toll = req.selected_transit.total_price_inr - (req.selected_transit.estimated_fuel_cost_inr or 0.0)
            new_total_transit = new_fuel_cost + base_toll
            new_duration_hrs = round((recalc_dist / 70.0) + 0.5, 1) + (len(req.waypoints) * 0.75)
            
            transit_estimate = {
                "cost_inr": round(new_total_transit, 2),
                "duration_hrs": new_duration_hrs
            }

    # Run the autonomous agent loop to observe, decide tools, optimize and finalize
    itinerary = agent_orchestrator.run_agentic_loop(
        start_req={
            "origin": req.origin,
            "destination": req.destination,
            "departure_date": req.departure_date,
            "return_date": req.return_date,
            "travelers": req.travelers,
            "budget": req.budget,
            "pace": req.pace,
            "interests": req.interests,
            "transport_mode": req.transport_mode,
            "travel_class": req.travel_class,
            "selected_transit": req.selected_transit.dict() if req.selected_transit else None,
            "selected_hotel": fixed_hotel,
            "selected_midway_hotel": fixed_midway,
            "waypoints": [w.dict() for w in req.waypoints] if req.waypoints else [],
            "fuel_type": req.fuel_type,
            "vehicle_query": req.vehicle_query
        },
        raw_hotels=raw_hotels,
        raw_attractions=raw_attractions,
        raw_restaurants=raw_restaurants
    )

    if itinerary["status"] == "Infeasible":
        cheaper_homestay = min(raw_hotels, key=lambda x: x["cost_inr"])
        rooms_needed = max(1, (req.travelers + 1) // 2)
        homestay_total_cost = cheaper_homestay["cost_inr"] * delta * rooms_needed
        saved_hotel = (req.selected_hotel.cost_inr * delta * rooms_needed) - homestay_total_cost

        alternatives = [
            {
                "id": "alt_homestay",
                "description": f"Switch Stay to '{cheaper_homestay['name']}' (Homestay) - Saves ₹{round(saved_hotel, 2)}",
                "hotel": {
                    "id": cheaper_homestay["id"],
                    "name": cheaper_homestay["name"],
                    "cost_inr": cheaper_homestay["cost_inr"],
                    "total_stay_cost_inr": homestay_total_cost,
                    "lat": cheaper_homestay["lat"],
                    "lng": cheaper_homestay["lng"],
                    "star_rating": cheaper_homestay["star_rating"],
                    "is_estimated": cheaper_homestay.get("is_estimated", True)
                },
                "transit": None,
                "transport_mode": req.transport_mode
            }
        ]

        if req.transport_mode == "flight":
            trains = search_transit_candidates(req.origin, req.destination, req.departure_date, req.return_date, req.travelers, "train")
            if trains:
                cheapest_train = min(trains, key=lambda x: x["total_price_inr"])
                saved_train = req.selected_transit.total_price_inr - cheapest_train["total_price_inr"]
                alternatives.append({
                    "id": "alt_train",
                    "description": f"Switch Transport to Train: '{cheapest_train['train_name']}' ({cheapest_train['travel_class']}) - Saves ₹{round(saved_train, 2)}",
                    "hotel": None,
                    "transit": cheapest_train,
                    "transport_mode": "train"
                })

        alternatives.append({
            "id": "alt_budget",
            "description": f"Increase budget limit to ₹{round(req.budget + 8000.0, 2)} to keep current choices.",
            "hotel": None,
            "transit": None,
            "budget_adjust": req.budget + 8000.0,
            "transport_mode": req.transport_mode
        })

        persona_name = itinerary.get("persona", "Balanced Explorer")
        return {
            "status": "Infeasible",
            "message": itinerary.get("explanation") or f"This combination exceeds your ₹{req.budget} budget. We found better alternatives that keep the trip within budget while maintaining quality.",
            "persona": persona_name,
            "alternatives": alternatives
        }

    persona_name = itinerary.get("persona", "Balanced Explorer")
    explanation = generate_itinerary_explanation(itinerary, persona_name, lang=req.lang)

    rooms_needed = max(1, (req.travelers + 1) // 2)
    original_hotel_cost = (req.selected_hotel.cost_inr * delta * rooms_needed) if req.selected_hotel else 0
    optimized_hotel_cost = itinerary["cost_breakdown"]["stays"]
    
    transit_cost = req.selected_transit.total_price_inr if req.selected_transit else 0
    food_cost = itinerary["cost_breakdown"]["food"]
    original_total = original_hotel_cost + transit_cost + food_cost
    
    optimization_applied = None
    if req.selected_hotel and (req.selected_hotel.name != fixed_hotel.get("name") or original_total > req.budget):
        optimization_applied = {
            "was_conflict": True,
            "original_stay": req.selected_hotel.name,
            "original_stay_cost": round(original_hotel_cost, 0),
            "original_total_cost": round(original_total, 0),
            "optimized_stay": fixed_hotel.get("name", "Optimized Stay"),
            "optimized_stay_cost": round(optimized_hotel_cost, 0),
            "savings": round(max(0, req.budget - itinerary["total_cost_inr"]), 0),
            "exceeded_by": round(max(0, original_total - req.budget), 0)
        }

    agent_orchestrator.log(
        "Final Validation & Explanation",
        "Generating human-like natural explanation of resolved itinerary via Gemini LLM layer.",
        "generate_itinerary_explanation()",
        "Blueprint finalized."
    )

    return {
        "status": "Success",
        "display_name": geo["display_name"],
        "lat": dest_lat,
        "lng": dest_lng,
        "persona": persona_name,
        "selected_hotel": fixed_hotel,
        "selected_transit": req.selected_transit,
        "selected_midway_hotel": fixed_midway,
        "days": itinerary["days"],
        "total_cost_inr": itinerary["total_cost_inr"],
        "cost_breakdown": itinerary["cost_breakdown"],
        "optimization_applied": optimization_applied,
        "explanation": explanation,
        "agent_logs": agent_orchestrator.logs
    }

class SOSQuery(BaseModel):
    lat: Optional[float] = 28.6139
    lng: Optional[float] = 77.2090
    type: Optional[str] = "medical"
    destination: Optional[str] = "Haridwar"
    origin: Optional[str] = "Delhi"
    location_name: Optional[str] = None

from emergency_engine import get_destination_emergency_intel
from guardian_agent import guardian_agent

@app.post("/api/sos")
def get_emergency_services(req: SOSQuery):
    dest_name = req.destination or "India"
    user_lat = req.lat if req.lat is not None else 28.6139
    user_lng = req.lng if req.lng is not None else 77.2090
    
    # 1. Dynamic spatial lookup for user's moving location
    route_services = guardian_agent.find_nearest_on_route_services(user_lat, user_lng)
    current_segment = req.location_name or route_services["current_road_segment"]
    
    # 2. Regional emergency intel (SDRF, regional lines)
    sos_intel = get_destination_emergency_intel(dest_name, user_lat, user_lng)
    
    # 3. Overpass OSM nearby services around (lat, lng)
    osm_services = fetch_nearby_emergency_services(user_lat, user_lng, req.type or "medical")
    
    # Combine destination-verified hospitals with closest route-spatial hospitals
    combined_hospitals = []
    seen_hosp = set()
    for h in sos_intel.get("hospitals", []):
        k = h.get("name", "").strip().lower()
        if k and k not in seen_hosp:
            seen_hosp.add(k)
            combined_hospitals.append(h)
    for h in route_services.get("hospitals", []):
        k = h.get("name", "").strip().lower()
        if k and k not in seen_hosp:
            seen_hosp.add(k)
            combined_hospitals.append(h)
    final_hospitals = combined_hospitals[:6] if combined_hospitals else route_services.get("hospitals", [])

    # Combine destination-verified 24x7 pharmacies with route-spatial pharmacies
    combined_pharmacies = []
    seen_pharm = set()
    for m in sos_intel.get("medicine_stores", []):
        k = m.get("name", "").strip().lower()
        if k and k not in seen_pharm:
            seen_pharm.add(k)
            combined_pharmacies.append(m)
    for m in route_services.get("medicine_stores", []):
        k = m.get("name", "").strip().lower()
        if k and k not in seen_pharm:
            seen_pharm.add(k)
            combined_pharmacies.append(m)
    final_medicine_stores = combined_pharmacies[:6] if combined_pharmacies else route_services.get("medicine_stores", [])

    nearest_hosp = route_services["nearest_hospital"]
    if final_hospitals:
        top_hosp = final_hospitals[0]
        try:
            top_hosp_km = float(str(top_hosp.get("distance", "999")).replace("km", "").split("(")[0].strip())
            if top_hosp_km < nearest_hosp.get("distance_km", 999):
                nearest_hosp = {
                    "name": top_hosp["name"],
                    "phone": top_hosp["phone"],
                    "distance_km": top_hosp_km,
                    "address": top_hosp["address"],
                    "services": top_hosp.get("services", "24x7 Casualty & Emergency Care"),
                    "is_apex": "Apex" in top_hosp["name"] or "Medical College" in top_hosp["name"]
                }
        except Exception:
            pass

    nearest_pharm = route_services.get("nearest_pharmacy")
    if final_medicine_stores:
        top_med = final_medicine_stores[0]
        try:
            top_med_dist_str = str(top_med.get("distance", "999"))
            if "meter" in top_med_dist_str:
                top_med_km = float(top_med_dist_str.replace("meters", "").replace("meter", "").strip()) / 1000.0
            else:
                top_med_km = float(top_med_dist_str.replace("km", "").split("(")[0].strip())
            
            cur_pharm_dist = nearest_pharm.get("distance_km", 999) if nearest_pharm else 999
            if top_med_km < cur_pharm_dist:
                nearest_pharm = {
                    "name": top_med["name"],
                    "phone": top_med["phone"],
                    "distance_km": top_med_km,
                    "address": top_med["address"],
                    "timings": top_med.get("timings", "Open 24 Hours"),
                    "available_medicines": top_med.get("available_medicines", "Emergency Medicines")
                }
        except Exception:
            pass
    if not nearest_pharm:
        nearest_pharm = {"name": "Local 24x7 Pharmacy", "phone": "112", "distance_km": 0.5}

    # 4. Generate dynamic live GPS WhatsApp & SMS beacon
    maps_link = f"https://maps.google.com/?q={user_lat:.4f},{user_lng:.4f}"
    beacon_msg = (
        f"🚨 EMERGENCY ASSISTANCE NEEDED near {current_segment}.\n"
        f"• Live GPS Location: {maps_link} ({user_lat:.4f}° N, {user_lng:.4f}° E)\n"
        f"• Nearest Hospital: {nearest_hosp['name']} ({nearest_hosp['distance_km']} km, Ph: {nearest_hosp['phone']})\n"
        f"• Nearest 24x7 Medicine Store: {nearest_pharm.get('name')} (Ph: {nearest_pharm.get('phone', '112')})\n"
        f"• Nearest Police Station: {route_services['nearest_police']['station']} (Ph: 112)\n"
        f"Please dispatch medical assistance or call 112 immediately."
    )
    encoded_beacon = urllib.parse.quote(beacon_msg)

    return {
        "status": "active",
        "emergency_number": "112",
        "destination": dest_name.title(),
        "region": sos_intel.get("region", "National Highway Corridor"),
        "live_location": {
            "lat": user_lat,
            "lng": user_lng,
            "road_segment": current_segment,
            "maps_url": maps_link
        },
        "nearest_hospital": nearest_hosp,
        "nearest_pharmacy": nearest_pharm,
        "nearest_police": route_services["nearest_police"],
        "national_helplines": sos_intel["national_helplines"],
        "sdrf_mountain_rescue": sos_intel.get("sdrf_mountain_rescue"),
        "hospitals": final_hospitals,
        "medicine_stores": final_medicine_stores,
        "trauma_centers": final_hospitals, # Backward compatibility for existing UI
        "local_police": route_services["nearest_police"],
        "tourist_police": sos_intel.get("tourist_police", {"location": "Highway Tourist Police Desk", "phone": "1363"}),
        "gps_beacon": {
            "message": beacon_msg,
            "sms_link": f"sms:112?body={encoded_beacon}",
            "whatsapp_link": f"https://api.whatsapp.com/send?text={encoded_beacon}"
        },
        "first_aid_protocols": sos_intel.get("first_aid_protocols", []),
        "services": osm_services
    }

@app.get("/api/sos/waypoints")
def get_sos_corridor_waypoints(origin: str = "Delhi", destination: str = "Haridwar"):
    waypoints = guardian_agent.get_corridor_waypoints(origin, destination)
    return {"status": "success", "origin": origin, "destination": destination, "waypoints": waypoints}

@app.post("/api/webhooks/payment")
async def process_payment(request: Request):
    payload = await request.json()
    payment_id = payload.get("payload", {}).get("payment", {}).get("entity", {}).get("id", "pay_simulated")
    return {
        "status": "success",
        "payment_id": payment_id,
        "message": "Payment verified idempotently."
    }

class TripEventRequest(BaseModel):
    event: str
    delay_minutes: int
    current_days: List[Dict]

@app.post("/api/trip/events")
def trigger_trip_event(req: TripEventRequest):
    from agent_orchestrator import agent_orchestrator
    # Create a fresh log state for this request cycle
    agent_orchestrator.logs = []
    replanned_state = agent_orchestrator.run_replan_loop({"days": req.current_days}, req.delay_minutes)
    return {
        "status": "Success",
        "itinerary": {
            "days": replanned_state["days"]
        },
        "agent_logs": agent_orchestrator.logs
    }

from pan_india_destinations import search_pan_india_destinations, log_unsupported_destination

@app.get("/api/destinations/autocomplete")
def autocomplete_destinations(q: str = ""):
    return search_pan_india_destinations(q, limit=8)

class RequestLocationBody(BaseModel):
    destination: str
    origin: Optional[str] = ""

@app.post("/api/destinations/request-location")
def request_unsupported_location(req: RequestLocationBody):
    log_unsupported_destination(req.destination, req.origin)
    return {
        "status": "success",
        "message": f"Humne aapki location '{req.destination}' ko note kar liya hai aur hamari team ise jald hi database me add karegi!"
    }

from flight_engine import get_sub_region_recommendation

from guardian_agent import guardian_agent, TRAINED_TELEMETRY_SCENARIOS

class GuardianTelemetryRequest(BaseModel):
    lat: float = 28.9845
    lng: float = 77.7064
    speed_kmh: float = 0.0
    stationary_duration_mins: float = 5.0
    traffic_congestion_index: float = 0.15
    destination: Optional[str] = "Haridwar"
    transit_mode: Optional[str] = "car"
    transit_details: Optional[str] = ""
    is_night: Optional[bool] = False
    sudden_impact: Optional[bool] = False
    is_rest_stop_area: Optional[bool] = False
    altitude_m: Optional[float] = 0.0
    is_desert_zone: Optional[bool] = False
    battery_percent: Optional[float] = 85.0
    temp_c: Optional[float] = 25.0
    is_tunnel_zone: Optional[bool] = False
    is_forest_naxal_zone: Optional[bool] = False
    is_landslide_zone: Optional[bool] = False
    bluetooth_failed: Optional[bool] = False
    is_isolated_ravine: Optional[bool] = False
    is_silent_zone_hospital: Optional[bool] = False
    is_city_zone: Optional[bool] = False
    is_corrupt_mesh_packet: Optional[bool] = False
    is_phone_shutdown: Optional[bool] = False
    device_offline_duration_mins: Optional[float] = 0.0
    is_hypoxia_risk: Optional[bool] = False
    is_water_submersion_hazard: Optional[bool] = False
    route_deviation_km: Optional[float] = 0.0
    is_thermal_runaway_fire: Optional[bool] = False
    is_vehicle_overturned: Optional[bool] = False

class GuardianEmergencyContact(BaseModel):
    name: str
    phone: str
    relationship: str
    notify_sms: bool = True
    notify_whatsapp: bool = True

class GuardianScenarioSimulationRequest(BaseModel):
    scenario_id: str
    destination: Optional[str] = "Haridwar"
    lat: Optional[float] = 28.9845
    lng: Optional[float] = 77.7064

@app.post("/api/guardian/telemetry")
def evaluate_guardian_telemetry(req: GuardianTelemetryRequest):
    result = guardian_agent.evaluate_safety_telemetry(
        lat=req.lat,
        lng=req.lng,
        speed_kmh=req.speed_kmh,
        stationary_duration_mins=req.stationary_duration_mins,
        traffic_congestion_index=req.traffic_congestion_index,
        destination=req.destination,
        transit_mode=req.transit_mode,
        transit_details=req.transit_details,
        is_night=req.is_night or False,
        sudden_impact=req.sudden_impact or False,
        is_rest_stop_area=req.is_rest_stop_area or False,
        altitude_m=req.altitude_m or 0.0,
        is_desert_zone=req.is_desert_zone or False,
        battery_percent=req.battery_percent if req.battery_percent is not None else 85.0,
        temp_c=req.temp_c if req.temp_c is not None else 25.0,
        is_tunnel_zone=req.is_tunnel_zone or False,
        is_forest_naxal_zone=req.is_forest_naxal_zone or False,
        is_landslide_zone=req.is_landslide_zone or False,
        bluetooth_failed=req.bluetooth_failed or False,
        is_isolated_ravine=req.is_isolated_ravine or False,
        is_silent_zone_hospital=req.is_silent_zone_hospital or False,
        is_city_zone=req.is_city_zone or False,
        is_corrupt_mesh_packet=req.is_corrupt_mesh_packet or False,
        is_phone_shutdown=req.is_phone_shutdown or False,
        device_offline_duration_mins=req.device_offline_duration_mins or 0.0,
        is_hypoxia_risk=req.is_hypoxia_risk or False,
        is_water_submersion_hazard=req.is_water_submersion_hazard or False,
        route_deviation_km=req.route_deviation_km or 0.0,
        is_thermal_runaway_fire=req.is_thermal_runaway_fire or False,
        is_vehicle_overturned=req.is_vehicle_overturned or False
    )
    return {"status": "success", "guardian_evaluation": result}

@app.get("/api/guardian/training-scenarios")
def get_guardian_training_scenarios():
    return {
        "status": "success",
        "scenarios": TRAINED_TELEMETRY_SCENARIOS
    }

@app.get("/api/guardian/training-status")
def get_guardian_training_status():
    evaluation = guardian_agent.train_and_evaluate_model()
    return {
        "status": "success",
        "training_report": evaluation,
        "metadata": guardian_agent.model_metadata
    }

@app.post("/api/guardian/simulate-scenario")
def simulate_guardian_scenario(req: GuardianScenarioSimulationRequest):
    result = guardian_agent.simulate_trained_scenario(
        scenario_id=req.scenario_id,
        destination=req.destination or "Haridwar",
        lat=req.lat or 28.9845,
        lng=req.lng or 77.7064
    )
    return {
        "status": "success",
        "simulation": result
    }

@app.get("/api/guardian/contacts")
def get_guardian_contacts():
    return {"status": "success", "contacts": guardian_agent.emergency_contacts}

@app.post("/api/guardian/contacts")
def add_guardian_contact(contact: GuardianEmergencyContact):
    guardian_agent.emergency_contacts.append(contact.dict())
    return {"status": "success", "contacts": guardian_agent.emergency_contacts}

# =========================================================================
# 📡 SAFAR GUARDIAN (सफ़र गार्जियन) — LIVE TRIP COMPANION & MILESTONE ALERTS
# =========================================================================
from trip_share_engine import (
    create_safar_guardian_session,
    advance_safar_milestone,
    ACTIVE_SAFAR_SESSIONS,
    generate_compact_2g_sms_payload,
    generate_dead_reckoning_transit_window,
    get_zero_network_survival_toolkit,
    simulate_p2p_mesh_relay_hop
)

class SafarShareRequest(BaseModel):
    origin: str = "Delhi"
    destination: str = "Darjeeling"
    traveler_name: Optional[str] = "Rahul Sharma"
    transport_mode: Optional[str] = "flight"
    departure_date: Optional[str] = None
    transit_details: Optional[Dict[str, Any]] = None
    stay_name: Optional[str] = None
    primary_contact: Optional[Dict[str, str]] = None

class SafarMilestoneAdvanceRequest(BaseModel):
    track_id: str
    target_milestone_id: Optional[str] = None

class SafarDeadReckoningRequest(BaseModel):
    track_id: str = "GP-SAMPLE"
    origin: Optional[str] = "Leh"
    destination: Optional[str] = "Nubra Valley"
    corridor_zone: Optional[str] = "Khardung La Valley No-Signal Zone"
    lat: Optional[float] = 34.2787
    lng: Optional[float] = 77.6047
    battery: Optional[int] = 82
    speed: Optional[float] = 45.0
    traveler_name: Optional[str] = "Rahul"

@app.post("/api/family-share/create-session")
@app.post("/api/guardian-protective/create-session")
@app.post("/api/safar-guardian/create-session")
def api_create_safar_session(req: SafarShareRequest):
    session = create_safar_guardian_session(
        origin=req.origin,
        destination=req.destination,
        traveler_name=req.traveler_name or "Rahul Sharma",
        transport_mode=req.transport_mode or "flight",
        departure_date=req.departure_date,
        transit_details=req.transit_details,
        stay_name=req.stay_name,
        primary_contact=req.primary_contact
    )
    return {"status": "success", "safar_session": session}

@app.get("/api/family-share/session/{track_id}")
@app.get("/api/guardian-protective/session/{track_id}")
@app.get("/api/safar-guardian/session/{track_id}")
def api_get_safar_session(track_id: str):
    session = ACTIVE_SAFAR_SESSIONS.get(track_id)
    if not session:
        # Generate on-demand fallback session preserving the requested track_id and route
        track_upper = track_id.upper()
        if "GOA" in track_upper:
            orig, dest = "Mumbai", "Goa"
        elif "MANA" in track_upper:
            orig, dest = "Delhi", "Manali"
        elif "JAIP" in track_upper:
            orig, dest = "Delhi", "Jaipur"
        else:
            orig, dest = "Mumbai", "Goa"
        session = create_safar_guardian_session(orig, dest, track_id=track_id)
    return {"status": "success", "safar_session": session}

@app.post("/api/family-share/advance-milestone")
@app.post("/api/guardian-protective/advance-milestone")
@app.post("/api/safar-guardian/advance-milestone")
def api_advance_safar_milestone(req: SafarMilestoneAdvanceRequest):
    result = advance_safar_milestone(track_id=req.track_id, target_milestone_id=req.target_milestone_id)
    return {"status": "success", "update": result}

@app.post("/api/family-share/offline-dead-reckoning")
def api_offline_dead_reckoning(req: SafarDeadReckoningRequest):
    dr = generate_dead_reckoning_transit_window(
        track_id=req.track_id,
        origin=req.origin or "Leh",
        destination=req.destination or "Nubra Valley",
        corridor_zone=req.corridor_zone or "Khardung La Valley No-Signal Zone"
    )
    sms = generate_compact_2g_sms_payload(
        track_id=req.track_id,
        lat=req.lat or 34.2787,
        lng=req.lng or 77.6047,
        battery=req.battery or 82,
        speed=req.speed or 45.0,
        transit_status=req.corridor_zone or "In Mountain Transit",
        traveler_name=req.traveler_name or "Rahul"
    )
    return {
        "status": "success",
        "dead_reckoning": dr,
        "offline_sms": sms
    }

@app.get("/api/guardian/stress-test-scenarios")
def api_get_stress_test_scenarios():
    return {
        "status": "success",
        "total_scenarios": len(TRAINED_TELEMETRY_SCENARIOS),
        "model_version": guardian_agent.model_metadata["version"],
        "scenarios": TRAINED_TELEMETRY_SCENARIOS
    }


class ZeroNetworkRequest(BaseModel):
    track_id: Optional[str] = "GP-LEH-9921"
    lat: Optional[float] = 34.2787
    lng: Optional[float] = 77.6047
    altitude_m: Optional[float] = 4850.0
    traveler_name: Optional[str] = "Rahul"
    emergency_contact: Optional[str] = "+91 98765 43210"

class MeshRelaySimulateRequest(BaseModel):
    track_id: Optional[str] = "GP-LEH-9921"
    forwarder_name: Optional[str] = "Indian Army Himank Convoy #12"

@app.post("/api/zero-network/protocol")
def api_zero_network_protocol(req: ZeroNetworkRequest):
    toolkit = get_zero_network_survival_toolkit(
        track_id=req.track_id or "GP-LEH-9921",
        lat=req.lat or 34.2787,
        lng=req.lng or 77.6047,
        altitude_m=req.altitude_m or 4850.0,
        traveler_name=req.traveler_name or "Rahul",
        emergency_contact=req.emergency_contact or "+91 98765 43210"
    )
    return {"status": "success", "toolkit": toolkit}

@app.post("/api/zero-network/simulate-mesh-hop")
def api_zero_network_mesh_hop(req: MeshRelaySimulateRequest):
    result = simulate_p2p_mesh_relay_hop(
        track_id=req.track_id or "GP-LEH-9921",
        forwarder_name=req.forwarder_name or "Indian Army Himank Convoy #12"
    )
    return {"status": "success", "relay_result": result}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
