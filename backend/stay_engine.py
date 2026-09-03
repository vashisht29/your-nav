# backend/stay_engine.py
"""
Pan-India Accommodation & Homestay Intelligence Engine
Covers:
1. 5 Accommodation Categories: Youth Hostels (Zostel/Hosteller), Local Homestays,
   3-Star Boutiques, 4-Star Resorts, and 5-Star / 7-Star Heritage Palaces (Taj/Oberoi/ITC).
2. Location Proximity to Core Attractions / Beach / Mall Road.
3. Check-in / Check-out Timings & 24x7 Flexible Desk.
4. Food & Meal Plans (Free Breakfast, In-House Café, Kitchen Access, Fine Dining).
5. Staff Hospitality & Cleanliness Ratings.
6. In-Card Dynamic Room Tier Pricing Options.
"""

import math
from typing import List, Dict, Optional

DESTINATION_HOTEL_REGISTRY = {
    "goa": [
        {
            "id": "stay_goa_zostel",
            "name": "Zostel Goa (Calangute / Anjuna Strip)",
            "category": "Youth Hostel & Workation",
            "star_rating": 4.6,
            "proximity_km": 0.4,
            "proximity_tag": "0.4 km from Calangute Beach Strip",
            "check_in": "12:00 PM",
            "check_out": "10:30 AM",
            "staff_nature_rating": "4.9/5 (Vibrant Host, Friendly & Local Party Guides)",
            "food_plan": "In-House Rooftop Café (Burgers, Goan Curry & Smoothies)",
            "amenities": ["Fast WiFi (100 Mbps)", "Swimming Pool", "Common Game Lounge", "Air Conditioned", "24x7 Security"],
            "image_url": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop",
            "rooms": [
                {"name": "6-Bed Mixed AC Dorm", "type": "Dorm Bed", "desc": "Bunk Bed with Privacy Curtain & Locker", "cost_per_night": 750, "meals": "Room Only"},
                {"name": "Female 4-Bed AC Dorm", "type": "Female Dorm", "desc": "Dedicated Female Dorm with En-suite Washroom", "cost_per_night": 850, "meals": "Room Only"},
                {"name": "Private Deluxe Balcony Room", "type": "Private Room", "desc": "Double Bed, Private Balcony & Work Desk", "cost_per_night": 2400, "meals": "Free Breakfast Included"}
            ]
        },
        {
            "id": "stay_goa_homestay",
            "name": "Portuguese Heritage Homestay & Villa (Fontainhas)",
            "category": "Authentic Local Homestay",
            "star_rating": 4.8,
            "proximity_km": 0.2,
            "proximity_tag": "0.2 km from Latin Quarter & River Cruise",
            "check_in": "01:00 PM (24x7 Self Check-in)",
            "check_out": "11:00 AM",
            "staff_nature_rating": "4.9/5 (Superhost Maria - Warm, Caring & Traditional Recipes)",
            "food_plan": "Authentic Goan Breakfast (Poi Bread, Xacuti & Fresh Mangoes) + Kitchen Access",
            "amenities": ["Garden Courtyard", "Home Cooked Food", "Full Kitchen Access", "High Speed WiFi", "Pet-Friendly"],
            "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop",
            "rooms": [
                {"name": "Heritage Garden Room", "type": "Standard Homestay", "desc": "Antique Wooden Furnishing & Courtyard View", "cost_per_night": 2200, "meals": "Free Homecooked Breakfast"},
                {"name": "Portuguese Master Suite", "type": "Master Suite", "desc": "High Ceilings, Four-Poster Bed & Veranda", "cost_per_night": 3600, "meals": "Breakfast + Afternoon High Tea"}
            ]
        },
        {
            "id": "stay_goa_resort",
            "name": "Seashell Beach Resort & Spa (Candolim)",
            "category": "4-Star Boutique Resort",
            "star_rating": 4.5,
            "proximity_km": 0.3,
            "proximity_tag": "0.3 km from Beachfront & Watersports",
            "check_in": "02:00 PM",
            "check_out": "11:00 AM",
            "staff_nature_rating": "4.7/5 (Polite, Fast Room Service & Concierge Desk)",
            "food_plan": "Multi-Cuisine Buffet Restaurant & Poolside Bar",
            "amenities": ["Infinity Pool", "Ayurvedic Spa", "Free Buffet Breakfast", "Fitness Center", "Live Music Nights"],
            "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop",
            "rooms": [
                {"name": "Deluxe Pool View Room", "type": "Deluxe", "desc": "King Bed, Pool Balcony & Rain Shower", "cost_per_night": 4800, "meals": "Free Buffet Breakfast"},
                {"name": "Luxury Executive Cottage", "type": "Luxury Cottage", "desc": "Standalone Garden Cottage with Jacuzzi", "cost_per_night": 7200, "meals": "Breakfast + Dinner (Half Board)"}
            ]
        },
        {
            "id": "stay_goa_taj",
            "name": "Taj Exotica Resort & Spa (South Goa Benaulim)",
            "category": "5-Star Ultra-Luxury / 7-Star Heritage",
            "star_rating": 4.9,
            "proximity_km": 0.1,
            "proximity_tag": "Direct Private Beach Access (56 Acres Mediterranean Estate)",
            "check_in": "02:00 PM (VIP Welcome Drink & In-Room Check-in)",
            "check_out": "12:00 PM",
            "staff_nature_rating": "5.0/5 (World-Class Taj Hospitality & Personal Butler Service)",
            "food_plan": "Fine Dining Gourmet (Miguel Arcanjo Mediterranean & Lobster Village Seafood)",
            "amenities": ["Private Beach", "Jiva Luxury Spa", "Golf Course", "Olympic Pool", "Helipad Access"],
            "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop",
            "rooms": [
                {"name": "Premium Sea View Villa Room", "type": "Luxury Villa", "desc": "Plush King Bed, Sea Facing Terrace & Butler", "cost_per_night": 16500, "meals": "Gourmet Breakfast + Hi-Tea"},
                {"name": "Presidential Ocean Villa with Private Pool", "type": "Presidential Pool Villa", "desc": "Private Plunge Pool, 2 Master Bedrooms & Private Chef", "cost_per_night": 38000, "meals": "All Meals & Luxury Airport Limousine"}
            ]
        }
    ],

    "manali": [
        {
            "id": "stay_manali_hostel",
            "name": "The Hosteller Manali (Old Manali Riverside)",
            "category": "Backpacker Hostel & Café",
            "star_rating": 4.7,
            "proximity_km": 0.5,
            "proximity_tag": "0.5 km from Old Manali Cafes & Manu Temple",
            "check_in": "12:00 PM",
            "check_out": "10:00 AM",
            "staff_nature_rating": "4.8/5 (Friendly Backpacking Community & Trek Leaders)",
            "food_plan": "Himalayan Café (Nutella Waffles, Thukpa & Masala Chai)",
            "amenities": ["Mountain View Deck", "Bonfire Nights", "High-Speed WiFi (Workation)", "Café On-Site"],
            "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop",
            "rooms": [
                {"name": "Standard 6-Bed Mountain Dorm", "type": "Dorm Bed", "desc": "Wooden Bunk Bed, Mountain View & Lockers", "cost_per_night": 650, "meals": "Room Only"},
                {"name": "Private Pine Wood Attic Room", "type": "Private Attic", "desc": "Cozy Pine Wood Room with Balcony & Heater", "cost_per_night": 1950, "meals": "Free Breakfast Included"}
            ]
        },
        {
            "id": "stay_manali_homestay",
            "name": "Apple Orchard Riverside Cottage & Homestay",
            "category": "Authentic Himachali Homestay",
            "star_rating": 4.9,
            "proximity_km": 1.2,
            "proximity_tag": "Set amidst Cedar Apple Orchards & Beas River Stream",
            "check_in": "12:30 PM",
            "check_out": "11:00 AM",
            "staff_nature_rating": "5.0/5 (Thakur Family - Homely, Welcoming & Cooked on Chulha)",
            "food_plan": "Traditional Himachali Dham (Siddu with Ghee, Rajma Madra & Kheer)",
            "amenities": ["Apple Orchard Walks", "River Stream Access", "Heater & Tandoor Fireplace", "Homecooked Food"],
            "image_url": "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&auto=format&fit=crop",
            "rooms": [
                {"name": "Himachali Wood Deluxe Room", "type": "Deluxe Homestay", "desc": "Cedar Wood Walls, Electric Blanket & Apple Tree View", "cost_per_night": 2300, "meals": "Free Farm-Fresh Breakfast"},
                {"name": "Family Wooden Chalet Suite", "type": "Wooden Chalet", "desc": "2 Bedrooms, Private Fireplace & Kitchenette", "cost_per_night": 4500, "meals": "Breakfast + Traditional Dinner"}
            ]
        },
        {
            "id": "stay_manali_resort",
            "name": "Solang Valley Resort & Spa",
            "category": "4-Star Mountain Resort",
            "star_rating": 4.6,
            "proximity_km": 0.4,
            "proximity_tag": "0.4 km from Solang Paragliding & Snow Point",
            "check_in": "02:00 PM",
            "check_out": "11:00 AM",
            "staff_nature_rating": "4.8/5 (Professional Mountain Guides & Warm Staff)",
            "food_plan": "Multi-Cuisine Buffet Dining + Open Air Barbeque",
            "amenities": ["Snow Valley Views", "Ayurvedic Steam Spa", "Central Heating", "Indoor Games", "Barbeque"],
            "image_url": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&auto=format&fit=crop",
            "rooms": [
                {"name": "Glacier View Deluxe Room", "type": "Deluxe Room", "desc": "Valley Facing Balcony, Heated Floors & Bathtub", "cost_per_night": 5200, "meals": "Free Buffet Breakfast"},
                {"name": "Presidential Himalayan Suite", "type": "Luxury Suite", "desc": "Panoramic 360° Snow View, Living Room & Jacuzzi", "cost_per_night": 9500, "meals": "Breakfast + Mountain Dinner"}
            ]
        },
        {
            "id": "stay_manali_luxury",
            "name": "The Himalayan Castle & Luxury Spa (Old Manali)",
            "category": "5-Star Heritage Castle / 7-Star Experience",
            "star_rating": 4.9,
            "proximity_km": 0.3,
            "proximity_tag": "Victorian Gothic Castle overlooking Rohtang Peaks",
            "check_in": "02:00 PM (Personal Escort)",
            "check_out": "12:00 PM",
            "staff_nature_rating": "5.0/5 (Royalty-Grade Hospitality & Private Sommelier)",
            "food_plan": "Fine Dining Victorian Dining Room & Dungeon Bar",
            "amenities": ["Cast-Iron Fireplaces", "Heated Swimming Pool", "Wine Cellar", "Private Butler"],
            "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop",
            "rooms": [
                {"name": "Castle Grand Chamber", "type": "Castle Chamber", "desc": "Antique Four Poster Bed, Fireplace & Mountain Vista", "cost_per_night": 14000, "meals": "Royal Breakfast Included"},
                {"name": "Crown Royal Penthouse Suite", "type": "Royal Penthouse", "desc": "Two-Story Penthouse, Private Terrace & Butler Service", "cost_per_night": 28000, "meals": "All Gourmet Meals + Airport Transfers"}
            ]
        }
    ]
}

