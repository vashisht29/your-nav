# Your Nav (Smart AI Travel)

A stateful, constraint-aware **Agentic AI Route Planning & Travel Optimization Engine**.

## 🚀 Key Features

1. **Autonomous Route Intelligence & Toll Estimation**
   - Calculates precision distance, fuel/EV range, and consumption estimations across petrol, diesel, and electric vehicles.
   - Generates structured NHAI toll plaza breakdown tables with live fees, Fastag telemetry, and high-resolution route waypoints.

2. **OR-Tools CP-SAT Travel Optimization**
   - Employs Google OR-Tools constraint satisfaction engine to dynamically balance trip duration, driver fatigue, meal stops, and budget ceilings.
   - Automatically schedules scenic driving slots, tea intervals, and authentic highway Dhaba lunch stops.

3. **Intelligent Midway Stays & Fatigue Prevention**
   - Automatically geocodes midway halt cities (e.g. Udaipur for Delhi-Goa routes) for journeys exceeding 10 hours.
   - Curates verified midway hotel and resort options to eliminate long-haul driver fatigue.

4. **Multi-Modal Transit & Budget Constraint Solver**
   - Resolves budget constraints dynamically with one-click alternatives (e.g. stay-swaps, sleeper/express train swaps) when plans exceed target limits.
   - Real-time pricing breakdowns covering stays, transport, fuel/tolls, monument entries, and meals.

5. **Live Family Share & Real-Time GPS Synchronization**
   - Dedicated family tracking telemetry with shareable live session links (`/track/[id]`).
   - Real-time journey milestone advancement, SOS guardian alerts, and synchronized waypoint locations.

6. **RoadGuard SOS Sentinel & Mesh Telemetry**
   - Emergency assistance engine featuring NavIC / GPS telemetry and nearest emergency response dispatch.
   - Offline peer-to-peer LoRa/BLE mesh simulation for zero-network emergency broadcast scenarios.

7. **Traveler Profile Hub & Community Recommendations**
   - **User Details:** Editable profile, home city, emergency contact guardian, and NavIC sentinel connection status.
   - **Past Trips Archive:** Historical logs of completed expeditions with logged milestones, distance, and budget analysis.
   - **Community Recommendations:** Add recommendations with direct photo upload, categories (Cafe, Dhaba, Viewpoint, Boutique Stay), rating, and location tags.

8. **Authentic Google & Apple ID Authentication**
   - Multi-stage Google OAuth 2.0 flow with two-step verification and consent scopes.
   - Native Apple ID authentication supporting Touch ID / Face ID, two-factor authentication, and "Hide My Email" private relay.

## 🛠️ Tech Stack

* **Frontend:** Next.js (App Router), React, TypeScript, TailwindCSS, Framer Motion, Leaflet / OpenStreetMap.
* **Backend:** FastAPI (Python 3), Google OR-Tools CP-SAT Solver, Nominatim & Overpass OpenStreetMap engines.
* **ML & Intelligence:** CatBoost Ranker, XGBoost Imputer, KMeans Persona Classifier.
