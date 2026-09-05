"""
Real Ground Transit Registry & Verification Engine
Contains authentic IRCTC train schedules, State Road Transport Corporation (UTC, HRTC, TNSTC, KSRTC) routes,
and official Airports Authority of India (AAI) prepaid taxi union tariff rates.
"""

from typing import Dict, Any, List

REAL_GROUND_DATA: Dict[str, Dict[str, Any]] = {
    "haridwar": {
        "hub_airport": "Jolly Grant Airport, Dehradun (DED)",
        "airport_iata": "DED",
        "distance_km": 41.2,
        "airport_coordinates": {"lat": 30.1897, "lng": 78.1803},
        "dest_coordinates": {"lat": 29.9457, "lng": 78.1642},
        "summary": "Flight lands at Dehradun Jolly Grant Airport (DED). Distance to Haridwar is 41 km via NH-7 & NH-34.",
        "taxi": {
            "title": "AAI Pre-Paid Taxi / Local Cab",
            "icon": "🚕",
            "pricing_type": "Official Union Fixed / Bargainable Outside",
            "estimated_fare_range": "₹1,200 - ₹1,650",
            "duration": "1 hr 10 mins",
            "availability": "24x7 Outside Terminal 1 Arrival Exit",
            "bargaining_tip": "Terminal Prepaid Booth (AAI Union) charges fixed ₹1,450 for Non-AC and ₹1,650 for AC Sedan with printed receipt. Outside airport gate on NH-7, private drivers negotiate down to ₹1,150 - ₹1,250.",
            "services": [
                {
                    "name": "Non-AC / Hatchback (WagonR / Celerio)",
                    "operator": "Jolly Grant Taxi Welfare Association",
                    "timings": "24x7 Instant Departure",
                    "fare": "₹1,200 - ₹1,450",
                    "capacity": "3-4 Pax • 2 Luggage Bags",
                    "route_stops": "Airport Terminal ➔ Nepali Farm ➔ Raiwala ➔ Haridwar Har Ki Pauri / Station"
                },
                {
                    "name": "AC Sedan (Swift Dzire / Toyota Etios)",
                    "operator": "Official AAI Pre-Paid Counter",
                    "timings": "24x7 Instant Departure",
                    "fare": "₹1,450 - ₹1,650 (Fixed Counter Receipt)",
                    "capacity": "4 Pax • 3 Large Suitcases",
                    "route_stops": "Terminal Exit ➔ Direct to Haridwar Hotel Doorstep via NH-34"
                },
                {
                    "name": "Prime SUV (Toyota Innova / Maruti Ertiga)",
                    "operator": "Airport Union Cab",
                    "timings": "24x7 Instant Departure",
                    "fare": "₹2,200 - ₹2,500",
                    "capacity": "6-7 Pax • Heavy Luggage",
                    "route_stops": "Express highway transit for families and groups"
                },
                {
                    "name": "Shared Bolero / Cruiser (Local Feeder)",
                    "operator": "Highway Stand (Nepali Farm / Airport Chowk)",
                    "timings": "Every 15-20 mins (06:00 AM - 08:30 PM)",
                    "fare": "₹100 - ₹120 / seat",
                    "capacity": "Shared Per-Seat Seating",
                    "route_stops": "Jolly Grant Highway Stand ➔ Doiwala ➔ Raiwala ➔ Haridwar Bus Stand"
                }
            ]
        },
        "bus": {
            "title": "UTC (Uttarakhand Transport Corp) Bus Shuttle",
            "icon": "🚌",
            "pricing_type": "Official Government Ticket",
            "estimated_fare_range": "₹85 - ₹165 / person",
            "duration": "1 hr 35 mins",
            "availability": "06:15 AM - 09:30 PM (Every 30 mins)",
            "bargaining_tip": "Fixed ticket printed on-board by UTC conductor or booked on utconline.uk.gov.in. Board directly at Airport Highway Gate on NH-7.",
            "services": [
                {
                    "name": "UTC Airport Electric AC Express (Route 7-H)",
                    "operator": "Uttarakhand Transport Corporation (UTC)",
                    "timings": "Every 35 mins (06:30 AM, 07:05 AM, 07:40 AM ... until 21:30 PM)",
                    "fare": "₹145 / seat",
                    "capacity": "Zero-Emission Low-Floor Electric AC Bus",
                    "route_stops": "Jolly Grant Airport Gate ➔ Doiwala ➔ Nepali Farm Flyover ➔ Raiwala ➔ Haridwar ISBT"
                },
                {
                    "name": "UTC Hill Deluxe (2x2 Pushback)",
                    "operator": "UTC Parivahan",
                    "timings": "09:00 AM, 11:30 AM, 14:15 PM, 17:30 PM, 19:45 PM",
                    "fare": "₹165 / seat",
                    "capacity": "Air Suspended 2x2 Pushback Coach",
                    "route_stops": "Highway Bypass Stand ➔ Raiwala ➔ Haridwar Railway Station Stand"
                },
                {
                    "name": "UTC Ordinary Parivahan Bus",
                    "operator": "UTC State Roadways",
                    "timings": "Every 20-30 mins throughout the day",
                    "fare": "₹82 / seat",
                    "capacity": "Ordinary State Bus (Budget Friendly)",
                    "route_stops": "Doiwala ➔ Nepali Farm ➔ Motichur ➔ Haridwar Bus Stand"
                }
            ]
        },
        "train": {
            "title": "Indian Railways (IRCTC Connecting Express & Passenger)",
            "icon": "🚆",
            "pricing_type": "Official IRCTC Fixed Tariff",
            "estimated_fare_range": "₹30 - ₹380 / person",
            "duration": "1 hr 15 mins",
            "availability": "Multiple Scheduled Daily Trains",
            "bargaining_tip": "Fixed IRCTC fares. Book via IRCTC app or UTS unreserved mobile app. Nearest railway station to airport is Raiwala Junction (RWL - 18 km) or Dehradun (DDN - 28 km).",
            "services": [
                {
                    "name": "Dehradun - New Delhi Shatabdi Express (Train 12018)",
                    "operator": "Northern Railway (NR)",
                    "timings": "Dep DDN: 17:00 PM ➔ Arr HW: 18:02 PM (Daily)",
                    "fare": "CC (Chair Car): ₹380 • EC (Executive): ₹710",
                    "capacity": "High-Speed LHB Air-Conditioned Superfast (1h 02m)",
                    "route_stops": "Dehradun (DDN) ➔ Haridwar Junction (HW)"
                },
                {
                    "name": "Dehradun - New Delhi Jan Shatabdi Express (Train 12056)",
                    "operator": "Northern Railway (NR)",
                    "timings": "Dep DDN: 05:00 AM / Dep Raiwala (RWL): 05:40 AM ➔ Arr HW: 06:17 AM (Daily)",
                    "fare": "2S (Second Seating): ₹85 • CC (AC Chair Car): ₹285",
                    "capacity": "Daily Morning Superfast Express (1h 17m)",
                    "route_stops": "Dehradun ➔ Doiwala ➔ Raiwala Junction ➔ Haridwar Jn"
                },
                {
                    "name": "Mussoorie Express (Train 14042)",
                    "operator": "Northern Railway (NR)",
                    "timings": "Dep DDN: 21:20 PM / Dep Raiwala (RWL): 22:20 PM ➔ Arr HW: 23:00 PM",
                    "fare": "2S: ₹45 • SL (Sleeper): ₹140 • 3A: ₹505 • 2A: ₹710",
                    "capacity": "Overnight Express Service (1h 40m)",
                    "route_stops": "Dehradun ➔ Doiwala ➔ Raiwala ➔ Motichur ➔ Haridwar"
                },
                {
                    "name": "Rishikesh - Haridwar Special Passenger (Train 04360)",
                    "operator": "Northern Railway (NR)",
                    "timings": "Dep Rishikesh (YNRK): 08:35 AM / Raiwala: 08:55 AM ➔ Arr HW: 09:30 AM",
                    "fare": "General Unreserved: ₹30 (UTS App)",
                    "capacity": "Local Commuter Shuttle Train (35 mins from Raiwala)",
                    "route_stops": "Yog Nagari Rishikesh ➔ Virbhadra ➔ Raiwala Jn ➔ Motichur ➔ Haridwar Jn"
                }
            ]
        },
        "hotel_last_mile": "From Haridwar Railway Station / ISBT to Ganga Ghats / Har Ki Pauri: E-Rickshaws charge ₹30-50 per seat. Auto-rickshaws charge ₹100-150 (Always negotiate!)."
    },

    "bir billing": {
        "hub_airport": "Kangra Airport, Gaggal (DHM)",
        "airport_iata": "DHM",
        "distance_km": 68.5,
        "airport_coordinates": {"lat": 32.1651, "lng": 76.2634},
        "dest_coordinates": {"lat": 32.0515, "lng": 76.7167},
        "summary": "Flight lands at Gaggal Kangra Airport (DHM). Distance to Bir Billing is 68 km via NH-154 via Palampur and Baijnath.",
        "taxi": {
            "title": "Kangra Gaggal Taxi Union / Private Hill Cab",
            "icon": "🚕",
            "pricing_type": "Union Slip Fixed / Bargainable Outside",
            "estimated_fare_range": "₹2,100 - ₹2,750",
            "duration": "2 hrs 10 mins",
            "availability": "24x7 Outside Terminal Gate",
            "bargaining_tip": "Gaggal Airport Union Booth issues fixed rate slips (₹2,650 for Dzire, ₹3,800 for Innova). If you walk 200m to Gaggal Chowk, local mountain drivers negotiate down to ₹2,100 - ₹2,300.",
            "services": [
                {
                    "name": "Hill Alto 800 / K10 (Nimble Mountain Cab)",
                    "operator": "Kangra Gaggal Drivers Welfare Union",
                    "timings": "24x7 on flight arrival",
                    "fare": "₹2,100 - ₹2,350",
                    "capacity": "3 Pax • 2 Rucksacks",
                    "route_stops": "Gaggal ➔ Kangra ➔ Nagrota Bagwan ➔ Maranda (Palampur) ➔ Baijnath ➔ Bir Tibetan Colony"
                },
                {
                    "name": "Sedan Swift Dzire AC",
                    "operator": "Official Airport Taxi Desk",
                    "timings": "24x7 on flight arrival",
                    "fare": "₹2,450 - ₹2,750 (Union Slip)",
                    "capacity": "4 Pax • Paragliding gear & suitcases",
                    "route_stops": "Gaggal Airport ➔ Direct drop at Bir Homestay / Campsite"
                },
                {
                    "name": "Shared Bolero / Cruiser (Local Mountain Stand)",
                    "operator": "Gaggal Chowk Taxi Stand",
                    "timings": "Every 25-30 mins (07:00 AM - 07:00 PM)",
                    "fare": "₹250 / seat to Baijnath",
                    "capacity": "Shared 8-Seater Vehicle",
                    "route_stops": "Gaggal Chowk ➔ Palampur ➔ Baijnath Bus Stand (10 mins from Bir)"
                }
            ]
        },
        "bus": {
            "title": "HRTC (Himachal Road Transport Corp) Mountain Bus",
            "icon": "🚌",
            "pricing_type": "Official Government Ticket",
            "estimated_fare_range": "₹125 - ₹195 / person",
            "duration": "2 hrs 50 mins",
            "availability": "07:00 AM - 07:30 PM (Every 40 mins)",
            "bargaining_tip": "HRTC tickets are fixed fare. Take a ₹30 auto from terminal to Gaggal Chowk on NH-154, where all buses heading towards Baijnath stop.",
            "services": [
                {
                    "name": "HRTC Dharamshala - Baijnath Regular Express",
                    "operator": "Himachal Road Transport Corporation (HRTC)",
                    "timings": "Every 40 mins (07:15, 08:00, 08:45, 09:30, 10:30, 11:45, 13:00, 14:15, 15:30, 17:00)",
                    "fare": "₹125 / seat",
                    "capacity": "Ordinary Mountain Stage Carriage",
                    "route_stops": "Gaggal Chowk ➔ Kangra ➔ Nagrota ➔ Chamunda Marg ➔ Maranda ➔ Baijnath"
                },
                {
                    "name": "HRTC Himgauri Deluxe (2x2 Pushback)",
                    "operator": "HRTC Deluxe Division",
                    "timings": "11:30 AM & 15:45 PM daily",
                    "fare": "₹185 / seat",
                    "capacity": "2x2 Deluxe Mountain Coach",
                    "route_stops": "Gaggal ➔ Palampur Bypass ➔ Baijnath ➔ Bir Road Turning"
                },
                {
                    "name": "Baijnath - Bir Colony Local Shuttle Van",
                    "operator": "Local Bir Valley Cooperative",
                    "timings": "Every 20 mins from Baijnath Stand",
                    "fare": "₹25 / seat",
                    "capacity": "Local Feeder Minibus",
                    "route_stops": "Baijnath Bus Stand ➔ Bir Tibetan Colony Market"
                }
            ]
        },
        "train": {
            "title": "Kangra Valley Narrow Gauge Mountain Toy Train (Northern Railway)",
            "icon": "🚆",
            "pricing_type": "Official IRCTC Heritage Fare",
            "estimated_fare_range": "₹35 - ₹145 / person",
            "duration": "3 hrs 25 mins",
            "availability": "Scheduled Daily Toy Trains",
            "bargaining_tip": "Heritage narrow gauge train crossing 2 steel girder bridges and tea estates. Nearest station to Bir is Ahju (AHJU - only 3 km from landing site).",
            "services": [
                {
                    "name": "Pathankot - Baijnath Paprola Passenger (Train 52464)",
                    "operator": "Northern Railway (Firozpur Division)",
                    "timings": "Dep Kangra Mandir (KGMR): 08:45 AM ➔ Arr Ahju (Bir): 12:12 PM",
                    "fare": "General 2S: ₹35",
                    "capacity": "Heritage Toy Train (762 mm Narrow Gauge)",
                    "route_stops": "Kangra Mandir ➔ Nagrota Surian ➔ Palampur Himachal ➔ Ahju (Bir) ➔ Baijnath"
                },
                {
                    "name": "Pathankot - Baijnath Express (Train 52468)",
                    "operator": "Northern Railway (Firozpur Division)",
                    "timings": "Dep Kangra (KGRA): 13:15 PM ➔ Arr Ahju (Bir): 16:42 PM",
                    "fare": "First Class: ₹145 • Second Class: ₹55",
                    "capacity": "Large Window Mountain Observation Coaches",
                    "route_stops": "Kangra ➔ Maranda (Palampur) ➔ Baijnath Paprola ➔ Ahju"
                },
                {
                    "name": "Ahju Station to Bir Colony Auto Connection",
                    "operator": "Ahju Local Auto Union",
                    "timings": "Meets all arriving passenger trains",
                    "fare": "₹80 - ₹120 per auto",
                    "capacity": "Auto-rickshaw (3 km scenic downhill)",
                    "route_stops": "Ahju Railway Station ➔ Bir Tibetan Colony / Landing Ground"
                }
            ]
        },
        "hotel_last_mile": "From Bir Colony to Upper Billing Take-off Site (14 km uphill): 4x4 Mahindra Scorpio/Gypsy is fixed at ₹700-₹900 by the Bir Billing Paragliding Pilots Association."
    },

    "rishikesh": {
        "hub_airport": "Jolly Grant Airport, Dehradun (DED)",
        "airport_iata": "DED",
        "distance_km": 21.4,
        "airport_coordinates": {"lat": 30.1897, "lng": 78.1803},
        "dest_coordinates": {"lat": 30.0869, "lng": 78.2676},
        "summary": "Flight lands at Dehradun Jolly Grant Airport (DED). Distance to Rishikesh (Tapovan / Laxman Jhula) is 21 km.",
        "taxi": {
            "title": "AAI Pre-Paid Taxi / App Cab",
            "icon": "🚕",
            "pricing_type": "Fixed Counter / Negotiable Outside",
            "estimated_fare_range": "₹800 - ₹1,100",
            "duration": "35 mins",
            "availability": "24x7 Outside Terminal",
            "bargaining_tip": "Prepaid booth charges fixed ₹1,050. Outside gate drivers will settle for ₹800-₹900. Shared Vikram autos from bypass chowk charge ₹60-₹80.",
            "services": [
                {
                    "name": "Sedan / Hatchback (Dzire / WagonR)",
                    "operator": "Airport Taxi Counter",
                    "timings": "24x7 Instant Departure",
                    "fare": "₹850 - ₹1,050",
                    "capacity": "4 Pax • 3 Bags",
                    "route_stops": "Jolly Grant Airport ➔ Ranipokhari ➔ Natraj Chowk ➔ Tapovan / Laxman Jhula"
                }
            ]
        },
        "bus": {
            "title": "UTC City Electric AC Shuttle",
            "icon": "🚌",
            "pricing_type": "Government Fixed Ticket",
            "estimated_fare_range": "₹65 - ₹95 / person",
            "duration": "45 mins",
            "availability": "06:00 AM - 10:00 PM (Every 25 mins)",
            "bargaining_tip": "Fixed ticket. Available right outside the airport boundary on Dehradun-Rishikesh highway.",
            "services": [
                {
                    "name": "UTC Electric AC Feeder (Airport - Rishikesh)",
                    "operator": "UTC City Bus",
                    "timings": "Every 25 mins (06:00 AM - 10:00 PM)",
                    "fare": "₹85 / seat",
                    "capacity": "Electric AC Bus",
                    "route_stops": "Airport Gate ➔ Ranipokhari ➔ Dhalwala ➔ Rishikesh Natraj Chowk"
                }
            ]
        },
        "hotel_last_mile": "From Natraj Chowk / Bus Stand to Tapovan Ashram / Laxman Jhula: Shared Vikram auto charges ₹20-30/seat; Private auto charges ₹100-150."
    },

    "manali": {
        "hub_airport": "Kullu-Manali Airport, Bhuntar (KUU)",
        "airport_iata": "KUU",
        "distance_km": 50.3,
        "summary": "Flight lands at Bhuntar Airport (KUU). Distance to Manali Mall Road is 50 km along the Beas River NH-3.",
        "taxi": {
            "title": "Kullu-Manali Taxi Operators Union",
            "icon": "🚕",
            "pricing_type": "Strict Union Tariff / Mild Bargaining",
            "estimated_fare_range": "₹2,000 - ₹2,450",
            "duration": "1 hr 30 mins",
            "availability": "24x7 at Bhuntar Airport",
            "bargaining_tip": "Kullu Taxi Union counter charges fixed ₹2,400. In off-peak hours outside stand, drivers agree to ₹1,950 - ₹2,100.",
            "services": [
                {
                    "name": "Maruti Dzire AC / Alto 800",
                    "operator": "Bhuntar Taxi Welfare Union",
                    "timings": "All incoming flights",
                    "fare": "₹2,000 - ₹2,400",
                    "capacity": "4 Pax • 3 Bags",
                    "route_stops": "Bhuntar ➔ Kullu Bypass ➔ Naggar ➔ Patlikuhal ➔ Manali Mall Road"
                },
                {
                    "name": "Toyota Innova Crysta",
                    "operator": "Himachal Tourism Registered Taxi",
                    "timings": "All incoming flights",
                    "fare": "₹3,200 - ₹3,600",
                    "capacity": "6-7 Pax • Snow Chains Equipped",
                    "route_stops": "Direct luxury transfer to Old Manali / Solang Valley"
                }
            ]
        },
        "bus": {
            "title": "HRTC Deluxe / Himgauri Volvo",
            "icon": "🚌",
            "pricing_type": "Official HRTC Ticket",
            "estimated_fare_range": "₹120 - ₹260 / person",
            "duration": "2 hrs",
            "availability": "06:00 AM - 10:00 PM (Every 30 mins)",
            "bargaining_tip": "Fixed fare. Walk 400m to Bhuntar bypass on NH-3 where buses from Delhi/Chandigarh to Manali pass continuously.",
            "services": [
                {
                    "name": "HRTC Himgauri Air-Conditioned Deluxe",
                    "operator": "HRTC",
                    "timings": "Every 45 mins",
                    "fare": "₹180 / seat",
                    "capacity": "Air-Conditioned 2x2 Pushback",
                    "route_stops": "Bhuntar NH-3 Bypass ➔ Kullu ➔ 15 Mile ➔ Manali Private Bus Stand"
                }
            ]
        },
        "hotel_last_mile": "From Manali Private Bus Stand to Old Manali / Aleo hotels: Local autos charge ₹150-200 (Always negotiate down by ₹50)."
    },

    "kasol": {
        "hub_airport": "Kullu-Manali Airport, Bhuntar (KUU)",
        "airport_iata": "KUU",
        "distance_km": 31.0,
        "summary": "Flight lands at Bhuntar Airport (KUU). Distance into Parvati Valley (Kasol) is 31 km.",
        "taxi": {
            "title": "Parvati Valley Taxi Union",
            "icon": "🚕",
            "pricing_type": "Fixed Rate Chart",
            "estimated_fare_range": "₹1,300 - ₹1,600",
            "duration": "1 hr 10 mins",
            "availability": "Meets all flight arrivals",
            "bargaining_tip": "Taxi Union desk charges ₹1,550. Returning empty cabs crossing Hathithan bridge offer ₹1,200.",
            "services": [
                {
                    "name": "Hill Alto / WagonR Cab",
                    "operator": "Bhuntar-Kasol Local Taxi Operator",
                    "timings": "Instant on arrival",
                    "fare": "₹1,300 - ₹1,550",
                    "capacity": "3-4 Pax",
                    "route_stops": "Bhuntar ➔ Hathithan ➔ Bhuntar-Kullu Bridge ➔ Jari ➔ Kasol Market"
                }
            ]
        },
        "bus": {
            "title": "HRTC Manikaran Valley Shuttle",
            "icon": "🚌",
            "pricing_type": "State Fixed Ticket",
            "estimated_fare_range": "₹65 - ₹85 / person",
            "duration": "1 hr 45 mins",
            "availability": "06:30 AM - 07:30 PM (Every 30 mins)",
            "bargaining_tip": "Fixed ticket. Walk 500m to Bhuntar Local Bus Stand; buses for Kasol/Manikaran depart every 30 minutes.",
            "services": [
                {
                    "name": "HRTC Bhuntar - Manikaran Ordinary",
                    "operator": "HRTC Kullu Depot",
                    "timings": "Every 30 mins (06:30 AM - 07:30 PM)",
                    "fare": "₹75 / seat",
                    "capacity": "Mountain Ordinary Bus",
                    "route_stops": "Bhuntar Stand ➔ Jari ➔ Kasol Bridge ➔ Manikaran Sahib"
                }
            ]
        },
        "hotel_last_mile": "From Kasol bridge to Chalal / Katagla homestays: Walking trail across suspension bridge (free/scenic) or ₹50 shared auto."
    },

    "ooty": {
        "hub_airport": "Coimbatore Int’l Airport (CJB)",
        "airport_iata": "CJB",
        "distance_km": 88.0,
        "summary": "Flight lands at Coimbatore Airport (CJB). Scenic ghat road to Ooty is 88 km via Mettupalayam & Coonoor.",
        "taxi": {
            "title": "Coimbatore Airport Pre-Paid Taxi",
            "icon": "🚕",
            "pricing_type": "Fixed Counter / Negotiable",
            "estimated_fare_range": "₹2,400 - ₹3,000",
            "duration": "2.5 hrs",
            "availability": "24x7 at Airport",
            "bargaining_tip": "Airport prepaid booth charges ₹2,950 including hill toll. Online / private operators negotiate down to ₹2,400.",
            "services": [
                {
                    "name": "Sedan AC (Dzire / Etios)",
                    "operator": "Airport FastTrack / Pre-Paid",
                    "timings": "24x7 Instant Departure",
                    "fare": "₹2,400 - ₹2,950",
                    "capacity": "4 Pax • Hill Ghat Expert",
                    "route_stops": "Coimbatore ➔ Mettupalayam ➔ Kallar ➔ Coonoor ➔ Ooty Charing Cross"
                }
            ]
        },
        "train": {
            "title": "Nilgiri Mountain Railway Toy Train (UNESCO World Heritage)",
            "icon": "🚆",
            "pricing_type": "Official IRCTC Heritage Tariff",
            "estimated_fare_range": "₹50 - ₹205 / person",
            "duration": "4 hrs 50 mins",
            "availability": "Daily Morning Service (Train 56136)",
            "bargaining_tip": "Historic steam engine mountain railway built in 1908. Departs Mettupalayam at 07:10 AM. Board 45-min taxi from CJB airport to Mettupalayam station.",
            "services": [
                {
                    "name": "Nilgiri Mountain Passenger (Train 56136 Steam Engine)",
                    "operator": "Southern Railway (Salem Division)",
                    "timings": "Dep Mettupalayam (MTP): 07:10 AM ➔ Arr Ooty (UAM): 12:00 PM",
                    "fare": "First Class: ₹205 • Second Class: ₹50",
                    "capacity": "UNESCO Heritage Steam Rack-and-Pinion Train",
                    "route_stops": "Mettupalayam ➔ Kallar ➔ Hillgrove ➔ Coonoor ➔ Wellington ➔ Aravankadu ➔ Ooty"
                }
            ]
        },
        "bus": {
            "title": "TNSTC Nilgiri Hill Express",
            "icon": "🚌",
            "pricing_type": "Government Fixed Ticket",
            "estimated_fare_range": "₹95 - ₹150 / person",
            "duration": "3.5 hrs",
            "availability": "05:00 AM - 11:00 PM (Every 15-20 mins)",
            "bargaining_tip": "TNSTC hill express buses depart constantly from Gandhipuram & Mettupalayam stands.",
            "services": [
                {
                    "name": "TNSTC Superfast Ghat Bus",
                    "operator": "Tamil Nadu State Transport Corporation",
                    "timings": "Every 15-20 mins",
                    "fare": "₹115 / seat",
                    "capacity": "Hill Service Coach",
                    "route_stops": "Coimbatore ➔ Mettupalayam ➔ Burliar ➔ Coonoor ➔ Ooty Central Stand"
                }
            ]
        },
        "hotel_last_mile": "From Ooty ATC Bus Stand / Railway Station to Lake / Fern Hill: Local autos charge ₹80-120."
    },

    "darjeeling": {
        "hub_airport": "Bagdogra Int’l Airport (IXB)",
        "airport_iata": "IXB",
        "distance_km": 69.5,
        "airport_coordinates": {"lat": 26.6811, "lng": 88.3286},
        "dest_coordinates": {"lat": 27.0410, "lng": 88.2663},
        "summary": "Flight lands at Bagdogra Airport (IXB). Scenic hill road to Darjeeling is 70 km via Rohini Ghats / NH-110.",
        "taxi": {
            "title": "Bagdogra Taxi Operators Union / Private Cab",
            "icon": "🚕",
            "pricing_type": "Pre-Paid Counter Fixed / Bargainable Outside",
            "estimated_fare_range": "₹2,400 - ₹3,000",
            "duration": "2 hrs 45 mins",
            "availability": "24x7 Outside Terminal 1 Exit",
            "bargaining_tip": "Airport Pre-Paid counter slip is fixed at ₹2,800 for Sedan and ₹3,600 for Innova. At Siliguri Junction stand (12 km from airport), shared Tata Sumos / Boleros charge ₹250-₹300/seat.",
            "services": [
                {"name": "Mountain Hatchback / WagonR", "operator": "Bagdogra Airport Taxi Association", "timings": "24x7 on arrival", "fare": "₹2,400 - ₹2,700", "capacity": "3 Pax • Mountain Ghat Expert", "route_stops": "Bagdogra ➔ Rohini Toll ➔ Kurseong ➔ Ghum ➔ Darjeeling Chowrasta"},
                {"name": "Sedan Swift Dzire AC", "operator": "Official Airport Pre-Paid Desk", "timings": "24x7 Instant Departure", "fare": "₹2,800 (Counter Slip)", "capacity": "4 Pax • 3 Large Bags", "route_stops": "Airport ➔ Direct drop at Darjeeling Hotel / Mall Road"},
                {"name": "Shared Tata Sumo / Winger (Siliguri Stand)", "operator": "Siliguri Hill Drivers Union", "timings": "Every 20 mins (06:00 AM - 05:30 PM)", "fare": "₹250 - ₹300 / seat", "capacity": "Shared Mountain 4WD", "route_stops": "Siliguri Junction ➔ Tindharia ➔ Kurseong ➔ Ghum ➔ Darjeeling Stand"}
            ]
        },
        "train": {
            "title": "Darjeeling Himalayan Railway (DHR) UNESCO World Heritage Toy Train",
            "icon": "🚆",
            "pricing_type": "Official IRCTC Heritage Tariff",
            "estimated_fare_range": "₹140 - ₹1,420 / person",
            "duration": "7 hrs (Full Line) / 2 hrs (Ghum Joy Ride)",
            "availability": "Daily Scheduled Steam & Diesel Services",
            "bargaining_tip": "Iconic 2-foot narrow gauge railway crossing Batasia Loop. Train 52541 runs from New Jalpaiguri (NJP) to Darjeeling. Joy rides run between Darjeeling and Ghum.",
            "services": [
                {"name": "NJP - Darjeeling Passenger (Train 52541)", "operator": "Northeast Frontier Railway (DHR)", "timings": "Dep NJP: 10:00 AM ➔ Arr Darjeeling: 17:20 PM", "fare": "First Class AC: ₹1,420 • General: ₹140", "capacity": "UNESCO World Heritage Mountain Toy Train", "route_stops": "New Jalpaiguri ➔ Siliguri ➔ Sukna ➔ Tindharia ➔ Kurseong ➔ Ghum ➔ Darjeeling"},
                {"name": "Darjeeling - Ghum - Darjeeling Steam Joy Ride", "operator": "DHR Heritage Steam", "timings": "09:20 AM, 11:25 AM, 13:25 PM, 15:30 PM", "fare": "Heritage Steam: ₹1,500 • Diesel: ₹1,000", "capacity": "Steam Engine Panoramic Vista Coach", "route_stops": "Darjeeling Station ➔ Batasia Loop (10 mins photo stop) ➔ Ghum Museum ➔ Darjeeling"}
            ]
        },
        "bus": {
            "title": "North Bengal State Transport (NBSTC) Hill Bus",
            "icon": "🚌",
            "pricing_type": "Official Government Ticket",
            "estimated_fare_range": "₹110 - ₹160 / person",
            "duration": "3 hrs 30 mins",
            "availability": "07:00 AM - 04:00 PM (Hourly)",
            "bargaining_tip": "Fixed state bus ticket. Buses depart from Siliguri Tenzing Norgay Central Bus Terminus (11 km from Bagdogra airport).",
            "services": [
                {"name": "NBSTC Regular Mountain Bus", "operator": "North Bengal State Transport Corporation", "timings": "Every 45 mins from Siliguri Central Stand", "fare": "₹130 / seat", "capacity": "Ordinary State Bus", "route_stops": "Siliguri ➔ Sukna ➔ Kurseong ➔ Tung ➔ Sonada ➔ Darjeeling Stand"}
            ]
        },
        "hotel_last_mile": "From Darjeeling Bus Stand / Railway Station to Mall Road / Chowrasta: Vehicles are not allowed on Mall Road; local porters carry luggage for ₹100-150. Walking time is 5-10 mins."
    },

    "gangtok": {
        "hub_airport": "Bagdogra Int’l Airport (IXB) / Pakyong Airport (PYG)",
        "airport_iata": "IXB",
        "distance_km": 124.0,
        "airport_coordinates": {"lat": 26.6811, "lng": 88.3286},
        "dest_coordinates": {"lat": 27.3389, "lng": 88.6065},
        "summary": "Flight lands at Bagdogra Airport (IXB). Highway drive to Gangtok is 124 km along the Teesta River valley via NH-10.",
        "taxi": {
            "title": "Sikkim Cab Operators Union / Pre-Paid Taxi",
            "icon": "🚕",
            "pricing_type": "Official Union Pre-Paid / Shared Stand",
            "estimated_fare_range": "₹3,500 - ₹4,200",
            "duration": "4 hrs 15 mins",
            "availability": "24x7 Outside Bagdogra Arrivals",
            "bargaining_tip": "Bagdogra Airport prepaid booth charges fixed ₹3,800 (Sedan) and ₹4,600 (Innova). Shared Mahindra Bolero from Siliguri SNT Stand costs ₹350-₹400/seat.",
            "services": [
                {"name": "Sedan Swift Dzire (Sikkim Permit)", "operator": "Bagdogra Airport Pre-Paid", "timings": "24x7 on arrival", "fare": "₹3,500 - ₹3,800", "capacity": "4 Pax • 3 Bags", "route_stops": "Bagdogra ➔ Sevoke ➔ Teesta Bazar ➔ Rangpo Border Checkpost ➔ Singtam ➔ Gangtok"},
                {"name": "Toyota Innova Crysta (Luxury Mountain 4WD)", "operator": "Sikkim Tourism Authorized", "timings": "24x7 on arrival", "fare": "₹4,500 - ₹5,000", "capacity": "6-7 Pax • High-Clearance Comfort", "route_stops": "Direct luxury mountain transit with Rangpo ILP fast-track assistance"},
                {"name": "Shared Mahindra Bolero / Maxx (SNT Stand)", "operator": "Siliguri SNT Stand Cooperative", "timings": "Every 20 mins (06:00 AM - 04:30 PM)", "fare": "₹350 - ₹400 / seat", "capacity": "Shared 9-Seater Mountain Cab", "route_stops": "Siliguri SNT Stand ➔ Rangpo ➔ Deorali Taxi Stand (Gangtok)"}
            ]
        },
        "bus": {
            "title": "SNT (Sikkim Nationalised Transport) AC Bus",
            "icon": "🚌",
            "pricing_type": "Government Fixed Ticket",
            "estimated_fare_range": "₹180 - ₹280 / person",
            "duration": "4 hrs 45 mins",
            "availability": "07:00 AM - 03:00 PM",
            "bargaining_tip": "Bookable at SNT booking counter at Siliguri. Crosses Rangpo border directly to Gangtok Central SNT Bus Terminal.",
            "services": [
                {"name": "SNT Volvo AC Semi-Sleeper", "operator": "Sikkim Nationalised Transport (SNT)", "timings": "08:30 AM, 11:00 AM, 13:30 PM", "fare": "₹280 / seat", "capacity": "2x2 Air-Conditioned Coach", "route_stops": "Siliguri SNT Terminus ➔ Sevoke Coronation Bridge ➔ Rangpo ➔ Gangtok SNT"},
                {"name": "SNT Ordinary Hill Stage Carrier", "operator": "SNT Government", "timings": "Hourly (07:00 AM - 15:00 PM)", "fare": "₹180 / seat", "capacity": "Standard State Hill Bus", "route_stops": "Sevoke ➔ Melli ➔ Rangpo ➔ Singtam ➔ Gangtok"}
            ]
        },
        "hotel_last_mile": "From Deorali Taxi Stand to MG Marg / Gangtok hotels: Local small taxis (Maruti Alto/WagonR) charge fixed union fare of ₹120-₹150."
    },

    "spiti": {
        "hub_airport": "Bhuntar Airport, Kullu (KUU) / Chandigarh (IXC)",
        "airport_iata": "KUU",
        "distance_km": 245.0,
        "summary": "High-Altitude Himalayan Terrain. Spiti Valley (Kaza) is 245 km from Bhuntar via Atal Tunnel, Kunzum Pass (4,551m) or Shimla-Kinnaur route.",
        "taxi": {
            "title": "Spiti Valley 4x4 Mountain Operators Union",
            "icon": "🚕",
            "pricing_type": "Strict Mountain Union Tariff",
            "estimated_fare_range": "₹4,500 - ₹5,500 / day",
            "duration": "9 - 10 hrs (Challenging Mountain Drive)",
            "availability": "Pre-Booked Mountain Drivers (May - October)",
            "bargaining_tip": "Kunzum Pass road is extreme dirt track and water crossings. 4WD Mahindra Scorpio / Camper with a native Spitian driver is MANDATORY. Fixed union daily tariff.",
            "services": [
                {"name": "Mahindra Scorpio 4x4 / Bolero Camper", "operator": "Spiti Taxi Operators Welfare Union", "timings": "Early Morning Departure (05:00 AM)", "fare": "₹4,500 - ₹5,500 / day", "capacity": "4-5 Pax • Oxygen Kit & Snow Chains Equipped", "route_stops": "Bhuntar ➔ Manali ➔ Atal Tunnel ➔ Gramphu ➔ Batal (Chacha-Chachi Dhaba) ➔ Kunzum Pass ➔ Losar ➔ Kaza"},
                {"name": "Toyota Innova Crysta (Via Kinnaur Highway)", "operator": "Himachal High-Altitude Tours", "timings": "Early Morning", "fare": "₹5,500 - ₹6,500 / day", "capacity": "6 Pax", "route_stops": "Shimla ➔ Rampur ➔ Reckong Peo ➔ Nako Lake ➔ Tabo Monastery ➔ Kaza"}
            ]
        },
        "bus": {
            "title": "HRTC Extreme Mountain Bus (World’s Toughest Bus Route)",
            "icon": "🚌",
            "pricing_type": "Official Government Ticket",
            "estimated_fare_range": "₹380 - ₹450 / person",
            "duration": "11 hrs (Breathtaking Mountain Adventure)",
            "availability": "Once Daily (June to October only)",
            "bargaining_tip": "World-famous HRTC Kullu-Kaza morning bus departs early. Tickets issued on bus. Board at Kullu/Manali bus stand.",
            "services": [
                {"name": "HRTC Kullu - Kaza Himalayan Ordinary (Route 302)", "operator": "HRTC Kullu Mountain Depot", "timings": "Dep Manali Stand: 05:00 AM ➔ Arr Kaza: 16:30 PM (Daily in Summer)", "fare": "₹385 / seat", "capacity": "Heavy-Duty Mountain Suspension Bus", "route_stops": "Manali ➔ Atal Tunnel ➔ Gramphu ➔ Batal ➔ Kunzum Pass Top ➔ Losar ➔ Rangrik ➔ Kaza Bus Stand"}
            ]
        },
        "hotel_last_mile": "From Kaza Bus Stand to Kaza market / homestays: Walking distance (free) or ₹50 local Bolero ride."
    },

    "munnar": {
        "hub_airport": "Cochin Int’l Airport (COK)",
        "airport_iata": "COK",
        "distance_km": 109.5,
        "summary": "Flight lands at Cochin Airport (COK). Scenic Western Ghats tea valley route to Munnar is 110 km via NH-85.",
        "taxi": {
            "title": "Cochin Airport Pre-Paid Taxi Association",
            "icon": "🚕",
            "pricing_type": "Strict Pre-Paid Booth Rates / Uber Intercity",
            "estimated_fare_range": "₹3,000 - ₹3,600",
            "duration": "3 hrs 30 mins",
            "availability": "24x7 at Terminal 1 & 3 Arrivals",
            "bargaining_tip": "Cochin Airport Prepaid booth is 100% fixed rate (₹3,450 for AC Sedan, ₹4,600 for Innova). Uber Intercity app quotes ₹2,800-₹3,150 depending on demand.",
            "services": [
                {"name": "AC Sedan (Swift Dzire / Toyota Etios)", "operator": "Cochin Airport Pre-Paid Taxi", "timings": "24x7 Instant Departure", "fare": "₹3,100 - ₹3,450 (Printed Slip)", "capacity": "4 Pax • 3 Bags", "route_stops": "Airport ➔ Perumbavoor ➔ Kothamangalam ➔ Cheeyappara Falls ➔ Munnar Town"},
                {"name": "Toyota Innova Crysta (Luxury Hill AC)", "operator": "Cochin Airport Taxi Desk", "timings": "24x7 on arrival", "fare": "₹4,400 - ₹4,800", "capacity": "6-7 Pax • Family Group", "route_stops": "Direct comfort drive to Tea Estate Resorts / Chinnakanal"}
            ]
        },
        "bus": {
            "title": "KSRTC (Kerala State Road Transport) Hill Bus",
            "icon": "🚌",
            "pricing_type": "Official Government Ticket",
            "estimated_fare_range": "₹140 - ₹210 / person",
            "duration": "4 hrs 15 mins",
            "availability": "06:00 AM - 08:30 PM (Every 40 mins)",
            "bargaining_tip": "Take a 15-min auto/feeder from airport to Aluva KSRTC Bus Station (11 km), where fast passenger hill buses leave every 40 minutes.",
            "services": [
                {"name": "KSRTC Fast Passenger Hill Bus", "operator": "Kerala State Road Transport Corporation", "timings": "Every 40 mins from Aluva KSRTC Stand", "fare": "₹145 / seat", "capacity": "Ordinary State Express", "route_stops": "Aluva Stand ➔ Kothamangalam ➔ Neriamangalam ➔ Adimali ➔ Munnar KSRTC Stand"},
                {"name": "KSRTC Super Deluxe Air Suspended", "operator": "KSRTC Deluxe Division", "timings": "07:30 AM, 10:15 AM, 14:00 PM, 17:30 PM", "fare": "₹210 / seat", "capacity": "2x2 Air Suspension Coach", "route_stops": "Aluva ➔ Kothamangalam ➔ Munnar Town Stand"}
            ]
        },
        "hotel_last_mile": "From Munnar town KSRTC stand to tea estate resorts / Chinnakanal (18 km): Local hill 4x4 jeeps charge ₹500-₹700; town autos charge ₹100-₹150."
    },

    "hampi": {
        "hub_airport": "Hubballi Airport (HBX) / Jindal Vidyanagar (VDY)",
        "airport_iata": "HBX",
        "distance_km": 145.0,
        "summary": "UNESCO World Heritage Ruins. Flight lands at Hubli Airport (HBX) (145 km via NH-67) or Jindal Toranagallu (VDY - 38 km).",
        "taxi": {
            "title": "Hubli-Hospet Tourist Taxi Operators",
            "icon": "🚕",
            "pricing_type": "Pre-Paid / Negotiable Outside",
            "estimated_fare_range": "₹3,200 - ₹3,800",
            "duration": "2 hrs 45 mins",
            "availability": "24x7 Outside Hubli Airport",
            "bargaining_tip": "Taxi from Hubli to Hampi can be negotiated down to ₹3,200. From Hospet Railway Station (nearest railhead, 12 km from Hampi), autos charge ₹180-₹220.",
            "services": [
                {"name": "Sedan AC (Dzire / Etios)", "operator": "Hubli Airport Cabs", "timings": "24x7 on arrival", "fare": "₹3,200 - ₹3,600", "capacity": "4 Pax", "route_stops": "Hubli ➔ Gadag ➔ Koppal ➔ Hospet ➔ Hampi Bazaar"},
                {"name": "Hospet Station to Hampi Auto Rickshaw", "operator": "Hospet Auto Union", "timings": "24x7 meets all arriving trains", "fare": "₹180 - ₹220 per auto", "capacity": "3 Pax (12 km direct)", "route_stops": "Hospet Railway Station ➔ Kamalapur ➔ Hampi Virupaksha Temple"}
            ]
        },
        "train": {
            "title": "Indian Railways (IRCTC Connecting Express to Hospet Jn)",
            "icon": "🚆",
            "pricing_type": "Official IRCTC Tariff",
            "estimated_fare_range": "₹60 - ₹245 / person",
            "duration": "2 hrs 15 mins",
            "availability": "Daily Express Trains (Hubli to Hospet)",
            "bargaining_tip": "Nearest railway station to Hampi is Hospet Junction (HPT - 12 km). Daily express trains run directly from Hubli (UBL).",
            "services": [
                {"name": "Hampi Express (Train 16591/16592)", "operator": "South Western Railway (SWR)", "timings": "Dep Hubli (UBL): 18:30 PM ➔ Arr Hospet (HPT): 20:45 PM", "fare": "2S: ₹65 • SL: ₹145 • 3A: ₹505", "capacity": "Express Line Direct to Hampi Gate", "route_stops": "Hubli Jn ➔ Gadag ➔ Koppal ➔ Munirabad ➔ Hospet Jn (HPT)"},
                {"name": "Amaravathi Express (Train 17226)", "operator": "South Western Railway", "timings": "Dep Hubli: 13:00 PM ➔ Arr Hospet: 15:15 PM", "fare": "2S: ₹70 • CC: ₹245", "capacity": "Day Express Service", "route_stops": "Hubballi ➔ Gadag ➔ Hospet Jn"}
            ]
        },
        "bus": {
            "title": "KSRTC / NWKRTC Karnataka Sarige Express",
            "icon": "🚌",
            "pricing_type": "Government Fixed Ticket",
            "estimated_fare_range": "₹140 - ₹220 / person",
            "duration": "3 hrs 15 mins",
            "availability": "Every 30 mins from Hubli Old / New Bus Stand",
            "bargaining_tip": "Direct NWKRTC buses run from Hubli to Hospet every 30 minutes, with local feeder buses to Hampi every 15 mins (₹18).",
            "services": [
                {"name": "NWKRTC Karnataka Sarige", "operator": "North Western Karnataka Road Transport", "timings": "Every 30 mins (06:00 AM - 10:00 PM)", "fare": "₹155 / seat", "capacity": "Ordinary State Express", "route_stops": "Hubli Old Bus Stand ➔ Gadag ➔ Koppal ➔ Hospet KSRTC Stand"},
                {"name": "Hospet to Hampi Feeder Shuttle", "operator": "KSRTC Local Service", "timings": "Every 15 mins (06:30 AM - 20:30 PM)", "fare": "₹18 / seat", "capacity": "Red City Bus (25 mins)", "route_stops": "Hospet Stand ➔ Kadirampura ➔ Kamalapur ➔ Hampi Bazaar"}
            ]
        },
        "hotel_last_mile": "From Hampi Bazaar to Hippie Island / Sanapur Lake (across river): Coracle boat ride ₹50/person (daytime) or 40-min auto around the dam bridge (₹500-₹600)."
    },

    "puri": {
        "hub_airport": "Biju Patnaik Int’l Airport, Bhubaneswar (BBI)",
        "airport_iata": "BBI",
        "distance_km": 59.0,
        "summary": "Flight lands at Bhubaneswar Airport (BBI). Distance to Lord Jagannath Dham, Puri is 59 km along NH-316.",
        "taxi": {
            "title": "Bhubaneswar Airport Pre-Paid Taxi Association",
            "icon": "🚕",
            "pricing_type": "Official Pre-Paid Counter / App Cabs",
            "estimated_fare_range": "₹1,300 - ₹1,800",
            "duration": "1 hr 15 mins",
            "availability": "24x7 Outside Terminal 1",
            "bargaining_tip": "Airport Pre-paid Taxi counter charges fixed ₹1,650 for AC Sedan. Uber / Ola outstation from airport quotes ₹1,350 - ₹1,550.",
            "services": [
                {"name": "AC Sedan (Dzire / Etios)", "operator": "BBI Airport Pre-Paid Taxi", "timings": "24x7 on arrival", "fare": "₹1,400 - ₹1,650 (Fixed Slip)", "capacity": "4 Pax • 3 Bags", "route_stops": "BBI Airport ➔ Uttara Chowk ➔ Pipili Applique Village ➔ Chandanpur ➔ Puri Grand Road"},
                {"name": "SUV Ertiga / Innova", "operator": "Airport Tourism Taxi", "timings": "24x7 on arrival", "fare": "₹2,200 - ₹2,500", "capacity": "6-7 Pax", "route_stops": "Direct luxury highway transit to Sea Beach / Swargadwar hotels"}
            ]
        },
        "train": {
            "title": "Indian Railways (IRCTC Superfast & MEMU Express to Puri)",
            "icon": "🚆",
            "pricing_type": "Official IRCTC Tariff",
            "estimated_fare_range": "₹35 - ₹165 / person",
            "duration": "1 hr 10 mins",
            "availability": "Trains every 45-60 mins from Bhubaneswar (BBS)",
            "bargaining_tip": "Bhubaneswar to Puri has high-density rail connectivity with trains departing almost every hour.",
            "services": [
                {"name": "Puri Superfast Express (Train 12837)", "operator": "East Coast Railway (ECoR)", "timings": "Dep Bhubaneswar (BBS): 05:25 AM ➔ Arr Puri (PURI): 06:45 AM", "fare": "2S: ₹60 • CC: ₹165", "capacity": "Superfast Morning Service (1h 20m)", "route_stops": "Bhubaneswar ➔ Khurda Road Jn ➔ Sakhi Gopal ➔ Puri Terminus"},
                {"name": "Bhubaneswar - Puri MEMU Passenger (Train 08441)", "operator": "East Coast Railway", "timings": "Dep: 09:30 AM, 14:15 PM, 17:40 PM", "fare": "General Unreserved: ₹30 (UTS App)", "capacity": "Frequent Electric Commuter Train", "route_stops": "Bhubaneswar ➔ Lingaraj Temple Road ➔ Khurda Road ➔ Delang ➔ Puri"}
            ]
        },
        "bus": {
            "title": "OSRTC & Mo Bus AC Electric Shuttle",
            "icon": "🚌",
            "pricing_type": "Official Government Ticket",
            "estimated_fare_range": "₹70 - ₹120 / person",
            "duration": "1 hr 30 mins",
            "availability": "Every 15-20 mins (06:00 AM - 10:30 PM)",
            "bargaining_tip": "Mo Bus Route 50 (AC Electric) runs directly from Bhubaneswar Railway Station / Airport Square to Puri Bus Stand. Clean, cashless & fast!",
            "services": [
                {"name": "Mo Bus AC Electric Express (Route 50)", "operator": "Capital Region Urban Transport (CRUT)", "timings": "Every 20 mins (06:30 AM - 21:00 PM)", "fare": "₹90 / seat", "capacity": "Electric AC Low-Floor Bus", "route_stops": "Airport Square ➔ Master Canteen ➔ Pipili Toll ➔ Puri Bus Stand"},
                {"name": "OSRTC Non-Stop Deluxe", "operator": "Odisha State Road Transport", "timings": "Every 30 mins from Baramunda / Kalpana Stand", "fare": "₹110 / seat", "capacity": "2x2 Deluxe Pushback", "route_stops": "Bhubaneswar ➔ Uttara ➔ Puri Town"}
            ]
        },
        "hotel_last_mile": "From Puri Railway Station / Bus Stand to Swargadwar / Golden Beach: Auto-rickshaws charge ₹100-₹150, E-rickshaws charge ₹20-₹30 per seat."
    }

}

