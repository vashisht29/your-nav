# backend/demo_registry.py

# A curated registry of real hotels, flights, trains, and attractions for presentations.
# If these destinations are queried, we inject these premium assets to guarantee real-world look & feel.

DEMO_HOTELS = {
    "jaipur": [
        {
            "id": "demo_h_rambagh",
            "name": "Rambagh Palace (Taj Group)",
            "category": "hotel",
            "cost_inr": 28000.0,
            "lat": 26.8981,
            "lng": 75.8078,
            "star_rating": 5.0,
            "distance_from_center": 2.1,
            "amenities": ["wifi", "ac", "breakfast", "pool", "spa", "heritage", "gym"],
            "reviews": [
                "The ultimate royal experience. The palace, peacock gardens, and hospitality are world-class.",
                "Stunning heritage property. Truly the jewel of Jaipur. Service was impeccable."
            ],
            "image_url": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&q=80",
            "images": [
                "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&q=80",
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&q=80",
                "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&q=80"
            ],
            "is_estimated": False
        },
        {
            "id": "demo_h_itc_rajputana",
            "name": "ITC Rajputana - Luxury Collection",
            "category": "hotel",
            "cost_inr": 8500.0,
            "lat": 26.9220,
            "lng": 75.7972,
            "star_rating": 5.0,
            "distance_from_center": 0.9,
            "amenities": ["wifi", "ac", "breakfast", "pool", "gym", "spa"],
            "reviews": [
                "Excellent hotel near the railway station. Beautiful lobby and very spacious rooms.",
                "Loved the Rajasthani cuisine served at Peshawri restaurant. High standards of cleanliness."
            ],
            "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80",
            "images": [
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80",
                "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80"
            ],
            "is_estimated": False
        },
        {
            "id": "demo_h_jaipur_inn",
            "name": "Jaipur Inn (Bani Park)",
            "category": "hotel",
            "cost_inr": 2800.0,
            "lat": 26.9272,
            "lng": 75.7981,
            "star_rating": 3.0,
            "distance_from_center": 1.4,
            "amenities": ["wifi", "ac", "breakfast"],
            "reviews": [
                "Warm hospitality. Loved the rooftop tea spot with views of Nahargarh Fort.",
                "Cozy budget inn. Tidy rooms, polite staff, and very peaceful neighborhood."
            ],
            "image_url": "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=500&q=80",
            "images": [
                "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=500&q=80",
                "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&q=80",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80"
            ],
            "is_estimated": False
        }
    ],
    "goa": [
        {
            "id": "demo_h_taj_exotica",
            "name": "Taj Exotica Resort & Spa Goa",
            "category": "hotel",
            "cost_inr": 18500.0,
            "lat": 15.2210,
            "lng": 73.9214,
            "star_rating": 5.0,
            "distance_from_center": 0.5,
            "amenities": ["wifi", "ac", "breakfast", "pool", "spa", "private_beach", "gym"],
            "reviews": [
                "Breathtaking resort on Benaulim beach. Perfect for relaxing with family.",
                "Luxury at its best. Extremely polite staff, clean private beach, and great pools."
            ],
            "image_url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80",
            "images": [
                "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80"
            ],
            "is_estimated": False
        },
        {
            "id": "demo_h_holiday_inn_goa",
            "name": "Holiday Inn Resort Goa (Mobor Beach)",
            "category": "hotel",
            "cost_inr": 8200.0,
            "lat": 15.1581,
            "lng": 73.9436,
            "star_rating": 4.0,
            "distance_from_center": 1.2,
            "amenities": ["wifi", "ac", "breakfast", "pool", "beach_access"],
            "reviews": [
                "Direct beach access, beautiful sunset views, and good value for money.",
                "Spacious clean rooms, friendly service, and very good buffet spread."
            ],
            "image_url": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80",
            "images": [
                "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80",
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&q=80",
                "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&q=80"
            ],
            "is_estimated": False
        }
    ]
}

DEMO_FLIGHTS = [
    {
        "id": "demo_f_indigo_1",
        "airline": "IndiGo (6E-2034)",
        "departure_time": "08:15",
        "arrival_time": "09:10",
        "duration_hrs": 0.9,
        "single_ticket_price": 3200.0,
        "delay_rate": "3%",
        "reviews": ["On time departure and quick landing.", "Clean cabin and polite crew."]
    },
    {
        "id": "demo_f_airindia_2",
        "airline": "Air India (AI-491)",
        "departure_time": "14:30",
        "arrival_time": "15:25",
        "duration_hrs": 0.9,
        "single_ticket_price": 4100.0,
        "delay_rate": "8%",
        "reviews": ["Included hot meals. Smooth flight.", "Generous baggage limits."]
    }
]

DEMO_TRAINS = [
    {
        "id": "demo_t_shatabdi",
        "train_name": "Jaipur Shatabdi Express (12015)",
        "travel_class": "AC Chair Car (CC)",
        "departure_time": "06:10",
        "arrival_time": "10:40",
        "duration_hrs": 4.5,
        "single_ticket_price": 850.0,
        "delay_rate": "5%",
        "reviews": ["Served tea, snacks and breakfast. Very clean coaches.", "Fastest rail connectivity to Jaipur."]
    },
    {
        "id": "demo_t_double_decker",
        "train_name": "Jaipur Double Decker (12986)",
        "travel_class": "AC Chair Car (CC)",
        "departure_time": "17:35",
        "arrival_time": "22:05",
        "duration_hrs": 4.5,
        "single_ticket_price": 680.0,
        "delay_rate": "12%",
        "reviews": ["Unique double decker layout. Fun travel experience.", "A bit crowded but runs on schedule."]
    }
]
