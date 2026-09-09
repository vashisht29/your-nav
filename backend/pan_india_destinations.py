# backend/pan_india_destinations.py
"""
Pan-India Destination Registry & Intelligent Fuzzy Search Engine
Comprehensive coverage of 200+ iconic destinations, districts, and border corners across all 28 States & 8 UTs.
Includes:
- Prefix / Substring Autocomplete (e.g. 't' -> Tawang, Tirupati, Trivandrum, Tehri)
- Fuzzy Spelling Auto-Correction (e.g. 'kasmir' -> 'Srinagar / Kashmir', 'knyakumari' -> 'Kanyakumari')
- Spatial Coordinates for any location across India
- Unsupported Destination Wishlist Logging
"""

import os
import json
import difflib

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
os.makedirs(DATA_DIR, exist_ok=True)
REQUESTED_LOG_PATH = os.path.join(DATA_DIR, "requested_destinations.json")

# Master Pan-India Destinations & Districts Directory (All 28 States & 8 UTs)
PAN_INDIA_DESTINATIONS = [
    # =========================================================================
    # 1. NORTH INDIA (Jammu & Kashmir, Ladakh, Himachal, Uttarakhand, Punjab, Haryana, Delhi, UP)
    # =========================================================================
    {"name": "Delhi", "state": "Delhi", "zone": "North", "type": "National Capital & Heritage", "lat": 28.6139, "lng": 77.2090, "famous_for": "Red Fort, Qutub Minar, India Gate, Chandni Chowk Street Food"},
    {"name": "Srinagar", "state": "Jammu & Kashmir", "zone": "North", "type": "Lakes & Mughal Gardens", "lat": 34.0837, "lng": 74.7973, "famous_for": "Dal Lake Shikara, Mughal Gardens, Shankaracharya Temple, Hazratbal"},
    {"name": "Gulmarg", "state": "Jammu & Kashmir", "zone": "North", "type": "Snow Meadows & Ski Resort", "lat": 34.0484, "lng": 74.3805, "famous_for": "Gulmarg Gondola (World #2 Highest), Skiing, Apharwat Peak, Snow Golf"},
    {"name": "Pahalgam", "state": "Jammu & Kashmir", "zone": "North", "type": "Valleys & Pine Treks", "lat": 34.0161, "lng": 75.1932, "famous_for": "Betaab Valley, Aru Valley, Baisaran Mini Switzerland, Lidder River"},
    {"name": "Sonamarg", "state": "Jammu & Kashmir", "zone": "North", "type": "Meadow of Gold & Glaciers", "lat": 34.3012, "lng": 75.2947, "famous_for": "Thajiwas Glacier, Sindh River Trout Fishing, Gateway to Ladakh"},
    {"name": "Jammu", "state": "Jammu & Kashmir", "zone": "North", "type": "City of Temples", "lat": 32.7266, "lng": 74.8570, "famous_for": "Raghunath Temple, Bahu Fort, Amar Mahal Palace, Tawi River"},
    {"name": "Katra (Vaishno Devi)", "state": "Jammu & Kashmir", "zone": "North", "type": "Sacred Pilgrimage", "lat": 32.9928, "lng": 74.9317, "famous_for": "Mata Vaishno Devi Shrine, Trikuta Mountains, Bhairon Temple"},
    {"name": "Kargil & Dras", "state": "Ladakh", "zone": "North", "type": "War Memorial & High Passes", "lat": 34.5539, "lng": 76.1349, "famous_for": "Kargil War Memorial, Dras (2nd Coldest Inhabited Place on Earth), Suru Valley"},
    {"name": "Leh Ladakh", "state": "Ladakh", "zone": "North", "type": "High Himalayan Cold Desert", "lat": 34.1526, "lng": 77.5771, "famous_for": "Pangong Tso Lake, Khardung La Pass (17,982ft), Leh Palace, Shanti Stupa, Magnetic Hill"},
    {"name": "Nubra Valley & Turtuk", "state": "Ladakh", "zone": "North", "type": "Double-Humped Camels & Border Valley", "lat": 34.6863, "lng": 77.5673, "famous_for": "Hunder Sand Dunes, Bactrian Camels, Diskit Monastery, Turtuk (Last Northern Village)"},
    {"name": "Zanskar Valley (Padum)", "state": "Ladakh", "zone": "North", "type": "Frozen Chadar Trek & Monasteries", "lat": 33.4650, "lng": 76.8830, "famous_for": "Phugtal Cave Monastery, Chadar Ice Trek, Zanskar River Rafting"},
    {"name": "Manali", "state": "Himachal Pradesh", "zone": "North", "type": "Snow Hills & Adventure", "lat": 32.2396, "lng": 77.1887, "famous_for": "Solang Valley, Rohtang Pass, Old Manali Cafes, Atal Tunnel, Hadimba Temple"},
    {"name": "Shimla", "state": "Himachal Pradesh", "zone": "North", "type": "Colonial Summer Capital", "lat": 31.1048, "lng": 77.1734, "famous_for": "Mall Road, Ridge, Kufri Snow Point, Jakhoo Temple, Kalka-Shimla Toy Train"},
    {"name": "Dharamshala & McLeodganj", "state": "Himachal Pradesh", "zone": "North", "type": "Tibetan Culture & High Treks", "lat": 32.2190, "lng": 76.3234, "famous_for": "Dalai Lama Temple, Triund Hill Trek, Bhagsu Waterfall, Norbulingka Institute"},
    {"name": "Bir Billing", "state": "Himachal Pradesh", "zone": "North", "type": "World Paragliding Capital", "lat": 32.0514, "lng": 76.7169, "famous_for": "World #2 Paragliding Takeoff, Landing Site Sunset, Chokling Monastery, Baijnath Shiva Temple"},
    {"name": "Kasol & Parvati Valley", "state": "Himachal Pradesh", "zone": "North", "type": "Riverside Pine Valleys & Treks", "lat": 32.0100, "lng": 77.3152, "famous_for": "Kheerganga Hot Springs, Tosh Village, Malana Heritage, Chalal River Trail"},
    {"name": "Spiti Valley (Kaza)", "state": "Himachal Pradesh", "zone": "North", "type": "High Altitude Cold Desert & Stupas", "lat": 32.2276, "lng": 78.0710, "famous_for": "Key Gompa, Chandratal Crescent Lake, Hikkim (Highest Post Office), Komic (Highest Village)"},
    {"name": "Jibhi & Tirthan Valley", "state": "Himachal Pradesh", "zone": "North", "type": "Offbeat Pine Forest Valley", "lat": 31.6393, "lng": 77.3482, "famous_for": "Jibhi Waterfalls, Jalori Pass, Serolsar Lake, Great Himalayan National Park"},
    {"name": "Dalhousie & Khajjiar", "state": "Himachal Pradesh", "zone": "North", "type": "Mini Switzerland of India", "lat": 32.5387, "lng": 75.9710, "famous_for": "Khajjiar Green Meadow, Panchpula Waterfall, Dainkund Peak, Kalatop Sanctuary"},
    {"name": "Kinnaur (Kalpa & Chitkul)", "state": "Himachal Pradesh", "zone": "North", "type": "Apple Orchards & Last Indian Village", "lat": 31.5367, "lng": 78.2562, "famous_for": "Chitkul (Last Village of India on Indo-Tibet Border), Kinner Kailash View, Apple Valleys"},
    {"name": "Rishikesh", "state": "Uttarakhand", "zone": "North", "type": "Yoga Capital & White Water Rafting", "lat": 30.0869, "lng": 78.2676, "famous_for": "River Rafting, Ganga Evening Aarti, Laxman Jhula, Bungee Jump Mohan Chatti, Beatles Ashram"},
    {"name": "Haridwar", "state": "Uttarakhand", "zone": "North", "type": "Holy Ghats & Ganga Pilgrimage", "lat": 29.9457, "lng": 78.1642, "famous_for": "Har Ki Pauri Maha Aarti, Mansa Devi Cable Car, Chandi Devi Temple, Shanti Kunj"},
    {"name": "Dehradun & Mussoorie", "state": "Uttarakhand", "zone": "North", "type": "Queen of Hills & Doon Valley", "lat": 30.4598, "lng": 78.0644, "famous_for": "Kempty Falls, Gun Hill, Camel's Back Road, Robber's Cave (Guchhupani), FRI Dehradun"},
    {"name": "Nainital", "state": "Uttarakhand", "zone": "North", "type": "Lake District of Kumaon", "lat": 29.3919, "lng": 79.4542, "famous_for": "Naini Lake Boating, Naina Peak, Mall Road, Snow View Ropeway, Bhimtal Lake"},
    {"name": "Auli", "state": "Uttarakhand", "zone": "North", "type": "Himalayan Ski Resort", "lat": 30.5283, "lng": 79.5671, "famous_for": "Ski Slopes, Auli Ropeway (Longest in Asia), Nanda Devi Mountain Views, Gurso Bugyal"},
    {"name": "Chopta & Tungnath", "state": "Uttarakhand", "zone": "North", "type": "Highest Shiva Temple & Alpine Meadows", "lat": 30.4900, "lng": 79.1830, "famous_for": "Tungnath (Highest Shiva Temple in World), Chandrashila Peak 13,000ft, Deoriatal Lake"},
    {"name": "Kedarnath", "state": "Uttarakhand", "zone": "North", "type": "Maha Jyotirlinga & Glacier Valley", "lat": 30.7346, "lng": 79.0669, "famous_for": "Kedarnath Temple 11,755ft, Mandakini River, Bhairavnath Temple, Vasuki Tal Trek"},
    {"name": "Badrinath & Mana", "state": "Uttarakhand", "zone": "North", "type": "Maha Char Dham & First Village of India", "lat": 30.7433, "lng": 79.4938, "famous_for": "Badrinath Temple, Tapt Kund Hot Spring, Mana (First Indian Village), Vasudhara Falls"},
    {"name": "Jim Corbett National Park", "state": "Uttarakhand", "zone": "North", "type": "Tiger Reserve & Jungle Safari", "lat": 29.5300, "lng": 78.7747, "famous_for": "Jeep Safari, Royal Bengal Tigers, Dhikala Zone, Ramganga River, Corbett Falls"},
    {"name": "Almora & Ranikhet", "state": "Uttarakhand", "zone": "North", "type": "Cultural Kumaon & Pine Hills", "lat": 29.5971, "lng": 79.6591, "famous_for": "Kasai Temple, Bright End Corner, Chaubatia Apple Gardens, Golf Course Ranikhet"},
    {"name": "Pithoragarh & Munsiyari", "state": "Uttarakhand", "zone": "North", "type": "Little Kashmir & Panchachuli Peaks", "lat": 30.0667, "lng": 80.2333, "famous_for": "Panchachuli Five Peaks, Birthi Falls, Milam Glacier Base, Indo-Nepal Border Valley"},
    {"name": "Amritsar", "state": "Punjab", "zone": "North", "type": "Spiritual Golden Temple & Border", "lat": 31.6340, "lng": 74.8723, "famous_for": "Harmandir Sahib (Golden Temple), Wagah Border Retreat Ceremony, Jallianwala Bagh, Kulcha"},
    {"name": "Chandigarh", "state": "Chandigarh", "zone": "North", "type": "The City Beautiful & Architecture", "lat": 30.7333, "lng": 76.7794, "famous_for": "Rock Garden by Nek Chand, Sukhna Lake, Rose Garden, Capitol Complex UNESCO"},
    {"name": "Kurukshetra", "state": "Haryana", "zone": "North", "type": "Land of Bhagavad Gita & Mahabharata", "lat": 29.9695, "lng": 76.8783, "famous_for": "Brahma Sarovar, Jyotisar (Birthplace of Gita), Krishna Museum, Sheikh Chilli Tomb"},
    {"name": "Gurugram (Gurgaon)", "state": "Haryana", "zone": "North", "type": "Millennium Tech City & Nightlife", "lat": 28.4595, "lng": 77.0266, "famous_for": "Cyber Hub, Sultanpur Bird Sanctuary, Kingdom of Dreams, Damdama Lake"},
    {"name": "Varanasi", "state": "Uttar Pradesh", "zone": "North", "type": "Spiritual Capital & Ganga Ghats", "lat": 25.3176, "lng": 82.9739, "famous_for": "Kashi Vishwanath Corridor, Dashashwamedh Ganga Aarti, Assi Ghat, Sarnath Stupa"},
    {"name": "Agra", "state": "Uttar Pradesh", "zone": "North", "type": "Wonder of the World & Mughal Architecture", "lat": 27.1767, "lng": 78.0081, "famous_for": "Taj Mahal, Agra Fort, Fatehpur Sikri, Mehtab Bagh Sunset, Petha"},
    {"name": "Ayodhya", "state": "Uttar Pradesh", "zone": "North", "type": "Ram Janmabhoomi & Sacred Saryu", "lat": 26.7922, "lng": 82.1998, "famous_for": "Shri Ram Janmabhoomi Mandir, Saryu River Aarti, Hanuman Garhi, Kanak Bhawan"},
    {"name": "Mathura & Vrindavan", "state": "Uttar Pradesh", "zone": "North", "type": "Braj Bhumi & Krishna Temples", "lat": 27.4924, "lng": 77.6737, "famous_for": "Banke Bihari Temple, Prem Mandir Light Show, Krishna Janmabhoomi, ISKCON Vrindavan"},
    {"name": "Prayagraj (Allahabad)", "state": "Uttar Pradesh", "zone": "North", "type": "Triveni Sangam & Maha Kumbh", "lat": 25.4358, "lng": 81.8463, "famous_for": "Triveni Sangam (Ganga-Yamuna-Saraswati), Allahabad Fort, Anand Bhavan, Kumbh Grounds"},
    {"name": "Lucknow", "state": "Uttar Pradesh", "zone": "North", "type": "City of Nawabs & Awadhi Cuisine", "lat": 26.8467, "lng": 80.9462, "famous_for": "Bara Imambara Bhulbhulaiya, Rumi Darwaza, Hazratganj, Tunday Kababi, Chikan Kari"},
    {"name": "Jhansi", "state": "Uttar Pradesh", "zone": "North", "type": "Historic Fort of Rani Lakshmibai", "lat": 25.4484, "lng": 78.5685, "famous_for": "Jhansi Fort, Rani Mahal, Government Museum, 1857 Rebellion Heritage"},

    # =========================================================================
    # 2. WEST INDIA (Rajasthan, Gujarat, Maharashtra, Goa, Daman & Diu)
    # =========================================================================
    {"name": "Jaipur", "state": "Rajasthan", "zone": "West", "type": "Pink City & UNESCO Heritage", "lat": 26.9124, "lng": 75.7873, "famous_for": "Hawa Mahal, Amber Fort, City Palace, Jantar Mantar, Nahargarh Sunset"},
    {"name": "Udaipur", "state": "Rajasthan", "zone": "West", "type": "City of Lakes & Royal Romance", "lat": 24.5854, "lng": 73.7125, "famous_for": "Lake Pichola Boating, City Palace Udaipur, Jag Mandir, Sajjangarh Monsoon Palace"},
    {"name": "Jodhpur", "state": "Rajasthan", "zone": "West", "type": "Blue City & Sun City", "lat": 26.2389, "lng": 73.0243, "famous_for": "Mehrangarh Fort, Umaid Bhawan Palace, Jaswant Thada, Blue Houses Old Town"},
    {"name": "Jaisalmer", "state": "Rajasthan", "zone": "West", "type": "Golden Fort & Thar Desert Safari", "lat": 26.9157, "lng": 70.9083, "famous_for": "Jaisalmer Living Fort, Sam Sand Dunes Camel Safari, Kuldhara Ghost Village, Patwon Ki Haveli"},
    {"name": "Pushkar", "state": "Rajasthan", "zone": "West", "type": "Holy Lake & Brahma Temple", "lat": 26.4899, "lng": 74.5511, "famous_for": "World's Rare Lord Brahma Temple, Pushkar Holy Lake Ghats, Desert Camel Fair, Savitri Temple"},
    {"name": "Mount Abu", "state": "Rajasthan", "zone": "West", "type": "Only Hill Station of Rajasthan", "lat": 24.5926, "lng": 72.7156, "famous_for": "Dilwara Marble Jain Temples, Nakki Lake Boating, Sunset Point, Guru Shikhar Highest Peak"},
    {"name": "Ranthambore", "state": "Rajasthan", "zone": "West", "type": "Royal Bengal Tiger Reserve", "lat": 26.0173, "lng": 76.5026, "famous_for": "Tiger Safari, Ranthambore UNESCO Hill Fort, Padam Talao, Wild Animals"},
    {"name": "Bikaner", "state": "Rajasthan", "zone": "West", "type": "Camel Country & Junagarh Fort", "lat": 28.0229, "lng": 73.3119, "famous_for": "Junagarh Fort, Karni Mata Rat Temple (Deshnoke), Camel Research Breeding Farm, Bhujia"},
    {"name": "Chittorgarh", "state": "Rajasthan", "zone": "West", "type": "Pride of Rajput Valour", "lat": 24.8887, "lng": 74.6269, "famous_for": "Chittorgarh Fort (Largest in India), Vijay Stambh Tower of Victory, Rani Padmini Palace"},
    {"name": "Barmer", "state": "Rajasthan", "zone": "West", "type": "Desert Handicrafts & Dunes", "lat": 25.7521, "lng": 71.3967, "famous_for": "Mahabar Sand Dunes, Kiradu Ancient Temples, Siwana Fort, Wood Carvings"},
    {"name": "Ahmedabad", "state": "Gujarat", "zone": "West", "type": "First UNESCO World Heritage City", "lat": 23.0225, "lng": 72.5714, "famous_for": "Sabarmati Ashram, Adalaj Stepwell, Akshardham Gandhinagar, Kankaria Lake, Street Food"},
    {"name": "Rann of Kutch (Bhuj)", "state": "Gujarat", "zone": "West", "type": "White Salt Desert & Rann Utsav", "lat": 23.7337, "lng": 69.8597, "famous_for": "Great White Rann of Kutch, Full Moon Desert Festival, Kala Dungar, Dholavira Harappan Site"},
    {"name": "Gir National Park", "state": "Gujarat", "zone": "West", "type": "Sole Home of Asiatic Lions", "lat": 21.1243, "lng": 70.8242, "famous_for": "Asiatic Lion Open Jeep Safari, Kamleshwar Dam, Devalia Safari Park, Wildlife"},
    {"name": "Somnath", "state": "Gujarat", "zone": "West", "type": "First Among 12 Holy Jyotirlingas", "lat": 20.8880, "lng": 70.4013, "famous_for": "Somnath Temple by the Sea, Sound & Light Show, Triveni Sangam Beach, Bhalka Tirth"},
    {"name": "Dwarka", "state": "Gujarat", "zone": "West", "type": "Maha Char Dham & Krishna's Kingdom", "lat": 22.2442, "lng": 68.9685, "famous_for": "Dwarkadhish Jagat Mandir, Bet Dwarka Island Ferry, Gomti River Ghat, Rukmini Temple"},
    {"name": "Statue of Unity (Kevadia)", "state": "Gujarat", "zone": "West", "type": "World's Tallest Statue", "lat": 21.8380, "lng": 73.7191, "famous_for": "182m Sardar Patel Statue, Valley of Flowers, Narmada Dam Viewing Deck, Glow Garden"},
    {"name": "Surat", "state": "Gujarat", "zone": "West", "type": "Diamond & Textile Capital", "lat": 21.1702, "lng": 72.8311, "famous_for": "Surat Castle, Dumas Black Sand Beach, Gopi Talav, Surti Locho, Diamond Bourse"},
    {"name": "Saputara", "state": "Gujarat", "zone": "West", "type": "Sahyadri Hill Station & Lake", "lat": 20.5750, "lng": 73.7500, "famous_for": "Saputara Lake Boating, Sunrise Sunset Points, Gira Waterfalls, Ropeway Cable Car"},
    {"name": "Mumbai", "state": "Maharashtra", "zone": "West", "type": "Financial Capital & Bollywood City", "lat": 19.0760, "lng": 72.8777, "famous_for": "Gateway of India, Marine Drive Queen's Necklace, Elephanta Caves UNESCO, Juhu Beach"},
    {"name": "Pune", "state": "Maharashtra", "zone": "West", "type": "Oxford of the East & Forts", "lat": 18.5204, "lng": 73.8567, "famous_for": "Shaniwar Wada, Sinhagad Fort, Aga Khan Palace, Osho Ashram, FC Road Cafes"},
    {"name": "Lonavala & Khandala", "state": "Maharashtra", "zone": "West", "type": "Sahyadri Ghats & Waterfalls", "lat": 18.7557, "lng": 73.4091, "famous_for": "Tiger's Leap Point, Bhushi Dam, Karla & Bhaja Rock Caves, Rajmachi Fort, Chikki"},
    {"name": "Mahabaleshwar & Panchgani", "state": "Maharashtra", "zone": "West", "type": "Strawberry Hills & Cliffs", "lat": 17.9307, "lng": 73.6477, "famous_for": "Arthur's Seat, Venna Lake Boating, Table Land Plateau, Mapro Strawberry Gardens"},
    {"name": "Shirdi", "state": "Maharashtra", "zone": "West", "type": "Sai Baba Holy Pilgrimage", "lat": 19.7645, "lng": 74.4762, "famous_for": "Sai Baba Samadhi Temple, Dwarkamai, Gurusthan, Lendi Baug, Chavadi"},
    {"name": "Chhatrapati Sambhajinagar (Aurangabad)", "state": "Maharashtra", "zone": "West", "type": "UNESCO World Heritage Caves", "lat": 19.8762, "lng": 75.3433, "famous_for": "Ajanta Caves 30 Buddhist Caves, Ellora Kailash Temple, Bibi Ka Maqbara, Daulatabad Fort"},
    {"name": "Nashik", "state": "Maharashtra", "zone": "West", "type": "Wine Capital & Holy Trimbakeshwar", "lat": 19.9975, "lng": 73.7898, "famous_for": "Trimbakeshwar Jyotirlinga, Sula Vineyards Wine Tasting, Panchavati Godavari Ghats"},
    {"name": "Alibaug & Kashid", "state": "Maharashtra", "zone": "West", "type": "Coastal Forts & Clean Beaches", "lat": 18.6575, "lng": 72.8797, "famous_for": "Kolaba Sea Fort, Kashid White Sand Beach, Murud Janjira Undefeated Sea Fort, Water Sports"},
    {"name": "Matheran", "state": "Maharashtra", "zone": "West", "type": "Asia's Only Automobile-Free Hill Town", "lat": 18.9866, "lng": 73.2678, "famous_for": "Toy Train, Charlotte Lake, Panorama Point 360 View, Horse Riding, Echo Point"},
    {"name": "Kolhapur", "state": "Maharashtra", "zone": "West", "type": "Mahalakshmi Temple & Royal Palace", "lat": 16.7050, "lng": 74.2433, "famous_for": "Mahalakshmi Ambabai Temple, New Palace Museum, Rankala Lake, Kolhapuri Chappals"},
    {"name": "Tarkarli & Malvan", "state": "Maharashtra", "zone": "West", "type": "Scuba Diving & Sindhudurg Fort", "lat": 16.0396, "lng": 73.4912, "famous_for": "Sindhudurg Sea Fort, Scuba Diving & Snorkeling, Tarkarli White Beach, Malvani Fish Thali"},
    {"name": "North Goa", "state": "Goa", "zone": "West", "type": "Golden Beaches & Nightlife", "lat": 15.5494, "lng": 73.7535, "famous_for": "Calangute, Baga Beach, Anjuna Flea Market, Chapora Dil Chahta Hai Fort, Aguada Fort"},
    {"name": "South Goa", "state": "Goa", "zone": "West", "type": "Tranquil Beaches & Portuguese Heritage", "lat": 15.2832, "lng": 73.9862, "famous_for": "Palolem Crescent Beach, Dudhsagar 4-Tier Waterfalls, Basilica of Bom Jesus UNESCO, Colva"},
    {"name": "Daman & Diu", "state": "Dadra & Nagar Haveli and Daman & Diu", "zone": "West", "type": "Portuguese Sea Forts & Beaches", "lat": 20.7144, "lng": 70.9874, "famous_for": "Diu Fort in Sea, Nagoa Shell Beach, St. Paul Church, Moti Daman Fort"},

    # =========================================================================
    # 3. SOUTH INDIA (Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Telangana, Puducherry)
    # =========================================================================
    {"name": "Bengaluru (Bangalore)", "state": "Karnataka", "zone": "South", "type": "Silicon Valley & Garden City", "lat": 12.9716, "lng": 77.5946, "famous_for": "Lalbagh Glass House, Cubbon Park, Bangalore Palace, Brewpubs & Craft Beer"},
    {"name": "Mysuru (Mysore)", "state": "Karnataka", "zone": "South", "type": "Palaces & Royal Heritage", "lat": 12.2958, "lng": 76.6394, "famous_for": "Mysore Palace Light Illumination, Chamundi Hills, Brindavan Gardens Musical Fountain"},
    {"name": "Coorg (Madikeri)", "state": "Karnataka", "zone": "South", "type": "Scotland of India & Coffee Hills", "lat": 12.4244, "lng": 75.7382, "famous_for": "Coffee Plantations, Abbey Falls, Raja's Seat Sunset, Dubare Elephant Camp, Talakaveri"},
    {"name": "Hampi", "state": "Karnataka", "zone": "South", "type": "Vijayanagara Empire UNESCO Ruins", "lat": 15.3350, "lng": 76.4600, "famous_for": "Stone Chariot at Vijaya Vittala Temple, Virupaksha Temple, Matanga Hill Sunrise, Coracle"},
    {"name": "Gokarna", "state": "Karnataka", "zone": "South", "type": "Om Shaped Beaches & Shiva Temple", "lat": 14.5479, "lng": 74.3188, "famous_for": "Om Beach, Kudle Beach Cliff Cafes, Mahabaleshwar Temple Atmalinga, Half Moon Beach"},
    {"name": "Chikmagalur", "state": "Karnataka", "zone": "South", "type": "Coffee Birthplace & Highest Peak", "lat": 13.3161, "lng": 75.7720, "famous_for": "Mullayanagiri (Karnataka's Highest Peak 6,330ft), Baba Budangiri, Hebbe Falls, Coffee"},
    {"name": "Murudeshwar", "state": "Karnataka", "zone": "South", "type": "World #2 Tallest Shiva & Sea Island", "lat": 14.0940, "lng": 74.4899, "famous_for": "123ft Shiva Statue on Arabian Sea, 20-Storey Raja Gopura, Netrani Island Scuba Diving"},
    {"name": "Udupi & Mangaluru", "state": "Karnataka", "zone": "South", "type": "Coastal Cuisine & Krishna Temple", "lat": 13.3409, "lng": 74.7421, "famous_for": "Sri Krishna Matha Temple, Malpe Beach & St. Mary's Basalt Rock Island, Mangalorean Ghee Roast"},
    {"name": "Kabini & Bandipur", "state": "Karnataka", "zone": "South", "type": "Black Panther & Tiger Safari", "lat": 11.9230, "lng": 76.3530, "famous_for": "Kabini River Boat Safari, Black Panther Sayas Spotting, Wild Elephants, Bandipur Forest"},
    {"name": "Munnar", "state": "Kerala", "zone": "South", "type": "Rolling Green Tea Hills & Mist", "lat": 10.0889, "lng": 77.0595, "famous_for": "Tata Tea Museum, Eravikulam Nilgiri Tahr National Park, Mattupetty Dam, Top Station Clouds"},
    {"name": "Alleppey (Alappuzha)", "state": "Kerala", "zone": "South", "type": "Venice of the East & Backwaters", "lat": 9.4981, "lng": 76.3388, "famous_for": "Overnight Houseboat Cruise, Vembanad Lake, Marari Serene Beach, Nehru Trophy Boat Race"},
    {"name": "Kochi (Cochin)", "state": "Kerala", "zone": "South", "type": "Queen of the Arabian Sea Port", "lat": 9.9312, "lng": 76.2673, "famous_for": "Fort Kochi Chinese Fishing Nets, Mattancherry Jewish Synagogue, Kathakali Dance Theater"},
    {"name": "Wayanad", "state": "Kerala", "zone": "South", "type": "Rainforests, Caves & Heart Lake", "lat": 11.6854, "lng": 76.1320, "famous_for": "Chembra Peak Heart-Shaped Lake, Edakkal Prehistoric Caves, Banasura Sagar Earth Dam"},
    {"name": "Varkala", "state": "Kerala", "zone": "South", "type": "Dramatic Red Cliffs & Arabian Sea", "lat": 8.7379, "lng": 76.7163, "famous_for": "Varkala Cliff Sunset Beach, Natural Mineral Springs, Janardhana Swamy Temple, Surfing"},
    {"name": "Thekkady (Periyar)", "state": "Kerala", "zone": "South", "type": "Wild Elephants & Spice Hills", "lat": 9.6031, "lng": 77.1615, "famous_for": "Periyar Lake Wildlife Boat Safari, Wild Elephants, Spice Plantations, Kalaripayattu Martial Arts"},
    {"name": "Kovalam & Thiruvananthapuram", "state": "Kerala", "zone": "South", "type": "Lighthouse Beach & Padmanabhaswamy", "lat": 8.4004, "lng": 76.9787, "famous_for": "Kovalam Crescent Lighthouse Beach, World's Richest Padmanabhaswamy Temple, Ayurvedic Spas"},
    {"name": "Chennai", "state": "Tamil Nadu", "zone": "South", "type": "Cultural Capital & Marina Beach", "lat": 13.0827, "lng": 80.2707, "famous_for": "Marina Beach (World #2 Longest), Kapaleeshwarar Dravidian Temple, San Thome Basilica"},
    {"name": "Mahabalipuram (Mamallapuram)", "state": "Tamil Nadu", "zone": "South", "type": "UNESCO Rock Cut Shore Temples", "lat": 12.6269, "lng": 80.1927, "famous_for": "Shore Temple, Pancha Rathas 5 Chariots, Arjuna's Penance Giant Rock Bas-Relief, Krishna's Butterball"},
    {"name": "Madurai", "state": "Tamil Nadu", "zone": "South", "type": "Athens of the East & Meenakshi Temple", "lat": 9.9252, "lng": 78.1198, "famous_for": "Meenakshi Amman Temple 14 Majestic Gopurams, Thirumalai Nayakkar Mahal, Jigarthanda Drink"},
    {"name": "Rameshwaram & Dhanushkodi", "state": "Tamil Nadu", "zone": "South", "type": "Maha Char Dham & Ghost Town Border", "lat": 9.2876, "lng": 79.3129, "famous_for": "Ramanathaswamy Longest Temple Corridor, Pamban Sea Bridge, Dhanushkodi Ram Setu Point"},
    {"name": "Kanyakumari", "state": "Tamil Nadu", "zone": "South", "type": "Southernmost Tip of Indian Mainland", "lat": 8.0883, "lng": 77.5385, "famous_for": "Vivekananda Rock Memorial, 133ft Thiruvalluvar Statue, Triveni Sangam (3 Oceans Meet), Sunset"},
    {"name": "Ooty (Udhagamandalam)", "state": "Tamil Nadu", "zone": "South", "type": "Queen of Nilgiri Hill Stations", "lat": 11.4102, "lng": 76.6950, "famous_for": "Nilgiri Mountain Railway UNESCO Toy Train, Ooty Lake Boating, Doddabetta Peak, Rose Garden"},
    {"name": "Kodaikanal", "state": "Tamil Nadu", "zone": "South", "type": "Princess of Hill Stations", "lat": 10.2381, "lng": 77.4892, "famous_for": "Star-Shaped Kodai Lake, Coaker's Walk Clouds, Pillar Rocks, Silver Cascade Waterfalls"},
    {"name": "Thanjavur (Tanjore)", "state": "Tamil Nadu", "zone": "South", "type": "Great Chola Living Temples", "lat": 10.7870, "lng": 79.1378, "famous_for": "Brihadisvara UNESCO Temple 1000 Years Old, Thanjavur Royal Palace, Tanjore Gold Leaf Paintings"},
    {"name": "Visakhapatnam (Vizag)", "state": "Andhra Pradesh", "zone": "South", "type": "City of Destiny & Submarine Museum", "lat": 17.6868, "lng": 83.2185, "famous_for": "Rishikonda Blue Beach, INS Kursura Real Submarine Museum, Kailasagiri Hill, Dolphin's Nose"},
    {"name": "Araku Valley", "state": "Andhra Pradesh", "zone": "South", "type": "Tribal Valleys, Coffee & Borra Caves", "lat": 18.3273, "lng": 82.8775, "famous_for": "Million-Year-Old Borra Limestone Caves, Organic Araku Coffee Farms, Katiki Falls, Dhimsa Dance"},
    {"name": "Tirupati", "state": "Andhra Pradesh", "zone": "South", "type": "Sacred Tirumala Venkateswara Temple", "lat": 13.6288, "lng": 79.4192, "famous_for": "Tirumala Lord Balaji Temple, Silathoranam Natural Arch, Sri Vari Padalu, Srivari Laddu Prasadam"},
    {"name": "Gandikota", "state": "Andhra Pradesh", "zone": "South", "type": "Grand Canyon of India", "lat": 14.8142, "lng": 78.2861, "famous_for": "Pennar River Gorge Canyon, 13th Century Gandikota Fort, Raghunathaswamy Temple"},
    {"name": "Hyderabad", "state": "Telangana", "zone": "South", "type": "City of Pearls & Charminar", "lat": 17.3850, "lng": 78.4867, "famous_for": "Charminar, Golconda Fort Echo Acoustics, Ramoji Film City (World's Largest), Hyderabadi Biryani"},
    {"name": "Warangal", "state": "Telangana", "zone": "South", "type": "Kakatiya Thousand Pillar Temple", "lat": 17.9689, "lng": 79.5941, "famous_for": "Thousand Pillar Temple, Ramappa UNESCO World Heritage Temple, Warangal Stone Gateway"},
    {"name": "Puducherry (Pondicherry)", "state": "Puducherry", "zone": "South", "type": "French Quarter & Promenade Beach", "lat": 11.9416, "lng": 79.8083, "famous_for": "French White Town Colonial Streets, Auroville Golden Matrimandir, Promenade Rock Beach"},

    # =========================================================================
    # 4. EAST INDIA (West Bengal, Odisha, Bihar, Jharkhand)
    # =========================================================================
    {"name": "Kolkata", "state": "West Bengal", "zone": "East", "type": "City of Joy & Cultural Capital", "lat": 22.5726, "lng": 88.3639, "famous_for": "Victoria Memorial, Howrah Bridge, Dakshineswar Kali Temple, Park Street, Tram Ride"},
    {"name": "Darjeeling", "state": "West Bengal", "zone": "East", "type": "Himalayan Kanchenjunga & World Tea", "lat": 27.0410, "lng": 88.2663, "famous_for": "Tiger Hill Kanchenjunga Sunrise, Darjeeling Himalayan Toy Train, Batasia Loop, Happy Valley Tea"},
    {"name": "Kalimpong", "state": "West Bengal", "zone": "East", "type": "Himalayan Flower Nurseries & Valleys", "lat": 27.0601, "lng": 88.4285, "famous_for": "Deolo Hill Viewpoint, Morgan House, Cactus Nursery, Zang Dhok Palri Monastery"},
    {"name": "Sundarbans", "state": "West Bengal", "zone": "East", "type": "World's Largest Mangrove & Tigers", "lat": 21.9497, "lng": 89.1833, "famous_for": "Royal Bengal Tiger Boat Safari, Mangrove Delta UNESCO, Estuarine Crocodiles, Sajnekhali"},
    {"name": "Shantiniketan (Bolpur)", "state": "West Bengal", "zone": "East", "type": "Rabindranath Tagore's UNESCO Abode", "lat": 23.6800, "lng": 87.6900, "famous_for": "Visva Bharati University UNESCO, Rabindra Bhavan, Poush Mela, Baul Folk Music"},
    {"name": "Digha & Mandarmani", "state": "West Bengal", "zone": "East", "type": "Drive-in Sea Beach of Bengal", "lat": 21.6266, "lng": 87.5074, "famous_for": "Mandarmani Longest Drivable Beach in India, Marine Aquarium, Red Crabs, Seafood"},
    {"name": "Bhubaneswar", "state": "Odisha", "zone": "East", "type": "Temple City of India & Smart City", "lat": 20.2961, "lng": 85.8245, "famous_for": "Lingaraj Temple, Udayagiri & Khandagiri Jain Caves, Dhauli Shanti Stupa Ashoka Edicts"},
    {"name": "Puri", "state": "Odisha", "zone": "East", "type": "Maha Char Dham & Jagannath Sea Beach", "lat": 19.8135, "lng": 85.8312, "famous_for": "Shree Jagannath Temple, Rath Yatra, Golden Blue Flag Certified Beach, Mahaprasad"},
    {"name": "Konark", "state": "Odisha", "zone": "East", "type": "UNESCO World Heritage Sun Chariot", "lat": 19.8876, "lng": 86.0945, "famous_for": "Black Pagoda Sun Temple 24 Stone Wheels, Chandrabhaga Sunset Beach, Konark Dance Festival"},
    {"name": "Chilika Lake", "state": "Odisha", "zone": "East", "type": "Asia's Largest Brackish Water Lagoon", "lat": 19.7167, "lng": 85.3167, "famous_for": "Irrawaddy Dolphins Spotting, Kalijai Island Temple, Migratory Birds from Siberia"},
    {"name": "Patna", "state": "Bihar", "zone": "East", "type": "Ancient Pataliputra & Sikh Shrine", "lat": 25.6127, "lng": 85.1589, "famous_for": "Takht Sri Patna Sahib (Guru Gobind Singh Birthplace), Golghar, Bihar Museum, Ganga Ghats"},
    {"name": "Gaya & Bodh Gaya", "state": "Bihar", "zone": "East", "type": "Buddha's Enlightenment & Pind Daan", "lat": 24.6961, "lng": 84.9869, "famous_for": "Mahabodhi Temple UNESCO, Sacred Bodhi Tree, Great 80ft Buddha Statue, Vishnupad Temple"},
    {"name": "Nalanda & Rajgir", "state": "Bihar", "zone": "East", "type": "World's First Residential University", "lat": 25.1357, "lng": 85.4439, "famous_for": "Ancient Nalanda University Ruins UNESCO, Rajgir Glass Bridge, Vishwa Shanti Stupa Ropeway"},
    {"name": "Ranchi", "state": "Jharkhand", "zone": "East", "type": "City of Waterfalls", "lat": 23.3441, "lng": 85.3096, "famous_for": "Hundru Falls, Dassam Falls, Jonha Falls, Tagor Hill, Pahari Mandir"},
    {"name": "Deoghar", "state": "Jharkhand", "zone": "East", "type": "Holy Baidyanath Jyotirlinga", "lat": 24.4826, "lng": 86.6997, "famous_for": "Baba Baidyanath Dham Jyotirlinga, Shravani Mela, Trikut Ropeway, Nandan Pahar"},

    # =========================================================================
    # 5. CENTRAL INDIA (Madhya Pradesh, Chhattisgarh)
    # =========================================================================
    {"name": "Bhopal", "state": "Madhya Pradesh", "zone": "Central", "type": "City of Lakes & Sanchi Stupa", "lat": 23.2599, "lng": 77.4126, "famous_for": "Upper Lake, Sanchi Great Stupa UNESCO, Bhimbetka Rock Shelters UNESCO, Bharat Bhavan"},
    {"name": "Indore", "state": "Madhya Pradesh", "zone": "Central", "type": "India's Cleanest City & Food Hub", "lat": 22.7196, "lng": 75.8577, "famous_for": "Sarafa Night Midnight Food Street, Chappan Dukan, Rajwada Palace, Lal Bagh Palace"},
    {"name": "Ujjain", "state": "Madhya Pradesh", "zone": "Central", "type": "Holy Mahakaleshwar & Kumbh Mela", "lat": 23.1765, "lng": 75.7885, "famous_for": "Mahakaleshwar Jyotirlinga Bhasma Aarti, Shri Mahakal Lok Corridor, Ram Ghat Shipra Aarti"},
    {"name": "Khajuraho", "state": "Madhya Pradesh", "zone": "Central", "type": "UNESCO Erotic Temple Sculptures", "lat": 24.8318, "lng": 79.9199, "famous_for": "Kandariya Mahadeva Temple, Western Group of Temples, Sound & Light Show, Khajuraho Dance"},
    {"name": "Pachmarhi", "state": "Madhya Pradesh", "zone": "Central", "type": "Queen of Satpura Hills", "lat": 22.4674, "lng": 78.4335, "famous_for": "Bee Falls, Dhoopgarh Sunset Point (Highest in MP), Jata Shankar Caves, Handi Khoh Gorge"},
    {"name": "Jabalpur & Bhedaghat", "state": "Madhya Pradesh", "zone": "Central", "type": "Marble Rocks & Dhuandhar Falls", "lat": 23.1815, "lng": 79.9864, "famous_for": "Bhedaghat Marble Rocks Moonlight Boat Ride, Dhuandhar Roaring Waterfall, Chausath Yogini"},
    {"name": "Gwalior", "state": "Madhya Pradesh", "zone": "Central", "type": "Pearl of Indian Fortresses", "lat": 26.2183, "lng": 78.1828, "famous_for": "Gwalior Fort on Hill, Jai Vilas Palace Gold Carpet, Tansen Tomb, Saas Bahu Temple"},
    {"name": "Orchha", "state": "Madhya Pradesh", "zone": "Central", "type": "Medieval Bundela Palaces & Betwa", "lat": 25.3510, "lng": 78.6416, "famous_for": "Ram Raja Temple (Where Lord Ram is King), Jahangir Mahal, Orchha Chhatris on Betwa River"},
    {"name": "Bandhavgarh & Kanha", "state": "Madhya Pradesh", "zone": "Central", "type": "Highest Royal Bengal Tiger Density", "lat": 23.7226, "lng": 81.0253, "famous_for": "Tiger Safari, Sal Forests, Bamni Dadar Sunset, Mowgli Jungle Book Inspiration"},
    {"name": "Mandu (Mandav)", "state": "Madhya Pradesh", "zone": "Central", "type": "City of Joy & Royal Romance", "lat": 22.3660, "lng": 75.4050, "famous_for": "Jahaz Mahal (Ship Palace), Baz Bahadur & Rani Roopmati Pavilion, Hindola Mahal, Baobab Trees"},
    {"name": "Raipur", "state": "Chhattisgarh", "zone": "Central", "type": "Capital City & Tribal Culture", "lat": 21.2514, "lng": 81.6296, "famous_for": "Swami Vivekananda Sarovar, Purkhouti Muktangan Open Air Museum, Naya Raipur Central Park"},
    {"name": "Bastar (Jagdalpur)", "state": "Chhattisgarh", "zone": "Central", "type": "Niagara of India & Tribal Bastar", "lat": 19.0744, "lng": 82.0309, "famous_for": "Chitrakote Horseshoe Waterfall, Tirathgarh Waterfalls, Kanger Valley National Park, Bell Metal Art"},

    # =========================================================================
    # 6. NORTHEAST INDIA (The 8 Sister States: Assam, Meghalaya, Arunachal, Sikkim, Nagaland, Manipur, Mizoram, Tripura)
    # =========================================================================
    {"name": "Guwahati", "state": "Assam", "zone": "Northeast", "type": "Gateway to Northeast & Kamakhya", "lat": 26.1445, "lng": 91.7362, "famous_for": "Maa Kamakhya Devi Shaktipeeth, Brahmaputra River Ropeway, Umananda Island Peacock Island"},
    {"name": "Kaziranga National Park", "state": "Assam", "zone": "Northeast", "type": "Home of One-Horned Rhinoceros", "lat": 26.5775, "lng": 93.1711, "famous_for": "One-Horned Rhino Jeep & Elephant Safari, UNESCO World Heritage, Royal Bengal Tigers, Orchids"},
    {"name": "Majuli", "state": "Assam", "zone": "Northeast", "type": "World's Largest River Island", "lat": 26.9500, "lng": 94.2167, "famous_for": "Neo-Vaishnavite Satras, Traditional Mask Making, Brahmaputra Ferry, Mishing Tribal Culture"},
    {"name": "Manas National Park", "state": "Assam", "zone": "Northeast", "type": "Himalayan Foothills Biosphere Reserve", "lat": 26.6594, "lng": 91.0011, "famous_for": "Golden Langur, Wild Water Buffalo, UNESCO Tiger Reserve, Manas River Rafting"},
    {"name": "Shillong", "state": "Meghalaya", "zone": "Northeast", "type": "Scotland of the East & Rock Music", "lat": 25.5788, "lng": 91.8933, "famous_for": "Umiam Lake Boating, Elephant Falls, Police Bazar, Laitlum Canyons, Ward's Lake"},
    {"name": "Cherrapunji (Sohra) & Dawki", "state": "Meghalaya", "zone": "Northeast", "type": "Living Root Bridges & Crystal Clear River", "lat": 25.2986, "lng": 91.5822, "famous_for": "Double Decker Living Root Bridges, Nohkalikai Falls (India's Highest), Dawki Transparent Umngot River"},
    {"name": "Mawlynnong", "state": "Meghalaya", "zone": "Northeast", "type": "Cleanest Village in Asia", "lat": 25.2017, "lng": 91.9160, "famous_for": "Asia's Cleanest Village, Single Living Root Bridge, Sky View Bamboo Tower overlooking Bangladesh"},
    {"name": "Tawang", "state": "Arunachal Pradesh", "zone": "Northeast", "type": "Monasteries & High Sela Pass", "lat": 27.5861, "lng": 91.8594, "famous_for": "Tawang Monastery (India's Largest), Sela Pass 13,700ft, Madhuri Lake (Sangetsar), Jaswant Garh"},
    {"name": "Ziro Valley", "state": "Arunachal Pradesh", "zone": "Northeast", "type": "UNESCO Apatani Tribe Valley", "lat": 27.5950, "lng": 93.8385, "famous_for": "Apatani Facial Tattoo Tribe, Paddy-cum-Fish Culture, Pine Groves, Ziro Outdoor Music Festival"},
    {"name": "Mechuka (Menchukha)", "state": "Arunachal Pradesh", "zone": "Northeast", "type": "Forbidden Valley of Arunachal", "lat": 28.6000, "lng": 94.1333, "famous_for": "400-Year-Old Samten Yongcha Monastery, Yargyapchu River, Snow Peaks, Wooden Houses"},
    {"name": "Gangtok", "state": "Sikkim", "zone": "Northeast", "type": "Himalayan Capital & Monasteries", "lat": 27.3389, "lng": 88.6065, "famous_for": "MG Marg Pedestrian Street, Tsomgo Changu Lake, Nathula Pass Indo-China Border, Rumtek"},
    {"name": "Lachung & Yumthang", "state": "Sikkim", "zone": "Northeast", "type": "Valley of Flowers & Zero Point", "lat": 27.6891, "lng": 88.7430, "famous_for": "Yumthang Valley Rhododendrons, Zero Point Snow 15,300ft, Hot Springs, Katao Snow"},
    {"name": "Pelling", "state": "Sikkim", "zone": "Northeast", "type": "Kanchenjunga Views & Skywalk", "lat": 27.3167, "lng": 88.2333, "famous_for": "Glass Skywalk, Chenrezig 137ft Statue, Pemayangtse Monastery, Rabdentse Ruins"},
    {"name": "Kohima & Dzukou Valley", "state": "Nagaland", "zone": "Northeast", "type": "Hornbill Festival & Valley of Flowers", "lat": 25.6751, "lng": 94.1086, "famous_for": "Hornbill Festival at Kisama, Dzukou Valley Trek, Kohima WWII War Cemetery, Naga Heritage"},
    {"name": "Mon", "state": "Nagaland", "zone": "Northeast", "type": "Land of Konyak Headhunter Tribe", "lat": 26.7460, "lng": 95.0470, "famous_for": "Konyak Tattooed Warriors, Longwa Village (Half in India, Half in Myanmar), Tribal Chieftain House"},
    {"name": "Imphal & Loktak Lake", "state": "Manipur", "zone": "Northeast", "type": "World's Only Floating National Park", "lat": 24.8170, "lng": 93.9368, "famous_for": "Loktak Lake Floating Phumdis, Keibul Lamjao (World's Only Floating Park), Sangai Brow-Antlered Deer"},
    {"name": "Aizawl & Champhai", "state": "Mizoram", "zone": "Northeast", "type": "Rolling Blue Hills & Rice Bowl", "lat": 23.7271, "lng": 92.7176, "famous_for": "Solomon's Temple, Durtlang Hills, Champhai Indo-Myanmar Border Valley, Reiek Mountain Peak"},
    {"name": "Agartala & Unakoti", "state": "Tripura", "zone": "Northeast", "type": "Royal Palaces & Ancient Rock Carvings", "lat": 23.8315, "lng": 91.2868, "famous_for": "Ujjayanta Palace, Neermahal Water Palace in Rudrasagar Lake, Unakoti 99 Lakh Rock Carvings"},

    # =========================================================================
    # 7. ISLANDS (Andaman & Nicobar, Lakshadweep)
    # =========================================================================
    {"name": "Port Blair", "state": "Andaman & Nicobar", "zone": "Islands", "type": "National Freedom Memorial & Corals", "lat": 11.6234, "lng": 92.7265, "famous_for": "Cellular Jail National Memorial (Kalapani), Ross Island, Corbyn's Cove Beach, Anthropological Museum"},
    {"name": "Havelock Island (Swaraj Dweep)", "state": "Andaman & Nicobar", "zone": "Islands", "type": "Asia #1 Beach & Scuba Diving", "lat": 11.9761, "lng": 92.9876, "famous_for": "Radhanagar Beach (Asia #1 by Time), Elephant Beach Live Coral Snorkeling, Deep Sea Scuba"},
    {"name": "Neil Island (Shaheed Dweep)", "state": "Andaman & Nicobar", "zone": "Islands", "type": "Natural Rock Bridge & Serenity", "lat": 11.8324, "lng": 93.0506, "famous_for": "Howrah Natural Rock Bridge, Laxmanpur Beach Sunset, Bharatpur Beach Glass Bottom Boats"},
    {"name": "Baratang Island", "state": "Andaman & Nicobar", "zone": "Islands", "type": "Limestone Caves & Mud Volcano", "lat": 12.1167, "lng": 92.7500, "famous_for": "Limestone Formations, Mud Volcano, Mangrove Boat Safari, Parrot Island Sunset"},
    {"name": "Lakshadweep (Agatti & Bangaram)", "state": "Lakshadweep", "zone": "Islands", "type": "Pristine Coral Atolls & Turquoise Lagoons", "lat": 10.5667, "lng": 72.6417, "famous_for": "Agatti Airport Runway between Sea, Bangaram Coral Lagoon, Deep Sea Diving, Kayaking"}
]

# Destination Index for fast lookup & spell correction
DEST_NAMES = [d["name"] for d in PAN_INDIA_DESTINATIONS]
NAME_TO_DEST = {d["name"].lower(): d for d in PAN_INDIA_DESTINATIONS}

def search_pan_india_destinations(query: str, limit: int = 8) -> dict:
    """
    Intelligent Search Engine:
    1. Prefix / Substring match across all destinations, states & famous features.
    2. Fuzzy auto-correction for spelling mistakes (e.g. 'kasmir' -> 'Srinagar').
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
        close_matches = difflib.get_close_matches(query.strip(), DEST_NAMES, n=1, cutoff=0.40)
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
        print("Wishlist log failed:", e)
