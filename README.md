# Your Nav (Smart AI Travel)

A stateful, constraint-aware **Agentic AI Route Planning & Travel Optimization Engine**.

## 🚀 Key Features
1. **Dynamic Route Intelligence & Toll Plazas:** Calculates distance-mileage estimations for **Petrol/Diesel** or **EV** trips, displaying dynamic route factors and structured toll plazas tables with exact fees.
2. **Highway Travel & Meal Stops:** The OR-Tools CP-SAT solver dynamically schedules driving slots, tea breaks, and highway Dhaba thali lunches on transit days.
3. **Midway Stays:** Automatically geocodes midway town stops (like Udaipur Midway for Delhi-Goa) and fetches hotels to avoid driver fatigue on routes longer than 10 hours.
4. **Constraint Solver & Cheaper Alternatives:** Resolves budget limit constraints dynamically using OR-Tools, offering one-click alternatives (stay-swap, train-swap) if the plan exceeds the budget ceiling.
5. **star Ratings & star filters:** Displays star reviews on hotels, restaurants, and sights.

## 🛠️ Stack
* **Backend:** FastAPI (Python), Google OR-Tools CP-SAT Solver, Nominatim/Overpass OpenStreetMap.
* **Frontend:** Next.js (React), TailwindCSS, Leaflet Maps.

## 🏃 Local Setup
1. **Backend:**
   ```bash
   cd backend
   source venv/bin/activate
   python3 app.py
   ```
2. **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
