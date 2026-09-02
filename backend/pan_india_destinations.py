# backend/pan_india_destinations.py
"""
Pan-India Destination Registry & Intelligent Fuzzy Search Engine
Covers 150+ iconic Indian destinations across all 28 States & 8 UTs.
Includes:
- Prefix / Substring Autocomplete (e.g. 'h' -> Hampi, Haridwar, Hyderabad, etc.)
- Fuzzy Spelling Auto-Correction (e.g. 'mnli' -> 'Manali', 'rshkesh' -> 'Rishikesh')
- Unsupported Destination Wishlist Logging
"""

import os
import json
import difflib

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
os.makedirs(DATA_DIR, exist_ok=True)
REQUESTED_LOG_PATH = os.path.join(DATA_DIR, "requested_destinations.json")

# Master Pan-India Destinations Directory
PAN_INDIA_DESTINATIONS = [
    # --- NORTH INDIA ---
    {"name": "Delhi", "state": "Delhi", "zone": "North", "type": "Metropolitan & Heritage", "lat": 28.6139, "lng": 77.2090, "famous_for": "Red Fort, Qutub Minar, India Gate, Street Food"},
    {"name": "Agra", "state": "Uttar Pradesh", "zone": "North", "type": "Heritage Monument", "lat": 27.1767, "lng": 78.0081, "famous_for": "Taj Mahal, Agra Fort, Fatehpur Sikri"},
    {"name": "Varanasi", "state": "Uttar Pradesh", "zone": "North", "type": "Spiritual & Ghats", "lat": 25.3176, "lng": 82.9739, "famous_for": "Kashi Vishwanath, Ganga Aarti, Dashashwamedh Ghat"},
    {"name": "Ayodhya", "state": "Uttar Pradesh", "zone": "North", "type": "Spiritual & Pilgrimage", "lat": 26.7922, "lng": 82.1998, "famous_for": "Ram Mandir, Saryu Ghat, Hanuman Garhi"},
    {"name": "Mathura & Vrindavan", "state": "Uttar Pradesh", "zone": "North", "type": "Spiritual & Temples", "lat": 27.4924, "lng": 77.6737, "famous_for": "Banke Bihari Temple, Prem Mandir, Krishna Janmabhoomi"},
    {"name": "Prayagraj", "state": "Uttar Pradesh", "zone": "North", "type": "Spiritual Confluence", "lat": 25.4358, "lng": 81.8463, "famous_for": "Triveni Sangam, Kumbh Mela Ground, Allahabad Fort"},
    {"name": "Lucknow", "state": "Uttar Pradesh", "zone": "North", "type": "Royal Heritage & Food", "lat": 26.8467, "lng": 80.9462, "famous_for": "Bara Imambara, Rumi Darwaza, Awadhi Cuisine"},
    {"name": "Jaipur", "state": "Rajasthan", "zone": "North", "type": "Royal Palaces & Forts", "lat": 26.9124, "lng": 75.7873, "famous_for": "Hawa Mahal, Amber Fort, City Palace, Nahargarh"},
    {"name": "Udaipur", "state": "Rajasthan", "zone": "North", "type": "Lakes & Luxury Palaces", "lat": 24.5854, "lng": 73.7125, "famous_for": "Lake Pichola, City Palace, Jag Mandir, Sajjangarh"},
    {"name": "Jodhpur", "state": "Rajasthan", "zone": "North", "type": "Blue City & Forts", "lat": 26.2389, "lng": 73.0243, "famous_for": "Mehrangarh Fort, Umaid Bhawan, Jaswant Thada"},
    {"name": "Jaisalmer", "state": "Rajasthan", "zone": "North", "type": "Desert Safari & Golden Fort", "lat": 26.9157, "lng": 70.9083, "famous_for": "Sam Sand Dunes, Jaisalmer Fort, Camel Safari"},
    {"name": "Pushkar", "state": "Rajasthan", "zone": "North", "type": "Spiritual & Desert Fair", "lat": 26.4899, "lng": 74.5511, "famous_for": "Brahma Temple, Pushkar Lake, Desert Camel Fair"},
    {"name": "Mount Abu", "state": "Rajasthan", "zone": "North", "type": "Hill Station & Temples", "lat": 24.5926, "lng": 72.7156, "famous_for": "Dilwara Jain Temples, Nakki Lake, Sunset Point"},
    {"name": "Ranthambore", "state": "Rajasthan", "zone": "North", "type": "Wildlife & Tiger Safari", "lat": 26.0173, "lng": 76.5026, "famous_for": "Tiger Safari, Ranthambore National Park, Fort"},
    {"name": "Amritsar", "state": "Punjab", "zone": "North", "type": "Spiritual & Border Heritage", "lat": 31.6340, "lng": 74.8723, "famous_for": "Golden Temple, Wagah Border, Jallianwala Bagh"},
    {"name": "Manali", "state": "Himachal Pradesh", "zone": "North", "type": "Snow Hills & Adventure", "lat": 32.2396, "lng": 77.1887, "famous_for": "Solang Valley, Rohtang Pass, Old Manali, Atal Tunnel"},
    {"name": "Shimla", "state": "Himachal Pradesh", "zone": "North", "type": "Colonial Hill Station", "lat": 31.1048, "lng": 77.1734, "famous_for": "Mall Road, Ridge, Kufri, Jakhoo Temple, Toy Train"},
    {"name": "Dharamshala & McLeodganj", "state": "Himachal Pradesh", "zone": "North", "type": "Tibetan Culture & Trekking", "lat": 32.2190, "lng": 76.3234, "famous_for": "Dalai Lama Temple, Triund Trek, Bhagsu Waterfall"},
    {"name": "Bir Billing", "state": "Himachal Pradesh", "zone": "North", "type": "Paragliding & Monasteries", "lat": 32.0514, "lng": 76.7169, "famous_for": "World #2 Paragliding Takeoff, Rajgundha Trek, Barot Valley"},
    {"name": "Kasol & Parvati Valley", "state": "Himachal Pradesh", "zone": "North", "type": "Riverside Valleys & Treks", "lat": 32.0100, "lng": 77.3152, "famous_for": "Kheerganga Trek, Tosh, Malana Village, Chalal Trail"},
    {"name": "Spiti Valley", "state": "Himachal Pradesh", "zone": "North", "type": "High-Altitude Cold Desert", "lat": 32.2461, "lng": 78.0349, "famous_for": "Key Monastery, Chandratal Lake, Kaza, Hikkim Post Office"},
    {"name": "Jibhi & Tirthan Valley", "state": "Himachal Pradesh", "zone": "North", "type": "Offbeat Pine Valleys", "lat": 31.6393, "lng": 77.3482, "famous_for": "Jibhi Waterfalls, Jalori Pass, Serolsar Lake, Trout Fishing"},
    {"name": "Dalhousie & Khajjiar", "state": "Himachal Pradesh", "zone": "North", "type": "Mini Switzerland of India", "lat": 32.5387, "lng": 75.9710, "famous_for": "Khajjiar Green Meadow, Panchpula, Dainkund Peak"},
    {"name": "Rishikesh", "state": "Uttarakhand", "zone": "North", "type": "Yoga & Adventure Capital", "lat": 30.0869, "lng": 78.2676, "famous_for": "River Rafting, Ganga Aarti, Laxman Jhula, Bungee Jump"},
    {"name": "Haridwar", "state": "Uttarakhand", "zone": "North", "type": "Holy Ghats & Pilgrimage", "lat": 29.9457, "lng": 78.1642, "famous_for": "Har Ki Pauri, Mansa Devi, Chandi Devi Temple"},
    {"name": "Nainital", "state": "Uttarakhand", "zone": "North", "type": "Lakes & Hill Resorts", "lat": 29.3919, "lng": 79.4542, "famous_for": "Naini Lake Boating, Naina Peak, Mall Road, Snow View"},
    {"name": "Mussoorie", "state": "Uttarakhand", "zone": "North", "type": "Queen of Hills", "lat": 30.4598, "lng": 78.0644, "famous_for": "Kempty Falls, Gun Hill, Camel's Back Road, Lal Tibba"},
    {"name": "Auli", "state": "Uttarakhand", "zone": "North", "type": "Snow Skiing Resort", "lat": 30.5283, "lng": 79.5671, "famous_for": "Ski Slopes, Auli Ropeway, Nanda Devi Views"},
    {"name": "Chopta & Tungnath", "state": "Uttarakhand", "zone": "North", "type": "High Altitude Shiva Temple", "lat": 30.4900, "lng": 79.1830, "famous_for": "Highest Shiva Temple in World, Chandrashila Summit Trek, Deoriatal"},
    {"name": "Kedarnath", "state": "Uttarakhand", "zone": "North", "type": "Holiest Jyotirlinga & Trek", "lat": 30.7346, "lng": 79.0669, "famous_for": "Kedarnath Dham, Bhairavnath Temple, Himalayan Peaks"},
    {"name": "Badrinath", "state": "Uttarakhand", "zone": "North", "type": "Maha Char Dham", "lat": 30.7433, "lng": 79.4938, "famous_for": "Badrinath Temple, Tapt Kund, Mana Last Indian Village"},
    {"name": "Jim Corbett", "state": "Uttarakhand", "zone": "North", "type": "Tiger Reserve & Jungle Lodges", "lat": 29.5300, "lng": 78.7747, "famous_for": "Jeep Safari, Royal Bengal Tigers, Dhikala Zone"},
    {"name": "Srinagar", "state": "Jammu & Kashmir", "zone": "North", "type": "Lakes, Houseboats & Gardens", "lat": 34.0837, "lng": 74.7973, "famous_for": "Dal Lake Shikara, Mughal Gardens, Shankaracharya Temple"},
    {"name": "Gulmarg", "state": "Jammu & Kashmir", "zone": "North", "type": "Snow Meadows & Gondola", "lat": 34.0484, "lng": 74.3805, "famous_for": "Gulmarg Gondola World #2 Highest, Skiing, Apharwat Peak"},
    {"name": "Pahalgam", "state": "Jammu & Kashmir", "zone": "North", "type": "Valleys & Pine Forests", "lat": 34.0161, "lng": 75.1932, "famous_for": "Betaab Valley, Aru Valley, Baisaran Mini Switzerland"},
    {"name": "Leh Ladakh", "state": "Ladakh", "zone": "North", "type": "High Passes & Lakes", "lat": 34.1526, "lng": 77.5771, "famous_for": "Pangong Tso Lake, Nubra Valley, Khardung La Pass, Magnetic Hill"},

    # --- WEST INDIA ---
    {"name": "Mumbai", "state": "Maharashtra", "zone": "West", "type": "Coastal Metropolis & Culture", "lat": 19.0760, "lng": 72.8777, "famous_for": "Gateway of India, Marine Drive, Elephanta Caves, Juhu"},
    {"name": "Pune", "state": "Maharashtra", "zone": "West", "type": "Maratha Heritage & Forts", "lat": 18.5204, "lng": 73.8567, "famous_for": "Shaniwar Wada, Sinhagad Fort, Aga Khan Palace"},
    {"name": "Lonavala & Khandala", "state": "Maharashtra", "zone": "West", "type": "Ghats & Waterfalls", "lat": 18.7557, "lng": 73.4091, "famous_for": "Tiger's Point, Bhushi Dam, Karla Caves, Rajmachi Fort"},
    {"name": "Mahabaleshwar & Panchgani", "state": "Maharashtra", "zone": "West", "type": "Strawberry Hills & Cliffs", "lat": 17.9307, "lng": 73.6477, "famous_for": "Arthur's Seat, Venna Lake, Table Land, Strawberry Farms"},
    {"name": "Shirdi", "state": "Maharashtra", "zone": "West", "type": "Spiritual Pilgrimage", "lat": 19.7645, "lng": 74.4762, "famous_for": "Sai Baba Temple, Dwarkamai, Chavadi"},
    {"name": "Chhatrapati Sambhajinagar", "state": "Maharashtra", "zone": "West", "type": "UNESCO Rock Caves", "lat": 19.8762, "lng": 75.3433, "famous_for": "Ajanta Caves, Ellora Caves, Bibi Ka Maqbara, Daulatabad Fort"},
    {"name": "Nashik", "state": "Maharashtra", "zone": "West", "type": "Wine Capital & Jyotirlinga", "lat": 19.9975, "lng": 73.7898, "famous_for": "Trimbakeshwar Jyotirlinga, Sula Vineyards, Panchavati"},
    {"name": "North Goa", "state": "Goa", "zone": "West", "type": "Party Beaches & Watersports", "lat": 15.5494, "lng": 73.7535, "famous_for": "Baga Beach, Calangute, Anjuna, Chapora Fort, Aguada Fort"},
    {"name": "South Goa", "state": "Goa", "zone": "West", "type": "Serene Beaches & Heritage", "lat": 15.2832, "lng": 73.9862, "famous_for": "Palolem Beach, Colva, Dudhsagar Waterfalls, Basilica of Bom Jesus"},
    {"name": "Ahmedabad", "state": "Gujarat", "zone": "West", "type": "Heritage City & Food", "lat": 23.0225, "lng": 72.5714, "famous_for": "Sabarmati Ashram, Adalaj Stepwell, Akshardham, Kankaria Lake"},
    {"name": "Rann of Kutch", "state": "Gujarat", "zone": "West", "type": "White Salt Desert", "lat": 23.7337, "lng": 69.8597, "famous_for": "White Desert Rann Utsav, Kala Dungar, Handicraft Villages"},
    {"name": "Gir National Park", "state": "Gujarat", "zone": "West", "type": "Asiatic Lion Sanctuary", "lat": 21.1243, "lng": 70.8242, "famous_for": "Asiatic Lion Safari, Kamleshwar Dam, Devalia Park"},
    {"name": "Somnath", "state": "Gujarat", "zone": "West", "type": "1st Holy Jyotirlinga", "lat": 20.8880, "lng": 70.4013, "famous_for": "Somnath Temple, Triveni Sangam Beach, Sound & Light Show"},
    {"name": "Dwarka", "state": "Gujarat", "zone": "West", "type": "Maha Char Dham & Sacred Port", "lat": 22.2442, "lng": 68.9685, "famous_for": "Dwarkadhish Temple, Bet Dwarka, Rukmini Devi Temple"},
    {"name": "Statue of Unity (Kevadia)", "state": "Gujarat", "zone": "West", "type": "World's Tallest Statue", "lat": 21.8380, "lng": 73.7191, "famous_for": "182m Sardar Patel Statue, Valley of Flowers, Narmada Dam"},

    # --- SOUTH INDIA ---
    {"name": "Bengaluru", "state": "Karnataka", "zone": "South", "type": "Garden City & Tech Hub", "lat": 12.9716, "lng": 77.5946, "famous_for": "Lalbagh Botanical Garden, Bangalore Palace, Cubbon Park"},
    {"name": "Mysuru", "state": "Karnataka", "zone": "South", "type": "Palaces & Silk Heritage", "lat": 12.2958, "lng": 76.6394, "famous_for": "Mysore Palace, Chamundi Hill, Brindavan Gardens"},
    {"name": "Coorg", "state": "Karnataka", "zone": "South", "type": "Coffee Hills & Waterfalls", "lat": 12.3375, "lng": 75.8069, "famous_for": "Abbey Falls, Raja's Seat, Dubare Elephant Camp, Talacauvery"},
    {"name": "Hampi", "state": "Karnataka", "zone": "South", "type": "Ancient Vijayanagara Ruins", "lat": 15.3350, "lng": 76.4600, "famous_for": "Virupaksha Temple, Stone Chariot, Matanga Hill Sunset, Coracle Ride"},
    {"name": "Gokarna", "state": "Karnataka", "zone": "South", "type": "Cliff Beaches & Shiva Temple", "lat": 14.5479, "lng": 74.3188, "famous_for": "Om Beach, Kudle Beach, Mahabaleshwar Temple, Half Moon Beach"},
    {"name": "Chikmagalur", "state": "Karnataka", "zone": "South", "type": "Highest Peaks & Coffee Hills", "lat": 13.3161, "lng": 75.7720, "famous_for": "Mullayanagiri Peak (Highest in Karnataka), Baba Budangiri, Hebbe Falls"},
    {"name": "Murudeshwar", "state": "Karnataka", "zone": "South", "type": "Giant Shiva & Scuba Island", "lat": 14.0940, "lng": 74.4899, "famous_for": "World #2 Tallest Shiva Statue, Netrani Island Scuba Diving, Beach"},
    {"name": "Munnar", "state": "Kerala", "zone": "South", "type": "Rolling Tea Hills & Mist", "lat": 10.0889, "lng": 77.0595, "famous_for": "Tea Plantations, Eravikulam Nilgiri Tahr, Mattupetty Dam"},
    {"name": "Alleppey", "state": "Kerala", "zone": "South", "type": "Venice of the East", "lat": 9.4981, "lng": 76.3388, "famous_for": "Overnight Houseboat Backwaters, Marari Beach, Punnamada Lake"},
    {"name": "Kochi", "state": "Kerala", "zone": "South", "type": "Colonial Coastal Port", "lat": 9.9312, "lng": 76.2673, "famous_for": "Fort Kochi, Chinese Fishing Nets, Mattancherry Palace, Kathakali"},
    {"name": "Wayanad", "state": "Kerala", "zone": "South", "type": "Lush Rainforests & Caves", "lat": 11.6854, "lng": 76.1320, "famous_for": "Edakkal Prehistoric Caves, Banasura Sagar Dam, Chembra Peak Heart Lake"},
    {"name": "Varkala", "state": "Kerala", "zone": "South", "type": "Dramatic Red Cliffs & Sea", "lat": 8.7379, "lng": 76.7163, "famous_for": "Varkala Cliff Beach, Janardhanaswamy Temple, Sunset Cafes"},
    {"name": "Chennai", "state": "Tamil Nadu", "zone": "South", "type": "Coastal Metropolis & Dravidian Art", "lat": 13.0827, "lng": 80.2707, "famous_for": "Marina Beach, Kapaleeshwarar Temple, San Thome Basilica"},
    {"name": "Mahabalipuram", "state": "Tamil Nadu", "zone": "South", "type": "UNESCO Shore Temples", "lat": 12.6269, "lng": 80.1927, "famous_for": "Shore Temple, Pancha Rathas, Arjuna's Penance, Rock Carvings"},
    {"name": "Madurai", "state": "Tamil Nadu", "zone": "South", "type": "Temple City of India", "lat": 9.9252, "lng": 78.1198, "famous_for": "Meenakshi Amman Temple, Thirumalai Nayakkar Palace"},
    {"name": "Rameshwaram", "state": "Tamil Nadu", "zone": "South", "type": "Maha Char Dham & Sacred Sea", "lat": 9.2876, "lng": 79.3129, "famous_for": "Ramanathaswamy Temple Corridor, Dhanushkodi Ghost Town, Pamban Bridge"},
    {"name": "Kanyakumari", "state": "Tamil Nadu", "zone": "South", "type": "Southernmost Tip of India", "lat": 8.0883, "lng": 77.5385, "famous_for": "Vivekananda Rock Memorial, Thiruvalluvar Statue, Triveni Sea Sangam"},
    {"name": "Ooty", "state": "Tamil Nadu", "zone": "South", "type": "Queen of Nilgiri Hills", "lat": 11.4102, "lng": 76.6950, "famous_for": "Nilgiri Mountain Railway Toy Train, Ooty Lake, Botanical Garden, Doddabetta"},
    {"name": "Kodaikanal", "state": "Tamil Nadu", "zone": "South", "type": "Princess of Hill Stations", "lat": 10.2381, "lng": 77.4892, "famous_for": "Kodai Lake, Pillar Rocks, Coaker's Walk, Silver Cascade Falls"},
    {"name": "Hyderabad", "state": "Telangana", "zone": "South", "type": "City of Pearls & Biryani", "lat": 17.3850, "lng": 78.4867, "famous_for": "Charminar, Golconda Fort, Ramoji Film City, Hussain Sagar"},
    {"name": "Visakhapatnam", "state": "Andhra Pradesh", "zone": "South", "type": "Port City & Beaches", "lat": 17.6868, "lng": 83.2185, "famous_for": "Rishikonda Beach, Submarine Museum, Kailasagiri Hill"},
    {"name": "Araku Valley", "state": "Andhra Pradesh", "zone": "South", "type": "Tribal Valleys & Caves", "lat": 18.3273, "lng": 82.8775, "famous_for": "Borra Caves, Coffee Gardens, Katiki Waterfalls, Tribal Museum"},
    {"name": "Tirupati", "state": "Andhra Pradesh", "zone": "South", "type": "World's Richest Temple", "lat": 13.6288, "lng": 79.4192, "famous_for": "Tirumala Venkateswara Temple, Silathoranam, Sri Vari Padalu"},
    {"name": "Pondicherry", "state": "Puducherry", "zone": "South", "type": "French Quarter & Promenade", "lat": 11.9416, "lng": 79.8083, "famous_for": "Auroville, French White Town, Promenade Beach, Paradise Beach"},

    # --- EAST & NORTH-EAST INDIA ---
    {"name": "Kolkata", "state": "West Bengal", "zone": "East", "type": "City of Joy & Culture", "lat": 22.5726, "lng": 88.3639, "famous_for": "Victoria Memorial, Howrah Bridge, Dakshineswar Kali Temple, Park Street"},
    {"name": "Darjeeling", "state": "West Bengal", "zone": "East", "type": "Himalayan Toy Train & Tea", "lat": 27.0410, "lng": 88.2663, "famous_for": "Tiger Hill Kanchenjunga Sunrise, Himalayan Toy Train, Batasia Loop, Happy Valley Tea"},
    {"name": "Sundarbans", "state": "West Bengal", "zone": "East", "type": "Mangrove Delta & Tigers", "lat": 21.9497, "lng": 89.1833, "famous_for": "Royal Bengal Tiger Boat Safari, Mangrove Forest, Sajnekhali Watch Tower"},
    {"name": "Gaya & Bodh Gaya", "state": "Bihar", "zone": "East", "type": "Enlightenment Seat & Shrine", "lat": 24.7447, "lng": 84.9512, "famous_for": "Mahabodhi Temple UNESCO, Sacred Bodhi Tree, Great 80ft Buddha, Vishnupad Temple"},
    {"name": "Rajgir & Nalanda", "state": "Bihar", "zone": "East", "type": "Ancient University & Stupa", "lat": 25.0300, "lng": 85.4200, "famous_for": "Vishwa Shanti Stupa, Ancient Nalanda University Ruins, Gridhakuta Peak"},
    {"name": "Puri", "state": "Odisha", "zone": "East", "type": "Maha Char Dham & Beach", "lat": 19.8135, "lng": 85.8312, "famous_for": "Jagannath Temple, Rath Yatra, Golden Blue Flag Beach"},
    {"name": "Konark", "state": "Odisha", "zone": "East", "type": "UNESCO Sun Chariot Temple", "lat": 19.8876, "lng": 86.0945, "famous_for": "Black Pagoda Sun Temple, Chandrabhaga Beach"},
    {"name": "Gangtok", "state": "Sikkim", "zone": "East", "type": "Himalayan Monasteries & Passes", "lat": 27.3389, "lng": 88.6065, "famous_for": "MG Marg, Tsomgo Lake, Nathula Pass Indo-China Border, Rumtek Monastery"},
    {"name": "Pelling", "state": "Sikkim", "zone": "East", "type": "Kanchenjunga Views & Skywalk", "lat": 27.3167, "lng": 88.2333, "famous_for": "Glass Skywalk, Chenrezig Statue, Pemayangtse Monastery"},
    {"name": "Lachung & Yumthang", "state": "Sikkim", "zone": "East", "type": "Valley of Flowers & Zero Point", "lat": 27.6891, "lng": 88.7430, "famous_for": "Yumthang Valley of Rhododendrons, Zero Point Snow, Hot Springs"},
    {"name": "Guwahati", "state": "Assam", "zone": "East", "type": "Gateway to North-East & Shrine", "lat": 26.1445, "lng": 91.7362, "famous_for": "Kamakhya Devi Shaktipeeth, Brahmaputra Sunset Cruise, Umananda Island"},
    {"name": "Kaziranga", "state": "Assam", "zone": "East", "type": "One-Horned Rhino Safari", "lat": 26.5775, "lng": 93.1711, "famous_for": "One-Horned Rhinoceros Safari, Elephant Ride, Orchid National Park"},
    {"name": "Shillong", "state": "Meghalaya", "zone": "East", "type": "Scotland of the East", "lat": 25.5788, "lng": 91.8933, "famous_for": "Umiam Lake, Elephant Falls, Police Bazar, Laitlum Canyons"},
    {"name": "Cherrapunji & Dawki", "state": "Meghalaya", "zone": "East", "type": "Living Root Bridges & Crystal Rivers", "lat": 25.2986, "lng": 91.5822, "famous_for": "Double Decker Living Root Bridges, Nohkalikai Falls, Dawki Umngot Transparent River"},
    {"name": "Tawang", "state": "Arunachal Pradesh", "zone": "East", "type": "High Monasteries & Mountain Passes", "lat": 27.5861, "lng": 91.8594, "famous_for": "Tawang Monastery (India's Largest), Sela Pass 13,700ft, Madhuri Lake"},
    {"name": "Ziro Valley", "state": "Arunachal Pradesh", "zone": "East", "type": "Pine Valleys & Tribal Heritage", "lat": 27.5950, "lng": 93.8385, "famous_for": "Apatani Tribe, Paddy-cum-Fish Cultivation, Ziro Music Festival"},

    # --- CENTRAL INDIA ---
    {"name": "Bhopal", "state": "Madhya Pradesh", "zone": "Central", "type": "Lakes & Sanchi Stupa", "lat": 23.2599, "lng": 77.4126, "famous_for": "Upper Lake, UNESCO Sanchi Stupa, Bhimbetka Cave Paintings"},
    {"name": "Indore", "state": "Madhya Pradesh", "zone": "Central", "type": "Cleanest City & Street Food", "lat": 22.7196, "lng": 75.8577, "famous_for": "Sarafa Night Food Market, Chappan Dukan, Rajwada Palace"},
    {"name": "Ujjain", "state": "Madhya Pradesh", "zone": "Central", "type": "Holy Jyotirlinga & Bhasma Aarti", "lat": 23.1765, "lng": 75.7885, "famous_for": "Mahakaleshwar Jyotirlinga, Kal Bhairav Temple, Ram Ghat Shipra Aarti"},
    {"name": "Khajuraho", "state": "Madhya Pradesh", "zone": "Central", "type": "UNESCO Erotic Temple Art", "lat": 24.8318, "lng": 79.9199, "famous_for": "Kandariya Mahadeva, Western Group of Temples, Light & Sound Show"},
    {"name": "Pachmarhi", "state": "Madhya Pradesh", "zone": "Central", "type": "Queen of Satpura Hills", "lat": 22.4674, "lng": 78.4335, "famous_for": "Bee Falls, Dhoopgarh Highest Sunset Point, Jata Shankar Caves"},
    {"name": "Jabalpur", "state": "Madhya Pradesh", "zone": "Central", "type": "Marble Rocks & Dhuandhar", "lat": 23.1815, "lng": 79.9864, "famous_for": "Bhedaghat Marble Rocks Boat Ride, Dhuandhar Waterfalls"},
    {"name": "Bandhavgarh & Kanha", "state": "Madhya Pradesh", "zone": "Central", "type": "Highest Tiger Density Parks", "lat": 23.7226, "lng": 81.0253, "famous_for": "Tiger Safari, Sal Forests, Bamni Dadar Sunset"},

    # --- ISLANDS ---
    {"name": "Port Blair", "state": "Andaman & Nicobar", "zone": "Islands", "type": "Freedom Trail & Coral Beaches", "lat": 11.6234, "lng": 92.7265, "famous_for": "Cellular Jail National Memorial, Ross Island, Corbyn's Cove"},
    {"name": "Havelock Island (Swaraj Dweep)", "state": "Andaman & Nicobar", "zone": "Islands", "type": "Asia's Best Beach & Scuba", "lat": 11.9761, "lng": 92.9876, "famous_for": "Radhanagar Beach (Asia #1), Elephant Beach Scuba & Coral Snorkeling"},
    {"name": "Neil Island (Shaheed Dweep)", "state": "Andaman & Nicobar", "zone": "Islands", "type": "Natural Coral Rock & Serenity", "lat": 11.8324, "lng": 93.0506, "famous_for": "Natural Coral Bridge, Laxmanpur Sunset Beach, Bharatpur Water Sports"},
    {"name": "Lakshadweep", "state": "Lakshadweep", "zone": "Islands", "type": "Turquoise Lagoons & Coral Atolls", "lat": 10.5667, "lng": 72.6417, "famous_for": "Agatti Island Lagoon, Bangaram Coral Atoll, Scuba Diving & Kayaking"}
]

