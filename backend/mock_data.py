# backend/mock_data.py

HOTELS = [
    {
        "id": "h_delhi_1",
        "name": "The Leela Palace Delhi",
        "city": "Delhi",
        "category": "hotel",
        "cost_inr": 18000.0,
        "lat": 28.5789,
        "lng": 77.1973,
        "star_rating": 5.0,
        "distance_from_center": 4.5,
        "amenities": ["wifi", "pool", "spa", "ac", "restaurant", "gym"],
        "reviews": [
            "Extremely clean, luxurious rooms and stellar service.",
            "Loved the pool and spa, but a bit noisy near the street.",
            "Wonderful hospitality and exceptional food quality!"
        ]
    },
    {
        "id": "h_delhi_2",
        "name": "Zostel Delhi",
        "city": "Delhi",
        "category": "hotel",
        "cost_inr": 800.0,
        "lat": 28.6430,
        "lng": 77.2205,
        "star_rating": 3.0,
        "distance_from_center": 1.5,
        "amenities": ["wifi", "ac", "laundry"],
        "reviews": [
            "Affordable backpacker hostel. Clean beds but average bathrooms.",
            "Very noisy, but social vibe is great. Value for money.",
            "Helpful staff and close to metro station."
        ]
    },
    {
        "id": "h_jaipur_1",
        "name": "Rambagh Palace Jaipur",
        "city": "Jaipur",
        "category": "hotel",
        "cost_inr": 25000.0,
        "lat": 26.8981,
        "lng": 75.8078,
        "star_rating": 5.0,
        "distance_from_center": 3.0,
        "amenities": ["wifi", "pool", "spa", "ac", "heritage", "bar"],
        "reviews": [
            "A royal heritage experience. Exquisite cleanliness and service.",
            "Beautiful gardens and noise-free luxury rooms.",
            "Best value for premium pricing. Absolute peace of mind."
        ]
    },
    {
        "id": "h_jaipur_2",
        "name": "Umaid Bhawan Hotel Jaipur",
        "city": "Jaipur",
        "category": "hotel",
        "cost_inr": 3500.0,
        "lat": 26.9298,
        "lng": 75.7972,
        "star_rating": 4.0,
        "distance_from_center": 2.2,
        "amenities": ["wifi", "pool", "ac", "restaurant", "heritage"],
        "reviews": [
            "Lovely heritage feel at a budget-friendly price. Fairly clean.",
            "Food quality at roof top restaurant was excellent.",
            "Slight street noise during peak traffic hours, but manageable."
        ]
    },
    {
        "id": "h_agra_1",
        "name": "Oberoi Amarvilas Agra",
        "city": "Agra",
        "category": "hotel",
        "cost_inr": 22000.0,
        "lat": 27.1685,
        "lng": 78.0485,
        "star_rating": 5.0,
        "distance_from_center": 0.6,  # Very close to Taj
        "amenities": ["wifi", "pool", "spa", "ac", "taj_view"],
        "reviews": [
            "Stunning Taj Mahal view from rooms! Super clean and peaceful.",
            "Top-tier luxury, highly recommend for couples.",
            "Exceptional hospitality and service sentiment."
        ]
    },
    {
        "id": "h_agra_2",
        "name": "Taj Resorts Agra",
        "city": "Agra",
        "category": "hotel",
        "cost_inr": 4200.0,
        "lat": 27.1691,
        "lng": 78.0450,
        "star_rating": 4.0,
        "distance_from_center": 0.8,
        "amenities": ["wifi", "pool", "ac", "restaurant"],
        "reviews": [
            "Very clean rooms and nice rooftop pool. Close to Taj gate.",
            "Value for money. Decent service quality.",
            "Clean toilets, but breakfast was average."
        ]
    },
    # Missing price hotel to test XGBoost Imputation
    {
        "id": "h_delhi_missing_price",
        "name": "Heritage Stay Delhi Old Town",
        "city": "Delhi",
        "category": "hotel",
        "cost_inr": None,  # Will be imputed by XGBoost
        "lat": 28.6562,
        "lng": 77.2310,
        "star_rating": 4.0,
        "distance_from_center": 0.5,
        "amenities": ["wifi", "ac", "heritage"],
        "reviews": [
            "Beautiful ancient architecture. Clean rooms but noisy neighborhood.",
            "Local food was awesome, service sentiment was welcoming.",
            "Nice heritage vibes in the heart of Chandni Chowk."
        ]
    }
]

