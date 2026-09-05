"""
Emergency SOS Lifesaving Intelligence Engine
Contains verified government emergency helplines (112, 1363, 108),
State Disaster Response Forces (SDRF / ITBP Mountain Rescue),
Level-1 Apex Trauma Centers, and 1-Click GPS SOS Beacon dispatchers.
"""

from typing import Dict, Any, List, Optional

GOVERNMENT_NATIONAL_HELPLINES = [
    {"name": "National Unified Emergency (Police, Fire, Ambulance)", "number": "112", "type": "national", "icon": "🚨", "priority": 1},
    {"name": "Ministry of Tourism 24x7 Multi-Lingual Tourist Helpline", "number": "1363", "type": "tourist", "icon": "👮", "priority": 2},
    {"name": "National Ambulance & Highway Health Service", "number": "108", "type": "medical", "icon": "🚑", "priority": 3},
    {"name": "Women In Distress Helpline", "number": "1090", "type": "safety", "icon": "🛡️", "priority": 4},
    {"name": "Fire & Rescue Service", "number": "101", "type": "fire", "icon": "🚒", "priority": 5}
]

DESTINATION_EMERGENCY_DATA: Dict[str, Dict[str, Any]] = {
    "haridwar": {
        "region": "Uttarakhand (Garhwal)",
        "sdrf_mountain_rescue": {
            "agency": "Uttarakhand State Disaster Response Force (SDRF)",
            "control_room": "+91-9411112973",
            "state_toll_free": "1077",
            "specialty": "Rapid Water Rescue in Ganga, Flash Flood Evacuation, Helipad Air-Lift Support"
        },
        "trauma_centers": [
            {
                "name": "AIIMS Rishikesh Apex Trauma Center (Level-1)",
                "distance": "22 km (via NH-34)",
                "phone": "+91-135-2462973",
                "address": "Virbhadra Road, Rishikesh",
                "facilities": "24x7 Apex Level-1 Trauma, Emergency OT, Helipad, Blood Bank, Neuro & Ortho Trauma",
                "is_apex": True
            },
            {
                "name": "District Hospital Haridwar (BHEL)",
                "distance": "4.5 km",
                "phone": "+91-1334-226060",
                "address": "Ranipur More, Haridwar",
                "facilities": "Emergency Casualty, 24x7 Ambulance Dispatch, Intensive Care Unit",
                "is_apex": False
            }
        ],
        "local_police": {"station": "Kotwali Haridwar", "phone": "01334-226100"},
        "tourist_police": {"location": "Har Ki Pauri Police Booth", "phone": "112"}
    },

    "rishikesh": {
        "region": "Uttarakhand",
        "sdrf_mountain_rescue": {
            "agency": "Uttarakhand SDRF River & Mountain Unit",
            "control_room": "+91-9411112973",
            "state_toll_free": "1077",
            "specialty": "White Water Rafting Accidents, Shivpuri Rapid Rescue, Mountain Search & Evacuation"
        },
        "trauma_centers": [
            {
                "name": "AIIMS Rishikesh Apex Hospital",
                "distance": "6 km",
                "phone": "+91-135-2462973",
                "address": "Virbhadra, Rishikesh",
                "facilities": "Level-1 Super-Specialty Trauma, 24x7 Blood Bank, Air-Ambulance Landing Ground",
                "is_apex": True
            }
        ],
        "local_police": {"station": "Tapovan Police Post / Muni Ki Reti", "phone": "0135-2442244"}
    },

    "bir billing": {
        "region": "Himachal Pradesh (Kangra)",
        "sdrf_mountain_rescue": {
            "agency": "Himachal ITBP & Dharamshala Mountain Rescue",
            "control_room": "+91-1892-222330",
            "state_toll_free": "1077",
            "specialty": "Paragliding Crash Tree Extraction, High Himalayan Ridge Rescue, Heli-Rescue Liason"
        },
        "trauma_centers": [
            {
                "name": "Dr. Rajendra Prasad Govt Medical College & Hospital (Tanda)",
                "distance": "52 km",
                "phone": "+91-1892-267115",
                "address": "Tanda, Kangra",
                "facilities": "Tertiary Referral Hospital, Specialized Spinal & Head Trauma, 24x7 Emergency ICU",
                "is_apex": True
            },
            {
                "name": "Civil Hospital Baijnath",
                "distance": "12 km (18 mins)",
                "phone": "+91-1894-263023",
                "address": "Baijnath Main Chowk",
                "facilities": "Immediate Emergency Stabilization, 108 Ambulance Hub, X-Ray & Fracture Care",
                "is_apex": False
            }
        ],
        "local_police": {"station": "Bir Police Post (Tibetan Colony)", "phone": "+91-1894-268020"}
    },

    "manali": {
        "region": "Himachal Pradesh",
        "sdrf_mountain_rescue": {
            "agency": "Himachal State Disaster Management & Atal Bihari Mountaineering Institute Rescue",
            "control_room": "+91-1902-252342",
            "state_toll_free": "1077",
            "specialty": "Snow Avalanche Rescue, Rohtang/Solang High-Altitude Recovery, Crevasse Search"
        },
        "trauma_centers": [
            {
                "name": "Regional Hospital Kullu",
                "distance": "40 km",
                "phone": "+91-1902-222350",
                "address": "Dhalpur, Kullu",
                "facilities": "Apex District Trauma Center, ICU, 24x7 Blood Bank, Specialized Orthopedic Ward",
                "is_apex": True
            },
            {
                "name": "Civil Hospital Manali",
                "distance": "1.5 km",
                "phone": "+91-1902-252327",
                "address": "Mall Road, Manali",
                "facilities": "Emergency Casualty, Frostbite Care, Acute Mountain Sickness (AMS) Oxygen Facility",
                "is_apex": False
            }
        ],
        "local_police": {"station": "Manali Police Station", "phone": "01902-252326"}
    },

    "spiti": {
        "region": "Himachal Pradesh (Tribal High Altitude)",
        "sdrf_mountain_rescue": {
            "agency": "Indo-Tibetan Border Police (ITBP) Mountain Rescue / Indian Army Aid Post",
            "control_room": "+91-1906-222226",
            "state_toll_free": "112 / 1077",
            "specialty": "Extreme Cold Weather Evacuation (Minus 20C), Kunzum Pass Stranded Vehicles Recovery"
        },
        "trauma_centers": [
            {
                "name": "Community Health Centre (CHC) Kaza",
                "distance": "1.0 km",
                "phone": "+91-1906-222218",
                "address": "Kaza Main Market",
                "facilities": "High Altitude Pulmonary Edema (HAPE) Oxygen Chambers, Emergency Doctors, Satellite Comms",
                "is_apex": True
            }
        ],
        "local_police": {"station": "Kaza Police Station", "phone": "01906-222222"}
    },

    "darjeeling": {
        "region": "West Bengal (North Bengal)",
        "sdrf_mountain_rescue": {
            "agency": "West Bengal Disaster Management / Himalayan Mountaineering Institute (HMI)",
            "control_room": "+91-354-2254347",
            "state_toll_free": "1070",
            "specialty": "Tea Valley Landslide Extraction, Ghat Road Accident Rescue"
        },
        "trauma_centers": [
            {
                "name": "North Bengal Medical College & Hospital (Sushrutanagar)",
                "distance": "65 km (Siliguri)",
                "phone": "+91-353-2585478",
                "address": "Siliguri, Darjeeling District",
                "facilities": "Apex Super-Specialty Trauma, Multi-Organ Support, Blood Bank, Burn & Trauma Unit",
                "is_apex": True
            },
            {
                "name": "Darjeeling District Hospital (Eden Hospital)",
                "distance": "1.2 km",
                "phone": "+91-354-2254218",
                "address": "Cart Road, Darjeeling",
                "facilities": "Emergency Casualty, 24x7 Ambulance, Fracture & Wound Stabilization",
                "is_apex": False
            }
        ],
        "local_police": {"station": "Sadar Police Station Darjeeling", "phone": "0354-2252222"}
    },

    "gangtok": {
        "region": "Sikkim",
        "sdrf_mountain_rescue": {
            "agency": "Sikkim State Disaster Management Authority (SSDMA)",
            "control_room": "+91-3592-202461",
            "state_toll_free": "1070",
            "specialty": "North Sikkim Snowbound Rescue, Teesta Gorge Evacuations, Army Border Coordination"
        },
        "trauma_centers": [
            {
                "name": "STNM Multi-Specialty Hospital (Sir Thutob Namgyal Memorial)",
                "distance": "4.5 km",
                "phone": "+91-3592-202944",
                "address": "Sochakgang, Sichey, Gangtok",
                "facilities": "State-of-the-Art Apex Level-1 Trauma, 1000-Bed Facility, Helipad, Intensive Cardiac Care",
                "is_apex": True
            }
        ],
        "local_police": {"station": "Sadar Police Station Gangtok", "phone": "03592-202022"}
    },

    "goa": {
        "region": "Goa (Coastal)",
        "sdrf_mountain_rescue": {
            "agency": "Drishti Marine Coastal Lifesavers & Coast Guard",
            "control_room": "+91-832-2419444",
            "state_toll_free": "112",
            "specialty": "Drowning & Rip-Current Jet-Ski Rescue, Watersport Accidents, Coastal Night Patrol"
        },
        "trauma_centers": [
            {
                "name": "Goa Medical College & Hospital (Bambolim)",
                "distance": "15 km (Central Goa)",
                "phone": "+91-832-2458725",
                "address": "Bambolim, Goa",
                "facilities": "State Apex Level-1 Trauma, Neuro & Ortho Surgery, 24x7 Toxicology, Blood Bank",
                "is_apex": True
            },
            {
                "name": "District Hospital North Goa (Mapusa)",
                "distance": "8 km from Baga/Anjuna",
                "phone": "+91-832-2250106",
                "address": "Peddem, Mapusa",
                "facilities": "Emergency Casualty, Beach Accident Triage, 108 Ambulance Hub",
                "is_apex": False
            }
        ],
        "local_police": {"station": "Calangute / Anjuna Tourist Police", "phone": "0832-2277211"}
    },

    "munnar": {
        "region": "Kerala (Idukki)",
        "sdrf_mountain_rescue": {
            "agency": "Kerala Fire & Rescue Service / Forest Rapid Response Team",
            "control_room": "+91-4865-230299",
            "state_toll_free": "112 / 1077",
            "specialty": "Ghat Road Landslide Recovery, Elephant Corridor Safety, Tea Highland Search"
        },
        "trauma_centers": [
            {
                "name": "Tata General Hospital, Munnar",
                "distance": "2.0 km",
                "phone": "+91-4865-230222",
                "address": "Nullatanni, Munnar",
                "facilities": "Emergency Casualty, Antivenom Stock, Cardiac Care, 24x7 Ambulance Service",
                "is_apex": True
            }
        ],
        "local_police": {"station": "Munnar Police Station", "phone": "04865-230321"}
    },

    "ooty": {
        "region": "Tamil Nadu (Nilgiris)",
        "sdrf_mountain_rescue": {
            "agency": "Nilgiris District Disaster Management Team",
            "control_room": "+91-423-2442220",
            "state_toll_free": "1077",
            "specialty": "Ghat Road Hairpin Accidents, Deep Ravine Rope Rescue, Wildlife Emergency"
        },
        "trauma_centers": [
            {
                "name": "Govt District Headquarters Hospital, Ooty",
                "distance": "1.0 km",
                "phone": "+91-423-2442212",
                "address": "Hospital Road, Ooty",
                "facilities": "24x7 Emergency Ward, Orthopedic Surgery, Blood Bank, 108 Ambulance Base",
                "is_apex": True
            }
        ],
        "local_police": {"station": "Ooty Town Central Police", "phone": "0423-2442222"}
    }
}

