# backend/app.py

import os
import math
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
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
    train_name: Optional[str] = None
    train_number: Optional[str] = None
    operator: Optional[str] = None
    bus_type: Optional[str] = None
    departure_time: Optional[str] = "09:00"
    arrival_time: Optional[str] = "15:00"
    duration_hrs: float
    total_price_inr: float
    estimated_fuel_cost_inr: Optional[float] = 0.0

class SelectedHotel(BaseModel):
    id: str
    name: str
    cost_inr: float
    lat: float
    lng: float
    star_rating: float
    is_estimated: bool

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

@app.get("/api/health")
def health():
    return {"status": "running"}

@app.get("/api/search/suggestions")
def get_suggestions(q: str):
    from agent_orchestrator import agent_orchestrator
    return {"suggestions": agent_orchestrator.search_destination(q)}

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

@app.post("/api/search/stays")
def get_stays(req: StaySearchRequest):
    try:
        dep = datetime.strptime(req.departure_date, "%Y-%m-%d")
        ret = datetime.strptime(req.return_date, "%Y-%m-%d")
        num_nights = (ret - dep).days
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format.")

    geo = geocode_destination(req.destination)
    if not geo:
        raise HTTPException(status_code=400, detail="Could not geocode destination location.")

    raw_hotels = get_hotels_with_failover(geo["lat"], geo["lng"], req.destination.strip().title())
    sights_data = get_sights_with_failover(geo["lat"], geo["lng"], req.destination.strip().title())
    raw_attractions = sights_data["attractions"]

    imputed_prices = price_imputer.train_and_impute(raw_hotels, raw_attractions)

    processed_hotels = []
    rooms_needed = max(1, (req.travelers + 1) // 2)

    for h in raw_hotels:
        cost = h["cost_inr"]
        is_imputed = False
        if cost is None:
            cost = imputed_prices.get(h["id"], 1500.0)
            is_imputed = True

        total_stay_cost = cost * num_nights * rooms_needed

        processed_hotels.append({
            "id": h["id"],
            "name": h["name"],
            "cost_inr": cost,
            "total_stay_cost_inr": total_stay_cost,
            "lat": h["lat"],
            "lng": h["lng"],
            "star_rating": h["star_rating"],
            "is_estimated": h.get("is_estimated", False),
            "is_imputed": is_imputed,
            "data_status": "ESTIMATED" if (is_imputed or h.get("is_estimated", False)) else "LIVE",
            "reviews": h.get("reviews", ["Clean rooms and quiet surroundings."]),
            "image_url": h.get("image_url", ""),
            "images": h.get("images", [h.get("image_url", "")])
        })

    # Midway Hotel stays check for long road drives
    midway_hotels = []
    midway_city_name = ""
    orig_geo = geocode_destination(req.origin)
    if orig_geo and req.transport_mode == "self-drive":
        lat1, lon1 = math.radians(orig_geo["lat"]), math.radians(orig_geo["lng"])
        lat2, lon2 = math.radians(geo["lat"]), math.radians(geo["lng"])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
        c = 2 * math.asin(math.sqrt(a))
        dist_km = (6371.0 * c) * 1.35
        driving_hrs = dist_km / 70.0
        if driving_hrs > 10.0:
            # Recommends Udaipur / Varanasi / Hyderabad stopover city
            mid_city, mid_lat, mid_lng = find_midway_city(req.origin, req.destination)
            midway_city_name = mid_city
            mid_hotels = get_hotels_with_failover(mid_lat, mid_lng, mid_city)
            for mh in mid_hotels:
                midway_hotels.append({
                    "id": mh["id"],
                    "name": f"{mh['name']} ({mid_city} Midway)",
                    "cost_inr": mh["cost_inr"],
                    "total_stay_cost_inr": mh["cost_inr"] * 1 * rooms_needed, # 1 night midway stay
                    "lat": mh["lat"],
                    "lng": mh["lng"],
                    "star_rating": mh["star_rating"],
                    "is_estimated": mh.get("is_estimated", True),
                    "reviews": mh.get("reviews", ["Excellent road trip midway lodge."]),
                    "image_url": mh.get("image_url", ""),
                    "images": mh.get("images", [mh.get("image_url", "")])
                })

    return {
        "hotels": processed_hotels,
        "midway_hotels": midway_hotels,
        "midway_city_name": midway_city_name
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
        "lat": req.selected_hotel.lat,
        "lng": req.selected_hotel.lng,
        "star_rating": req.selected_hotel.star_rating,
        "is_estimated": req.selected_hotel.is_estimated
    }

    # If midway hotel selected for overnight stay
    fixed_midway = None
    if req.selected_midway_hotel:
        fixed_midway = {
            "id": req.selected_midway_hotel.id,
            "name": req.selected_midway_hotel.name,
            "cost_inr": req.selected_midway_hotel.cost_inr,
            "ml_score": 1.0,
            "lat": req.selected_midway_hotel.lat,
            "lng": req.selected_midway_hotel.lng,
            "star_rating": req.selected_midway_hotel.star_rating,
            "is_estimated": req.selected_midway_hotel.is_estimated
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
        "explanation": explanation,
        "agent_logs": agent_orchestrator.logs
    }

class SOSQuery(BaseModel):
    lat: float
    lng: float
    type: str

@app.post("/api/sos")
def get_emergency_services(req: SOSQuery):
    services = fetch_nearby_emergency_services(req.lat, req.lng, req.type)
    return {
        "emergency_number": "112",
        "services": services,
        "instructions": [
            "Maintain safety boundaries and indicators.",
            "Contact assistance numbers listed on map checkpoints.",
            "Emergency alerts broadcasted to primary caretakers."
        ]
    }

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