ATTRACTIONS = [
    {
        "id": "a_delhi_qutub",
        "name": "Qutub Minar",
        "city": "Delhi",
        "category": "attraction",
        "cost_inr": 50.0,
        "lat": 28.5244,
        "lng": 77.1855,
        "rating": 4.6,
        "duration_hrs": 2.0,
        "opening_hour": 7,  # 7:00 AM
        "closing_hour": 17, # 5:00 PM
        "tags": ["heritage", "architecture", "history"],
        "reviews": [
            "Magnificent historical site. Very clean and well-maintained.",
            "Crowded on weekends. Excellent location quality."
        ]
    },
    {
        "id": "a_delhi_redfort",
        "name": "Red Fort",
        "city": "Delhi",
        "category": "attraction",
        "cost_inr": 80.0,
        "lat": 28.6562,
        "lng": 77.2410,
        "rating": 4.5,
        "duration_hrs": 3.0,
        "opening_hour": 9,
        "closing_hour": 18,
        "tags": ["heritage", "history", "local_market"],
        "reviews": [
            "Huge fort. Lots of walking. Cleanliness is average.",
            "Very noisy near Chandni Chowk entrance. Great historical stories."
        ]
    },
    {
        "id": "a_delhi_lotus",
        "name": "Lotus Temple",
        "city": "Delhi",
        "category": "attraction",
        "cost_inr": 0.0,
        "lat": 28.5535,
        "lng": 77.2588,
        "rating": 4.4,
        "duration_hrs": 1.5,
        "opening_hour": 9,
        "closing_hour": 17,
        "tags": ["architecture", "peaceful", "garden"],
        "reviews": [
            "Incredibly quiet and serene inside. Clean gardens.",
            "Spectacular architecture, but long queue under hot sun."
        ]
    },
    {
        "id": "a_jaipur_amer",
        "name": "Amer Fort",
        "city": "Jaipur",
        "category": "attraction",
        "cost_inr": 200.0,
        "lat": 26.9855,
        "lng": 75.8513,
        "rating": 4.8,
        "duration_hrs": 3.0,
        "opening_hour": 8,
        "closing_hour": 18,
        "tags": ["heritage", "history", "views"],
        "reviews": [
            "Majestic fort on hill. Outstanding cleanliness. A must visit!",
            "Riding elephants or walking up is busy. Great guides."
        ]
    },
    {
        "id": "a_jaipur_hawa",
        "name": "Hawa Mahal",
        "city": "Jaipur",
        "category": "attraction",
        "cost_inr": 50.0,
        "lat": 26.9239,
        "lng": 75.8267,
        "rating": 4.6,
        "duration_hrs": 1.0,
        "opening_hour": 9,
        "closing_hour": 16,
        "tags": ["heritage", "architecture", "local_market"],
        "reviews": [
            "Stunning pink facade. Very noisy from main road traffic.",
            "Small inside corridors. Great location and view."
        ]
    },
    {
        "id": "a_agra_taj",
        "name": "Taj Mahal",
        "city": "Agra",
        "category": "attraction",
        "cost_inr": 250.0,
        "lat": 27.1751,
        "lng": 78.0421,
        "rating": 4.9,
        "duration_hrs": 3.0,
        "opening_hour": 6,
        "closing_hour": 18,
        "tags": ["heritage", "architecture", "history"],
        "reviews": [
            "Breathtaking beauty. Superb cleanliness and high security.",
            "Very crowded, but the view of sunrise is noise-free and magical."
        ]
    },
    {
        "id": "a_agra_fort",
        "name": "Agra Fort",
        "city": "Agra",
        "category": "attraction",
        "cost_inr": 80.0,
        "lat": 27.1798,
        "lng": 78.0210,
        "rating": 4.6,
        "duration_hrs": 2.0,
        "opening_hour": 6,
        "closing_hour": 18,
        "tags": ["heritage", "history"],
        "reviews": [
            "Stellar red sandstone construction. Clean washrooms.",
            "Informative history about Shah Jahan's imprisonment."
        ]
    }
]

INTERCITY_TRANSPORT = [
    {
        "id": "t_delhi_jaipur_train",
        "from_city": "Delhi",
        "to_city": "Jaipur",
        "mode": "train",
        "cost_inr": 650.0,
        "duration_hrs": 4.5,
        "comfort_score": 0.8
    },
    {
        "id": "t_delhi_jaipur_bus",
        "from_city": "Delhi",
        "to_city": "Jaipur",
        "mode": "bus",
        "cost_inr": 450.0,
        "duration_hrs": 6.0,
        "comfort_score": 0.5
    },
    {
        "id": "t_jaipur_agra_bus",
        "from_city": "Jaipur",
        "to_city": "Agra",
        "mode": "bus",
        "cost_inr": 400.0,
        "duration_hrs": 5.0,
        "comfort_score": 0.5
    },
    {
        "id": "t_jaipur_agra_train",
        "from_city": "Jaipur",
        "to_city": "Agra",
        "mode": "train",
        "cost_inr": 550.0,
        "duration_hrs": 4.0,
        "comfort_score": 0.7
    },
    {
        "id": "t_agra_delhi_train",
        "from_city": "Agra",
        "to_city": "Delhi",
        "mode": "train",
        "cost_inr": 450.0,
        "duration_hrs": 3.0,
        "comfort_score": 0.8
    },
    {
        "id": "t_agra_delhi_bus",
        "from_city": "Agra",
        "to_city": "Delhi",
        "mode": "bus",
        "cost_inr": 350.0,
        "duration_hrs": 4.5,
        "comfort_score": 0.4
    }
]

WEATHER = {
    "Delhi": {"temp_c": 32, "forecast": "Partly Cloudy", "historical_monthly_rain_mm": 50},
    "Jaipur": {"temp_c": 34, "forecast": "Sunny", "historical_monthly_rain_mm": 20},
    "Agra": {"temp_c": 33, "forecast": "Sunny", "historical_monthly_rain_mm": 40}
}