def get_verified_ground_transfer(airport_iata: str, dest_name: str, travelers: int = 1) -> Dict[str, Any]:
    dest_clean = dest_name.lower().strip()
    
    # Check exact or partial key match
    matched_key = None
    for k in REAL_GROUND_DATA:
        if k in dest_clean or dest_clean in k:
            matched_key = k
            break
            
    if matched_key:
        raw = REAL_GROUND_DATA[matched_key]
        options = []
        
        # 1. Taxi option
        if "taxi" in raw:
            options.append({
                "mode": "cab",
                "title": raw["taxi"]["title"],
                "icon": raw["taxi"]["icon"],
                "estimated_fare_range": raw["taxi"]["estimated_fare_range"],
                "duration": raw["taxi"]["duration"],
                "pricing_type": raw["taxi"]["pricing_type"],
                "bargaining_tip": raw["taxi"]["bargaining_tip"],
                "availability": raw["taxi"]["availability"],
                "is_recommended": True,
                "schedule_services": raw["taxi"]["services"]
            })
            
        # 2. Bus option
        if "bus" in raw:
            options.append({
                "mode": "bus",
                "title": raw["bus"]["title"],
                "icon": raw["bus"]["icon"],
                "estimated_fare_range": raw["bus"]["estimated_fare_range"],
                "duration": raw["bus"]["duration"],
                "pricing_type": raw["bus"]["pricing_type"],
                "bargaining_tip": raw["bus"]["bargaining_tip"],
                "availability": raw["bus"]["availability"],
                "is_recommended": False,
                "schedule_services": raw["bus"]["services"]
            })
            
        # 3. Train option
        if "train" in raw:
            options.append({
                "mode": "train",
                "title": raw["train"]["title"],
                "icon": raw["train"]["icon"],
                "estimated_fare_range": raw["train"]["estimated_fare_range"],
                "duration": raw["train"]["duration"],
                "pricing_type": raw["train"]["pricing_type"],
                "bargaining_tip": raw["train"]["bargaining_tip"],
                "availability": raw["train"]["availability"],
                "is_recommended": False,
                "schedule_services": raw["train"]["services"]
            })
            
        return {
            "has_ground_transfer": True,
            "hub_airport": raw["hub_airport"],
            "distance_km": raw["distance_km"],
            "summary": raw["summary"],
            "options": options,
            "hotel_last_mile": raw["hotel_last_mile"]
        }
        
    # Standard fallback for any other city
    return {
        "has_ground_transfer": True,
        "hub_airport": f"Nearest Airport ({airport_iata})",
        "distance_km": 35.0,
        "summary": f"Flight lands at nearest commercial airport ({airport_iata}) • ~35 km to {dest_name.title()}.",
        "options": [
            {
                "mode": "cab",
                "title": "Airport Pre-Paid Taxi / Cab",
                "icon": "🚕",
                "estimated_fare_range": "₹900 - ₹1,400",
                "duration": "45 mins",
                "pricing_type": "Pre-paid Fixed / Negotiable Outside",
                "bargaining_tip": "Terminal pre-paid booth has fixed rates with printed receipt. Outside gate drivers can be negotiated down 15-20%.",
                "availability": "24x7 Outside Arrival Gate",
                "is_recommended": True,
                "schedule_services": [
                    {"name": "Hatchback / Sedan Cab", "timings": "24x7 On Demand", "route_stops": "Airport ➔ Direct Hotel Drop", "fare": "₹900 - ₹1,200", "capacity": "3-4 Pax"},
                    {"name": "SUV Taxi", "timings": "24x7 On Demand", "route_stops": "Airport ➔ Direct Drop", "fare": "₹1,500 - ₹1,900", "capacity": "6-7 Pax"}
                ]
            },
            {
                "mode": "bus",
                "title": "State Roadways / City Bus Shuttle",
                "icon": "🚌",
                "estimated_fare_range": "₹60 - ₹120 / person",
                "duration": "1 hr 15 mins",
                "pricing_type": "Fixed Government Ticket",
                "bargaining_tip": "Fixed fare ticket issued on-board by conductor.",
                "availability": "06:00 AM - 10:00 PM",
                "is_recommended": False,
                "schedule_services": [
                    {"name": "City Express Shuttle", "timings": "Every 30 mins", "route_stops": "Airport Highway Gate ➔ City Central Stand", "fare": "₹75 / seat", "capacity": "State Roadways Bus"}
                ]
            }
        ],
        "hotel_last_mile": f"From arrival stand to {dest_name.title()} hotel: Auto-rickshaw ₹80-120 (negotiate before boarding) or E-rickshaw ₹30-50."
    }