def generate_destination_stays(dest_name: str, num_nights: int, travelers: int, user_budget: float = 30000) -> List[Dict]:
    """Generates authentic stays with in-card room tier pricing options."""
    d_lower = dest_name.lower().strip()
    
    # Check if exact pre-registered curated stay exists
    matched_stays = None
    for key, stays in DESTINATION_HOTEL_REGISTRY.items():
        if key in d_lower:
            matched_stays = stays
            break

    # If not in registry, generate dynamic hyper-realistic accommodations
    if not matched_stays:
        matched_stays = [
            {
                "id": f"stay_{d_lower}_hostel",
                "name": f"Zostel / Backpacker Hub {dest_name.title()}",
                "category": "Youth Hostel & Social Stays",
                "star_rating": 4.6,
                "proximity_km": 0.4,
                "proximity_tag": f"0.4 km from central {dest_name.title()} landmark",
                "check_in": "12:00 PM",
                "check_out": "10:30 AM",
                "staff_nature_rating": "4.8/5 (Helpful, Energetic & Local Tour Experts)",
                "food_plan": "In-House Café (Hot Meals, Beverages & Breakfast)",
                "amenities": ["Fast WiFi (100 Mbps)", "Common Lounge", "24x7 Hot Water", "Clean Lockers"],
                "image_url": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop",
                "rooms": [
                    {"name": "Standard Mixed AC Dorm Bed", "type": "Dorm Bed", "desc": "Comfortable Bed, Privacy Curtain & Lamp", "cost_per_night": 650, "meals": "Room Only"},
                    {"name": "Private Standard Room", "type": "Private Room", "desc": "Double Bed, Work Desk & Attached Bath", "cost_per_night": 1800, "meals": "Free Breakfast Included"}
                ]
            },
            {
                "id": f"stay_{d_lower}_homestay",
                "name": f"{dest_name.title()} Heritage Village Homestay",
                "category": "Authentic Local Homestay",
                "star_rating": 4.8,
                "proximity_km": 0.3,
                "proximity_tag": f"0.3 km from main culture strip & market",
                "check_in": "01:00 PM",
                "check_out": "11:00 AM",
                "staff_nature_rating": "4.9/5 (Local Host Family - Warm & Generous)",
                "food_plan": "Fresh Organic Homecooked Meals + Kitchen Access",
                "amenities": ["Garden Seating", "Homecooked Thalis", "Kitchen Access", "Free WiFi"],
                "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop",
                "rooms": [
                    {"name": "Heritage Deluxe Homestay Room", "type": "Deluxe Homestay", "desc": "Traditional Architecture, Balcony & Attached Bath", "cost_per_night": 2200, "meals": "Free Homecooked Breakfast"},
                    {"name": "Full Family Cottage Suite", "type": "Cottage Suite", "desc": "2 Rooms with Kitchenette & Living Area", "cost_per_night": 3900, "meals": "Breakfast + Home Dinner"}
                ]
            },
            {
                "id": f"stay_{d_lower}_boutique",
                "name": f"Royal Orchid / Treebo Trend {dest_name.title()}",
                "category": "3-Star / 4-Star Boutique Comfort",
                "star_rating": 4.5,
                "proximity_km": 0.6,
                "proximity_tag": f"0.6 km from city center with fast cab connectivity",
                "check_in": "02:00 PM",
                "check_out": "11:00 AM",
                "staff_nature_rating": "4.7/5 (Polite, Fast Check-in & 24x7 Room Service)",
                "food_plan": "Multi-Cuisine Restaurant with Buffet Breakfast",
                "amenities": ["Swimming Pool", "Restaurant", "Free Buffet Breakfast", "Air Conditioned", "Elevator"],
                "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop",
                "rooms": [
                    {"name": "Executive City View Room", "type": "Executive Room", "desc": "King Bed, City View & Tea Maker", "cost_per_night": 3400, "meals": "Free Buffet Breakfast"},
                    {"name": "Premium Luxury Suite", "type": "Premium Suite", "desc": "Living Area, Bathtub & Premium Toiletries", "cost_per_night": 5600, "meals": "Breakfast + Dinner (Half Board)"}
                ]
            },
            {
                "id": f"stay_{d_lower}_luxury",
                "name": f"Taj / Grand Heritage Palace & Spa {dest_name.title()}",
                "category": "5-Star Luxury & Heritage Palace (7-Star Vibe)",
                "star_rating": 4.9,
                "proximity_km": 0.2,
                "proximity_tag": "Prime Scenic Heritage Estate with Private Grounds",
                "check_in": "02:00 PM (Royal Garland Welcome)",
                "check_out": "12:00 PM",
                "staff_nature_rating": "5.0/5 (Legendary Royal Hospitality & Dedicated Concierge)",
                "food_plan": "Gourmet Fine Dining & 24x7 Signature Dining",
                "amenities": ["Luxury Spa & Wellness", "Infinity Pool", "Royal Butler", "Fine Dining Restaurants", "Valet Parking"],
                "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop",
                "rooms": [
                    {"name": "Palace Luxury Room", "type": "Palace Room", "desc": "Royal Bedding, Marble Bath & Heritage Artifacts", "cost_per_night": 14500, "meals": "Royal Gourmet Breakfast"},
                    {"name": "Grand Presidential Royal Suite", "type": "Presidential Suite", "desc": "Private Lounge, Jacuzzi & Personal Butler", "cost_per_night": 32000, "meals": "All Gourmet Meals Included"}
                ]
            }
        ]

    processed_stays = []
    rooms_needed = max(1, (travelers + 1) // 2)

    for h in matched_stays:
        # Build room tiers with total stay cost
        room_options = []
        for r in h["rooms"]:
            cost_pn = r["cost_per_night"]
            total_stay = cost_pn * num_nights * rooms_needed
            room_options.append({
                "room_name": r["name"],
                "room_type": r["type"],
                "desc": r["desc"],
                "cost_per_night": cost_pn,
                "total_stay_cost_inr": total_stay,
                "meals_included": r["meals"]
            })

        default_room = room_options[0]
        base_nightly = default_room["cost_per_night"]
        total_stay_cost = default_room["total_stay_cost_inr"]
        selected_room_name = default_room["room_name"]
        meals_text = default_room["meals_included"]

        processed_stays.append({
            "id": h["id"],
            "name": h["name"],
            "category": h["category"],
            "star_rating": h["star_rating"],
            "proximity_km": h["proximity_km"],
            "proximity_tag": h["proximity_tag"],
            "check_in": h["check_in"],
            "check_out": h["check_out"],
            "staff_nature_rating": h["staff_nature_rating"],
            "food_plan": h["food_plan"],
            "amenities": h["amenities"],
            "image_url": h["image_url"],
            "cost_inr": base_nightly,
            "total_stay_cost_inr": total_stay_cost,
            "selected_room": selected_room_name,
            "meals_included": meals_text,
            "room_options": room_options,
            "reviews": [
                f"Staff behavior was exceptional ({h['staff_nature_rating'].split('(')[0].strip()})!",
                f"Located only {h['proximity_km']} km away, saved so much cab fare.",
                f"Loved the {h['food_plan'].split('(')[0].strip()} — super hygienic!"
            ]
        })

    # Sort so best proximity & budget matching stays are prioritized
    return sorted(processed_stays, key=lambda x: (x["proximity_km"], x["total_stay_cost_inr"]))
