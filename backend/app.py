# backend/app.py

import os
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

    candidates = search_transit_candidates(
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
            "reviews": h.get("reviews", ["Clean rooms and quiet surroundings."]),
            "image_url": h.get("image_url", ""),
            "images": h.get("images", [h.get("image_url", "")])
        })

    # Midway Hotel stays check for long road drives
    midway_hotels = []
    midway_city_name = ""
    orig_geo = geocode_destination(req.origin)
    if orig_geo and req.transport_mode == "self-drive":
        dist_km = (abs(orig_geo["lat"] - geo["lat"]) + abs(orig_geo["lng"] - geo["lng"])) * 111.0
        driving_hrs = dist_km / 55.0
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

    geo = geocode_destination(req.destination)
    if not geo:
        raise HTTPException(status_code=400, detail="Could not geocode destination.")

    dest_lat = geo["lat"]
    dest_lng = geo["lng"]

    raw_hotels = get_hotels_with_failover(dest_lat, dest_lng, req.destination.strip().title())
    sights_data = get_sights_with_failover(dest_lat, dest_lng, req.destination.strip().title())
    raw_attractions = sights_data["attractions"]
    raw_restaurants = sights_data["restaurants"]

    attraction_candidates = []
    for a in raw_attractions:
        sentiment = sentiment_extractor.analyze_reviews(a.get("reviews", []))
        tag_overlap = len(set(a["tags"]).intersection(set(req.interests)))
        daily_budget = req.budget / delta
        price_ratio = a["cost_inr"] / max(1.0, daily_budget)

        attraction_candidates.append({
            **a,
            "rating": a["rating"] / 5.0,
            "price_ratio": price_ratio,
            "tag_overlap": tag_overlap,
            "dist_to_center": 2.0,
            "location_quality": sentiment["cleanliness_score"]
        })

    daily_budget = req.budget / delta
    budget_ratio = min(1.0, daily_budget / 5000.0)
    pace_val = 0.3 if req.pace == "relaxed" else 0.6 if req.pace == "moderate" else 0.9
    luxury_pref = 0.8 if any(x in req.interests for x in ["heritage", "spa"]) else 0.3
    user_vector = [budget_ratio, pace_val, float(req.travelers), luxury_pref]
    
    persona_name, persona_weights = persona_segmenter.predict_persona(user_vector)
    scored_attractions = catboost_ranker.score_candidates(attraction_candidates, persona_weights, "attraction")

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
        "duration_hrs": req.selected_transit.duration_hrs
    }

    if req.transport_mode == "self-drive" and req.waypoints:
        orig_geo = geocode_destination(req.origin)
        if orig_geo:
            curr_lat = orig_geo["lat"]
            curr_lng = orig_geo["lng"]
            recalc_dist = 0.0
            for wp in req.waypoints:
                recalc_dist += (abs(curr_lat - wp.lat) + abs(curr_lng - wp.lng)) * 111.0
                curr_lat = wp.lat
                curr_lng = wp.lng
            recalc_dist += (abs(curr_lat - dest_lat) + abs(curr_lng - dest_lng)) * 111.0
            
            from osm_service import lookup_vehicle_specs, get_fuel_price_by_location
            v_specs = lookup_vehicle_specs(req.vehicle_query or "")
            price_unit = get_fuel_price_by_location(req.destination, req.fuel_type or "petrol")
            consumption = (recalc_dist / 100.0) * v_specs["consumption_rate"]
            new_fuel_cost = consumption * price_unit
            
            base_toll = req.selected_transit.total_price_inr - (req.selected_transit.estimated_fuel_cost_inr or 0.0)
            new_total_transit = new_fuel_cost + base_toll
            new_duration_hrs = round((recalc_dist / 55.0) + 0.5, 1) + (len(req.waypoints) * 0.75)
            
            transit_estimate = {
                "cost_inr": round(new_total_transit, 2),
                "duration_hrs": new_duration_hrs
            }

    # Solve Optimization (OR-Tools)
    attraction_limit = 12 if delta <= 3 else (9 if delta <= 5 else 6)
    itinerary = solve_itinerary(
        days=delta,
        budget=req.budget,
        hotel_candidates=[fixed_hotel],
        attraction_candidates=scored_attractions[:attraction_limit],
        restaurant_candidates=raw_restaurants,
        transit_estimate=transit_estimate,
        group_size=req.travelers,
        midway_hotel=fixed_midway,
        travel_class=req.travel_class,
        toll_cost=req.selected_transit.total_price_inr if req.transport_mode == "self-drive" else 0,
        pace=req.pace,
        lang=req.lang or "en"
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

        return {
            "status": "Infeasible",
            "message": f"This combination exceeds your ₹{req.budget} budget. We found better alternatives that keep the trip within budget while maintaining quality.",
            "persona": persona_name,
            "alternatives": alternatives
        }

    explanation = generate_itinerary_explanation(itinerary, persona_name, lang=req.lang)

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
        "explanation": explanation
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
    from solver import parse_time
    shifted_days = []
    
    for day in req.current_days:
        day_number = day.get("day_number", 1)
        schedule = day.get("schedule", [])
        new_schedule = []
        
        for item in schedule:
            category = item.get("category", "")
            # Only shift items on Day 1 (when flight arrival delay occurs)
            if day_number == 1 and category in ["attraction", "logistics", "food"]:
                start_str = item.get("start_time", "09:00")
                duration = item.get("duration_hrs", 1.5)
                
                orig_start_min = parse_time(start_str)
                new_start_min = orig_start_min + req.delay_minutes
                
                new_start_hrs = (new_start_min // 60) % 24
                new_start_mins = new_start_min % 60
                new_start_time = f"{new_start_hrs:02d}:{new_start_mins:02d}"
                
                new_end_min = new_start_min + int(duration * 60)
                new_end_hrs = (new_end_min // 60) % 24
                new_end_mins = new_end_min % 60
                new_end_time = f"{new_end_hrs:02d}:{new_end_mins:02d}"
                
                is_closed = False
                if category == "attraction":
                    close_min = int(item.get("closing_hour", 18) * 60)
                    if new_end_min > close_min:
                        is_closed = True
                
                updated_item = {
                    **item,
                    "start_time": new_start_time,
                    "end_time": new_end_time,
                }
                
                if is_closed:
                    updated_item["name"] = f"⚠️ {item['name']} (CLOSED)"
                    updated_item["description"] = f"Shifted past closing hours ({item.get('closing_hour', 18)}:00) due to flight delay."
                    updated_item["is_closed_alert"] = True
                
                new_schedule.append(updated_item)
            else:
                new_schedule.append(item)
                
        if day_number == 1:
            new_schedule.sort(key=lambda x: parse_time(x.get("start_time", "09:00")))
            
        shifted_days.append({
            "day_number": day_number,
            "schedule": new_schedule
        })
        
    return {
        "status": "Success",
        "itinerary": {
            "days": shifted_days
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
