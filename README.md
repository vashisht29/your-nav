# YourNav

### Autonomous Agentic AI Route Planning & Highway Safety Platform

**YourNav** is an autonomous, constraint-aware travel planning and on-road safety engine designed for real-world road expeditions across India.

Unlike traditional apps that only draw a static line between two cities or sell pre-packaged hotel bundles, YourNav functions as an intelligent travel agent and vehicular safety sentry. It plans fatigue-free, budget-guaranteed multi-day journeys while actively safeguarding travelers on expressways and remote highways with real-time telemetry.

---

## 🥊 How YourNav is Different from Others

Most travelers currently juggle 3 to 4 different apps (navigation apps for directions, online booking portals for stays, itinerary planners for lists, and messaging apps for sharing location). None of these platforms talk to each other, and none of them protect you on the road.

| Feature / Capability | Standard Navigation Apps | Online Travel Portals | Generic Itinerary Planners | **YourNav Platform** |
| :--- | :---: | :---: | :---: | :---: |
| **Fatigue Prevention (>10h Trips)** | ❌ None | ❌ None | ❌ None | **✅ Automatic Midway Stay Geocoding** |
| **Constraint Solver (Budget & Time)** | ❌ No budget awareness | ❌ Static ticket sales | ❌ Manual lists only | **✅ Mathematically Guaranteed Schedule** |
| **Highway Meal & Dhaba Scheduling** | ❌ Manual search only | ❌ None | ❌ None | **✅ Synchronized Transit Meal Halts** |
| **NHAI Toll Matrix & Fuel/EV Range** | ⚠️ Generic toll warning | ❌ None | ❌ None | **✅ Exact Toll Plaza Fees & Range Matrix** |
| **Active Highway Immobility Sentry** | ❌ None | ❌ None | ❌ None | **✅ Real-time Anomaly & Crash Sentry** |
| **Nearest Trauma & Police Dispatch** | ❌ Manual 112/100 dial | ❌ None | ❌ None | **✅ Automatic On-Route Emergency Routing** |
| **Zero-Network Emergency Relay** | ❌ Requires internet | ❌ Requires internet | ❌ Requires internet | **✅ Offline Peer-to-Peer Mesh Simulation** |
| **Private Family Companion Sync** | ⚠️ Basic GPS sharing | ❌ None | ❌ None | **✅ Live Milestone & Telemetry Tracking** |

---

## 🧭 How It Works (End-to-End Travel Flow)

YourNav guides travelers through a seamless 5-stage lifecycle—from initial inspiration to live on-road navigation and post-trip community sharing:

```
[ 1. Traveler Intent ] ──► [ 2. Constraint Engine ] ──► [ 3. Curation & Scoring ]
  • Origin & Destination     • Driver Fatigue Check (<10h) • Fair-market Valuation
  • Vehicle (Petrol/EV)      • Midway Stay Discovery        • Review Sentiment Filter
  • Budget & Travel Style    • NHAI Toll Plaza Fees         • Budget-Optimized Stays
                             • Meal & Dhaba Stop Timing
                                         │
                                         ▼
[ 5. Community & Profile ] ◄── [ 4. RoadGuard Sentry & Live Companion ]
  • Past Trips History         • Continuous GPS / Telemetry Monitoring
  • Spot Recommendations       • Expressway Immobility Detection
  • Verified Photo Uploads     • Multi-Stage Verification & Emergency Dispatch
                               • Shareable Live Family Telemetry (/track/[id])
```

---

### Step 1: Intelligent Intent & Persona Recognition
* The traveler enters starting point, destination, vehicle type (Petrol, Diesel, or Electric Vehicle), party size, and target budget.
* The engine dynamically profiles the traveler's pacing style—whether they are a budget-conscious backpacker, a family exploring heritage circuits, or an adventure traveler seeking high-altitude passes.
* All subsequent routing, recommendations, and timing calibrate to match this traveling pace.

