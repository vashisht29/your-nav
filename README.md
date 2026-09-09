# YourNav

An autonomous, constraint-aware travel optimization and vehicular safety platform designed for long-distance overland expeditions.

## Overview

Planning and executing multi-day road journeys requires balancing interrelated and often conflicting variables: road topography, continuous driving fatigue, transit meal windows, dynamic accommodation pricing, and roadside safety. Conventional navigation services treat routing in isolation from temporal and financial constraints, while travel portals provide static bookings without contextual awareness of on-road execution.

YourNav addresses this fragmentation by modeling the journey as a unified constraint-satisfaction graph. It coordinates route generation, dynamic midway halt scheduling, toll-aware expenditure modeling, and real-time vehicular telemetry within a single reactive runtime.

## Architectural Overview

The platform operates across three coordinated tiers:

```
[ User Input: Origin, Destination, Vehicle, Budget, Preferences ]
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Travel Intelligence Pipeline                │
│  - Behavioral persona segmentation                          │
│  - Spatial rate imputation for unpriced regional POIs       │
│  - Multi-aspect sentiment extraction (noise, hygiene, value)│
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Combinatorial Optimization Engine               │
│  - Conflict-free timeline and waypoint sequencing           │
│  - Driver fatigue mitigation (<10h driving limit enforcement)│
│  - Expressway toll matrix and fuel/range modeling           │
│  - Budget ceiling enforcement and dynamic mode failover     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│            Active Safety & Companion Runtime                │
│  - Real-time GPS and speed telemetry monitoring             │
│  - Expressway immobility vs. traffic congestion analysis    │
│  - Multi-tier consciousness checks and emergency dispatch   │
│  - Shareable companion telemetry sessions (/track/[id])     │
└─────────────────────────────────────────────────────────────┘
```

## Core Systems

### 1. Constraint-Aware Journey Scheduling
Long-distance driving across national highway networks introduces significant physiological strain. The optimization solver enforces hard and soft operational bounds:
- **Fatigue Mitigation**: Trips exceeding 10 continuous driving hours automatically trigger midpoint geocoding to suggest verified overnight halts (e.g., Udaipur on Delhi-Goa routes, Kolhapur on Mumbai-Bengaluru routes).
- **Transit Windows**: Schedules 45-minute highway meal halts during typical midday hours alongside periodic short rest breaks.
- **Budget Compliance**: Calculates aggregated expenditures across accommodations, fuel, tolls, and activities, offering alternative modes (such as railway transit or budget homestays) when constraints are exceeded.

### 2. Spatial Valuation and Quality Filtering
Open geospatial datasets often have sparse pricing coverage for regional homestays, roadside dhabas, and heritage locations.
- **Spatial Rate Estimation**: Infers fair-market rates for unpriced accommodations using geographic and categorical attributes, preventing zero-cost anomalies in budget projections.
- **Aspect-Based Review Filtering**: Parses traveler review corpora across cleanliness, ambient noise, and service quality to down-weight unsuitable highway accommodations.

### 3. RoadGuard Sentry (Vehicular Safety Agent)
RoadGuard provides active on-road telemetry monitoring to detect potential emergencies in transit corridors:
- **Immobility Detection**: Analyzes vehicular speed and coordinates to distinguish standard congestion patterns from unexpected stoppages on high-speed expressways or mountain ghats.
- **Escalation Protocol**: Emits staged auditory verification prompts on the driver's device. If unacknowledged, it triggers automatic emergency routing to the nearest verified trauma center or highway assistance post.
- **Resilient Signaling**: Incorporates offline peer-to-peer mesh broadcast simulation for emergency packet relay in dead zones with zero cellular connectivity.

### 4. Companion Telemetry
Enables secure, low-overhead live tracking for family members:
- Provides unique, time-scoped session URLs (`/track/[id]`).
- Broadcasts current waypoint progress, estimated arrival times, and battery levels without requiring driver interaction.

### 5. Traveler Hub & Experience Sharing
An integrated profile drawer managing expedition records and community spot discovery:
- **Expedition Archive**: Historical logs of completed journeys with route paths, logged expenses, and milestone timelines.
- **Community Recommendations**: Traveler-submitted recommendations with client-side image verification, regional tagging, and contextual tips.

## System Architecture

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, Asynchronous Python 3
- **Engines**: Constraint Satisfaction Engine, Geospatial Intelligence & Telemetry Handlers
- **Cartography**: OpenStreetMap, Nominatim Geocoding, Dynamic Vector Overlays

## License

Proprietary. All rights reserved.




