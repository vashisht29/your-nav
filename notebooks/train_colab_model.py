#!/usr/bin/env python3
"""
RoadGuard AI 5.0 — Google Colab & Standalone Machine Learning Training Pipeline
Author: Antigravity Team
"""

import numpy as np
import pandas as pd
import json
import time
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

print("=" * 70)
print("🚀 ROADGUARD AI 5.0 MACHINE LEARNING MODEL TRAINING PIPELINE")
print("=" * 70)

TARGET_CLASSES = [
    "NORMAL_TRANSIT", "PHONE_DROP_DISARMED", "TUNNEL_TRANSIT_SAFE",
    "TRAFFIC_JAM_HOLD", "PLANNED_REST_HALT", "IMPACT_CRASH_ANOMALY",
    "VEHICLE_ROLLOVER_INVERSION_ALERT", "VEHICLE_FIRE_EV_THERMAL_ALERT",
    "FLASH_FLOOD_SUBMERSION_HAZARD", "OFF_ROUTE_NIGHT_DEVIATION_ALERT",
    "HIGH_ALTITUDE_HYPOXIA_AMS_EMERGENCY", "BLIZZARD_HYPOTHERMIA_EMERGENCY",
    "DESERT_BREAKDOWN_ANOMALY", "FOREST_CORRIDOR_ALERT", "LANDSLIDE_BLOCKADE_ALERT",
    "BATTERY_LAST_GASP_BEACON", "PHONE_SHUTDOWN_REASSURANCE",
    "SILENT_ZONE_ACOUSTIC_SUPPRESSED", "CITY_TRAFFIC_SIREN_DISARMED",
    "CORRUPT_MESH_PACKET_DROPPED", "CLOUD_SENTINEL_AUTO_ESCALATION"
]

np.random.seed(42)
n_samples = 12000
data = []