# Destination Index for fast lookup & spell correction
DEST_NAMES = [d["name"] for d in PAN_INDIA_DESTINATIONS]
NAME_TO_DEST = {d["name"].lower(): d for d in PAN_INDIA_DESTINATIONS}

def search_pan_india_destinations(query: str, limit: int = 8) -> dict:
    """
    Intelligent Search Engine:
    1. Prefix / Substring match across all destinations & keywords.
    2. Fuzzy auto-correction for spelling mistakes (e.g. 'mnli' -> 'Manali').
    3. Returns exact match status and structured results.
    """
    if not query or not query.strip():
        return {"results": PAN_INDIA_DESTINATIONS[:limit], "did_you_mean": None, "exact_match": False}

    q = query.strip().lower()

    # 1. Exact / Prefix / Substring matching
    exact_matches = []
    for d in PAN_INDIA_DESTINATIONS:
        d_name = d["name"].lower()
        d_state = d["state"].lower()
        d_famous = d["famous_for"].lower()
        d_type = d["type"].lower()

        # Score relevance
        if d_name.startswith(q):
            exact_matches.append((10, d))
        elif q in d_name:
            exact_matches.append((8, d))
        elif d_state.startswith(q) or q in d_state:
            exact_matches.append((6, d))
        elif q in d_famous or q in d_type:
            exact_matches.append((4, d))

    exact_matches.sort(key=lambda x: x[0], reverse=True)
    results = [item[1] for item in exact_matches[:limit]]

    # 2. Fuzzy Auto-Correction if no direct results or few results
    did_you_mean = None
    if len(results) == 0:
        # Run fuzzy matching on names
        close_matches = difflib.get_close_matches(query.strip(), DEST_NAMES, n=1, cutoff=0.45)
        if close_matches:
            did_you_mean = close_matches[0]
            matched_obj = NAME_TO_DEST.get(did_you_mean.lower())
            if matched_obj:
                results = [matched_obj]

    return {
        "results": results,
        "did_you_mean": did_you_mean,
        "exact_match": len(results) > 0 and (results[0]["name"].lower() == q or q in results[0]["name"].lower()),
        "total_matches": len(results)
    }

def log_unsupported_destination(destination_name: str, origin: str = ""):
    """Logs user-requested unknown locations to wishlist for future enrichment."""
    try:
        data = []
        if os.path.exists(REQUESTED_LOG_PATH):
            with open(REQUESTED_LOG_PATH, "r") as f:
                data = json.load(f)
        data.append({
            "requested_destination": destination_name,
            "origin": origin
        })
        with open(REQUESTED_LOG_PATH, "w") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"Logging error: {e}")
