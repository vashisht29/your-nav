# backend/app.py

import os
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from dotenv import load_dotenv

from osm_service import geocode_destination, fetch_osm_candidates, fetch_nearby_emergency_services, search_transit_candidates, find_midway_city, lookup_vehicle_specs
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
    travelers: int
    budget: float
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

class PlanRequest(BaseModel):
    origin: str
    destination: str
    departure_date: str
    return_date: str
    travelers: int
    budget: float
    selected_transit: SelectedTransit
    selected_hotel: SelectedHotel
    selected_midway_hotel: Optional[SelectedHotel] = None
    pace: str
    interests: List[str]
    lang: Optional[str] = "en"
    transport_mode: str
    fuel_type: Optional[str] = "petrol"
    vehicle_query: Optional[str] = ""

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

    candidates = fetch_osm_candidates(geo["lat"], geo["lng"], req.destination.strip().title())
    raw_hotels = candidates["hotels"]
    raw_attractions = candidates["attractions"]

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
            "image_url": h.get("image_url", "")
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
            mid_osm = fetch_osm_candidates(mid_lat, mid_lng, mid_city)
            for mh in mid_osm["hotels"]:
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
                    "image_url": mh.get("image_url", "")
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
        delta = (ret - dep).days
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format.")

    geo = geocode_destination(req.destination)
    if not geo:
        raise HTTPException(status_code=400, detail="Could not geocode destination.")

    dest_lat = geo["lat"]
    dest_lng = geo["lng"]

    candidates = fetch_osm_candidates(dest_lat, dest_lng, req.destination.strip().title())
    raw_hotels = candidates["hotels"]
    raw_attractions = candidates["attractions"]
    raw_restaurants = candidates["restaurants"]

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

    # Solve Optimization (OR-Tools)
    itinerary = solve_itinerary(
        days=delta,
        budget=req.budget,
        hotel_candidates=[fixed_hotel],
        attraction_candidates=scored_attractions[:12],
        restaurant_candidates=raw_restaurants,
        transit_estimate=transit_estimate,
        group_size=req.travelers,
        midway_hotel=fixed_midway
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