def get_destination_emergency_intel(destination: str, user_lat: Optional[float] = None, user_lng: Optional[float] = None) -> Dict[str, Any]:
    dest_clean = destination.lower().strip()
    
    matched_key = None
    for k in DESTINATION_EMERGENCY_DATA:
        if k in dest_clean or dest_clean in k:
            matched_key = k
            break
            
    dest_intel = DESTINATION_EMERGENCY_DATA.get(matched_key, {
        "region": "National / State Jurisdiction",
        "sdrf_mountain_rescue": {
            "agency": "State Disaster Response Authority",
            "control_room": "112",
            "state_toll_free": "1077",
            "specialty": "Disaster Evacuation & Immediate Highway Response"
        },
        "trauma_centers": [
            {
                "name": f"Government District Hospital, {destination.title()}",
                "distance": "Within City Limits",
                "phone": "108 / 112",
                "address": f"District Headquarters, {destination.title()}",
                "facilities": "24x7 Emergency Casualty, 108 Ambulance Dispatch, Basic Trauma Support",
                "is_apex": True
            }
        ],
        "local_police": {"station": f"Central Police Station, {destination.title()}", "phone": "112"}
    })
    
    # Pre-generate 1-Click WhatsApp / SMS GPS Beacon
    coords_text = f"https://maps.google.com/?q={user_lat},{user_lng}" if (user_lat and user_lng) else "GPS coordinates pending"
    beacon_message = f"🚨 EMERGENCY SOS! I need immediate help. I am currently in/near {destination.title()}. My live location: {coords_text}. Please dispatch emergency assistance or alert 112 immediately."
    
    return {
        "destination": destination.title(),
        "region": dest_intel.get("region"),
        "national_helplines": GOVERNMENT_NATIONAL_HELPLINES,
        "sdrf_mountain_rescue": dest_intel.get("sdrf_mountain_rescue"),
        "trauma_centers": dest_intel.get("trauma_centers", []),
        "local_police": dest_intel.get("local_police"),
        "tourist_police": dest_intel.get("tourist_police", {"location": f"Tourist Desk, {destination.title()}", "phone": "1363"}),
        "gps_beacon": {
            "message": beacon_message,
            "sms_link": f"sms:112?body={beacon_message.replace(' ', '%20')}",
            "whatsapp_link": f"https://api.whatsapp.com/send?text={beacon_message.replace(' ', '%20')}"
        },
        "first_aid_protocols": [
            {"condition": "Acute Mountain Sickness (AMS) / Breathlessness", "action": "Immediately stop ascending. Rest, stay warm, sip water with electrolytes, take Diamox if prescribed, and descend 500m if headache worsens."},
            {"condition": "Fracture / Road Accident", "action": "Do NOT move patient neck or spine. Immobilize limb with a makeshift splint. Apply firm pressure with clean cloth on external bleeding. Call 108/112."},
            {"condition": "Severe Dehydration / Heat Stroke / Food Poisoning", "action": "Move to shade. Drink small sips of ORS (Oral Rehydration Solution) or coconut water. Avoid solid food for 6 hours."}
        ]
    }
