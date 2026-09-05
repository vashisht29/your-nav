import urllib.parse
# Agentic AI Travel Safety Guardian (Kavach AI Engine)
# Autonomous road anomaly detection, live traffic congestion differentiation,
# multi-stage unresponsive escalation, and dynamic real-time emergency routing.

import math
from typing import Dict, Any, List, Optional

class AgenticSafetyGuardian:
    def __init__(self):
        # Emergency contacts registry (customizable by user)
        self.emergency_contacts = [
            {"name": "Papa / Primary Guardian", "phone": "+91-9876543210", "relationship": "Father", "notify_sms": True, "notify_whatsapp": True},
            {"name": "Close Friend / Travel Buddy", "phone": "+91-9812345678", "relationship": "Friend", "notify_sms": True, "notify_whatsapp": True}
        ]
        
        # Highway dynamic spatial nodes across major Indian transit corridors
        self.spatial_highway_nodes = [
            # Delhi - Haridwar NH-58 / NH-334 Corridor
            {"lat": 28.7041, "lng": 77.1025, "segment": "Delhi Ring Road / Eastern Peripheral", "nearest_hospital": "Max Super Speciality Hospital, Patparganj", "hospital_phone": "011-43033333", "dist_km": 1.2, "police": "Delhi Highway Traffic Police", "police_phone": "112"},
            {"lat": 28.9845, "lng": 77.7064, "segment": "Meerut Bypass (NH-58)", "nearest_hospital": "Subharti Medical College & Hospital", "hospital_phone": "0121-2439052", "dist_km": 2.4, "police": "Meerut Highway Patrol Chowki", "police_phone": "112"},
            {"lat": 29.4727, "lng": 77.7085, "segment": "Muzaffarnagar Expressway", "nearest_hospital": "Muzaffarnagar District Hospital", "hospital_phone": "0131-2621002", "dist_km": 3.1, "police": "Muzaffarnagar Highway Post", "police_phone": "112"},
            {"lat": 29.8543, "lng": 77.8880, "segment": "Roorkee Bypass (NH-334)", "nearest_hospital": "Civil Hospital Roorkee", "hospital_phone": "01332-264250", "dist_km": 1.8, "police": "Roorkee Kotwali", "police_phone": "112"},
            {"lat": 29.9457, "lng": 78.1642, "segment": "Haridwar Entrance (Nepali Farm)", "nearest_hospital": "District Hospital Haridwar (BHEL)", "hospital_phone": "01334-226060", "dist_km": 2.8, "police": "Haridwar City Kotwali", "police_phone": "112"},
            
            # Chandigarh - Manali NH-3 Corridor
            {"lat": 30.7333, "lng": 76.7794, "segment": "Chandigarh Outskirts", "nearest_hospital": "PGIMER Chandigarh Apex Trauma", "hospital_phone": "0172-2747585", "dist_km": 3.0, "police": "Chandigarh Traffic Police", "police_phone": "112"},
            {"lat": 31.3260, "lng": 76.9000, "segment": "Bilaspur Four-Lane Highway", "nearest_hospital": "AIIMS Bilaspur", "hospital_phone": "01978-292555", "dist_km": 4.2, "police": "Bilaspur Highway Post", "police_phone": "112"},
            {"lat": 31.7087, "lng": 76.9320, "segment": "Mandi Ghat Section (NH-3)", "nearest_hospital": "Zonal Hospital Mandi", "hospital_phone": "01905-222102", "dist_km": 2.1, "police": "Mandi Sadar Police", "police_phone": "112"},
            {"lat": 31.9579, "lng": 77.1095, "segment": "Bhuntar Valley Approach", "nearest_hospital": "Regional Hospital Kullu", "hospital_phone": "01902-222350", "dist_km": 5.4, "police": "Bhuntar Police Station", "police_phone": "112"},
            {"lat": 32.2396, "lng": 77.1887, "segment": "Manali Solang Approach", "nearest_hospital": "Civil Hospital Manali", "hospital_phone": "01902-252327", "dist_km": 1.5, "police": "Manali Police Post", "police_phone": "112"},
            
            # Kangra - Bir Billing Mountain Highway
            {"lat": 32.1651, "lng": 76.2634, "segment": "Gaggal Kangra Highway (NH-154)", "nearest_hospital": "Dr. RPGMC Tanda Medical College", "hospital_phone": "01892-267115", "dist_km": 6.2, "police": "Gaggal Police Station", "police_phone": "112"},
            {"lat": 32.1109, "lng": 76.5363, "segment": "Palampur Tea Estate Corridor", "nearest_hospital": "Civil Hospital Palampur", "hospital_phone": "01894-230325", "dist_km": 1.9, "police": "Palampur Police Station", "police_phone": "112"},
            {"lat": 32.0515, "lng": 76.7167, "segment": "Baijnath - Bir Valley Road", "nearest_hospital": "Civil Hospital Baijnath", "hospital_phone": "01894-263023", "dist_km": 3.5, "police": "Bir Police Post", "police_phone": "112"}
        ]

    def haversine_km(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        R = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 2)

    def find_nearest_on_route_services(self, lat: float, lng: float) -> Dict[str, Any]:
        closest_node = min(self.spatial_highway_nodes, key=lambda n: self.haversine_km(lat, lng, n["lat"], n["lng"]))
        dist = self.haversine_km(lat, lng, closest_node["lat"], closest_node["lng"])
        
        return {
            "current_road_segment": closest_node["segment"],
            "nearest_hospital": {
                "name": closest_node["nearest_hospital"],
                "phone": closest_node["hospital_phone"],
                "distance_km": round(dist + closest_node["dist_km"], 1),
                "is_apex": "Apex" in closest_node["nearest_hospital"] or "Medical College" in closest_node["nearest_hospital"]
            },
            "nearest_police": {
                "station": closest_node["police"],
                "phone": closest_node["police_phone"],
                "distance_km": round(dist + 0.8, 1)
            }
        }

    def evaluate_safety_telemetry(
        self,
        lat: float,
        lng: float,
        speed_kmh: float,
        stationary_duration_mins: float,
        traffic_congestion_index: float,
        destination: str = "Haridwar",
        transit_mode: str = "car",
        transit_details: Optional[str] = None
    ) -> Dict[str, Any]:
        route_services = self.find_nearest_on_route_services(lat, lng)
        
        # Case 1: Moving normally
        if speed_kmh > 15.0:
            return {
                "verdict": "NORMAL_TRANSIT",
                "risk_level": "LOW",
                "traffic_status": "Traffic flowing normally",
                "traffic_density_percent": int(traffic_congestion_index * 100),
                "is_alert_triggered": False,
                "message": "Speed normal. Agentic Guardian is silently monitoring route telemetry in background.",
                "on_route_services": route_services
            }

        # Case 2: Stationary, but Traffic Congestion is high (Toll Plaza / Traffic Jam)
        if stationary_duration_mins > 3.0 and traffic_congestion_index >= 0.60:
            return {
                "verdict": "TRAFFIC_JAM_HOLD",
                "risk_level": "SAFE",
                "traffic_status": "Heavy Traffic Congestion / Toll Plaza Queue",
                "traffic_density_percent": int(traffic_congestion_index * 100),
                "is_alert_triggered": False,
                "false_alarm_prevented": True,
                "message": f"Agentic AI detected stationary state ({int(stationary_duration_mins)} mins), but high traffic congestion index ({int(traffic_congestion_index * 100)}%) confirms traffic jam or toll queue. Safety alerts safely suppressed.",
                "on_route_services": route_services
            }

        # Case 3: Stopped on Open Road / Isolated Highway with Clear Traffic -> ANOMALY!
        if stationary_duration_mins >= 4.0 and traffic_congestion_index < 0.60:
            if stationary_duration_mins < 6.0:
                stage = "STAGE_1_CHECK_IN"
                beep_intensity = "standard_beep"
                grace_seconds = 60
                severity = "MEDIUM"
                headline = "Are You OK? Unexpected Stop Detected"
                subtext = f"Vehicle has been stationary for {int(stationary_duration_mins)} mins on {route_services['current_road_segment']}. Road traffic is clear."
            elif stationary_duration_mins < 8.0:
                stage = "STAGE_2_URGENT_SIREN"
                beep_intensity = "urgent_siren"
                grace_seconds = 30
                severity = "HIGH"
                headline = "CRITICAL: Urgent Safety Verification Needed!"
                subtext = f"No response received after 6 mins stationary. Emergency contacts will be notified in 30 seconds if unverified."
            else:
                stage = "STAGE_3_AUTO_ESCALATION"
                beep_intensity = "emergency_beacon"
                grace_seconds = 0
                severity = "CRITICAL"
                headline = "SOS ESCALATED: Emergency Beacon Transmitted!"
                subtext = f"Traveler has been unresponsive for {int(stationary_duration_mins)} mins. Live GPS coordinates and alert dispatched to family and emergency authorities."

            maps_link = f"https://maps.google.com/?q={lat},{lng}"
            sos_payload_message = (
                "🚨 URGENT SAFETY ALERT: Traveler appears unresponsive after an unexpected stop on "
                + route_services["current_road_segment"] + " (near " + destination + ").\n"
                + f"• Stopped Duration: {int(stationary_duration_mins)} mins\n"
                + "• Road Traffic Condition: CLEAR (No Traffic Jam)\n"
                + f"• Transit Mode: {transit_mode.title()} {transit_details or ''}\n"
                + f"• Live GPS Pinpoint: {maps_link}\n"
                + f"• Nearest Hospital: {route_services['nearest_hospital']['name']} (Ph: {route_services['nearest_hospital']['phone']})\n"
                + f"• Nearest Police: {route_services['nearest_police']['station']} (Ph: 112)\n"
                + "Please check on them immediately or notify 112."
            )
            encoded_sos = urllib.parse.quote(sos_payload_message)

            return {
                "verdict": "ANOMALY_STOP_DETECTED",
                "stage": stage,
                "severity": severity,
                "headline": headline,
                "subtext": subtext,
                "stationary_duration_mins": stationary_duration_mins,
                "traffic_status": "Road Traffic Clear (Isolated Road)",
                "traffic_density_percent": int(traffic_congestion_index * 100),
                "is_alert_triggered": True,
                "beep_intensity": beep_intensity,
                "grace_seconds": grace_seconds,
                "emergency_contacts": self.emergency_contacts,
                "dispatched_beacon": {
                    "message": sos_payload_message,
                    "whatsapp_url": f"https://api.whatsapp.com/send?text={encoded_sos}",
                    "sms_url": f"sms:112?body={encoded_sos}"
                },
                "on_route_services": route_services
            }

        # Case 4: Short brief halt
        return {
            "verdict": "SHORT_HALT",
            "risk_level": "LOW",
            "traffic_status": "Short stop (under threshold)",
            "traffic_density_percent": int(traffic_congestion_index * 100),
            "is_alert_triggered": False,
            "message": f"Halt duration {int(stationary_duration_mins)} mins is within normal brief halt buffer.",
            "on_route_services": route_services
        }

guardian_agent = AgenticSafetyGuardian()