### Step 2: Constraint-Aware Schedule & Route Optimization
* **Driver Stamina & Midway Halts:** On routes longer than 10 continuous driving hours (e.g. Delhi to Goa or Mumbai to Bangalore), the system automatically geocodes a scenic, safe midway city (such as Udaipur or Kolhapur) to eliminate long-haul driver exhaustion.
* **Transit Rest Stops:** Intelligently schedules 45-minute lunch breaks at verified highway Dhabas between 12:30 PM and 2:30 PM, alongside 20-minute tea breaks along highway corridors.
* **Expressway Toll Matrix:** Calculates precise National Highway toll plaza fees, Fastag telemetry, and expected fuel or EV charging stops.
* **Hard Budget Enforcement:** Guarantees that stays, fuel, tolls, and activities stay strictly within the traveler's stated budget, providing 1-click alternative swaps (such as stay-swaps or train alternatives) if limits are exceeded.

### Step 3: Spatial Valuation & Quality Verification
* **Fair-Market Pricing:** Fills missing rate data for regional homestays and offbeat accommodations using geospatial valuation models, preventing zero-cost planning surprises.
* **Aspect Sentiment Screening:** Scans traveler feedback across cleanliness, noise levels, and service quality, automatically filtering out noisy highway motels or sub-standard lodgings.

### Step 4: RoadGuard Sentry (Active Highway Safety Agent)
* **Real-Time Speed & Immobility Tracking:** During the journey, RoadGuard continuously monitors vehicular speed and GPS telemetry.
* **Accident vs. Traffic Jam Detection:** Analyzes sudden or prolonged stops on expressways and mountain ghats, intelligently differentiating between standard traffic jams and potential breakdowns or accidents.
* **Multi-Tier Alert Escalation:** If abnormal immobility is detected, the system initiates a timed auditory check on the driver's phone. If unresponsive, it automatically dispatches emergency alerts with exact GPS coordinates.
* **Nearest Emergency Assistance:** Immediately maps the closest verified trauma hospitals, highway police checkpoints, and roadside assistance units.
* **Zero-Network Emergency Relay:** In remote highway dead-zones without cellular signal, RoadGuard activates an offline peer-to-peer mesh simulation to broadcast distress packets to nearby passing vehicles.

### Step 5: Live Companion Sync & Family Telemetry
* Travelers can share a private, secure live tracking link (`/track/[id]`) with designated family members.
* Family members can view live journey milestones, current transit checkpoints, distance remaining, and battery status in real-time without calling or texting while driving.

### Step 6: Traveler Hub & Community Memories
* A slide-over Traveler Hub allows users to:
  - Edit traveler details, base city, and emergency guardian contacts.
  - Review past completed expeditions with logged miles, milestones, and expense breakdowns.
  - Share hidden gems, cafes, dhabas, and viewpoints with direct photo uploads, ratings, and practical travel tips.

---

## 🌟 Core Platform Capabilities

* **Autonomous Route Intelligence:** Live toll calculations, EV/Fuel consumption models, and road topography analysis.
* **Midway Fatigue Mitigation:** Automated midway halt detection and overnight booking recommendations for routes exceeding safe driving limits.
* **Multi-Modal Transit Alternatives:** 1-click failover comparison between Self-Drive, Indian Railways express trains, and Flights.
* **RoadGuard Emergency Hub:** On-route trauma centers, national emergency integration, and offline SOS telemetry.
* **Live Family Companion:** Encrypted, shareable telemetry links for hands-free live trip monitoring.
* **Community Discovery Feed:** User-contributed local recommendations with real photo uploads, ratings, and location tags.

---

## 🛠️ Technology Stack

* **Frontend:** Next.js 14, React 18, TypeScript, TailwindCSS, Framer Motion
* **Backend:** FastAPI (Asynchronous Python 3)
* **Engines:** Combinatorial Constraint Solver, Machine Learning Scoring & Telemetry Handlers
* **Mapping:** OpenStreetMap, Nominatim Geocoding, Dynamic SVG Vehicle Overlays

---

## 📄 License & Attribution

Designed and built with a focus on safety, driver endurance, and modern intelligent travel. All rights reserved.



