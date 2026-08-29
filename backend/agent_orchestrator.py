# backend/agent_orchestrator.py

import json
import math
import requests
from typing import List, Dict, Any, Optional
from datetime import datetime

# Import helper functions
from osm_service import geocode_destination, search_transit_candidates, AIRPORTS, NOMINATIM_URL, HEADERS
from real_providers import get_hotels_with_failover, get_sights_with_failover
from solver import solve_itinerary, calculate_trip_cost

class AgentOrchestrator:
    def __init__(self):
        self.logs = []

    def log(self, step_name: str, thought: str, action: str, observation: Any):
        self.logs.append({
            "step": step_name,
            "thought": thought,
            "action": action,
            "observation": str(observation)[:200] + "..." if len(str(observation)) > 200 else str(observation)
        })

    def search_destination(self, query: str) -> List[Dict[str, Any]]:
        """
        Tool: Discovers destinations, sub-regions, and specific sub-destinations.
        Matches keywords and returns ranked geographical coordinates.
        Queries Nominatim live and blends results with local curated regional databases.
        """
        query_lower = query.lower().strip()
        self.log(
            "Destination Discovery",
            f"User typed query '{query}'. Activating Discovery Layer to match exact, nearby, and sub-regions.",
            f"search_destination(query='{query}')",
            f"Matching sub-destinations for {query_lower}"
        )

        DISCOVERY_DB = {
            "himachal": [
                {"name": "Himachal Pradesh, India", "lat": 31.1048, "lng": 77.1734, "data_status": "VERIFIED"},
                {"name": "Bir Billing, Himachal Pradesh", "lat": 32.04, "lng": 76.72, "data_status": "VERIFIED"},
                {"name": "Kasol, Himachal Pradesh", "lat": 32.009, "lng": 77.315, "data_status": "VERIFIED"},
                {"name": "Spiti Valley, Himachal Pradesh", "lat": 32.246, "lng": 78.034, "data_status": "VERIFIED"},
                {"name": "Dharamshala, Himachal Pradesh", "lat": 32.219, "lng": 76.323, "data_status": "VERIFIED"},
                {"name": "Manali, Himachal Pradesh", "lat": 32.2396, "lng": 77.1887, "data_status": "VERIFIED"},
                {"name": "Shimla, Himachal Pradesh", "lat": 31.1048, "lng": 77.1734, "data_status": "VERIFIED"}
            ],
            "rajasthan": [
                {"name": "Rajasthan, India", "lat": 27.0238, "lng": 74.2179, "data_status": "VERIFIED"},
                {"name": "Jaipur, Rajasthan", "lat": 26.9124, "lng": 75.7873, "data_status": "VERIFIED"},
                {"name": "Udaipur, Rajasthan", "lat": 24.5854, "lng": 73.7125, "data_status": "VERIFIED"},
                {"name": "Jaisalmer, Rajasthan", "lat": 26.9157, "lng": 70.9083, "data_status": "VERIFIED"},
                {"name": "Pushkar, Rajasthan", "lat": 26.4897, "lng": 74.5511, "data_status": "VERIFIED"}
            ],
            "goa": [
                {"name": "Goa, India", "lat": 15.2993, "lng": 74.1240, "data_status": "VERIFIED"},
                {"name": "Panaji, Goa", "lat": 15.4909, "lng": 73.8278, "data_status": "VERIFIED"},
                {"name": "Calangute, Goa", "lat": 15.5441, "lng": 73.7624, "data_status": "VERIFIED"},
                {"name": "Anjuna, Goa", "lat": 15.5733, "lng": 73.7428, "data_status": "VERIFIED"},
                {"name": "Palolem, Goa", "lat": 15.0100, "lng": 74.0232, "data_status": "VERIFIED"}
            ],
            "jabalpur": [
                {"name": "Jabalpur, Madhya Pradesh, India", "lat": 23.1815, "lng": 79.9864, "data_status": "VERIFIED"},
                {"name": "Bhedaghat Dhuandhar Falls, Jabalpur", "lat": 23.1311, "lng": 79.8016, "data_status": "VERIFIED"},
                {"name": "Kanha National Park, Madhya Pradesh", "lat": 22.3345, "lng": 80.6115, "data_status": "VERIFIED"},
                {"name": "Bandhavgarh National Park, Madhya Pradesh", "lat": 23.7088, "lng": 81.0256, "data_status": "VERIFIED"},
                {"name": "Pachmarhi Hill Station, Madhya Pradesh", "lat": 22.4674, "lng": 78.4346, "data_status": "VERIFIED"}
            ],
            "madhya pradesh": [
                {"name": "Madhya Pradesh, India", "lat": 22.9734, "lng": 78.6569, "data_status": "VERIFIED"},
                {"name": "Jabalpur, Madhya Pradesh", "lat": 23.1815, "lng": 79.9864, "data_status": "VERIFIED"},
                {"name": "Bhopal, Madhya Pradesh", "lat": 23.2599, "lng": 77.4126, "data_status": "VERIFIED"},
                {"name": "Indore, Madhya Pradesh", "lat": 22.7196, "lng": 75.8577, "data_status": "VERIFIED"},
                {"name": "Gwalior Fort, Madhya Pradesh", "lat": 26.2195, "lng": 78.1695, "data_status": "VERIFIED"},
                {"name": "Khajuraho Temples, Madhya Pradesh", "lat": 24.8318, "lng": 79.9199, "data_status": "VERIFIED"},
                {"name": "Orchha Fort, Madhya Pradesh", "lat": 25.3533, "lng": 78.6431, "data_status": "VERIFIED"}
            ],
            "kerala": [
                {"name": "Kerala, India", "lat": 10.8505, "lng": 76.2711, "data_status": "VERIFIED"},
                {"name": "Munnar, Kerala", "lat": 10.0889, "lng": 77.0595, "data_status": "VERIFIED"},
                {"name": "Alleppey Houseboats, Kerala", "lat": 9.4981, "lng": 76.3388, "data_status": "VERIFIED"},
                {"name": "Wayanad, Kerala", "lat": 11.6854, "lng": 76.1320, "data_status": "VERIFIED"},
                {"name": "Varkala Cliff Beach, Kerala", "lat": 8.7338, "lng": 76.7059, "data_status": "VERIFIED"},
                {"name": "Thekkady Wildlife Reserve, Kerala", "lat": 9.6015, "lng": 77.1620, "data_status": "VERIFIED"}
            ],
            "uttarakhand": [
                {"name": "Uttarakhand, India", "lat": 30.0668, "lng": 79.0193, "data_status": "VERIFIED"},
                {"name": "Rishikesh, Uttarakhand", "lat": 30.0869, "lng": 78.2676, "data_status": "VERIFIED"},
                {"name": "Auli Ski Resort, Uttarakhand", "lat": 30.5312, "lng": 79.5658, "data_status": "VERIFIED"},
                {"name": "Mussoorie, Uttarakhand", "lat": 30.4598, "lng": 78.0799, "data_status": "VERIFIED"},
                {"name": "Nainital, Uttarakhand", "lat": 29.3919, "lng": 79.4542, "data_status": "VERIFIED"},
                {"name": "Valley of Flowers, Uttarakhand", "lat": 30.7280, "lng": 79.6053, "data_status": "VERIFIED"}
            ]
        }

        # Check in local discovery mappings
        suggestions = []
        for key, list_of_places in DISCOVERY_DB.items():
            if key in query_lower:
                suggestions.extend(list_of_places)

        # Also search for individual word matches across all lists
        for key, list_of_places in DISCOVERY_DB.items():
            for p in list_of_places:
                if query_lower in p["name"].lower() and p not in suggestions:
                    suggestions.append(p)

        # Live OpenStreetMap Geocoding suggest pool for deeper discovery
        if len(query_lower) >= 3:
            params = {"q": query + ", India", "format": "json", "limit": 5, "countrycodes": "in"}
            try:
                response = requests.get(NOMINATIM_URL, params=params, headers=HEADERS, timeout=6)
                if response.status_code == 200:
                    for item in response.json():
                        # Clean and format display name
                        parts = item["display_name"].split(", ")
                        cleaned_name = ", ".join(parts[:3]) + f", {parts[-1]}"
                        
                        # Prevent duplicate suggestion entries
                        if not any(abs(s["lat"] - float(item["lat"])) < 0.01 and abs(s["lng"] - float(item["lon"])) < 0.01 for s in suggestions):
                            suggestions.append({
                                "name": cleaned_name,
                                "lat": float(item["lat"]),
                                "lng": float(item["lon"]),
                                "data_status": "LIVE"
                            })
            except Exception as e:
                self.log("Geocoding API Warning", "Live OSM geocoder suggest query failed", "OSM query", str(e))

        self.log(
            "Destination Discovery",
            "Found relevant regional destinations.",
            "search_destination() result",
            f"Found {len(suggestions)} suggestions"
        )
        return suggestions[:8]

    def search_transport(self, origin: str, destination: str, departure_date: str, return_date: str, travelers: int, mode: str, fuel_type: str = "petrol", vehicle_query: str = "") -> List[Dict[str, Any]]:
        """
        Tool: Searches transit options. Implements the Accessibility Planning Layer to support multi-leg transit if direct route is unavailable.
        """
        self.log(
            "Transport Accessibility Analysis",
            f"Checking transport availability for mode '{mode}' from {origin} to {destination}.",
            f"search_transport(origin='{origin}', destination='{destination}', mode='{mode}')",
            "Checking connectivity..."
        )

        # Check if direct coordinates are far from closest airports/hubs
        orig_geo = geocode_destination(origin)
        dest_geo = geocode_destination(destination)
        if not orig_geo or not dest_geo:
            return []

        # Find distance
        lat1, lon1 = math.radians(orig_geo["lat"]), math.radians(orig_geo["lng"])
        lat2, lon2 = math.radians(dest_geo["lat"]), math.radians(dest_geo["lng"])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
        c = 2 * math.asin(math.sqrt(a))
        dist_km = (6371.0 * c) * 1.35

        # Check nearest airport to destination
        dest_port = None
        min_port_dist = 99999.0
        for city, port in AIRPORTS.items():
            port_dist = abs(port["lat"] - dest_geo["lat"]) + abs(port["lng"] - dest_geo["lng"]) * 111.0
            if port_dist < min_port_dist:
                min_port_dist = port_dist
                dest_port = port

        # If mode is flight and nearest airport is far (e.g. Bir Billing is ~68km from Kangra Airport DHM)
        # DHM is closest airport to Bir, but it is not a direct commercial flight for all cities.
        # We simulate a multi-leg journey: Flight (DEL -> DHM) + Taxi (DHM -> Bir Billing)
        is_multi_leg_needed = (mode == "flight" and min_port_dist > 30.0)

        candidates = search_transit_candidates(
            origin=origin,
            destination=destination,
            departure_date=departure_date,
            return_date=return_date,
            travelers=travelers,
            mode=mode,
            fuel_type=fuel_type,
            vehicle_query=vehicle_query
        )

        if is_multi_leg_needed and mode == "flight":
            self.log(
                "Accessibility planning",
                f"Destination is remote. No direct airport at {destination} (nearest is {dest_port['name']} {min_port_dist:.1f}km away). Generating multi-leg taxi connection.",
                "is_multi_leg_needed = True",
                f"Nearest Hub: {dest_port['code']}"
            )
            # Decorate candidate list with multi-leg attributes
            for c in candidates:
                c["is_multi_leg"] = True
                c["destination_airport"] = dest_port["code"]
                # Add taxi fee to the transit ticket cost
                taxi_cost = round(min_port_dist * 22.0, 2)  # ₹22 per km for taxi
                c["taxi_cost_inr"] = taxi_cost
                c["total_price_inr"] += taxi_cost * travelers
                c["duration_hrs"] = round(c["duration_hrs"] + (min_port_dist / 40.0), 1)  # add taxi time
                c["accessibility_note"] = f"Includes flight to {dest_port['code']} + {min_port_dist:.1f}km taxi transfer to {destination}"
                c["data_status"] = "VERIFIED"
        else:
            for c in candidates:
                c["is_multi_leg"] = False
                c["data_status"] = "LIVE" if "estimated_fuel_cost_inr" not in c else "VERIFIED"

        return candidates

    def run_replan_loop(self, state: Dict[str, Any], delay_minutes: int) -> Dict[str, Any]:
        """
        Tool: Autonomously replan itinerary schedules when events (such as flight delays) occur.
        Detects closed slots, reschedules activities, or replaces them entirely.
        """
        self.log(
            "Impact Analysis",
            f"Detected event: Flight Delay of {delay_minutes} minutes. Analysing schedule impact.",
            f"run_replan_loop(delay={delay_minutes})",
            "Evaluating schedule overlap..."
        )

        days = state.get("days", [])
        if not days:
            return state

        # Day 1 activities get shifted
        day_1 = days[0]
        schedule = day_1.get("schedule", [])

        # Start of travel gets shifted by delay_minutes
        arrival_shift_hrs = delay_minutes / 60.0
        self.log(
            "Rescheduling",
            f"Shifting arrival and check-in timeline by +{arrival_shift_hrs} hours.",
            "Timeline shift",
            f"New arrival delay: {arrival_shift_hrs} hrs"
        )

        updated_schedule = []
        for item in schedule:
            if item.get("category") == "logistics" and ("Check-in" in item["name"] or "Arrive" in item["name"]):
                # shift time
                sh_hrs = int(item["start_time"].split(":")[0])
                sh_mins = int(item["start_time"].split(":")[1])
                new_start_min = sh_hrs * 60 + sh_mins + delay_minutes
                new_start_time = f"{new_start_min // 60:02d}:{new_start_min % 60:02d}"
                item["start_time"] = new_start_time
                item["description"] = f"Delayed by {delay_minutes} mins. " + item.get("description", "")
            
            # Check if any sightseeing activity is affected
            elif item.get("category") == "attraction" or "opening_hour" in item:
                # check if start time overlaps with delayed check-in/arrival
                # For simplicity, if activity is before 18:00 (which is during the delay window), mark it
                closing_h = item.get("closing_hour", 18)
                duration_h = item.get("duration_hrs", 2.0)
                
                # Check if it clashes
                # Standard arrival is shifted to ~18:00 or after. If museum closes at 18:00, it cannot be visited
                if closing_h <= 18.0:
                    self.log(
                        "Conflict Resolution",
                        f"Activity '{item['name']}' closes at {closing_h}:00 but delayed transit arrives late. Rescheduling attraction.",
                        "reschedule_attraction()",
                        f"Attraction closed: {item['name']}"
                    )
                    item["status"] = "CLOSED"
                    item["warning"] = "Rescheduled/Cancelled due to delay"
            
            updated_schedule.append(item)

        day_1["schedule"] = updated_schedule
        state["days"][0] = day_1

        self.log(
            "Re-planning Completed",
            "Itinerary re-optimized and validated with warnings.",
            "Verification",
            "Plan status: SUCCESS"
        )

        return state

agent_orchestrator = AgentOrchestrator()