print(f"1. Generating {n_samples} synthetic multi-sensor telemetry records...")
for _ in range(n_samples):
    scenario = np.random.choice(TARGET_CLASSES)
    speed = np.random.uniform(40, 100)
    stationary_mins = 0.0
    traffic_index = np.random.uniform(0.05, 0.4)
    altitude = np.random.uniform(100, 1500)
    temp_c = np.random.uniform(18, 35)
    sudden_impact = 0
    is_night = int(np.random.rand() > 0.7)
    battery_pct = np.random.uniform(30, 95)
    tilt_angle = np.random.uniform(0, 15)
    route_deviation_km = np.random.uniform(0, 1.5)
    is_tunnel = 0
    is_submerged = 0
    is_fire = 0
    is_silent_zone = 0
    is_phone_shutdown = 0
    bluetooth_failed = 0
    is_corrupt_packet = 0

    if scenario == "NORMAL_TRANSIT":
        speed = np.random.uniform(35, 110)
    elif scenario == "PHONE_DROP_DISARMED":
        speed = np.random.uniform(45, 95)
        sudden_impact = 1
    elif scenario == "TUNNEL_TRANSIT_SAFE":
        speed = np.random.uniform(40, 60)
        is_tunnel = 1
    elif scenario == "TRAFFIC_JAM_HOLD":
        speed = np.random.uniform(0, 8)
        stationary_mins = np.random.uniform(4, 25)
        traffic_index = np.random.uniform(0.65, 0.98)
    elif scenario == "PLANNED_REST_HALT":
        speed = 0.0
        stationary_mins = np.random.uniform(15, 60)
    elif scenario == "IMPACT_CRASH_ANOMALY":
        speed = np.random.uniform(0, 5)
        sudden_impact = 1
        stationary_mins = np.random.uniform(0.5, 5)
    elif scenario == "VEHICLE_ROLLOVER_INVERSION_ALERT":
        speed = 0.0
        sudden_impact = 1
        tilt_angle = np.random.uniform(62, 180)
    elif scenario == "VEHICLE_FIRE_EV_THERMAL_ALERT":
        speed = np.random.uniform(0, 5)
        temp_c = np.random.uniform(66, 110)
        is_fire = 1
    elif scenario == "FLASH_FLOOD_SUBMERSION_HAZARD":
        speed = 0.0
        is_submerged = 1
        stationary_mins = np.random.uniform(1.5, 10)
    elif scenario == "OFF_ROUTE_NIGHT_DEVIATION_ALERT":
        speed = np.random.uniform(30, 65)
        is_night = 1
        route_deviation_km = np.random.uniform(5.2, 18.0)
    elif scenario == "HIGH_ALTITUDE_HYPOXIA_AMS_EMERGENCY":
        speed = 0.0
        altitude = np.random.uniform(4300, 5400)
        stationary_mins = np.random.uniform(12, 45)
    elif scenario == "BLIZZARD_HYPOTHERMIA_EMERGENCY":
        speed = 0.0
        altitude = np.random.uniform(3600, 5350)
        temp_c = np.random.uniform(-25, -6)
    elif scenario == "DESERT_BREAKDOWN_ANOMALY":
        speed = 0.0
        temp_c = np.random.uniform(44, 52)
        stationary_mins = np.random.uniform(6, 30)
    elif scenario == "FOREST_CORRIDOR_ALERT":
        speed = 0.0
        is_night = 1
        stationary_mins = np.random.uniform(5, 25)
    elif scenario == "BATTERY_LAST_GASP_BEACON":
        battery_pct = np.random.uniform(3, 8)
        stationary_mins = np.random.uniform(3, 15)
    elif scenario == "PHONE_SHUTDOWN_REASSURANCE":
        is_phone_shutdown = 1
        battery_pct = np.random.uniform(0, 2)
    elif scenario == "SILENT_ZONE_ACOUSTIC_SUPPRESSED":
        sudden_impact = 1
        is_silent_zone = 1
    elif scenario == "CITY_TRAFFIC_SIREN_DISARMED":
        speed = np.random.uniform(3, 12)
        traffic_index = np.random.uniform(0.78, 0.95)
        sudden_impact = 1
    elif scenario == "CORRUPT_MESH_PACKET_DROPPED":
        is_corrupt_packet = 1
    elif scenario == "CLOUD_SENTINEL_AUTO_ESCALATION":
        bluetooth_failed = 1
        stationary_mins = np.random.uniform(32, 65)

    data.append({
        "speed_kmh": round(speed, 1),
        "stationary_mins": round(stationary_mins, 1),
        "traffic_index": round(traffic_index, 2),
        "altitude_m": round(altitude, 1),
        "temp_c": round(temp_c, 1),
        "sudden_impact": sudden_impact,
        "is_night": is_night,
        "battery_pct": round(battery_pct, 1),
        "tilt_angle": round(tilt_angle, 1),
        "route_deviation_km": round(route_deviation_km, 1),
        "is_tunnel": is_tunnel,
        "is_submerged": is_submerged,
        "is_fire": is_fire,
        "is_silent_zone": is_silent_zone,
        "is_phone_shutdown": is_phone_shutdown,
        "bluetooth_failed": bluetooth_failed,
        "is_corrupt_packet": is_corrupt_packet,
        "target_verdict": scenario
    })

df = pd.DataFrame(data)
features = [
    "speed_kmh", "stationary_mins", "traffic_index", "altitude_m", "temp_c",
    "sudden_impact", "is_night", "battery_pct", "tilt_angle", "route_deviation_km",
    "is_tunnel", "is_submerged", "is_fire", "is_silent_zone", "is_phone_shutdown",
    "bluetooth_failed", "is_corrupt_packet"
]

X = df[features]
y = df["target_verdict"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print(f"2. Splitting into Train ({len(X_train)}) and Test ({len(X_test)}) sets...")

print("3. Training Random Forest Multi-Sensor Classifier...")
model = RandomForestClassifier(n_estimators=150, max_depth=16, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"🎯 Test Accuracy: {acc * 100:.2f}%")

metadata = {
    "model": "RoadGuard-5.0-UniversalOmniSentinel",
    "accuracy": float(acc),
    "classes": TARGET_CLASSES,
    "features": features
}
with open("/Users/air/.gemini/antigravity/scratch/smart-ai-travel/notebooks/roadguard_model_metadata.json", "w") as f:
    json.dump(metadata, f, indent=2)

print("✅ Saved 'roadguard_model_metadata.json' successfully.")
print("=" * 70)
