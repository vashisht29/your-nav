# YourNav | Agentic AI Travel & Safety Optimization Engine

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Google OR-Tools](https://img.shields.io/badge/Optimization-Google%20OR--Tools-4285F4?logo=google)](https://developers.google.com/optimization)
[![CatBoost](https://img.shields.io/badge/ML-CatBoost%20Ranker-yellow?logo=catboost)](https://catboost.ai/)
[![XGBoost](https://img.shields.io/badge/ML-XGBoost%20Imputer-blue?logo=xgboost)](https://xgboost.readthedocs.io/)
[![Scikit-Learn](https://img.shields.io/badge/ML-K--Means%20Clustering-F7931E?logo=scikit-learn)](https://scikit-learn.org/)
[![Safety](https://img.shields.io/badge/Safety-RoadGuard%20Sentinel%20(Kavach)-red?logo=shield)](https://github.com/vashisht29/your-nav)

> **YourNav** is an autonomous, constraint-aware **Agentic Travel Planning & Vehicular Safety Platform**. It unites combinatorial optimization, gradient-boosted decision trees, unsupervised persona clustering, and real-time telemetry to plan optimal pan-India itineraries while actively safeguarding travelers on expressways and remote highways.

---

## 🧠 AI & Machine Learning Architecture

YourNav does not rely on static rules or simple heuristics. The platform coordinates a multi-model pipeline where each model addresses a specialized phase of route generation, cost estimation, candidate ranking, and passenger safety:

```
[ User Prompt & Intent ]
           │
           ▼
┌────────────────────────────────────────────────────────┐
│  1. K-Means Persona Segmenter (Unsupervised Profile)    │
│     Outputs: Behavioral Weights & Psychographic Tilt    │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  2. Geospatial OpenStreetMap / Overpass Telemetry      │
│     Fetches Candidates: Hotels, Attractions, Stops     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  3. XGBoost Spatial Price Imputation Model              │
│     Predicts Missing Fair-Market INR Rates for Stays    │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  4. NLP Aspect Sentiment & Noise Penalty Analyzer      │
│     Extracts: Cleanliness, Noise, Service, Value       │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  5. CatBoost Multi-Criteria Decision Ranker             │
│     Scores & Selects Top-K Candidates with Persona Fit  │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  6. Google OR-Tools CP-SAT Combinatorial Solver        │
│     Formulates NP-Hard Schedule, Fatigue & Budget Caps │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  7. RoadGuard Sentinel AI (Continuous Safety Engine)    │
│     Live NavIC Telemetry, Immobility & SOS Escalation  │
└────────────────────────────────────────────────────────┘
```

---

### 1. CatBoost Multi-Criteria Preference Ranker (`catboost_ranker.cbm`)
* **Core Function:** High-precision scoring and sorting of hotel candidates, viewpoints, and cultural attractions.
* **Why CatBoost:** Categorical features (destination state, stay category, transit type) are natively handled without target leakage, avoiding one-hot dimensionality explosions.
* **Feature Vector:**
  - `price_ratio`: Candidate cost divided by the traveler's daily budget ceiling.
  - `rating`: Normalized user rating (1.0 to 5.0).
  - `tag_overlap`: Semantic match between user interest tags and POI descriptors.
  - `dist_to_center`: Distance penalty from the focal city or route corridor.
  - `sentiment_penalties`: Down-weights candidates with high noise or hygiene complaints.
* **Outcome:** Produces an objective utility score for every candidate, ensuring the final itinerary recommends places with maximum personal utility.

---

### 2. Google OR-Tools CP-SAT Combinatorial Solver
* **Core Function:** NP-hard Constraint Satisfaction and Vehicle Routing Problem (VRP) optimization.
* **Why CP-SAT:** Conventional greedy planners create schedule overlaps or exceed physical driving limits. OR-Tools uses Integer Linear Programming (ILP) with boolean satisfiability to mathematically guarantee a zero-conflict itinerary.
* **Hard & Soft Constraints Solved:**
  - **Driver Fatigue Limits:** Maximum 10 hours continuous road travel; mandates midway halts if exceeded.
  - **Transit Break Timing:** Schedules 45-minute Dhaba lunch breaks (12:30 PM - 2:30 PM) and 20-minute tea intervals.
  - **Operating Windows:** Pins attractions strictly within their verified opening and closing hours.
  - **Financial Budget Ceiling:** Enforces hard cost caps across stays, fuel, tolls, and activities, dynamically triggering stay-swaps or train-swaps if violated.
* **Outcome:** A realistic, minute-by-minute schedule that balances leisure, driver stamina, and travel expenses.

---

### 3. K-Means Traveler Persona Segmenter (`kmeans_persona.pkl`)
* **Core Function:** Unsupervised classification of travelers into psychographic behavioral archetypes.
* **Why K-Means:** User behavior is multi-dimensional; explicit preference forms introduce user friction. K-Means discovers latent archetypes from minimal initial inputs.
* **Identified Archetypes & Steering Policies:**
  - **Budget Explorer:** Heavy emphasis on low cost-ratio (`price_ratio: 2.2`), transit flexibility, and hostels/budget homestays.
  - **Luxury Connoisseur:** Prioritizes star ratings (`rating: 2.2`), luxury amenities, and minimal transit friction.
  - **Family Heritage & Leisure:** Balances comfortable pacing, elder/child safety, cultural heritage tags, and spacious private vehicles.
  - **Fast Thrill & Nature Seeker:** Prioritizes high adventure difficulty, extreme elevation, scenic off-roading, and rapid itinerary pacing.
  - **Spiritual & Cultural Pilgrim:** Focuses on historic temple circuits, vegetarian dining proximity, and peaceful retreats.
* **Outcome:** Dynamically modifies the loss function and feature weights used by downstream ranking engines.

---

### 4. XGBoost Spatial Price Imputer (`xgboost_imputer.json`)
* **Core Function:** Machine-learned geospatial cost estimation for unpriced OpenStreetMap POIs.
* **Problem Solved:** Open-source map providers (OSM/Overpass) frequently lack commercial tariff data for offbeat homestays, highway motels, and regional viewpoints.
* **Model Inputs:** Latitude, Longitude, Star Rating, Property Category, and Distance from Urban Core.
* **Outcome:** Fills missing tariff values with high-accuracy fair-market INR estimates, preventing gaps or zero-cost anomalies in budget calculations.

---

### 5. NLP Aspect Sentiment & Noise Penalty Analyzer
* **Core Function:** Multi-attribute review text mining.
* **Evaluated Dimensions:**
  - `Cleanliness Score`: Hygiene and washroom sanitation ratings.
  - `Noise Penalty`: Proximity to noisy highways, train lines, or nightlife.
  - `Service Sentiment`: Staff hospitality and responsiveness.
  - `Value Sentiment`: Traveler satisfaction relative to price charged.
* **Outcome:** Feeds negative-penalty multipliers directly into the CatBoost Ranker to eliminate substandard properties before user presentation.

---

### 6. RoadGuard Sentinel AI (Autonomous Kavach Telemetry)
* **Core Function:** Active vehicular safety monitoring, accident/immobility detection, and emergency escalation.
* **Capabilities:**
  - **Continuous Telemetry Tracking:** Ingests live speed, heading, and NavIC/GPS coordinates.
  - **Intelligent Immobility Detection:** Analyzes stopped vehicles on expressways or ghat routes, differentiating between standard urban traffic congestion and emergency immobilizations.
  - **Multi-Tier Audio/Tactile Escalation:** Emits tiered countdown chimes to verify driver consciousness before dispatching alerts.
  - **Zero-Network Emergency Protocol:** In dead zones without cellular reception, initiates peer-to-peer LoRa/BLE mesh broadcast simulation to relay SOS coordinates via passing vehicles.
  - **Rapid Emergency Dispatch:** Automatically pinpoints and routes to the nearest verified trauma hospitals, highway police patrols, and mechanical assistance centers.

---

## 🌟 Key Platform Capabilities

| Capability | Technical Implementation | Value to Traveler |
| :--- | :--- | :--- |
| **Autonomous Toll Matrix** | Live NHAI Toll plaza integration & Fastag calculation | Exact expressway toll expenses with zero unexpected toll-booth surprises. |
| **Midway Halt Discovery** | Geodesic midpoint calculation & automated hotel geocoding | Automatically flags journeys >10 hours and books scenic midway stopovers (e.g. Udaipur on Delhi-Goa). |
| **Live Family Share** | Unique `/track/[id]` telemetry sessions with live milestone sync | Loved ones can monitor live route progress, battery level, and waypoint check-ins without phone calls. |
| **Traveler Profile Hub** | 3-tab drawer: User Details, Past Trips Archive, Add Recommendations | Manage traveler profile, review historical journey metrics, and publish recommendations with photo uploads. |
| **Authentic OAuth & Security** | Google OAuth 2.0 (2-Step verification) + Apple ID (Touch ID/Face ID, Private Relay) | Zero password theft risk; protects personal email with Apple Private Relay. |
| **Multi-Modal Transit Swaps** | Dynamic failover between Self-Drive, Train (IRCTC), and Flights | Instant one-click budget optimization if original choices exceed budget limits. |

---

## 🏗️ System Architecture & Technology Stack

* **Frontend Layer:**
  - **Framework:** Next.js 14 (App Router, Server & Client Components)
  - **Interface & Motion:** React 18, TailwindCSS, Framer Motion, Lucide Icons
  - **Cartography:** Leaflet, OpenStreetMap, Custom SVG Vehicle Marker Overlays
* **Backend Layer:**
  - **API Framework:** FastAPI (Asynchronous Python 3)
  - **Optimization Engine:** Google OR-Tools CP-SAT (Constraint Programming)
  - **Geospatial Intelligence:** Nominatim Geocoding, Overpass OpenStreetMap API
* **Intelligence Layer:**
  - **Ranker:** CatBoost Regressor (`catboost_ranker.cbm`)
  - **Imputer:** XGBoost Regressor (`xgboost_imputer.json`)
  - **Persona Engine:** Scikit-Learn K-Means (`kmeans_persona.pkl`)
  - **Sentiment Extraction:** Aspect-Based Lexical NLP Engine
* **Safety & Telemetry Layer:**
  - **Engine:** RoadGuard Kavach Sentinel Agent (`guardian_agent.py`, `emergency_engine.py`)
  - **Protocols:** NavIC / GPS Positioning, Simulated P2P LoRa/BLE Mesh Telemetry

---

## 🔒 Security & Privacy Architecture

* **No Hardcoded Credentials:** All credentials and telemetry identifiers are managed via secure environment variables.
* **Apple Private Relay Integration:** Supports Apple's anonymized email forwarding (`@appleid.com`), keeping traveler emails private.
* **Telemetry Anonymization:** Family Share session links use cryptographically random session IDs (`GP-XXXX-XXXX`) with time-based access expiration.
* **Proprietary Weights Isolation:** Model training pipelines, loss functions, and synthetic datasets remain strictly isolated from public client bundles.

---

## 📄 License & Attribution

Developed with high-precision engineering for modern, safe, and intelligent travel. All rights reserved.

